import type { LovelaceCardConfig } from "custom-card-helpers";

/** How a connecting line decides whether (and how fast) it flows. */
export type EdgeType = "power" | "state" | "delta";

/** A pump glyph rendered on an edge; spins while its entity is active. */
export interface PumpConfig {
  /** Binary/state entity; the pump glyph spins while active. */
  entity?: string;
  active_states?: string[];
  /** Override the label shown next to the glyph. */
  name?: string;
  /** Override the pump mdi icon. */
  icon?: string;
  /** Override the pump accent color. */
  color?: string;
  /** Hide the text label next to the glyph. */
  hide_label?: boolean;
}

/** Backward-compatible alias for the top-level `solarpumpe:` block. */
export type SolarpumpeConfig = PumpConfig;

export type NodeKind = "circle" | "badge" | "gauge";

export interface NodeConfig {
  /** Entity whose state is shown as the node's primary value. */
  primary?: string;
  /** Optional entity shown as a smaller secondary value. */
  secondary?: string;
  /**
   * Optional text/state entity rendered as a small pill (e.g. the boiler's
   * "Bereit"/"Heizen"/"Ausbrand" state). Takes the slot secondary would use.
   */
  state?: string;
  /** Override the default label. */
  name?: string;
  /** Override the default mdi icon. */
  icon?: string;
  /** Override the default accent color. */
  color?: string;
  /**
   * Circle radius in SVG units on the fixed 400x400 canvas, i.e. relative to the
   * card size (e.g. 38 ≈ 9.5% of the card width). Overrides the role default.
   */
  radius?: number;
  /** Ring outline thickness in SVG units. Overrides the role default. */
  stroke_width?: number;

  // --- Placement & kind (fully custom / repositioned nodes) ------------------
  /** Center X on the 0..400 canvas. Required for custom nodes without a role. */
  x?: number;
  /** Center Y on the 0..400 canvas. Required for custom nodes without a role. */
  y?: number;
  /** How the node is drawn: full circle, corner badge, or gauge badge. */
  kind?: NodeKind;
  /** Force-hide this node even if it has a primary entity. */
  hidden?: boolean;

  // --- Buffer stratification (puffer node) -----------------------------------
  /**
   * Charge-% entity (0..100) that sets the stratified fill level. Falls back to
   * `primary` when it is a numeric percentage.
   */
  level?: string;
  /**
   * Temperature entities ordered top → bottom. Used to color the stratified fill
   * with a warm-top / cool-bottom gradient (the ETA Schichtpuffer look).
   */
  layers?: string[];

  // --- Gauge nodes (e.g. pellet stock) ---------------------------------------
  /** Render a small fill gauge under the value (default on for the `vorrat` badge). */
  gauge?: boolean;
  /** Gauge lower bound (default 0). */
  min?: number;
  /** Gauge upper bound (default 100). */
  max?: number;
}

export interface EdgeConfig {
  /** Source node id. Overrides the built-in topology; required for custom edges. */
  from?: string;
  /** Target node id. Overrides the built-in topology; required for custom edges. */
  to?: string;
  /** Drive mode. Defaults to "power" if an `entity` is numeric, else "state". */
  type?: EdgeType;
  /** Entity used for "power" (numeric) or "state" (on/off) modes. */
  entity?: string;
  /** States considered "active" for `type: state`. Default: ["on"]. */
  active_states?: string[];
  /** For `type: delta`: warm side and cold side; active when from > to. */
  from_entity?: string;
  to_entity?: string;
  /** Minimum magnitude before the edge is considered flowing. Default 0. */
  threshold?: number;
  /** Reverse the visual dot direction. */
  invert?: boolean;
  /**
   * Magnitude that maps to full dot speed (default 5000, tuned for electrical
   * watts). Set e.g. 15 for a pellet boiler reporting kW.
   */
  power_reference?: number;
  /** Show the driving value as a small label at the edge midpoint. */
  show_label?: boolean;
  /** Optional entity to source the edge label from, instead of the driving entity. */
  label_entity?: string;
  /** A pump glyph rendered on this edge, spinning while its entity is active. */
  pump?: PumpConfig;
}

/** A thin dashed, non-hydraulic link expressing a control relationship. */
export interface ControlLinkConfig {
  from: string;
  to: string;
}

export interface EtaFlowCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  nodes?: Record<string, NodeConfig>;
  edges?: Record<string, EdgeConfig>;
  /** Backward-compatible shorthand for a pump on the solar → puffer edge. */
  solarpumpe?: PumpConfig;
  /** Show driving-value labels on every edge (per-edge `show_label` overrides). */
  show_edge_labels?: boolean;
  /** Override the default control links (e.g. Außen → Heizkreis). */
  control_links?: ControlLinkConfig[];
}

/** Result of evaluating an edge against the current states. */
export interface EdgeFlow {
  active: boolean;
  /** Animation duration for one dot cycle, in seconds (lower = faster). */
  duration: number;
  /** Reverse travel direction (to -> from). */
  reverse: boolean;
}

/** Result of evaluating a node for display. */
export interface NodeDisplay {
  primary?: string;
  secondary?: string;
  /** Text state for the pill (see NodeConfig.state). */
  state?: string;
  available: boolean;
}
