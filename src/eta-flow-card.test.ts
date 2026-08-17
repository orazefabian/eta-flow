// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { HomeAssistant } from "custom-card-helpers";
import type { EtaFlowCard } from "./eta-flow-card";
import type { EtaFlowCardConfig } from "./types";

beforeAll(async () => {
  if (!("ResizeObserver" in globalThis)) {
    // happy-dom has no layout engine; the card only uses it to measure its width.
    (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
      public observe(): void {}
      public disconnect(): void {}
    };
  }
  await import("./eta-flow-card");
});

function makeHass(entities: Record<string, [string | number, string?]> = {}): HomeAssistant {
  const states: Record<string, unknown> = {};
  for (const [id, [state, unit]] of Object.entries(entities)) {
    states[id] = {
      entity_id: id,
      state: String(state),
      attributes: unit ? { unit_of_measurement: unit } : {},
    };
  }
  return { states, locale: { language: "en", number_format: "language" } } as HomeAssistant;
}

async function mount(config: Partial<EtaFlowCardConfig>, hass: HomeAssistant) {
  const card = document.createElement("eta-flow-card") as EtaFlowCard;
  card.setConfig({ type: "custom:eta-flow-card", ...config } as EtaFlowCardConfig);
  card.hass = hass;
  document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

const texts = (card: EtaFlowCard, selector: string) =>
  [...(card.shadowRoot?.querySelectorAll(selector) ?? [])].map((el) => el.textContent?.trim());

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("setConfig validation", () => {
  const bad: [string, Partial<EtaFlowCardConfig>][] = [
    ["a custom node without a position", { nodes: { keller: { primary: "sensor.a" } } }],
    ["an unknown edge type", { edges: { kessel_to_puffer: { type: "magic" as never } } }],
    ["an edge pointing at an unknown node", { edges: { kessel_to_puffer: { to: "nope" } } }],
    ["a custom edge without both ends", { edges: { extra: { from: "puffer" } } }],
    ["a gauge whose max is not above min", { nodes: { vorrat: { min: 10, max: 5 } } }],
    ["a control link to an unknown node", { control_links: [{ from: "puffer", to: "nope" }] }],
    ["a state block with no entity", { nodes: { kessel: { state: { map: { on: "an" } } } } }],
  ];

  it.each(bad)("rejects %s", (_name, config) => {
    const card = document.createElement("eta-flow-card") as EtaFlowCard;
    expect(() =>
      card.setConfig({ type: "custom:eta-flow-card", ...config } as EtaFlowCardConfig),
    ).toThrow(/eta-flow-card/);
  });

  it("accepts a fully configured card", () => {
    const card = document.createElement("eta-flow-card") as EtaFlowCard;
    expect(() =>
      card.setConfig({
        type: "custom:eta-flow-card",
        nodes: { puffer: { primary: "sensor.a" }, keller: { x: 90, y: 330 } },
        edges: { puffer_to_keller: { from: "puffer", to: "keller", entity: "sensor.b" } },
      } as EtaFlowCardConfig),
    ).not.toThrow();
  });
});

describe("rendering", () => {
  it("shows formatted values and hides nodes without data", async () => {
    const card = await mount(
      { nodes: { puffer: { primary: "sensor.charge" }, solar: {} } },
      makeHass({ "sensor.charge": [57, "%"] }),
    );
    expect(texts(card, ".node-primary")).toContain("57 %");
    expect(texts(card, ".node-label")).toEqual(["Puffer"]);
  });

  it("marks a node whose entity is unavailable instead of printing the word", async () => {
    const card = await mount(
      { nodes: { puffer: { primary: "sensor.charge" } } },
      makeHass({ "sensor.charge": ["unavailable", "%"] }),
    );
    expect(texts(card, ".node-primary")).toEqual(["—"]);
    expect(card.shadowRoot?.querySelector(".ring.unavailable")).toBeTruthy();
  });

  it("previews the whole layout when none of the entities exist yet", async () => {
    const card = await mount({ nodes: { puffer: { primary: "sensor.gone" } } }, makeHass());
    expect(texts(card, ".node-label").length).toBeGreaterThan(4);
    expect(card.shadowRoot?.querySelector(".hint")?.textContent).toMatch(/card editor/i);
  });

  it("colors values against the buffer fill, but only where they sit on it", async () => {
    const hass = makeHass({
      "sensor.level": [95, "%"],
      "sensor.cold": [22, "°C"],
      "sensor.warm": [50, "°C"],
    });
    const fill = (card: EtaFlowCard) =>
      (card.shadowRoot?.querySelector(".node-primary") as SVGElement | null)?.style.fill;

    // A cold (blue) fill needs light text, a mid-ramp (green) fill needs dark text.
    const cold = await mount(
      {
        nodes: {
          puffer: { primary: "sensor.level", level: "sensor.level", layers: ["sensor.cold"] },
        },
      },
      hass,
    );
    expect(fill(cold)).toBe("#ffffff");

    const warm = await mount(
      {
        nodes: {
          puffer: { primary: "sensor.level", level: "sensor.level", layers: ["sensor.warm"] },
        },
      },
      hass,
    );
    expect(fill(warm)).toBe("#101418");

    // No stratification configured: the theme's text color stays in charge, even
    // though the value is a percentage that could be read as a fill level.
    const plain = await mount({ nodes: { puffer: { primary: "sensor.level" } } }, hass);
    expect(fill(plain)).toBeFalsy();
  });

  it("renders a status pill and a node that only has one", async () => {
    const card = await mount(
      { nodes: { kessel: { state: "sensor.status" } } },
      makeHass({ "sensor.status": ["Heizen"] }),
    );
    expect(texts(card, ".pill-text")).toEqual(["Heizen"]);
  });

  it("shortens and tints a mapped pill state", async () => {
    const card = await mount(
      {
        nodes: {
          solar: {
            state: {
              entity: "sensor.zustand",
              map: { "Kollektortemperatur zu niedrig": { text: "zu kalt", color: "#78909c" } },
            },
          },
        },
      },
      makeHass({ "sensor.zustand": ["Kollektortemperatur zu niedrig"] }),
    );
    expect(texts(card, ".pill-text")).toEqual(["zu kalt"]);
    expect((card.shadowRoot?.querySelector(".pill-bg") as SVGElement).style.fill).toBe("#78909c");
  });

  it("drops the pill entirely for a state mapped to an empty string", async () => {
    const card = await mount(
      { nodes: { kessel: { primary: "sensor.temp", state: { entity: "s.x", map: { off: "" } } } } },
      makeHass({ "sensor.temp": [78, "°C"], "s.x": ["off"] }),
    );
    expect(card.shadowRoot?.querySelector(".pill-bg")).toBeNull();
    expect(card.shadowRoot?.querySelector(".ring.unavailable")).toBeNull();
  });

  it("animates a connection only while it is flowing", async () => {
    const hass = makeHass({ "binary_sensor.pump": ["on"], "sensor.charge": [50, "%"] });
    const config = {
      nodes: { puffer: { primary: "sensor.charge" }, solar: { primary: "sensor.charge" } },
      edges: { solar_to_puffer: { type: "state" as const, entity: "binary_sensor.pump" } },
    };
    const flowing = await mount(config, hass);
    expect(flowing.shadowRoot?.querySelectorAll(".dot").length).toBeGreaterThan(0);

    const idle = await mount(config, makeHass({ ...{}, "binary_sensor.pump": ["off"] }));
    expect(idle.shadowRoot?.querySelectorAll(".dot").length).toBe(0);
  });
});

describe("interaction", () => {
  const tap = (element: Element) => {
    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  };

  it("opens more-info for the node's entity by default", async () => {
    const card = await mount(
      { nodes: { puffer: { primary: "sensor.charge" } } },
      makeHass({ "sensor.charge": [57, "%"] }),
    );
    const opened: string[] = [];
    card.addEventListener("hass-more-info", (ev) =>
      opened.push((ev as CustomEvent).detail.entityId),
    );
    tap(card.shadowRoot!.querySelector("g.clickable")!);
    expect(opened).toEqual(["sensor.charge"]);
  });

  it("honours a configured tap_action instead of more-info", async () => {
    const card = await mount(
      { nodes: { puffer: { primary: "sensor.charge", tap_action: { action: "none" } } } },
      makeHass({ "sensor.charge": [57, "%"] }),
    );
    const opened: string[] = [];
    card.addEventListener("hass-more-info", (ev) =>
      opened.push((ev as CustomEvent).detail.entityId),
    );
    const group = card.shadowRoot!.querySelector("g");
    expect(group?.classList.contains("clickable")).toBe(false);
    tap(group!);
    expect(opened).toEqual([]);
  });
});

describe("shouldUpdate", () => {
  it("ignores state changes for entities the card does not use", async () => {
    const card = await mount(
      { nodes: { puffer: { primary: "sensor.charge" } } },
      makeHass({ "sensor.charge": [57, "%"], "sensor.other": [1] }),
    );
    const before = card.shadowRoot?.innerHTML;

    card.hass = makeHass({ "sensor.charge": [57, "%"], "sensor.other": [999] });
    await card.updateComplete;
    expect(card.shadowRoot?.innerHTML).toBe(before);

    card.hass = makeHass({ "sensor.charge": [80, "%"], "sensor.other": [999] });
    await card.updateComplete;
    expect(texts(card, ".node-primary")).toContain("80 %");
  });
});

describe("getStubConfig", () => {
  it("maps existing ETA sensors onto the matching nodes", async () => {
    const { EtaFlowCard: Card } = await import("./eta-flow-card");
    const hass = makeHass({
      "sensor.eta_puffer_ladezustand": [57, "%"],
      "sensor.eta_kessel_temp": [78, "°C"],
      "sensor.eta_heizkreis_vorlauf": [41, "°C"],
      "sensor.eta_heizkreis_2_vorlauf": [28, "°C"],
      "sensor.eta_aussentemperatur": [8, "°C"],
      "sensor.unrelated_humidity": [55, "%"],
    });
    const stub = Card.getStubConfig(hass);
    expect(stub.nodes?.puffer.primary).toBe("sensor.eta_puffer_ladezustand");
    expect(stub.nodes?.kessel.primary).toBe("sensor.eta_kessel_temp");
    expect(stub.nodes?.heizkreis.primary).toBe("sensor.eta_heizkreis_vorlauf");
    expect(stub.nodes?.heizkreis2.primary).toBe("sensor.eta_heizkreis_2_vorlauf");
    expect(stub.nodes?.aussen.primary).toBe("sensor.eta_aussentemperatur");
  });

  it("returns a usable empty config when nothing matches", async () => {
    const { EtaFlowCard: Card } = await import("./eta-flow-card");
    const stub = Card.getStubConfig(makeHass());
    expect(stub.type).toBe("custom:eta-flow-card");
    expect(Object.keys(stub.nodes ?? {})).toContain("puffer");
  });
});
