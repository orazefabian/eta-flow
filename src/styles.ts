import { css } from "lit";

export const styles = css`
  /*
   * Follow the active Home Assistant theme so the card blends with every other
   * card in both light and dark themes. The hardcoded values are dark-theme
   * fallbacks for when a theme variable is missing.
   */
  :host {
    --eta-line: var(--divider-color, #565656);
    --eta-text: var(--primary-text-color, #e1e1e1);
    --eta-text-dim: var(--secondary-text-color, #9e9e9e);
    --eta-node-fill: var(--secondary-background-color, #2a2a2a);
  }

  ha-card {
    /* inherit the standard themed card background instead of forcing dark */
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

  /* clickable nodes open the entity's more-info dialog */
  .clickable {
    cursor: pointer;
  }
  .clickable:hover .ring,
  .clickable:hover .badge {
    filter: brightness(1.12);
  }

  /* wide invisible hit target so a thin edge is easy to click */
  .edge-hit {
    stroke: transparent;
    stroke-width: 18;
    fill: none;
    cursor: pointer;
    pointer-events: stroke;
  }

  /* connecting lines */
  .edge-line {
    stroke: var(--eta-line);
    stroke-width: 2;
    fill: none;
  }

  /* control link (e.g. outside temp -> heating circuit) */
  .ctrl-line {
    stroke: var(--eta-text-dim);
    stroke-width: 1.2;
    stroke-dasharray: 3 4;
    fill: none;
    opacity: 0.5;
  }

  .dot {
    fill: currentColor;
  }

  /* edge value label */
  .edge-label {
    fill: var(--eta-text-dim);
    font-size: 10px;
    text-anchor: middle;
    font-variant-numeric: tabular-nums;
  }

  /* node circles (outline thickness set per-node via the stroke-width attribute) */
  .ring {
    fill: var(--eta-node-fill);
  }
  .ring.inactive {
    opacity: 0.55;
  }
  .ring.active {
    filter: drop-shadow(0 0 5px currentColor);
  }

  /* stratified buffer fill */
  .strat-fill {
    opacity: 0.82;
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

  /* text state pill (e.g. boiler Bereit/Heizen) */
  .pill-bg {
    fill: currentColor;
    opacity: 0.22;
  }
  .pill-text {
    fill: var(--eta-text);
    text-anchor: middle;
  }

  /* corner badge (Außentemperatur, Pelletvorrat) */
  .badge {
    fill: var(--eta-node-fill);
  }
  .badge-text {
    fill: var(--eta-text);
    font-size: 12px;
    text-anchor: middle;
  }

  /* badge fill gauge */
  .gauge-bg {
    fill: currentColor;
    opacity: 0.2;
  }
  .gauge-fill {
    fill: currentColor;
  }

  /* pump glyph (any edge) */
  .pump-ring {
    fill: var(--eta-node-fill);
    stroke-width: 2;
  }
  .pump-ring.inactive {
    opacity: 0.55;
  }
  .pump-ring.active {
    filter: drop-shadow(0 0 4px currentColor);
  }
  .pump-label {
    fill: var(--eta-text-dim);
    font-size: 11px;
    text-anchor: start;
  }
  .pump {
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
