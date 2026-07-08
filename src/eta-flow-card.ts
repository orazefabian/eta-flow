import { LitElement, html, svg, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard, LovelaceCardEditor } from "custom-card-helpers";
import {
  BADGE_ROLE,
  CARD_NAME,
  CARD_VERSION,
  CIRCLE_ROLES,
  DEFAULT_STROKE_WIDTH,
  EDGES,
  PUFFER_ID,
  ROLES,
  SOLARPUMPE,
  type EdgeDef,
} from "./const";
import type { EtaFlowCardConfig } from "./types";
import { computeEdgeFlow, computeNodeDisplay, isActive } from "./flow";
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
  description: "Animated heat-flow visualization for ETA pellet heating systems.",
  preview: true,
  documentationURL: "https://github.com/orazefabian/eta-flow",
});

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

interface Point {
  x: number;
  y: number;
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

    return html`
      <ha-card>
        ${this._config.title ? html`<div class="title">${this._config.title}</div>` : nothing}
        <svg class="flow" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
          ${EDGES.map((e) => this._renderEdge(e))} ${this._renderSolarpumpe()}
          ${CIRCLE_ROLES.map((id) => this._renderNode(id))} ${this._renderBadge()}
        </svg>
      </ha-card>
    `;
  }

  // ---- appearance resolvers ----------------------------------------------------

  private _nodeColor(id: string): string {
    return this._config.nodes?.[id]?.color ?? ROLES[id]?.color ?? "#4caf50";
  }
  private _nodeRadius(id: string): number {
    return this._config.nodes?.[id]?.radius ?? ROLES[id]?.radius ?? 34;
  }
  private _nodeStroke(id: string): number {
    return this._config.nodes?.[id]?.stroke_width ?? DEFAULT_STROKE_WIDTH;
  }

  // ---- edges -------------------------------------------------------------------

  private _renderEdge(edge: EdgeDef) {
    const from = ROLES[edge.from];
    const to = ROLES[edge.to];
    const { x1, y1, x2, y2 } = trim(from, to, this._nodeRadius(from.id), this._nodeRadius(to.id));
    const pathId = `edge-${edge.key}`;
    const d = `M ${x1} ${y1} L ${x2} ${y2}`;
    const flow = computeEdgeFlow(this._config.edges?.[edge.key], this.hass);
    // Dots inherit the color of the "source" node of the flow.
    const source = flow.reverse ? to : from;
    const color = this._nodeColor(source.id);

    return svg`
      <path id=${pathId} class="edge-line" d=${d}></path>
      ${flow.active ? this._renderDots(pathId, flow.duration, flow.reverse, color) : nothing}
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

  // ---- solarpumpe --------------------------------------------------------------

  private _renderSolarpumpe() {
    const cfg = this._config.solarpumpe;
    if (!cfg?.entity) return nothing;
    const from = ROLES.solar;
    const to = ROLES.puffer;
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const on = isActive(this.hass, cfg.entity, cfg.active_states);
    const color = cfg.color ?? ROLES.solar.color;
    const r = SOLARPUMPE.radius;
    const iconSize = Math.round(r * 1.15);
    const label = cfg.name ?? SOLARPUMPE.label;

    return svg`
      <g style=${`color:${color}`}>
        <circle
          class=${`sp-ring ${on ? "active" : "inactive"}`}
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
            icon=${cfg.icon ?? SOLARPUMPE.icon}
            style=${`color: var(--eta-text); --mdc-icon-size: ${iconSize}px; width:${iconSize}px; height:${iconSize}px;`}
          ></ha-icon>
        </foreignObject>
        ${
          cfg.hide_label
            ? nothing
            : svg`<text class="sp-label" x=${mx + r + 5} y=${my} dominant-baseline="central">${label}</text>`
        }
      </g>
    `;
  }

  // ---- nodes -------------------------------------------------------------------

  private _renderNode(id: string) {
    const role = ROLES[id];
    const cfg = this._config.nodes?.[id];
    if (id !== PUFFER_ID && (!cfg || !cfg.primary)) return nothing; // hide unconfigured peripherals
    const disp = computeNodeDisplay(cfg, this.hass);
    const color = this._nodeColor(id);
    const r = this._nodeRadius(id);
    const label = cfg?.name ?? role.label;
    const icon = cfg?.icon ?? role.icon;
    const active = this._nodeActive(id);
    const hasSecondary = !!disp.secondary;

    const iconSize = clamp(Math.round(r * 0.62), 14, 40);
    const primaryFont = clamp(r * 0.36, 12, 22).toFixed(1);
    const secondaryFont = clamp(r * 0.28, 10, 16).toFixed(1);
    const labelFont = clamp(r * 0.3, 11, 16).toFixed(1);

    const iconCY = hasSecondary ? role.y - r * 0.42 : role.y - r * 0.3;
    const primaryCY = hasSecondary ? role.y + r * 0.04 : role.y + r * 0.36;
    const secondaryCY = role.y + r * 0.44;
    const labelY = role.y + r + Number(labelFont) * 0.8 + 3;

    return svg`
      <g style=${`color:${color}`}>
        <circle
          class=${`ring ${active ? "active" : "inactive"}`}
          cx=${role.x}
          cy=${role.y}
          r=${r}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(id)}
        ></circle>
        <foreignObject
          x=${role.x - iconSize / 2}
          y=${iconCY - iconSize / 2}
          width=${iconSize}
          height=${iconSize}
        >
          <ha-icon
            icon=${icon}
            style=${`color: var(--eta-text); --mdc-icon-size: ${iconSize}px; width:${iconSize}px; height:${iconSize}px;`}
          ></ha-icon>
        </foreignObject>
        ${
          disp.primary
            ? svg`<text
                class="node-primary"
                x=${role.x}
                y=${primaryCY}
                dominant-baseline="central"
                style=${`font-size:${primaryFont}px`}
              >${disp.primary}</text>`
            : nothing
        }
        ${
          hasSecondary
            ? svg`<text
                class="node-secondary"
                x=${role.x}
                y=${secondaryCY}
                dominant-baseline="central"
                style=${`font-size:${secondaryFont}px`}
              >${disp.secondary}</text>`
            : nothing
        }
        <text
          class="node-label"
          x=${role.x}
          y=${labelY}
          dominant-baseline="central"
          style=${`font-size:${labelFont}px`}
        >${label}</text>
      </g>
    `;
  }

  // ---- corner badge (Außentemperatur) -----------------------------------------

  private _renderBadge() {
    const role = ROLES[BADGE_ROLE];
    const cfg = this._config.nodes?.[BADGE_ROLE];
    if (!cfg?.primary) return nothing;
    const disp = computeNodeDisplay(cfg, this.hass);
    const color = cfg.color ?? role.color;
    const r = this._nodeRadius(BADGE_ROLE);
    const label = cfg.name ?? role.label;
    const iconSize = clamp(Math.round(r * 0.6), 12, 28);

    return svg`
      <g style=${`color:${color}`}>
        <circle
          class="badge"
          cx=${role.x}
          cy=${role.y}
          r=${r}
          stroke="currentColor"
          stroke-width=${this._nodeStroke(BADGE_ROLE)}
        ></circle>
        <foreignObject
          x=${role.x - iconSize / 2}
          y=${role.y - r * 0.34 - iconSize / 2}
          width=${iconSize}
          height=${iconSize}
        >
          <ha-icon
            icon=${cfg.icon ?? role.icon}
            style=${`color: var(--eta-text); --mdc-icon-size: ${iconSize}px; width:${iconSize}px; height:${iconSize}px;`}
          ></ha-icon>
        </foreignObject>
        ${
          disp.primary
            ? svg`<text class="badge-text" x=${role.x} y=${role.y + r * 0.36} dominant-baseline="central">${disp.primary}</text>`
            : nothing
        }
        <text class="node-label" x=${role.x} y=${role.y + r + 12} dominant-baseline="central">${label}</text>
      </g>
    `;
  }

  /** A node "glows" when any edge touching it is actively flowing. */
  private _nodeActive(id: string): boolean {
    if (id === PUFFER_ID) {
      return EDGES.some((e) => computeEdgeFlow(this._config.edges?.[e.key], this.hass).active);
    }
    return EDGES.filter((e) => e.from === id || e.to === id).some(
      (e) => computeEdgeFlow(this._config.edges?.[e.key], this.hass).active,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "eta-flow-card": EtaFlowCard;
  }
}
