import { css } from "lit";

export const styles = css`
  :host {
    --eta-bg: #1c1c1c;
    --eta-line: #3a3a3a;
    --eta-text: #e1e1e1;
    --eta-text-dim: #9e9e9e;
  }

  ha-card {
    background: var(--eta-bg);
    padding: 8px 8px 4px;
    overflow: hidden;
  }

  .title {
    color: var(--eta-text-dim);
    font-size: 0.95rem;
    padding: 6px 8px 2px;
  }

  .flow {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: block;
  }

  /* connecting lines */
  .edge-line {
    stroke: var(--eta-line);
    stroke-width: 2;
    fill: none;
  }

  .dot {
    fill: currentColor;
  }

  /* node circles */
  .ring {
    fill: #2a2a2a;
    stroke-width: 3.5;
  }
  .ring.inactive {
    opacity: 0.45;
  }
  .ring.active {
    filter: drop-shadow(0 0 5px currentColor);
  }

  .node-icon {
    color: var(--eta-text);
  }

  .node-primary {
    fill: var(--eta-text);
    font-size: 15px;
    text-anchor: middle;
    font-weight: 500;
  }
  .node-secondary {
    fill: var(--eta-text-dim);
    font-size: 12px;
    text-anchor: middle;
  }
  .node-label {
    fill: var(--eta-text-dim);
    font-size: 13px;
    text-anchor: middle;
  }

  /* corner badge (Außentemperatur) */
  .badge {
    fill: #2a2a2a;
    stroke-width: 2;
  }
  .badge-text {
    fill: var(--eta-text);
    font-size: 13px;
    text-anchor: middle;
  }

  /* solarpumpe glyph */
  .pump {
    transform-box: fill-box;
    transform-origin: center;
  }
  .pump.on {
    animation: spin 1.6s linear infinite;
    filter: drop-shadow(0 0 3px currentColor);
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
