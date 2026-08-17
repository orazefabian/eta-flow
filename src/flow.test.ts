import { describe, expect, it } from "vitest";
import type { HomeAssistant } from "custom-card-helpers";
import {
  computeEdgeFlow,
  computeNodeDisplay,
  edgeValueLabel,
  formatState,
  gaugeFraction,
  isActive,
  isUnavailable,
  levelFraction,
  numState,
  tempColor,
} from "./flow";

/** Minimal hass stub: `entity_id: [state, unit?]`. */
function makeHass(
  entities: Record<string, [string | number, string?]>,
  extra: Partial<HomeAssistant> = {},
): HomeAssistant {
  const states: Record<string, unknown> = {};
  for (const [id, [state, unit]] of Object.entries(entities)) {
    states[id] = {
      entity_id: id,
      state: String(state),
      attributes: unit ? { unit_of_measurement: unit } : {},
    };
  }
  return {
    states,
    locale: { language: "en", number_format: "language" },
    ...extra,
  } as HomeAssistant;
}

describe("numState / isUnavailable", () => {
  const hass = makeHass({
    "sensor.num": [42.5, "°C"],
    "sensor.text": ["Heizen"],
    "sensor.dead": ["unavailable"],
    "sensor.blank": ["unknown"],
  });

  it("reads finite numbers only", () => {
    expect(numState(hass, "sensor.num")).toBe(42.5);
    expect(numState(hass, "sensor.text")).toBeUndefined();
    expect(numState(hass, "sensor.missing")).toBeUndefined();
    expect(numState(hass, undefined)).toBeUndefined();
  });

  it("treats unavailable and unknown as no value", () => {
    expect(numState(hass, "sensor.dead")).toBeUndefined();
    expect(numState(hass, "sensor.blank")).toBeUndefined();
    expect(isUnavailable(hass, "sensor.dead")).toBe(true);
    expect(isUnavailable(hass, "sensor.missing")).toBe(true);
    expect(isUnavailable(hass, "sensor.num")).toBe(false);
  });
});

describe("formatState", () => {
  it("uses the frontend formatter when the instance provides one", () => {
    const hass = makeHass({ "sensor.a": [21.456, "°C"] }, {
      formatEntityState: () => "21,5 °C",
    } as Partial<HomeAssistant>);
    expect(formatState(hass, "sensor.a")).toBe("21,5 °C");
  });

  it("falls back to a locale-formatted number with the unit", () => {
    const hass = makeHass({ "sensor.a": [21.456, "°C"] });
    expect(formatState(hass, "sensor.a")).toBe("21.5 °C");
  });

  it("falls back again when the frontend formatter throws", () => {
    const hass = makeHass({ "sensor.a": [7, "kW"] }, {
      formatEntityState: () => {
        throw new Error("boom");
      },
    } as Partial<HomeAssistant>);
    expect(formatState(hass, "sensor.a")).toBe("7 kW");
  });

  it("never prints a unit next to a non-value state", () => {
    const hass = makeHass({ "sensor.a": ["unavailable", "°C"], "sensor.b": ["unknown", "%"] });
    expect(formatState(hass, "sensor.a")).toBeUndefined();
    expect(formatState(hass, "sensor.b")).toBeUndefined();
    expect(formatState(hass, "sensor.missing")).toBeUndefined();
  });

  it("passes text states through unchanged", () => {
    const hass = makeHass({ "sensor.a": ["Heizen"] });
    expect(formatState(hass, "sensor.a")).toBe("Heizen");
  });
});

describe("computeEdgeFlow", () => {
  const hass = makeHass({
    "sensor.power": [2500, "W"],
    "sensor.negative": [-2500, "W"],
    "sensor.small": [10, "W"],
    "binary_sensor.pump": ["on"],
    "binary_sensor.idle": ["off"],
    "sensor.hot": [70, "°C"],
    "sensor.cold": [40, "°C"],
    "sensor.dead": ["unavailable"],
  });

  it("is inactive without a config or entity", () => {
    expect(computeEdgeFlow(undefined, hass).active).toBe(false);
    expect(computeEdgeFlow({ type: "power" }, hass).active).toBe(false);
  });

  it("flows on power and speeds up with magnitude", () => {
    const strong = computeEdgeFlow({ type: "power", entity: "sensor.power" }, hass);
    const weak = computeEdgeFlow({ type: "power", entity: "sensor.small" }, hass);
    expect(strong.active).toBe(true);
    expect(strong.reverse).toBe(false);
    expect(strong.duration).toBeLessThan(weak.duration);
  });

  it("reverses on a negative value and honours invert", () => {
    expect(computeEdgeFlow({ type: "power", entity: "sensor.negative" }, hass).reverse).toBe(true);
    expect(
      computeEdgeFlow({ type: "power", entity: "sensor.negative", invert: true }, hass).reverse,
    ).toBe(false);
    expect(
      computeEdgeFlow({ type: "power", entity: "sensor.power", invert: true }, hass).reverse,
    ).toBe(true);
  });

  it("respects the threshold", () => {
    expect(
      computeEdgeFlow({ type: "power", entity: "sensor.small", threshold: 50 }, hass).active,
    ).toBe(false);
  });

  it("follows on-off states", () => {
    expect(computeEdgeFlow({ type: "state", entity: "binary_sensor.pump" }, hass).active).toBe(
      true,
    );
    expect(computeEdgeFlow({ type: "state", entity: "binary_sensor.idle" }, hass).active).toBe(
      false,
    );
    expect(
      computeEdgeFlow({ type: "state", entity: "binary_sensor.idle", active_states: ["off"] }, hass)
        .active,
    ).toBe(true);
  });

  it("flows on a temperature difference only in the warm direction", () => {
    expect(
      computeEdgeFlow({ type: "delta", from_entity: "sensor.hot", to_entity: "sensor.cold" }, hass)
        .active,
    ).toBe(true);
    expect(
      computeEdgeFlow({ type: "delta", from_entity: "sensor.cold", to_entity: "sensor.hot" }, hass)
        .active,
    ).toBe(false);
  });

  it("infers the mode from the entity when type is omitted", () => {
    expect(computeEdgeFlow({ entity: "sensor.power" }, hass).active).toBe(true);
    expect(computeEdgeFlow({ entity: "binary_sensor.pump" }, hass).active).toBe(true);
  });

  it("stays inactive when the driving entity is unavailable", () => {
    expect(computeEdgeFlow({ type: "power", entity: "sensor.dead" }, hass).active).toBe(false);
    expect(computeEdgeFlow({ entity: "sensor.dead" }, hass).active).toBe(false);
  });

  it("quantizes the duration so small value changes don't restart the animation", () => {
    for (const value of [1000, 1010, 1020]) {
      const flow = computeEdgeFlow(
        { type: "power", entity: "sensor.power" },
        makeHass({ "sensor.power": [value, "W"] }),
      );
      expect(flow.duration * 4).toBe(Math.round(flow.duration * 4));
    }
  });
});

describe("edgeValueLabel", () => {
  const hass = makeHass({
    "sensor.power": [2500, "W"],
    "sensor.hot": [70, "°C"],
    "sensor.cold": [40.4, "°C"],
    "binary_sensor.pump": ["on"],
    "sensor.flow": [41, "°C"],
  });

  it("shows the driving value for power edges", () => {
    expect(edgeValueLabel({ type: "power", entity: "sensor.power" }, hass)).toBe("2,500 W");
  });

  it("shows the difference with a unit for delta edges", () => {
    expect(
      edgeValueLabel({ type: "delta", from_entity: "sensor.hot", to_entity: "sensor.cold" }, hass),
    ).toBe("Δ29.6 °C");
  });

  it("has no label for state edges unless label_entity is set", () => {
    expect(edgeValueLabel({ type: "state", entity: "binary_sensor.pump" }, hass)).toBeUndefined();
    expect(
      edgeValueLabel(
        { type: "state", entity: "binary_sensor.pump", label_entity: "sensor.flow" },
        hass,
      ),
    ).toBe("41 °C");
  });
});

describe("isActive", () => {
  const hass = makeHass({ "binary_sensor.pump": ["on"], "sensor.mode": ["Heizen"] });

  it("defaults to the on state", () => {
    expect(isActive(hass, "binary_sensor.pump")).toBe(true);
    expect(isActive(hass, "sensor.mode")).toBe(false);
    expect(isActive(hass, "sensor.mode", ["Heizen"])).toBe(true);
    expect(isActive(hass, undefined)).toBe(false);
    expect(isActive(hass, "sensor.missing")).toBe(false);
  });
});

describe("fill fractions", () => {
  const hass = makeHass({
    "sensor.charge": [57, "%"],
    "sensor.over": [140, "%"],
    "sensor.negative": [-5, "%"],
    "sensor.stock": [1200, "kg"],
  });

  it("clamps the buffer level to 0..1 and falls back to primary", () => {
    expect(levelFraction({ level: "sensor.charge" }, hass)).toBeCloseTo(0.57);
    expect(levelFraction({ primary: "sensor.charge" }, hass)).toBeCloseTo(0.57);
    expect(levelFraction({ level: "sensor.over" }, hass)).toBe(1);
    expect(levelFraction({ level: "sensor.negative" }, hass)).toBe(0);
    expect(levelFraction({ level: "sensor.missing" }, hass)).toBeUndefined();
  });

  it("maps a gauge onto its min/max range", () => {
    expect(gaugeFraction({ primary: "sensor.stock", max: 2000 }, hass)).toBeCloseTo(0.6);
    expect(gaugeFraction({ primary: "sensor.stock", min: 200, max: 2200 }, hass)).toBeCloseTo(0.5);
    expect(gaugeFraction({ primary: "sensor.stock", min: 100, max: 100 }, hass)).toBeUndefined();
    expect(gaugeFraction({ primary: "sensor.charge" }, hass)).toBeCloseTo(0.57);
  });
});

describe("tempColor", () => {
  it("runs from blue when cold to red when hot, and clamps outside 20..80 °C", () => {
    expect(tempColor(20)).toBe("hsl(210, 72%, 50%)");
    expect(tempColor(80)).toBe("hsl(0, 72%, 50%)");
    expect(tempColor(-40)).toBe(tempColor(20));
    expect(tempColor(500)).toBe(tempColor(80));
  });
});

describe("computeNodeDisplay", () => {
  const hass = makeHass({
    "sensor.temp": [68, "°C"],
    "sensor.flue": [142, "°C"],
    "sensor.status": ["Heizen"],
    "sensor.dead": ["unavailable"],
  });

  it("formats every configured slot", () => {
    const display = computeNodeDisplay(
      { primary: "sensor.temp", secondary: "sensor.flue", state: "sensor.status" },
      hass,
    );
    expect(display).toMatchObject({
      primary: "68 °C",
      secondary: "142 °C",
      state: "Heizen",
      available: true,
    });
  });

  it("reports unavailable when nothing resolves", () => {
    expect(computeNodeDisplay({ primary: "sensor.dead" }, hass).available).toBe(false);
    expect(computeNodeDisplay({ primary: "sensor.missing" }, hass).available).toBe(false);
    expect(computeNodeDisplay(undefined, hass).available).toBe(false);
    expect(computeNodeDisplay({}, hass).available).toBe(false);
  });

  it("works for a node that only has a status pill", () => {
    const display = computeNodeDisplay({ state: "sensor.status" }, hass);
    expect(display.state).toBe("Heizen");
    expect(display.available).toBe(true);
  });
});
