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

/** Text colors used on top of a filled shape, where the theme colors can't be read. */
export const ON_FILL_LIGHT = "#ffffff";
export const ON_FILL_DARK = "#101418";

/** sRGB channels (0..1) of a color the card itself produced: hsl() or #hex. */
function channels(color: string): [number, number, number] | undefined {
  const hsl = /^hsl\(\s*([\d.-]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/i.exec(color.trim());
  if (hsl) {
    const h = ((Number(hsl[1]) % 360) + 360) % 360;
    const s = Number(hsl[2]) / 100;
    const l = Number(hsl[3]) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const [r, g, b] = (
      [
        [c, x, 0],
        [x, c, 0],
        [0, c, x],
        [0, x, c],
        [x, 0, c],
        [c, 0, x],
      ] as [number, number, number][]
    )[Math.floor(h / 60) % 6];
    return [r + m, g + m, b + m];
  }

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (hex) {
    const digits =
      hex[1].length === 3
        ? [...hex[1]].map((d) => d + d)
        : [hex[1].slice(0, 2), hex[1].slice(2, 4), hex[1].slice(4, 6)];
    return digits.map((d) => parseInt(d, 16) / 255) as [number, number, number];
  }

  return undefined;
}

/**
 * Pick white or near-black text for a known background, by WCAG relative luminance.
 * Used for values that sit on the stratified buffer fill, where neither theme text
 * color is guaranteed to be legible (the fill runs from blue through green to red).
 */
export function contrastText(background: string): string {
  const rgb = channels(background);
  if (!rgb) return ON_FILL_LIGHT;
  const [r, g, b] = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.42 ? ON_FILL_DARK : ON_FILL_LIGHT;
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

/** The entity behind a status pill, whether it is configured as a string or a block. */
export function stateEntity(state: NodeConfig["state"]): string | undefined {
  return typeof state === "string" ? state : state?.entity;
}

/**
 * Apply a status pill's `map` to one state.
 *
 * Lookup is case-insensitive and tries the raw state first, then the formatted one, so
 * a switch can be keyed as either `"on"` or `"Ein"`. An unlisted state keeps its
 * formatted text; a mapped empty string hides the pill.
 */
function mapPillState(
  state: NodeConfig["state"],
  raw: string,
  formatted: string,
): { text?: string; color?: string } {
  const map = typeof state === "string" ? undefined : state?.map;
  if (!map) return { text: formatted };

  const lookup = new Map(Object.entries(map).map(([key, value]) => [key.toLowerCase(), value]));
  const hit = lookup.get(raw.toLowerCase()) ?? lookup.get(formatted.toLowerCase());
  if (hit === undefined) return { text: formatted };
  if (typeof hit === "string") return { text: hit };
  return { text: hit.text ?? formatted, color: hit.color };
}

/**
 * Build the displayable primary/secondary/state strings for a node.
 *
 * `available` is false when the node has value entities configured but none of them
 * currently resolve — the renderer shows a placeholder and dims the ring for that case.
 * It reflects the entities, not the pill's mapped text: a state mapped to "" hides the
 * pill without making the node look dead.
 */
export function computeNodeDisplay(node: NodeConfig | undefined, hass: HomeAssistant): NodeDisplay {
  if (!node) return { available: false };
  const stateId = stateEntity(node.state);
  const configured = !!(node.primary || node.secondary || stateId);
  if (!configured) return { available: false };

  const primary = formatState(hass, node.primary);
  const secondary = formatState(hass, node.secondary);
  const rawState = hass.states[stateId as string]?.state;
  const formattedState = formatState(hass, stateId);
  const pill =
    formattedState !== undefined && rawState !== undefined
      ? mapPillState(node.state, rawState, formattedState)
      : {};

  return {
    primary,
    secondary,
    state: pill.text || undefined,
    stateColor: pill.color,
    available: primary !== undefined || secondary !== undefined || formattedState !== undefined,
  };
}
