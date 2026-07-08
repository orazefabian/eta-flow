import type { HomeAssistant } from "custom-card-helpers";
import type { EdgeConfig, EdgeFlow, NodeConfig, NodeDisplay } from "./types";

const FAST = 0.9; // seconds per dot cycle at high magnitude
const SLOW = 3.0; // seconds per dot cycle at low magnitude

function stateNum(hass: HomeAssistant, entity?: string): number | undefined {
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
  const type: string = edge.type ?? (stateNum(hass, edge.entity) !== undefined ? "power" : "state");

  if (type === "power") {
    const raw = stateNum(hass, edge.entity);
    if (raw === undefined) return off;
    const mag = Math.abs(raw);
    if (mag <= threshold) return off;
    // Normalize against a soft reference so small kW still animate.
    const norm = Math.min(1, mag / 5000 + 0.15);
    return { active: true, duration: durationFor(norm), reverse: raw < 0 !== !!edge.invert };
  }

  if (type === "delta") {
    const from = stateNum(hass, edge.from_entity);
    const to = stateNum(hass, edge.to_entity);
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

/** True when the solarpumpe entity is in an active state. */
export function isActive(
  hass: HomeAssistant,
  entity?: string,
  activeStates: string[] = ["on"],
): boolean {
  if (!entity) return false;
  const s = hass.states[entity];
  return !!s && activeStates.includes(s.state);
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

/** Build the displayable primary/secondary strings for a node. */
export function computeNodeDisplay(node: NodeConfig | undefined, hass: HomeAssistant): NodeDisplay {
  if (!node || !node.primary) return { available: false };
  const primary = formatState(hass, node.primary);
  const secondary = formatState(hass, node.secondary);
  return { primary, secondary, available: primary !== undefined };
}
