// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { HomeAssistant } from "custom-card-helpers";
import type { EtaFlowCardEditor } from "./editor";
import type { EtaFlowCardConfig, NodeConfig } from "./types";

beforeAll(async () => {
  await import("./editor");
});

async function mount(config: Partial<EtaFlowCardConfig>) {
  const editor = document.createElement("eta-flow-card-editor") as EtaFlowCardEditor;
  editor.setConfig({ type: "custom:eta-flow-card", ...config } as EtaFlowCardConfig);
  editor.hass = { states: {}, locale: { language: "en" } } as unknown as HomeAssistant;
  document.body.appendChild(editor);
  await editor.updateComplete;
  return editor;
}

/** The three ha-forms are rendered in order: card options, nodes, connections. */
const nodeForm = (editor: EtaFlowCardEditor) =>
  editor.shadowRoot!.querySelectorAll("ha-form")[1] as HTMLElement & { data: unknown };

/** Emit what ha-form emits: the full data object with one field edited. */
function edit(editor: EtaFlowCardEditor, value: Record<string, NodeConfig>): EtaFlowCardConfig {
  let emitted!: EtaFlowCardConfig;
  editor.addEventListener("config-changed", (ev) => {
    emitted = (ev as CustomEvent).detail.config;
  });
  nodeForm(editor).dispatchEvent(
    new CustomEvent("value-changed", { detail: { value }, bubbles: true, composed: true }),
  );
  return emitted;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("status pill in the GUI editor", () => {
  const withMap = {
    nodes: {
      solar: {
        primary: "sensor.kollektor",
        state: { entity: "sensor.zustand", map: { cold: { text: "zu kalt" }, idle: "" } },
      },
    },
  };

  it("shows the pill's entity in the plain entity picker", async () => {
    const editor = await mount(withMap);
    const data = nodeForm(editor).data as Record<string, NodeConfig>;
    expect(data.solar.state).toBe("sensor.zustand");
  });

  it("keeps the map when another field of the node is edited", async () => {
    const editor = await mount(withMap);
    const config = edit(editor, {
      solar: { primary: "sensor.kollektor", state: "sensor.zustand", name: "Kollektor" },
    });
    expect(config.nodes?.solar.name).toBe("Kollektor");
    // Including `idle: ""`, which prune() would otherwise strip as an empty value.
    expect(config.nodes?.solar.state).toEqual({
      entity: "sensor.zustand",
      map: { cold: { text: "zu kalt" }, idle: "" },
    });
  });

  it("re-points the map when the picker names a different entity", async () => {
    const editor = await mount(withMap);
    const config = edit(editor, { solar: { state: "sensor.other" } });
    expect(config.nodes?.solar.state).toMatchObject({ entity: "sensor.other" });
  });

  it("drops the pill and its map when the picker is cleared", async () => {
    const editor = await mount(withMap);
    const config = edit(editor, { solar: { primary: "sensor.kollektor", state: "" } });
    expect(config.nodes?.solar.state).toBeUndefined();
  });

  it("leaves a plain string pill a plain string", async () => {
    const editor = await mount({ nodes: { kessel: { state: "sensor.a" } } });
    const config = edit(editor, { kessel: { state: "sensor.b" } });
    expect(config.nodes?.kessel.state).toBe("sensor.b");
  });
});
