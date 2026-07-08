import type { LovelaceCardConfig } from "custom-card-helpers";

/** How a connecting line decides whether (and how fast) it flows. */
export type EdgeType = "power" | "state" | "delta";

export interface NodeConfig {
  /** Entity whose state is shown as the node's primary value. */
  primary?: string;
  /** Optional entity shown as a smaller secondary value. */
  secondary?: string;
  /** Override the default label. */
  name?: string;
  /** Override the default mdi icon. */
  icon?: string;
  /** Override the default accent color. */
  color?: string;
}

export interface EdgeConfig {
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
}

export interface SolarpumpeConfig {
  /** Binary/state entity; the pump glyph pulses while active. */
  entity?: string;
  active_states?: string[];
}

export interface EtaFlowCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  nodes?: Record<string, NodeConfig>;
  edges?: Record<string, EdgeConfig>;
  solarpumpe?: SolarpumpeConfig;
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
  available: boolean;
}
