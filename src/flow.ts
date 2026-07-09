import type { HomeAssistant } from "custom-card-helpers";
import type { EdgeConfig, EdgeFlow, NodeConfig, NodeDisplay } from "./types";

const FAST = 0.9; // seconds per dot cycle at high magnitude
const SLOW = 3.0; // seconds per dot cycle at low magnitude
const DEFAULT_POWER_REFERENCE = 5000; // magnitude mapping to full speed (electrical W)

/** Numeric value of an entity's state, or undefined when missing/non-numeric. */
export function numState(hass: HomeAssistant, entity?: string): number | undefined {
  if (!entity) return undefined;
  const s = hass.states[entity];
  if (!s) return undefined;
  const n = Number(s.state);
  return Number.isFinite(n) ? n : undefined;
}

/** Map a magnitude (0..1 normalized-ish) to a dot cycle duration. */
function durationFor(magnitude: number): number {
  const m = Math.max(0, Math.min(1, magnitude));
  return SLOW - (SLOW - FAST) * m;
}

/** Infer the edge drive mode when not set explicitly. */
function edgeType(edge: EdgeConfig, hass: HomeAssistant): string {
  return edge.type ?? (numState(hass, edge.entity) !== undefined ? "power" : "state");
}

/**
 * Evaluate an edge into visual flow parameters.
 * - power: numeric entity; magnitude scales speed, sign can reverse direction.
 * - state: on/off entity; fixed speed when in an active state.
 * - delta: from_entity warmer than to_entity by more than threshold.
 */
export function computeEdgeFlow(edge: EdgeConfig | undefined, hass: HomeAssistant): EdgeFlow {
  const off: EdgeFlow = { active: false, duration: SLOW, reverse: false };
  if (!edge) return off;

  const threshold = edge.threshold ?? 0;
  const type = edgeType(edge, hass);

  if (type === "power") {
    const raw = numState(hass, edge.entity);
    if (raw === undefined) return off;
    const mag = Math.abs(raw);
    if (mag <= threshold) return off;
    // Normalize against a (configurable) soft reference so small values still animate.
    const ref = edge.power_reference ?? DEFAULT_POWER_REFERENCE;
    const norm = Math.min(1, mag / ref + 0.15);
    return { active: true, duration: durationFor(norm), reverse: raw < 0 !== !!edge.invert };
  }

  if (type === "delta") {
    const from = numState(hass, edge.from_entity);
    const to = numState(hass, edge.to_entity);
    if (from === undefined || to === undefined) return off;
    const diff = from - to;
    if (diff <= threshold) return off;
    const norm = Math.min(1, diff / 30 + 0.15);
    return { active: true, duration: durationFor(norm), reverse: !!edge.invert };
  }

  // state
  const s = edge.entity ? hass.states[edge.entity] : undefined;
  if (!s) return off;
  const activeStates = edge.active_states ?? ["on"];
  const active = activeStates.includes(s.state);
  return { active, duration: durationFor(0.6), reverse: !!edge.invert };
}

/** A short, human-readable label for the value driving an edge (or undefined). */
export function edgeValueLabel(
  edge: EdgeConfig | undefined,
  hass: HomeAssistant,
): string | undefined {
  if (!edge) return undefined;
  if (edge.label_entity) return formatState(hass, edge.label_entity);
  const type = edgeType(edge, hass);
  if (type === "power") return formatState(hass, edge.entity);
  if (type === "delta") {
    const from = numState(hass, edge.from_entity);
    const to = numState(hass, edge.to_entity);
    if (from === undefined || to === undefined) return undefined;
    const diff = Math.round((from - to) * 10) / 10;
    return `Δ${diff}°`;
  }
  return undefined; // state edges carry no numeric label unless label_entity is set
}

/** True when the entity is in an active state (used for pump glyphs). */
export function isActive(
  hass: HomeAssistant,
  entity?: string,
  activeStates: string[] = ["on"],
): boolean {
  if (!entity) return false;
  const s = hass.states[entity];
  return !!s && activeStates.includes(s.state);
}

/**
 * Fill fraction (0..1) for a stratified buffer, from an explicit `level` entity or
 * a numeric percentage `primary`.
 */
export function levelFraction(
  node: NodeConfig | undefined,
  hass: HomeAssistant,
): number | undefined {
  const n = numState(hass, node?.level ?? node?.primary);
  if (n === undefined) return undefined;
  return Math.max(0, Math.min(1, n / 100));
}

/** Fill fraction (0..1) for a gauge given min/max bounds (default 0..100). */
export function gaugeFraction(
  node: NodeConfig | undefined,
  hass: HomeAssistant,
): number | undefined {
  const n = numState(hass, node?.primary);
  if (n === undefined) return undefined;
  const min = node?.min ?? 0;
  const max = node?.max ?? 100;
  if (max <= min) return undefined;
  return Math.max(0, Math.min(1, (n - min) / (max - min)));
}

/** Map a temperature (°C) to a warm/cool color for the buffer stratification fill. */
export function tempColor(t: number): string {
  const c = Math.max(20, Math.min(80, t));
  const hue = 210 - ((c - 20) / 60) * 210; // 210° blue (cool) → 0° red (hot)
  return `hsl(${hue}, 72%, 50%)`;
}

function formatState(hass: HomeAssistant, entity?: string): string | undefined {
  if (!entity) return undefined;
  const s = hass.states[entity];
  if (!s) return undefined;
  const unit = s.attributes?.unit_of_measurement;
  const num = Number(s.state);
  const value = Number.isFinite(num) ? String(Math.round(num * 10) / 10) : s.state;
  return unit ? `${value} ${unit}` : value;
}

/** Build the displayable primary/secondary/state strings for a node. */
export function computeNodeDisplay(node: NodeConfig | undefined, hass: HomeAssistant): NodeDisplay {
  if (!node || !node.primary) return { available: false };
  const primary = formatState(hass, node.primary);
  const secondary = formatState(hass, node.secondary);
  const state = node.state ? hass.states[node.state]?.state : undefined;
  return { primary, secondary, state, available: primary !== undefined };
}
