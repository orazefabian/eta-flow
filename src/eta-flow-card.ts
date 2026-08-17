import { LitElement, html, svg, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import {
  handleAction,
  hasAction,
  type ActionConfig,
  type HomeAssistant,
  type LovelaceCard,
  type LovelaceCardEditor,
} from "custom-card-helpers";
import { actionHandler } from "./action-handler";
import {
  CARD_NAME,
  CARD_VERSION,
  CONTROL_LINKS,
  DEFAULT_STROKE_WIDTH,
  EDGES,
  NODE_FALLBACK,
  PUFFER_ID,
  PUMP_DEFAULTS,
  ROLE_ENTITY_HINTS,
  ROLES,
  type NodeKind,
} from "./const";
import type { ActionsConfig, EtaFlowCardConfig, NodeConfig, PumpConfig } from "./types";
import {
  computeEdgeFlow,
  computeNodeDisplay,
  contrastText,
  edgeValueLabel,
  gaugeFraction,
  isActive,
  levelFraction,
  NO_VALUE,
  numState,
  stateEntity,
  tempColor,
} from "./flow";
import { styles } from "./styles";
import "./editor";

/* eslint-disable no-console */
console.info(
  `%c ETA-FLOW-CARD %c v${CARD_VERSION} `,
  "color: #fff; background: #4caf50; font-weight: 700;",
  "color: #4caf50; background: #1c1c1c;",
);
/* eslint-enable no-console */

// Register in the card picker.
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_NAME,
  name: "ETA Flow Card",
  description: "Animated heat-flow visualization for ETA heating systems (pellet, log & solar).",
  preview: true,
  documentationURL: "https://github.com/orazefabian/eta-flow",
});

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Text sizing. Font sizes live in SVG user units on the fixed 400x400 canvas, so they
 * shrink with the card: on a 260px-wide phone column a 15-unit label renders at under
 * 10 real pixels. MIN_TEXT_PX is the smallest size any label may end up at, converted
 * to user units from the measured card width.
 */
const MIN_TEXT_PX = 9.5;
/**
 * Below this rendered width, drop the secondary detail (edge labels, secondary
 * values, pump names) instead of squeezing it in: once every label is pinned at the
 * readable floor they take up more of the canvas than the diagram itself.
 */
const NARROW_PX = 290;
/** Rough advance width of one character, in em — good enough to fit text to a shape. */
const CHAR_EM = 0.58;

interface Point {
  x: number;
  y: number;
}

/** An axis-aligned box in canvas units, used for label collision avoidance. */
interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** A text run that has been fitted to a maximum width. */
interface FittedText {
  text: string;
  fontSize: number;
  /** Set only when the glyphs still need squeezing after shrinking to the floor. */
  textLength?: number;
}

/** Area shared by two boxes — 0 when they don't touch. */
function overlapArea(a: Box, b: Box): number {
  const w = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
  const h = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
  return w > 0 && h > 0 ? w * h : 0;
}

/** Total area a candidate label box shares with everything already placed. */
function collisionCost(box: Box, obstacles: Box[]): number {
  return obstacles.reduce((sum, o) => sum + overlapArea(box, o), 0);
}

function textBox(x: number, y: number, t: FittedText): Box {
  const w = t.textLength ?? t.text.length * t.fontSize * CHAR_EM;
  const h = t.fontSize * 1.25;
  return { x1: x - w / 2, y1: y - h / 2, x2: x + w / 2, y2: y + h / 2 };
}

/** A fully-resolved edge (default topology merged with config overrides). */
interface ResolvedEdge {
  key: string;
  from: string;
  to: string;
}

/** A label that has been fitted and placed on the canvas. */
interface PlacedLabel extends FittedText {
  x: number;
  y: number;
}

/** Labels placed for one render pass, keyed by edge. */
interface PlacedLabels {
  edges: Map<string, PlacedLabel>;
  pumps: Map<string, PlacedLabel>;
}

/** The actions a single shape responds to, plus the entity they act on. */
interface ResolvedActions extends ActionsConfig {
  entity?: string;
}

/** A node/pump icon to draw in the shared icon layer (positions in 0..400 units). */
interface IconSpec {
  icon: string;
  cx: number;
  cy: number;
  size: number;
  cls: string;
}

const EDGE_TYPES = ["power", "state", "delta"];
const NODE_KINDS = ["circle", "badge", "gauge"];

/**
 * Reject configurations that could only render as a silently empty card, with a
 * message naming the offending key. Unknown keys stay tolerated on purpose.
 */
function validateConfig(config: EtaFlowCardConfig): void {
  const known = new Set([...Object.keys(ROLES), ...Object.keys(config.nodes ?? {})]);

  for (const [id, node] of Object.entries(config.nodes ?? {})) {
    if (!node) continue;
    if (!ROLES[id] && (node.x === undefined || node.y === undefined)) {
      throw new Error(`eta-flow-card: custom node "${id}" needs an x and y position (0..400).`);
    }
    if (node.kind && !NODE_KINDS.includes(node.kind)) {
      throw new Error(
        `eta-flow-card: node "${id}" has kind "${node.kind}" — expected ${NODE_KINDS.join(", ")}.`,
      );
    }
    if (node.min !== undefined && node.max !== undefined && node.max <= node.min) {
      throw new Error(`eta-flow-card: node "${id}" needs max greater than min.`);
    }
    if (node.state && typeof node.state !== "string" && !node.state.entity) {
      throw new Error(`eta-flow-card: node "${id}" has a state block without an entity.`);
    }
  }

  for (const [key, edge] of Object.entries(config.edges ?? {})) {
    if (!edge) continue;
    if (edge.type && !EDGE_TYPES.includes(edge.type)) {
      throw new Error(
        `eta-flow-card: edge "${key}" has type "${edge.type}" — expected ${EDGE_TYPES.join(", ")}.`,
      );
    }
    for (const end of ["from", "to"] as const) {
      const id = edge[end];
      if (id && !known.has(id)) {
        throw new Error(`eta-flow-card: edge "${key}" points ${end} unknown node "${id}".`);
      }
    }
    if (!EDGES.some((e) => e.key === key) && (!edge.from || !edge.to)) {
      throw new Error(`eta-flow-card: custom edge "${key}" needs both from and to.`);
    }
  }

  for (const link of config.control_links ?? []) {
    for (const end of ["from", "to"] as const) {
      if (!known.has(link[end])) {
        throw new Error(`eta-flow-card: control_link points ${end} unknown node "${link[end]}".`);
      }
    }
  }
}

/**
 * Guess which existing sensor belongs to which node role, by entity id. Each entity
 * is claimed at most once, and roles are tried most-specific first.
 */
export function detectRoleEntities(hass?: HomeAssistant): Record<string, string> {
  const found: Record<string, string> = {};
  if (!hass?.states) return found;
  const sensors = Object.keys(hass.states).filter((id) => id.startsWith("sensor."));
  const taken = new Set<string>();
  for (const [role, pattern] of ROLE_ENTITY_HINTS) {
    const match = sensors.find((id) => !taken.has(id) && pattern.test(id.toLowerCase()));
    if (match) {
      found[role] = match;
      taken.add(match);
    }
  }
  return found;
}

/** All entity ids the config references, in no particular order. */
function collectEntityIds(config: EtaFlowCardConfig): string[] {
  const ids = new Set<string>();
  const add = (id?: string) => {
    if (id) ids.add(id);
  };
  for (const node of Object.values(config.nodes ?? {})) {
    if (!node) continue;
    add(node.primary);
    add(node.secondary);
    add(stateEntity(node.state));
    add(node.level);
    for (const layer of node.layers ?? []) add(layer);
  }
  for (const edge of Object.values(config.edges ?? {})) {
    if (!edge) continue;
    add(edge.entity);
    add(edge.from_entity);
    add(edge.to_entity);
    add(edge.label_entity);
    add(edge.pump?.entity);
  }
  add(config.solarpumpe?.entity);
  return [...ids];
}

/** Trim a line between two node centers so it starts/ends just outside each ring. */
function trim(from: Point, to: Point, fromR: number, toR: number, gap = 4) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.x + ux * (fromR + gap),
    y1: from.y + uy * (fromR + gap),
    x2: to.x - ux * (toR + gap),
    y2: to.y - uy * (toR + gap),
  };
}

@customElement(CARD_NAME)
export class EtaFlowCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: EtaFlowCardConfig;

  /** Every entity id referenced by the config — drives shouldUpdate. */
  private _entityIds: string[] = [];
  /** Rendered width of the diagram in CSS pixels (0 until first measured). */
  @state() private _widthPx = 0;
  /** True while none of the configured entities exist — show the layout as a preview. */
  private _placeholder = false;
  private _resize?: ResizeObserver;

  public static styles = styles;

  public connectedCallback(): void {
    super.connectedCallback();
    this._observeSize();
  }

  public disconnectedCallback(): void {
    this._resize?.disconnect();
    this._resize = undefined;
    super.disconnectedCallback();
  }

  protected firstUpdated(): void {
    this._observeSize();
  }

  /** Track the rendered width so text can be kept above a readable pixel size. */
  private _observeSize(): void {
    if (this._resize) return;
    const target = this.renderRoot?.querySelector(".flow-wrap");
    if (!target) return; // not rendered yet — firstUpdated will retry
    this._resize = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      // Round to whole pixels: sub-pixel jitter would re-render on every scroll.
      const rounded = Math.round(width);
      if (rounded !== this._widthPx) this._widthPx = rounded;
    });
    this._resize.observe(target);
  }

  /** Canvas units per CSS pixel (1 when the size isn't known yet). */
  private _unitsPerPx(): number {
    return this._widthPx > 0 ? 400 / this._widthPx : 1;
  }

  /** The smallest font size, in canvas units, that still renders readably. */
  private _minFont(): number {
    return MIN_TEXT_PX * this._unitsPerPx();
  }

  /** A font size in canvas units, never below the readable floor. */
  private _font(desired: number): number {
    return Math.max(desired, this._minFont());
  }

  /** True when the card is too small to carry secondary detail (edge labels, …). */
  private _isNarrow(): boolean {
    return this._widthPx > 0 && this._widthPx < NARROW_PX;
  }

  /**
   * Fit `text` into `maxWidth` canvas units: shrink the font down to the readable
   * floor, then squeeze the glyphs (`textLength`) if it still doesn't fit.
   */
  private _fit(text: string, desired: number, maxWidth: number): FittedText {
    const fontSize = this._font(desired);
    const width = text.length * fontSize * CHAR_EM;
    if (width <= maxWidth) return { text, fontSize };
    const shrunk = Math.max(this._minFont(), maxWidth / (text.length * CHAR_EM));
    const stillWide = text.length * shrunk * CHAR_EM > maxWidth + 0.5;
    return { text, fontSize: shrunk, textLength: stillWide ? maxWidth : undefined };
  }

  /** Fit a label by truncating it with an ellipsis rather than squeezing glyphs. */
  private _fitLabel(text: string, desired: number, maxWidth: number): FittedText {
    const fontSize = this._font(desired);
    const maxChars = Math.floor(maxWidth / (fontSize * CHAR_EM));
    if (text.length <= maxChars) return { text, fontSize };
    if (maxChars < 2) return { text: text.slice(0, 1), fontSize };
    return { text: `${text.slice(0, maxChars - 1).trimEnd()}…`, fontSize };
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement("eta-flow-card-editor") as unknown as LovelaceCardEditor;
  }

  /**
   * A starting config for the card picker. When the instance already has ETA-looking
   * sensors, they are mapped onto the matching nodes so the new card shows real data
   * straight away instead of an empty diagram.
   */
  public static getStubConfig(hass?: HomeAssistant): EtaFlowCardConfig {
    const nodes: Record<string, NodeConfig> = {
      puffer: {},
      solar: {},
      kessel: {},
      warmwasser: {},
      heizkreis: {},
      aussen: {},
    };
    for (const [id, entity] of Object.entries(detectRoleEntities(hass))) {
      nodes[id] = { ...nodes[id], primary: entity };
    }
    return { type: `custom:${CARD_NAME}`, title: "Heizung", nodes };
  }

  public setConfig(config: EtaFlowCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    validateConfig(config);
    this._config = { nodes: {}, edges: {}, ...config };
    this._entityIds = collectEntityIds(this._config);
  }

  public getCardSize(): number {
    return 6;
  }

  /** Sizing hint for Home Assistant's sections (grid) layout. The card is square. */
  public getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  /**
   * Only re-render when something the card actually shows changed. Without this the
   * card re-renders on every state change in the instance, which also restarts the
   * flow-dot animations.
   */
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (changed.size > 1 || !changed.has("hass")) return true;
    const old = changed.get("hass") as HomeAssistant | undefined;
    if (!old) return true;
    for (const id of this._entityIds) {
      if (old.states[id] !== this.hass.states[id]) return true;
    }
    // Locale/theme changes affect formatting, so watch those objects too.
    return old.locale !== this.hass.locale || old.themes !== this.hass.themes;
  }

  protected willUpdate(): void {
    // A card whose entities don't exist yet (card picker preview, a fresh manual
    // card, a renamed integration) shows the full layout with placeholder values
    // rather than a single lonely circle.
    this._placeholder = !!this.hass && !this._entityIds.some((id) => this.hass.states[id]);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    const visible = this._nodeIds().filter((id) => this._nodeVisible(id));
    const edges = this._resolvedEdges().filter(
      (e) => visible.includes(e.from) && visible.includes(e.to),
    );
    const links = (this._config.control_links ?? CONTROL_LINKS).filter(
      (l) => visible.includes(l.from) && visible.includes(l.to),
    );

    // Icons are drawn as an HTML overlay on top of the SVG (see _iconOverlay), so
    // they position reliably on mobile WebKit.
    const iconSpecs: IconSpec[] = [];
    for (const id of visible) {
      const spec =
        this._nodeKind(id) === "circle" ? this._circleIconSpec(id) : this._badgeIconSpec(id);
      if (spec) iconSpecs.push(spec);
    }
    for (const e of edges) {
      const spec = this._pumpIconSpec(e);
      if (spec) iconSpecs.push(spec);
    }

    const cardStyle = this._config.node_background
      ? `--eta-node-fill: ${this._config.node_background}`
      : nothing;

    const labels = this._layoutLabels(edges, visible);

    return html`
      <ha-card style=${cardStyle}>
        ${this._config.title ? html`<div class="title">${this._config.title}</div>` : nothing}
        <div class="flow-wrap">
          <svg class="flow" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
            ${links.map((l) => this._renderControlLink(l.from, l.to))}
            ${edges.map((e) => this._renderEdge(e))} ${edges.map((e) => this._renderPump(e))}
            ${visible.map((id) => this._renderNode(id, edges))}
            <!-- value labels last: they must never disappear behind a node -->
            ${[...labels.edges.values()].map((l) => this._renderText("edge-label", l.x, l.y, l))}
            ${[...labels.pumps.values()].map((l) => this._renderText("pump-label", l.x, l.y, l))}
          </svg>
          ${this._iconOverlay(iconSpecs)}
        </div>
        ${
          this._placeholder
            ? html`<div class="hint">Pick the entities for each node in the card editor.</div>`
            : nothing
        }
      </ha-card>
    `;
  }

  // ---- edge label placement ----------------------------------------------------

  /**
   * Place edge value labels so they miss the nodes, the node names and each other.
   *
   * The default layout is radial, so a fixed perpendicular offset from the midpoint
   * puts labels straight onto the hub's own name. Instead each label tries a few
   * positions along its line, on either side, and takes the one that collides least.
   */
  private _layoutLabels(edges: ResolvedEdge[], visible: string[]): PlacedLabels {
    const placed: PlacedLabels = { edges: new Map(), pumps: new Map() };
    if (this._isNarrow()) return placed; // no room — labels are dropped entirely

    const obstacles: Box[] = [];
    for (const id of visible) {
      const pos = this._geom(id);
      if (!pos) continue;
      const r = this._nodeRadius(id);
      obstacles.push({ x1: pos.x - r, y1: pos.y - r, x2: pos.x + r, y2: pos.y + r });
      const label = this._nodeLabelFitted(id);
      obstacles.push(textBox(pos.x, this._nodeLabelY(pos, r, label), label));
    }
    for (const edge of edges) {
      const center = this._pumpCenter(edge);
      if (!center) continue;
      const r = PUMP_DEFAULTS.radius + 2;
      obstacles.push({ x1: center.x - r, y1: center.y - r, x2: center.x + r, y2: center.y + r });
    }

    // Pump names first: they are pinned to their glyph, so edge labels move around them.
    for (const edge of edges) {
      const cfg = this._edgePump(edge.key);
      const center = this._pumpCenter(edge);
      if (!cfg || !center || cfg.hide_label) continue;
      const fitted = this._fitLabel(cfg.name ?? PUMP_DEFAULTS.label, 11, 84);
      const spot = this._placeNear(
        center,
        PUMP_DEFAULTS.radius + fitted.fontSize,
        fitted,
        obstacles,
      );
      if (!spot) continue;
      obstacles.push(spot.box);
      placed.pumps.set(edge.key, { ...fitted, x: spot.x, y: spot.y });
    }

    for (const edge of edges) {
      const cfg = this._config.edges?.[edge.key];
      const show = cfg?.show_label ?? this._config.show_edge_labels ?? false;
      if (!show) continue;
      const text = edgeValueLabel(cfg, this.hass);
      if (!text) continue;
      const from = this._geom(edge.from);
      const to = this._geom(edge.to);
      if (!from || !to) continue;

      const { x1, y1, x2, y2 } = trim(
        from,
        to,
        this._nodeRadius(edge.from),
        this._nodeRadius(edge.to),
      );
      const fitted = this._fit(text, 10, 96);
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const px = -(y2 - y1) / len;
      const py = (x2 - x1) / len;
      const offset = fitted.fontSize * 0.9 + 5;

      // Short edges (hub to a close node) leave little room along the line, so the
      // search also tries pushing the label further out sideways.
      let best: { cost: number; x: number; y: number; box: Box } | undefined;
      for (const t of [0.5, 0.62, 0.38, 0.74, 0.26]) {
        for (const side of [1, -1]) {
          for (const reach of [1, 1.8, 2.6]) {
            const away = offset * reach * side;
            const x = x1 + (x2 - x1) * t + px * away;
            const y = y1 + (y2 - y1) * t + py * away;
            const box = textBox(x, y, fitted);
            if (box.x1 < 1 || box.x2 > 399 || box.y1 < 1 || box.y2 > 399) continue;
            const cost =
              collisionCost(box, obstacles) +
              Math.abs(t - 0.5) * 8 +
              (reach - 1) * 6 +
              (side === 1 ? 0 : 1);
            if (!best || cost < best.cost) best = { cost, x, y, box };
          }
        }
      }
      if (!best) continue;
      obstacles.push(best.box);
      placed.edges.set(edge.key, { ...fitted, x: best.x, y: best.y });
    }
    return placed;
  }

  /**
   * Put a label just outside a point, trying right/below/left/above and taking the
   * first direction (by preference) that hits the fewest obstacles.
   */
  private _placeNear(
    center: Point,
    distance: number,
    text: FittedText,
    obstacles: Box[],
  ): { x: number; y: number; box: Box } | undefined {
    const halfWidth = (text.textLength ?? text.text.length * text.fontSize * CHAR_EM) / 2;
    const directions: Point[] = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
    ];
    let best: { cost: number; x: number; y: number; box: Box } | undefined;
    directions.forEach((dir, i) => {
      const reach = dir.y === 0 ? distance + halfWidth : distance;
      const x = center.x + dir.x * reach;
      const y = center.y + dir.y * reach;
      const box = textBox(x, y, text);
      if (box.x1 < 1 || box.x2 > 399 || box.y1 < 1 || box.y2 > 399) return;
      const cost = collisionCost(box, obstacles) + i * 2;
      if (!best || cost < best.cost) best = { cost, x, y, box };
    });
    return best;
  }

  /** Midpoint of an edge that carries a pump glyph, if any. */
  private _pumpCenter(edge: ResolvedEdge): Point | undefined {
    if (!this._edgePump(edge.key)?.entity) return undefined;
    const from = this._geom(edge.from);
    const to = this._geom(edge.to);
    if (!from || !to) return undefined;
    return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  }

  /** The node's name, sized and truncated to sit under its circle. */
  private _nodeLabelFitted(id: string): FittedText {
    const r = this._nodeRadius(id);
    return this._fitLabel(this._nodeLabel(id), clamp(r * 0.3, 11, 16), Math.max(2.4 * r, 76));
  }

  private _nodeLabelY(pos: Point, r: number, label: FittedText): number {
    return pos.y + r + label.fontSize * 0.8 + 3;
  }

  private _renderNodeLabel(id: string, pos: Point, r: number) {
    const label = this._nodeLabelFitted(id);
    return svg`<text
      class="node-label"
      x=${pos.x}
      y=${this._nodeLabelY(pos, r, label)}
      dominant-baseline="central"
      style=${`font-size:${label.fontSize.toFixed(1)}px`}
    >${label.text}</text>`;
  }

  // ---- node model resolvers ----------------------------------------------------

  /** All node ids: role defaults first (in order), then any extra configured ids. */
  private _nodeIds(): string[] {
    const ids = Object.keys(ROLES);
    for (const id of Object.keys(this._config.nodes ?? {})) {
      if (!ids.includes(id)) ids.push(id);
    }
    return ids;
  }

  private _cfg(id: string): NodeConfig | undefined {
    return this._config.nodes?.[id];
  }

  private _geom(id: string): Point | undefined {
    const cfg = this._cfg(id);
    const role = ROLES[id];
    const x = cfg?.x ?? role?.x;
    const y = cfg?.y ?? role?.y;
    if (x === undefined || y === undefined) return undefined;
    return { x, y };
  }

  private _nodeKind(id: string): NodeKind {
    return this._cfg(id)?.kind ?? ROLES[id]?.kind ?? NODE_FALLBACK.kind;
  }
  private _nodeColor(id: string): string {
    return this._cfg(id)?.color ?? ROLES[id]?.color ?? NODE_FALLBACK.color;
  }
  private _nodeRadius(id: string): number {
    return this._cfg(id)?.radius ?? ROLES[id]?.radius ?? NODE_FALLBACK.radius;
  }
  private _nodeStroke(id: string): number {
    return this._cfg(id)?.stroke_width ?? DEFAULT_STROKE_WIDTH;
  }
  private _nodeIcon(id: string): string {
    return this._cfg(id)?.icon ?? ROLES[id]?.icon ?? NODE_FALLBACK.icon;
  }
  private _nodeLabel(id: string): string {
    return this._cfg(id)?.name ?? ROLES[id]?.label ?? id;
  }

  private _hasData(cfg: NodeConfig | undefined): boolean {
    const state = stateEntity(cfg?.state);
    return !!(cfg?.primary || cfg?.secondary || state || cfg?.level || cfg?.layers?.length);
  }

  /** The entity a node click opens (primary value, else the first available). */
  private _nodeEntity(id: string): string | undefined {
    const cfg = this._cfg(id);
    return (
      cfg?.primary ?? cfg?.level ?? stateEntity(cfg?.state) ?? cfg?.secondary ?? cfg?.layers?.[0]
    );
  }

  /** The entity an edge click opens (its driving entity). */
  private _edgeEntity(key: string): string | undefined {
    const cfg = this._config.edges?.[key];
    return cfg?.entity ?? cfg?.label_entity ?? cfg?.from_entity;
  }

  /**
   * Resolve what a shape does when tapped/held: its own actions, then the card-level
   * defaults, then more-info on the entity it represents (the historical behaviour).
   */
  private _actionsFor(entity: string | undefined, cfg?: ActionsConfig): ResolvedActions {
    const fallback: ActionConfig = entity ? { action: "more-info" } : { action: "none" };
    return {
      entity,
      tap_action: cfg?.tap_action ?? this._config.tap_action ?? fallback,
      hold_action: cfg?.hold_action ?? this._config.hold_action,
      double_tap_action: cfg?.double_tap_action ?? this._config.double_tap_action,
    };
  }

  private _interactive(actions: ResolvedActions): boolean {
    return (
      hasAction(actions.tap_action) ||
      hasAction(actions.hold_action) ||
      hasAction(actions.double_tap_action)
    );
  }

  private _actionHandler(actions: ResolvedActions) {
    return actionHandler({
      hasHold: hasAction(actions.hold_action),
      hasDoubleClick: hasAction(actions.double_tap_action),
      disabled: !this._interactive(actions),
    });
  }

  private _onAction(ev: CustomEvent, actions: ResolvedActions): void {
    const action = (ev.detail as { action?: string } | undefined)?.action;
    if (!action) return;
    handleAction(this, this.hass, actions, action);
  }

  /**
   * Icons are an HTML overlay ON TOP of the SVG — never inside a `foreignObject`.
   * WebKit (iOS) does not apply the SVG `viewBox` scale to foreignObject HTML content,
   * so icons placed inside the SVG drift off their nodes (offset grows with position,
   * flips with orientation). The overlay exactly covers the square SVG, and each icon
   * is placed with percentages of that box (`cx/400`), so it scales correctly on every
   * engine. Size uses `cqw` against the `.flow-wrap` container so glyphs scale too.
   */
  private _iconOverlay(specs: IconSpec[]) {
    if (!specs.length) return nothing;
    return html`
      <div class="icon-overlay">
        ${specs.map(
          (s) => html`
            <ha-icon
              class=${`node-icon ${s.cls}`.trim()}
              icon=${s.icon}
              style=${`left:${s.cx / 4}%;top:${s.cy / 4}%;--mdc-icon-size:${s.size / 4}cqw;`}
            ></ha-icon>
          `,
        )}
      </div>
    `;
  }

  private _circleIconSpec(id: string): IconSpec | undefined {
    const pos = this._geom(id);
    if (!pos) return undefined;
    const cfg = this._cfg(id);
    const disp = computeNodeDisplay(cfg, this.hass);
    const r = this._nodeRadius(id);
    const hasState = !!disp.state;
    const hasBelow = hasState || !!disp.secondary;
    const size = clamp(Math.round(r * 0.62), 14, 40);
    const cy = hasBelow ? pos.y - r * 0.42 : pos.y - r * 0.3;
    return { icon: this._nodeIcon(id), cx: pos.x, cy, size, cls: "" };
  }

  private _badgeIconSpec(id: string): IconSpec | undefined {
    const pos = this._geom(id);
    if (!pos) return undefined;
    const r = this._nodeRadius(id);
    const size = clamp(Math.round(r * 0.66), 14, 28);
    return { icon: this._nodeIcon(id), cx: pos.x, cy: pos.y - r * 0.44, size, cls: "" };
  }

  private _pumpIconSpec(edge: ResolvedEdge): IconSpec | undefined {
    const cfg = this._edgePump(edge.key);
    if (!cfg?.entity) return undefined;
    const from = this._geom(edge.from);
    const to = this._geom(edge.to);
    if (!from || !to) return undefined;
    const on = isActive(this.hass, cfg.entity, cfg.active_states);
    const size = Math.round(PUMP_DEFAULTS.radius * 0.95);
    return {
      icon: cfg.icon ?? PUMP_DEFAULTS.icon,
      cx: (from.x + to.x) / 2,
      cy: (from.y + to.y) / 2,
      size,
      cls: `pump ${on ? "on" : ""}`.trim(),
    };
  }

  /** A node renders when it is placeable, not hidden, and has data (Puffer always). */
  private _nodeVisible(id: string): boolean {
    const cfg = this._cfg(id);
    if (cfg?.hidden) return false;
    if (!this._geom(id)) return false;
    // In placeholder mode the whole default layout is shown as a preview.
    if (this._placeholder && ROLES[id]) return true;
    return this._hasData(cfg) || id === PUFFER_ID;
  }

  /** Merge default edge topology with per-edge `from`/`to` overrides + custom edges. */
  private _resolvedEdges(): ResolvedEdge[] {
    const defaults = new Map(EDGES.map((e) => [e.key, e]));
    const keys = new Set<string>([...defaults.keys(), ...Object.keys(this._config.edges ?? {})]);
    const out: ResolvedEdge[] = [];
    for (const key of keys) {
      const cfg = this._config.edges?.[key];
      const def = defaults.get(key);
      const from = cfg?.from ?? def?.from;
      const to = cfg?.to ?? def?.to;
      if (!from || !to) continue;
      out.push({ key, from, to });
    }
    return out;
  }

  // ---- edges -------------------------------------------------------------------

  private _renderEdge(edge: ResolvedEdge) {
    const from = this._geom(edge.from);
    const to = this._geom(edge.to);
    if (!from || !to) return nothing;

    const { x1, y1, x2, y2 } = trim(
      from,
      to,
      this._nodeRadius(edge.from),
      this._nodeRadius(edge.to),
    );
    const pathId = `edge-${edge.key}`;
    const d = `M ${x1} ${y1} L ${x2} ${y2}`;
    const cfg = this._config.edges?.[edge.key];
    const flow = computeEdgeFlow(cfg, this.hass);
    // Dots inherit the color of the "source" node of the flow.
    const color = this._nodeColor(flow.reverse ? edge.to : edge.from);

    const actions = this._actionsFor(this._edgeEntity(edge.key), cfg);

    return svg`
      <g class="edge-group">
        <path id=${pathId} class="edge-line" d=${d}></path>
        ${flow.active ? this._renderDots(pathId, flow.duration, flow.reverse, color) : nothing}
        ${
          this._interactive(actions)
            ? svg`<path
                class="edge-hit"
                d=${d}
                ${this._actionHandler(actions)}
                @action=${(ev: CustomEvent) => this._onAction(ev, actions)}
              ></path>`
            : nothing
        }
      </g>
    `;
  }

  private _renderDots(pathId: string, dur: number, reverse: boolean, color: string) {
    const keyPoints = reverse ? "1;0" : "0;1";
    const count = 3;
    return svg`${Array.from({ length: count }, (_, i) => {
      const begin = `-${(dur / count) * i}s`;
      return svg`
        <circle class="dot" r="3.5" style=${`color:${color}`}>
          <animateMotion
            dur=${`${dur}s`}
            begin=${begin}
            repeatCount="indefinite"
            keyPoints=${keyPoints}
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href=${`#${pathId}`}></mpath>
          </animateMotion>
        </circle>`;
    })}`;
  }

  // ---- control links (dashed, non-hydraulic) -----------------------------------

  private _renderControlLink(fromId: string, toId: string) {
    const from = this._geom(fromId);
    const to = this._geom(toId);
    if (!from || !to) return nothing;
    const { x1, y1, x2, y2 } = trim(from, to, this._nodeRadius(fromId), this._nodeRadius(toId), 2);
    return svg`<path class="ctrl-line" d=${`M ${x1} ${y1} L ${x2} ${y2}`}></path>`;
  }

  // ---- pumps (any edge) --------------------------------------------------------

  /** Resolve the pump config for an edge (with solarpumpe as a compat shorthand). */
  private _edgePump(edgeKey: string): PumpConfig | undefined {
    const p = this._config.edges?.[edgeKey]?.pump;
    if (p?.entity) return p;
    if (edgeKey === "solar_to_puffer" && this._config.solarpumpe?.entity) {
      return this._config.solarpumpe;
    }
    return undefined;
  }

  private _renderPump(edge: ResolvedEdge) {
    const cfg = this._edgePump(edge.key);
    if (!cfg?.entity) return nothing;
    const from = this._geom(edge.from);
    const to = this._geom(edge.to);
    if (!from || !to) return nothing;

    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const on = isActive(this.hass, cfg.entity, cfg.active_states);
    const color = cfg.color ?? this._nodeColor(edge.from);
    const r = PUMP_DEFAULTS.radius;

    const actions = this._actionsFor(cfg.entity, cfg);

    return svg`
      <g
        style=${`color:${color}`}
        class=${this._interactive(actions) ? "clickable" : ""}
        ${this._actionHandler(actions)}
        @action=${(ev: CustomEvent) => this._onAction(ev, actions)}
      >
        <circle
          class=${`pump-ring ${on ? "active" : "inactive"}`}
          cx=${mx}
          cy=${my}
          r=${r}
          stroke="currentColor"
        ></circle>
      </g>
    `;
  }

  // ---- nodes -------------------------------------------------------------------

  private _renderNode(id: string, edges: ResolvedEdge[]) {
    return this._nodeKind(id) === "circle" ? this._renderCircle(id, edges) : this._renderBadge(id);
  }

  private _renderCircle(id: string, edges: ResolvedEdge[]) {
    const pos = this._geom(id);
    if (!pos) return nothing;
    const cfg = this._cfg(id);
    const disp = computeNodeDisplay(cfg, this.hass);
    const color = this._nodeColor(id);
    const r = this._nodeRadius(id);
    const active = this._nodeActive(id, edges);
    const unavailable = this._placeholder || (this._hasData(cfg) && !disp.available);
    const narrow = this._isNarrow();

    const hasState = !!disp.state && !narrow;
    const hasSecondary = !hasState && !!disp.secondary && !narrow;
    const hasBelow = hasState || hasSecondary;

    // A configured node whose entities are all gone shows a placeholder rather than
    // an empty ring — so a dead sensor reads as "no data", not as a rendering bug.
    const primaryText = disp.primary ?? (unavailable ? NO_VALUE : undefined);
    const primary = primaryText
      ? this._fit(primaryText, clamp(r * 0.36, 12, 22), r * 1.55)
      : undefined;
    const secondary = hasSecondary
      ? this._fit(disp.secondary as string, clamp(r * 0.28, 10, 16), r * 1.5)
      : undefined;

    const primaryCY = hasBelow ? pos.y + r * 0.04 : pos.y + r * 0.36;
    const belowCY = pos.y + r * 0.44;
    const hasStrat = !!(cfg?.level || cfg?.layers?.length);
    const actions = this._actionsFor(this._nodeEntity(id), cfg);

    return svg`
      <g
        style=${`color:${color}`}
        class=${this._interactive(actions) ? "clickable" : ""}
        ${this._actionHandler(actions)}
        @action=${(ev: CustomEvent) => this._onAction(ev, actions)}
      >
        <circle
          class=${`ring ${active ? "active" : "inactive"}${unavailable ? " unavailable" : ""}`}
          cx=${pos.x}
          cy=${pos.y}
          r=${r}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(id)}
        ></circle>
        ${hasStrat ? this._renderStratFill(id, pos, r, cfg, color) : nothing}
        ${
          primary
            ? this._renderText(
                "node-primary",
                pos.x,
                primaryCY,
                primary,
                this._valueColor(id, pos, r, cfg, primaryCY, color),
              )
            : nothing
        }
        ${
          hasState
            ? this._renderPill(pos.x, belowCY, r, disp.state as string, disp.stateColor)
            : nothing
        }
        ${
          secondary
            ? this._renderText(
                "node-secondary",
                pos.x,
                belowCY,
                secondary,
                this._valueColor(id, pos, r, cfg, belowCY, color),
              )
            : nothing
        }
        ${this._renderNodeLabel(id, pos, r)}
      </g>
    `;
  }

  /** A centered, pre-fitted text run, optionally forced to a specific fill color. */
  private _renderText(cls: string, x: number, y: number, t: FittedText, fill?: string) {
    const style = `font-size:${t.fontSize.toFixed(1)}px${fill ? `;fill:${fill}` : ""}`;
    return svg`<text
      class=${cls}
      x=${x}
      y=${y}
      dominant-baseline="central"
      textLength=${ifDefined(t.textLength)}
      lengthAdjust="spacingAndGlyphs"
      style=${style}
    >${t.text}</text>`;
  }

  /** Geometry and layer temperatures of a node's stratified fill, when it has one. */
  private _strat(
    id: string,
    pos: Point,
    r: number,
    cfg: NodeConfig | undefined,
  ): { top: number; bottom: number; rC: number; layers: number[] } | undefined {
    // Only nodes that opted into stratification: levelFraction falls back to a numeric
    // `primary`, which would otherwise give every node an invisible "fill".
    if (!cfg?.level && !cfg?.layers?.length) return undefined;
    const frac = levelFraction(cfg, this.hass);
    if (frac === undefined || frac <= 0) return undefined;
    const rC = Math.max(0, r - this._nodeStroke(id) - 0.5);
    const bottom = pos.y + rC;
    return {
      top: bottom - 2 * rC * frac,
      bottom,
      rC,
      layers: (cfg?.layers ?? [])
        .map((e) => numState(this.hass, e))
        .filter((n): n is number => n !== undefined),
    };
  }

  /**
   * Text color for a value drawn inside a node.
   *
   * Values that land on the buffer fill can't use the theme's text colors — the fill
   * runs from blue through green to red, so one end or the other is always unreadable.
   * Where the text sits on the fill, the color under it is reconstructed (the gradient
   * is interpolated at that height) and white or near-black is picked against it.
   */
  private _valueColor(
    id: string,
    pos: Point,
    r: number,
    cfg: NodeConfig | undefined,
    y: number,
    fallbackColor: string,
  ): string | undefined {
    const strat = this._strat(id, pos, r, cfg);
    if (!strat || y < strat.top || y > strat.bottom) return undefined; // plain background
    const { layers } = strat;
    if (layers.length === 0) return contrastText(fallbackColor);
    if (layers.length === 1) return contrastText(tempColor(layers[0]));
    // Gradient stops are spread evenly over the filled rect, top to bottom.
    const t = clamp((y - strat.top) / (strat.bottom - strat.top), 0, 1) * (layers.length - 1);
    const i = Math.min(Math.floor(t), layers.length - 2);
    const temp = layers[i] + (layers[i + 1] - layers[i]) * (t - i);
    return contrastText(tempColor(temp));
  }

  /** Stratified fill: level = charge %, colored warm-top / cool-bottom by `layers`. */
  private _renderStratFill(
    id: string,
    pos: Point,
    r: number,
    cfg: NodeConfig | undefined,
    color: string,
  ) {
    const strat = this._strat(id, pos, r, cfg);
    if (!strat) return nothing;
    const { rC, layers, top } = strat;
    const fillH = strat.bottom - top;
    const clipId = `${id}-clip`;
    const gradId = `${id}-grad`;

    let paint: string;
    let defs: unknown = nothing;
    if (layers.length >= 2) {
      const stops = layers.map((t, i) => {
        const offset = (i / (layers.length - 1)) * 100;
        return svg`<stop offset=${`${offset}%`} stop-color=${tempColor(t)}></stop>`;
      });
      defs = svg`<linearGradient id=${gradId} x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>`;
      paint = `url(#${gradId})`;
    } else if (layers.length === 1) {
      paint = tempColor(layers[0]);
    } else {
      paint = color;
    }

    return svg`
      <defs>
        ${defs}
        <clipPath id=${clipId}><circle cx=${pos.x} cy=${pos.y} r=${rC}></circle></clipPath>
      </defs>
      <rect
        class="strat-fill"
        x=${pos.x - rC}
        y=${top}
        width=${2 * rC}
        height=${fillH}
        fill=${paint}
        clip-path=${`url(#${clipId})`}
      ></rect>
    `;
  }

  /**
   * A small rounded text pill (e.g. boiler state), never wider than the node.
   * `color` tints the chip only — the text keeps the theme color, so the pill stays
   * legible whatever color a `state.map` entry names.
   */
  private _renderPill(cx: number, cy: number, r: number, text: string, color?: string) {
    const maxTextWidth = 2 * r - 16;
    const fitted = this._fit(text, clamp(r * 0.26, 9, 13), maxTextWidth);
    const textWidth = fitted.textLength ?? fitted.text.length * fitted.fontSize * CHAR_EM;
    const w = Math.min(2 * r - 6, textWidth + 10);
    const h = fitted.fontSize + 6;
    return svg`
      <rect
        class="pill-bg"
        x=${cx - w / 2}
        y=${cy - h / 2}
        width=${w}
        height=${h}
        rx=${h / 2}
        style=${color ? `fill:${color}` : nothing}
      ></rect>
      ${this._renderText("pill-text", cx, cy, fitted)}
    `;
  }

  // ---- badge & gauge nodes -----------------------------------------------------

  private _renderBadge(id: string) {
    const pos = this._geom(id);
    if (!pos) return nothing;
    const cfg = this._cfg(id);
    const disp = computeNodeDisplay(cfg, this.hass);
    const color = this._nodeColor(id);
    const r = this._nodeRadius(id);
    const isGauge = this._nodeKind(id) === "gauge" || cfg?.gauge === true;
    const frac = isGauge ? gaugeFraction(cfg, this.hass) : undefined;
    const unavailable = this._placeholder || (this._hasData(cfg) && !disp.available);
    const valueCY = pos.y + (frac !== undefined ? r * 0.14 : r * 0.2);
    const actions = this._actionsFor(this._nodeEntity(id), cfg);

    // Badge values are often wide ("-12.5 °C", "1234 kWh") — fit them to the ring.
    const valueText = disp.primary ?? (unavailable ? NO_VALUE : undefined);
    const value = valueText ? this._fit(valueText, 12, r * 1.7) : undefined;

    const gaugeW = r * 1.3;
    const gaugeY = pos.y + r * 0.52;

    return svg`
      <g
        style=${`color:${color}`}
        class=${this._interactive(actions) ? "clickable" : ""}
        ${this._actionHandler(actions)}
        @action=${(ev: CustomEvent) => this._onAction(ev, actions)}
      >
        <circle
          class=${`badge${unavailable ? " unavailable" : ""}`}
          cx=${pos.x}
          cy=${pos.y}
          r=${r}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(id)}
        ></circle>
        ${value ? this._renderText("badge-text", pos.x, valueCY, value) : nothing}
        ${
          frac !== undefined
            ? svg`
              <rect class="gauge-bg" x=${pos.x - gaugeW / 2} y=${gaugeY} width=${gaugeW} height="6" rx="3"></rect>
              <rect class="gauge-fill" x=${pos.x - gaugeW / 2} y=${gaugeY} width=${gaugeW * frac} height="6" rx="3"></rect>`
            : nothing
        }
        ${this._renderNodeLabel(id, pos, r)}
      </g>
    `;
  }

  /** A node "glows" when any (resolved) edge touching it is actively flowing. */
  private _nodeActive(id: string, edges: ResolvedEdge[]): boolean {
    return edges
      .filter((e) => e.from === id || e.to === id)
      .some((e) => computeEdgeFlow(this._config.edges?.[e.key], this.hass).active);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "eta-flow-card": EtaFlowCard;
  }
}
