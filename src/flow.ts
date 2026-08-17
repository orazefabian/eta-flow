import { formatNumber, type HomeAssistant } from "custom-card-helpers";
import type { EdgeConfig, EdgeFlow, NodeConfig, NodeDisplay } from "./types";

const FAST = 0.9; // seconds per dot cycle at high magnitude
const SLOW = 3.0; // seconds per dot cycle at low magnitude
const DEFAULT_POWER_REFERENCE = 5000; // magnitude mapping to full speed (electrical W)

/** States that carry no value — never render or format these. */
const UNAVAILABLE_STATES = new Set(["unavailable", "unknown", "none", ""]);

/** Shown where a value would be, when the entity has no usable state. */
export const NO_VALUE = "—";

/**
 * Newer Home Assistant frontends expose a state formatter that already honours the
 * user's locale, the entity's display precision and translated device-class states.
 * It is not part of the `custom-card-helpers` typings, so it is probed at runtime.
 */
interface HassWithFormat extends HomeAssistant {
  formatEntityState?: (stateObj: unknown, state?: string) => string;
}

/** True when the entity is missing or in a no-value state. */
export function isUnavailable(hass: HomeAssistant, entity?: string): boolean {
  if (!entity) return true;
  const s = hass.states[entity];
  return !s || UNAVAILABLE_STATES.has(s.state);
}

/** Numeric value of an entity's state, or undefined when missing/non-numeric. */
export function numState(hass: HomeAssistant, entity?: string): number | undefined {
  if (!entity) return undefined;
  const s = hass.states[entity];
  if (!s || UNAVAILABLE_STATES.has(s.state)) return undefined;
  const n = Number(s.state);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Map a magnitude (0..1 normalized-ish) to a dot cycle duration.
 * Quantized to 0.25 s steps: a jittering power sensor would otherwise change `dur`
 * on every state update, which restarts `animateMotion` and makes the dots jump.
 */
function durationFor(magnitude: number): number {
  const m = Math.max(0, Math.min(1, magnitude));
  return Math.round((SLOW - (SLOW - FAST) * m) * 4) / 4;
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
    const unit = unitOf(hass, edge.from_entity);
    const value = `Δ${formatValue(hass, diff)}`;
    return unit ? `${value} ${unit}` : value;
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

/** Unit of measurement of an entity, if it has one. */
function unitOf(hass: HomeAssistant, entity?: string): string | undefined {
  if (!entity) return undefined;
  return hass.states[entity]?.attributes?.unit_of_measurement as string | undefined;
}

/** Format a bare number in the user's locale (decimal separator, grouping). */
function formatValue(hass: HomeAssistant, value: number): string {
  const rounded = Math.round(value * 10) / 10;
  try {
    return formatNumber(rounded, hass.locale, { maximumFractionDigits: 1 });
  } catch {
    return String(rounded);
  }
}

/**
 * Render an entity's state the way the rest of Home Assistant does.
 *
 * Preference order: the frontend's own `formatEntityState` (display precision,
 * locale, translated states) → locale-aware number + unit → the raw state. Entities
 * that are missing or unavailable/unknown return undefined so callers can show a
 * placeholder instead of printing the word "unavailable" with a unit glued to it.
 */
export function formatState(hass: HomeAssistant, entity?: string): string | undefined {
  if (!entity) return undefined;
  const s = hass.states[entity];
  if (!s || UNAVAILABLE_STATES.has(s.state)) return undefined;

  const format = (hass as HassWithFormat).formatEntityState;
  if (typeof format === "function") {
    try {
      const out = format(s);
      if (out) return out;
    } catch {
      /* fall through to the local formatter */
    }
  }

  const unit = s.attributes?.unit_of_measurement;
  const num = Number(s.state);
  const value = Number.isFinite(num) ? formatValue(hass, num) : s.state;
  return unit ? `${value} ${unit}` : value;
}

/**
 * Build the displayable primary/secondary/state strings for a node.
 *
 * `available` is false when the node has value entities configured but none of them
 * currently resolve — the renderer shows a placeholder and dims the ring for that case.
 */
export function computeNodeDisplay(node: NodeConfig | undefined, hass: HomeAssistant): NodeDisplay {
  if (!node) return { available: false };
  const configured = !!(node.primary || node.secondary || node.state);
  if (!configured) return { available: false };
  const primary = formatState(hass, node.primary);
  const secondary = formatState(hass, node.secondary);
  const state = formatState(hass, node.state);
  return {
    primary,
    secondary,
    state,
    available: primary !== undefined || secondary !== undefined || state !== undefined,
  };
}
