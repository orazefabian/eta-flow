import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, type HomeAssistant, type LovelaceCardEditor } from "custom-card-helpers";
import { CARD_EDITOR_NAME, EDGES, ROLES } from "./const";
import type { EdgeConfig, EtaFlowCardConfig, NodeConfig } from "./types";
import { stateEntity } from "./flow";

/** One entry of an `ha-form` schema (loosely typed — the shape is HA's, not ours). */
type Schema = Record<string, unknown>;

const CARD_SCHEMA: Schema[] = [
  { name: "title", selector: { text: {} } },
  { name: "show_edge_labels", selector: { boolean: {} } },
  { name: "node_background", selector: { text: {} } },
];

const NODE_FIELDS: Schema[] = [
  { name: "primary", selector: { entity: {} } },
  { name: "secondary", selector: { entity: {} } },
  { name: "state", selector: { entity: {} } },
  { name: "name", selector: { text: {} } },
  { name: "icon", selector: { icon: {} } },
  { name: "color", selector: { text: {} } },
];

const EDGE_FIELDS: Schema[] = [
  {
    name: "type",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "power", label: "Power / numeric sensor" },
          { value: "state", label: "On-off state (pump, …)" },
          { value: "delta", label: "Temperature difference" },
        ],
      },
    },
  },
  { name: "entity", selector: { entity: {} } },
  { name: "from_entity", selector: { entity: {} } },
  { name: "to_entity", selector: { entity: {} } },
  { name: "threshold", selector: { number: { mode: "box", step: "any" } } },
  { name: "power_reference", selector: { number: { mode: "box", step: "any" } } },
  { name: "show_label", selector: { boolean: {} } },
  { name: "label_entity", selector: { entity: {} } },
  {
    type: "expandable",
    name: "pump",
    title: "Pump glyph",
    schema: [
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      { name: "hide_label", selector: { boolean: {} } },
    ],
  },
];

const LABELS: Record<string, string> = {
  title: "Title",
  show_edge_labels: "Show values on the connections",
  node_background: "Node fill color (CSS color, optional)",
  primary: "Primary value",
  secondary: "Secondary value",
  state: "Status pill",
  name: "Name",
  icon: "Icon",
  color: "Accent color (CSS color)",
  type: "Flow mode",
  entity: "Entity",
  from_entity: "Warm side",
  to_entity: "Cold side",
  threshold: "Threshold",
  power_reference: "Value at full speed",
  show_label: "Show this value on the line",
  label_entity: "Label entity",
  hide_label: "Hide the pump name",
};

/**
 * The form shows a status pill as a plain entity picker, so a `state:` block is
 * flattened to its entity for display and rebuilt around it on write — otherwise
 * editing any field of a node would drop a `map` that only exists in YAML.
 */
function flattenNode(node: NodeConfig): NodeConfig {
  return node.state && typeof node.state !== "string"
    ? { ...node, state: stateEntity(node.state) }
    : node;
}

function restoreState(previous: NodeConfig | undefined, entity: unknown): NodeConfig["state"] {
  const block = previous?.state;
  if (!block || typeof block === "string") return (entity as string) || undefined;
  if (!entity) return undefined; // the picker was cleared: drop the pill and its map
  return { ...block, entity: entity as string };
}

/** Drop empty strings and empty objects so the YAML stays clean. */
function prune<T extends Record<string, unknown>>(value: T): T | undefined {
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined || item === null || item === "") continue;
    if (typeof item === "object" && !Array.isArray(item)) {
      const nested = prune(item as Record<string, unknown>);
      if (nested) out[key] = nested;
      continue;
    }
    out[key] = item;
  }
  return Object.keys(out).length ? (out as T) : undefined;
}

@customElement(CARD_EDITOR_NAME)
export class EtaFlowCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: EtaFlowCardConfig;

  public setConfig(config: EtaFlowCardConfig): void {
    this._config = { nodes: {}, edges: {}, ...config };
  }

  /** Role nodes plus any extra node ids the YAML defines, so nothing is hidden. */
  private _nodeIds(): string[] {
    const ids = Object.keys(ROLES);
    for (const id of Object.keys(this._config.nodes ?? {})) {
      if (!ids.includes(id)) ids.push(id);
    }
    return ids;
  }

  private _edgeKeys(): string[] {
    const keys = EDGES.map((e) => e.key);
    for (const key of Object.keys(this._config.edges ?? {})) {
      if (!keys.includes(key)) keys.push(key);
    }
    return keys;
  }

  private _nodeData(): Record<string, NodeConfig> {
    const data: Record<string, NodeConfig> = {};
    for (const [id, node] of Object.entries(this._config.nodes ?? {})) {
      if (node) data[id] = flattenNode(node);
    }
    return data;
  }

  private _nodeSchema(): Schema[] {
    return this._nodeIds().map((id) => ({
      type: "expandable",
      name: id,
      title: this._config.nodes?.[id]?.name ?? ROLES[id]?.label ?? id,
      icon: ROLES[id]?.icon,
      schema: NODE_FIELDS,
    }));
  }

  private _edgeSchema(): Schema[] {
    return this._edgeKeys().map((key) => ({
      type: "expandable",
      name: key,
      title: this._edgeTitle(key),
      schema: EDGE_FIELDS,
    }));
  }

  /** "puffer_to_heizkreis" → "Puffer → Heizkreis", using the node labels. */
  private _edgeTitle(key: string): string {
    const def = EDGES.find((e) => e.key === key);
    const cfg = this._config.edges?.[key];
    const from = cfg?.from ?? def?.from;
    const to = cfg?.to ?? def?.to;
    if (!from || !to) return key;
    const label = (id: string) => this._config.nodes?.[id]?.name ?? ROLES[id]?.label ?? id;
    return `${label(from)} → ${label(to)}`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;
    const { title, show_edge_labels, node_background } = this._config;

    return html`
      <div class="card-config">
        <ha-form
          .hass=${this.hass}
          .data=${{ title, show_edge_labels, node_background }}
          .schema=${CARD_SCHEMA}
          .computeLabel=${this._label}
          @value-changed=${this._cardChanged}
        ></ha-form>

        <h4>Nodes</h4>
        <p class="hint">
          A node is drawn once it has an entity. Leave one empty to hide it — the Puffer hub always
          shows. Shortening or coloring the status pill's text (<code>state.map</code>) stays in
          YAML and is kept when you edit a node here.
        </p>
        <ha-form
          .hass=${this.hass}
          .data=${this._nodeData()}
          .schema=${this._nodeSchema()}
          .computeLabel=${this._label}
          @value-changed=${this._nodesChanged}
        ></ha-form>

        <h4>Connections</h4>
        <p class="hint">
          Each connection animates when its entity says heat is moving. Rewiring the layout
          (<code>from</code>/<code>to</code>, custom nodes, positions) stays in YAML — see the
          README.
        </p>
        <ha-form
          .hass=${this.hass}
          .data=${this._config.edges ?? {}}
          .schema=${this._edgeSchema()}
          .computeLabel=${this._label}
          @value-changed=${this._edgesChanged}
        ></ha-form>
      </div>
    `;
  }

  private _label = (schema: { name: string; title?: string }): string =>
    LABELS[schema.name] ?? schema.title ?? schema.name;

  private _cardChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as Partial<EtaFlowCardConfig>;
    this._emit({
      ...this._config,
      title: value.title || undefined,
      show_edge_labels: value.show_edge_labels || undefined,
      node_background: value.node_background || undefined,
    });
  }

  private _nodesChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as Record<string, NodeConfig>;
    const nodes: Record<string, NodeConfig> = {};
    for (const [id, node] of Object.entries(value)) {
      const previous = this._config.nodes?.[id];
      // Keep YAML-only keys (x/y, layers, radius, …) that the form doesn't show.
      const merged: Record<string, unknown> = { ...previous, ...node };
      // Reattached after pruning: a map entry whose text is deliberately "" (hide the
      // pill for this state) would otherwise be pruned away as an empty value.
      const state = restoreState(previous, node.state);
      delete merged.state;
      const pruned = (prune(merged) ?? {}) as NodeConfig;
      if (state) pruned.state = state;
      if (Object.keys(pruned).length) nodes[id] = pruned;
    }
    this._emit({ ...this._config, nodes });
  }

  private _edgesChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail.value as Record<string, EdgeConfig>;
    const edges: Record<string, EdgeConfig> = {};
    for (const [key, edge] of Object.entries(value)) {
      const merged = { ...this._config.edges?.[key], ...edge };
      const pruned = prune(merged as Record<string, unknown>);
      if (pruned) edges[key] = pruned as EdgeConfig;
    }
    this._emit({ ...this._config, edges });
  }

  private _emit(config: EtaFlowCardConfig): void {
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  public static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    h4 {
      margin: 12px 0 0;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin: 2px 0 4px;
    }
    ha-form {
      display: block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "eta-flow-card-editor": EtaFlowCardEditor;
  }
}
