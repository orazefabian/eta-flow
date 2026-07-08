import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, type HomeAssistant, type LovelaceCardEditor } from "custom-card-helpers";
import { CARD_EDITOR_NAME, ROLES } from "./const";
import type { EtaFlowCardConfig, NodeConfig } from "./types";

@customElement(CARD_EDITOR_NAME)
export class EtaFlowCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: EtaFlowCardConfig;

  public setConfig(config: EtaFlowCardConfig): void {
    this._config = { nodes: {}, ...config };
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;
    return html`
      <div class="card-config">
        <ha-textfield
          label="Title"
          .value=${this._config.title ?? ""}
          @input=${this._titleChanged}
        ></ha-textfield>

        <p class="hint">
          Map an entity to each node. Leave a node empty to hide it. Connecting lines
          (<code>edges</code>) and per-edge flow behaviour are configured in YAML — see the README.
        </p>

        ${Object.values(ROLES).map((role) => this._renderNodeRow(role.id, role.label))}

        <h4>Solarpumpe</h4>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.solarpumpe?.entity ?? ""}
          allow-custom-entity
          @value-changed=${this._solarpumpeChanged}
        ></ha-entity-picker>
      </div>
    `;
  }

  private _renderNodeRow(id: string, label: string) {
    const node = this._config.nodes?.[id] ?? {};
    return html`
      <div class="node-row">
        <span class="node-name">${label}</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${node.primary ?? ""}
          label="Primary"
          allow-custom-entity
          @value-changed=${(e: CustomEvent) => this._nodeChanged(id, "primary", e)}
        ></ha-entity-picker>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${node.secondary ?? ""}
          label="Secondary (optional)"
          allow-custom-entity
          @value-changed=${(e: CustomEvent) => this._nodeChanged(id, "secondary", e)}
        ></ha-entity-picker>
      </div>
    `;
  }

  private _titleChanged(ev: Event): void {
    const value = (ev.target as HTMLInputElement).value;
    this._emit({ ...this._config, title: value || undefined });
  }

  private _nodeChanged(id: string, field: keyof NodeConfig, ev: CustomEvent): void {
    const value = ev.detail?.value as string | undefined;
    const nodes = { ...(this._config.nodes ?? {}) };
    const node: NodeConfig = { ...(nodes[id] ?? {}) };
    if (value) {
      (node as any)[field] = value;
    } else {
      delete (node as any)[field];
    }
    nodes[id] = node;
    this._emit({ ...this._config, nodes });
  }

  private _solarpumpeChanged(ev: CustomEvent): void {
    const value = ev.detail?.value as string | undefined;
    const solarpumpe = value ? { ...this._config.solarpumpe, entity: value } : undefined;
    this._emit({ ...this._config, solarpumpe });
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
    ha-textfield {
      width: 100%;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin: 4px 0;
    }
    .node-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color);
    }
    .node-name {
      font-weight: 600;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "eta-flow-card-editor": EtaFlowCardEditor;
  }
}
