import { LitElement, html, svg, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard, LovelaceCardEditor } from "custom-card-helpers";
import {
  CARD_NAME,
  CARD_VERSION,
  CONTROL_LINKS,
  DEFAULT_STROKE_WIDTH,
  EDGES,
  NODE_FALLBACK,
  PUFFER_ID,
  PUMP_DEFAULTS,
  ROLES,
  type NodeKind,
} from "./const";
import type { EtaFlowCardConfig, NodeConfig, PumpConfig } from "./types";
import {
  computeEdgeFlow,
  computeNodeDisplay,
  edgeValueLabel,
  gaugeFraction,
  isActive,
  levelFraction,
  numState,
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

interface Point {
  x: number;
  y: number;
}

/** A fully-resolved edge (default topology merged with config overrides). */
interface ResolvedEdge {
  key: string;
  from: string;
  to: string;
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

  public static styles = styles;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement("eta-flow-card-editor") as unknown as LovelaceCardEditor;
  }

  public static getStubConfig(): EtaFlowCardConfig {
    return {
      type: `custom:${CARD_NAME}`,
      title: "Heizung",
      nodes: { puffer: {}, solar: {}, kessel: {}, warmwasser: {}, heizkreis: {}, aussen: {} },
    };
  }

  public setConfig(config: EtaFlowCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    this._config = { nodes: {}, edges: {}, ...config };
  }

  public getCardSize(): number {
    return 6;
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

    return html`
      <ha-card>
        ${this._config.title ? html`<div class="title">${this._config.title}</div>` : nothing}
        <svg class="flow" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          ${links.map((l) => this._renderControlLink(l.from, l.to))}
          ${edges.map((e) => this._renderEdge(e))} ${edges.map((e) => this._renderPump(e))}
          ${visible.map((id) => this._renderNode(id, edges))}
        </svg>
      </ha-card>
    `;
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
    return !!(cfg?.primary || cfg?.level || cfg?.layers?.length);
  }

  /** A node renders when it is placeable, not hidden, and has data (Puffer always). */
  private _nodeVisible(id: string): boolean {
    const cfg = this._cfg(id);
    if (cfg?.hidden) return false;
    if (!this._geom(id)) return false;
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

    const showLabel = cfg?.show_label ?? this._config.show_edge_labels ?? false;
    const label = showLabel ? edgeValueLabel(cfg, this.hass) : undefined;
    let labelEl: unknown = nothing;
    if (label) {
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
      const px = -(to.y - from.y) / len; // perpendicular unit
      const py = (to.x - from.x) / len;
      const off = this._edgePump(edge.key) ? 22 : 11;
      labelEl = svg`<text class="edge-label" x=${mx + px * off} y=${my + py * off}
        dominant-baseline="central">${label}</text>`;
    }

    return svg`
      <path id=${pathId} class="edge-line" d=${d}></path>
      ${flow.active ? this._renderDots(pathId, flow.duration, flow.reverse, color) : nothing}
      ${labelEl}
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
    const iconSize = Math.round(r * 1.15);
    const label = cfg.name ?? PUMP_DEFAULTS.label;

    return svg`
      <g style=${`color:${color}`}>
        <circle
          class=${`pump-ring ${on ? "active" : "inactive"}`}
          cx=${mx}
          cy=${my}
          r=${r}
          stroke="currentColor"
        ></circle>
        <foreignObject
          x=${mx - iconSize / 2}
          y=${my - iconSize / 2}
          width=${iconSize}
          height=${iconSize}
          class=${`pump ${on ? "on" : ""}`}
        >
          <ha-icon
            icon=${cfg.icon ?? PUMP_DEFAULTS.icon}
            style=${`color: var(--eta-text); --mdc-icon-size: ${iconSize}px; width:${iconSize}px; height:${iconSize}px;`}
          ></ha-icon>
        </foreignObject>
        ${
          cfg.hide_label
            ? nothing
            : svg`<text class="pump-label" x=${mx + r + 5} y=${my} dominant-baseline="central">${label}</text>`
        }
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
    const hasState = !!disp.state;
    const hasSecondary = !hasState && !!disp.secondary;
    const hasBelow = hasState || hasSecondary;

    const iconSize = clamp(Math.round(r * 0.62), 14, 40);
    const primaryFont = clamp(r * 0.36, 12, 22).toFixed(1);
    const secondaryFont = clamp(r * 0.28, 10, 16).toFixed(1);
    const labelFont = clamp(r * 0.3, 11, 16).toFixed(1);

    const iconCY = hasBelow ? pos.y - r * 0.42 : pos.y - r * 0.3;
    const primaryCY = hasBelow ? pos.y + r * 0.04 : pos.y + r * 0.36;
    const belowCY = pos.y + r * 0.44;
    const labelY = pos.y + r + Number(labelFont) * 0.8 + 3;
    const hasStrat = !!(cfg?.level || cfg?.layers?.length);

    return svg`
      <g style=${`color:${color}`}>
        <circle
          class=${`ring ${active ? "active" : "inactive"}`}
          cx=${pos.x}
          cy=${pos.y}
          r=${r}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(id)}
        ></circle>
        ${hasStrat ? this._renderStratFill(id, pos, r, cfg, color) : nothing}
        <foreignObject
          x=${pos.x - iconSize / 2}
          y=${iconCY - iconSize / 2}
          width=${iconSize}
          height=${iconSize}
        >
          <ha-icon
            icon=${this._nodeIcon(id)}
            style=${`color: var(--eta-text); --mdc-icon-size: ${iconSize}px; width:${iconSize}px; height:${iconSize}px;`}
          ></ha-icon>
        </foreignObject>
        ${
          disp.primary
            ? svg`<text
                class="node-primary"
                x=${pos.x}
                y=${primaryCY}
                dominant-baseline="central"
                style=${`font-size:${primaryFont}px`}
              >${disp.primary}</text>`
            : nothing
        }
        ${hasState ? this._renderPill(pos.x, belowCY, r, disp.state as string) : nothing}
        ${
          hasSecondary
            ? svg`<text
                class="node-secondary"
                x=${pos.x}
                y=${belowCY}
                dominant-baseline="central"
                style=${`font-size:${secondaryFont}px`}
              >${disp.secondary}</text>`
            : nothing
        }
        <text
          class="node-label"
          x=${pos.x}
          y=${labelY}
          dominant-baseline="central"
          style=${`font-size:${labelFont}px`}
        >${this._nodeLabel(id)}</text>
      </g>
    `;
  }

  /** Stratified fill: level = charge %, colored warm-top / cool-bottom by `layers`. */
  private _renderStratFill(
    id: string,
    pos: Point,
    r: number,
    cfg: NodeConfig | undefined,
    color: string,
  ) {
    const frac = levelFraction(cfg, this.hass);
    if (frac === undefined || frac <= 0) return nothing;
    const stroke = this._nodeStroke(id);
    const rC = Math.max(0, r - stroke - 0.5);
    const fillH = 2 * rC * frac;
    const clipId = `${id}-clip`;
    const gradId = `${id}-grad`;

    const layers = (cfg?.layers ?? [])
      .map((e) => numState(this.hass, e))
      .filter((n): n is number => n !== undefined);

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
        y=${pos.y + rC - fillH}
        width=${2 * rC}
        height=${fillH}
        fill=${paint}
        clip-path=${`url(#${clipId})`}
      ></rect>
    `;
  }

  /** A small rounded text pill (e.g. boiler state). */
  private _renderPill(cx: number, cy: number, r: number, text: string) {
    const fontSize = clamp(r * 0.26, 9, 13);
    const w = Math.min(2 * r - 6, text.length * fontSize * 0.62 + 10);
    const h = fontSize + 6;
    return svg`
      <rect class="pill-bg" x=${cx - w / 2} y=${cy - h / 2} width=${w} height=${h} rx=${h / 2}></rect>
      <text class="pill-text" x=${cx} y=${cy} dominant-baseline="central" style=${`font-size:${fontSize}px`}>${text}</text>
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
    const iconSize = clamp(Math.round(r * 0.52), 12, 26);
    const isGauge = this._nodeKind(id) === "gauge" || cfg?.gauge === true;
    const frac = isGauge ? gaugeFraction(cfg, this.hass) : undefined;
    const valueCY = pos.y + r * 0.2;

    return svg`
      <g style=${`color:${color}`}>
        <circle
          class="badge"
          cx=${pos.x}
          cy=${pos.y}
          r=${r}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(id)}
        ></circle>
        <foreignObject
          x=${pos.x - iconSize / 2}
          y=${pos.y - r * 0.42 - iconSize / 2}
          width=${iconSize}
          height=${iconSize}
        >
          <ha-icon
            icon=${this._nodeIcon(id)}
            style=${`color: var(--eta-text); --mdc-icon-size: ${iconSize}px; width:${iconSize}px; height:${iconSize}px;`}
          ></ha-icon>
        </foreignObject>
        ${
          disp.primary
            ? svg`<text class="badge-text" x=${pos.x} y=${valueCY} dominant-baseline="central">${disp.primary}</text>`
            : nothing
        }
        ${
          frac !== undefined
            ? svg`
              <rect class="gauge-bg" x=${pos.x - r * 0.6} y=${pos.y + r * 0.5} width=${r * 1.2} height="4" rx="2"></rect>
              <rect class="gauge-fill" x=${pos.x - r * 0.6} y=${pos.y + r * 0.5} width=${r * 1.2 * frac} height="4" rx="2"></rect>`
            : nothing
        }
        <text class="node-label" x=${pos.x} y=${pos.y + r + 12} dominant-baseline="central">${this._nodeLabel(id)}</text>
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
