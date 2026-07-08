import { LitElement, html, svg, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard, LovelaceCardEditor } from "custom-card-helpers";
import {
  BADGE_ROLE,
  CARD_NAME,
  CARD_VERSION,
  CIRCLE_ROLES,
  EDGES,
  NODE_RADIUS,
  PUFFER_ID,
  ROLES,
  type EdgeDef,
  type RoleDef,
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

const GAP = NODE_RADIUS + 3;

function trim(from: RoleDef, to: RoleDef): { x1: number; y1: number; x2: number; y2: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.x + ux * GAP,
    y1: from.y + uy * GAP,
    x2: to.x - ux * GAP,
    y2: to.y - uy * GAP,
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

  private _renderEdge(edge: EdgeDef) {
    const from = ROLES[edge.from];
    const to = ROLES[edge.to];
    const { x1, y1, x2, y2 } = trim(from, to);
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

  private _renderSolarpumpe() {
    const cfg = this._config.solarpumpe;
    if (!cfg?.entity) return nothing;
    const from = ROLES.solar;
    const to = ROLES.puffer;
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const on = isActive(this.hass, cfg.entity, cfg.active_states);
    const color = ROLES.solar.color;
    return svg`
      <g style=${`color:${color}`}>
        <circle cx=${mx} cy=${my} r="13" fill="#2a2a2a" stroke="currentColor" stroke-width="2"></circle>
        <foreignObject x=${mx - 9} y=${my - 9} width="18" height="18" class=${`pump ${on ? "on" : ""}`}>
          <ha-icon
            icon="mdi:pump"
            style="color: var(--eta-text); --mdc-icon-size: 18px; width:18px; height:18px;"
          ></ha-icon>
        </foreignObject>
      </g>
    `;
  }

  private _renderNode(id: string) {
    const role = ROLES[id];
    const cfg = this._config.nodes?.[id];
    if (id !== PUFFER_ID && (!cfg || !cfg.primary)) return nothing; // hide unconfigured peripherals
    const disp = computeNodeDisplay(cfg, this.hass);
    const color = this._nodeColor(id);
    const label = cfg?.name ?? role.label;
    const icon = cfg?.icon ?? role.icon;
    const active = this._nodeActive(id);
    const hasSecondary = !!disp.secondary;

    const iconY = hasSecondary ? role.y - 26 : role.y - 22;
    const primaryY = hasSecondary ? role.y + 8 : role.y + 14;
    const secondaryY = role.y + 26;

    return svg`
      <g style=${`color:${color}`}>
        <circle
          class=${`ring ${active ? "active" : "inactive"}`}
          cx=${role.x}
          cy=${role.y}
          r=${NODE_RADIUS}
          stroke="currentColor"
        ></circle>
        <foreignObject x=${role.x - 13} y=${iconY} width="26" height="26">
          <ha-icon
            icon=${icon}
            style="color: var(--eta-text); --mdc-icon-size: 24px; width:24px; height:24px;"
          ></ha-icon>
        </foreignObject>
        ${
          disp.primary
            ? svg`<text class="node-primary" x=${role.x} y=${primaryY}>${disp.primary}</text>`
            : nothing
        }
        ${
          hasSecondary
            ? svg`<text class="node-secondary" x=${role.x} y=${secondaryY}>${disp.secondary}</text>`
            : nothing
        }
        <text class="node-label" x=${role.x} y=${role.y + NODE_RADIUS + 16}>${label}</text>
      </g>
    `;
  }

  private _renderBadge() {
    const role = ROLES[BADGE_ROLE];
    const cfg = this._config.nodes?.[BADGE_ROLE];
    if (!cfg?.primary) return nothing;
    const disp = computeNodeDisplay(cfg, this.hass);
    const color = cfg.color ?? role.color;
    const label = cfg.name ?? role.label;
    return svg`
      <g style=${`color:${color}`}>
        <circle class="badge" cx=${role.x} cy=${role.y} r="26" stroke="currentColor"></circle>
        <foreignObject x=${role.x - 9} y=${role.y - 20} width="18" height="18">
          <ha-icon
            icon=${cfg.icon ?? role.icon}
            style="color: var(--eta-text); --mdc-icon-size: 18px; width:18px; height:18px;"
          ></ha-icon>
        </foreignObject>
        ${disp.primary ? svg`<text class="badge-text" x=${role.x} y=${role.y + 10}>${disp.primary}</text>` : nothing}
        <text class="node-label" x=${role.x} y=${role.y + 42}>${label}</text>
      </g>
    `;
  }

  private _nodeColor(id: string): string {
    return this._config.nodes?.[id]?.color ?? ROLES[id]?.color ?? "#4caf50";
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
