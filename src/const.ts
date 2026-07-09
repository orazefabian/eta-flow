export const CARD_NAME = "eta-flow-card";
export const CARD_EDITOR_NAME = "eta-flow-card-editor";
export const CARD_VERSION = "0.1.0";

/** A visual node role in the ETA heat-flow diagram. */
export interface RoleDef {
  id: string;
  /** Default human label (German, ETA terminology). */
  label: string;
  /** Default mdi icon. */
  icon: string;
  /** Default accent color for the glowing ring. */
  color: string;
  /** Position on the 400x400 SVG canvas (center of the node). */
  x: number;
  y: number;
  /** Default circle radius in SVG units on the 400x400 canvas. */
  radius: number;
}

/** Default ring outline thickness (SVG units) when a node doesn't override it. */
export const DEFAULT_STROKE_WIDTH = 2.5;

/** Center hub. */
export const PUFFER_ID = "puffer";

/**
 * Fixed radial layout: Puffer in the center, producers/consumers around it.
 * Coordinates are on a 0..400 SVG viewBox.
 *
 * Producers charge the buffer (Solar top, Kessel bottom); consumers draw from it
 * (Warmwasser left, Heizkreis right, optional Heizkreis 2 bottom-right). Two corner
 * badges carry context data: Außentemperatur (top-right, drives the heating circuit)
 * and Pelletvorrat (bottom-left, fuel store feeding the boiler).
 */
export const ROLES: Record<string, RoleDef> = {
  puffer: {
    id: "puffer",
    label: "Puffer",
    icon: "mdi:storage-tank",
    color: "#4caf50",
    x: 200,
    y: 200,
    radius: 42,
  },
  solar: {
    id: "solar",
    label: "Solar",
    icon: "mdi:solar-power-variant",
    color: "#ff9800",
    x: 200,
    y: 56,
    radius: 34,
  },
  kessel: {
    id: "kessel",
    label: "Kessel",
    icon: "mdi:fire",
    color: "#9c27b0",
    x: 200,
    y: 344,
    radius: 34,
  },
  warmwasser: {
    id: "warmwasser",
    label: "Warmwasser",
    icon: "mdi:water-boiler",
    color: "#03a9f4",
    x: 56,
    y: 200,
    radius: 34,
  },
  heizkreis: {
    id: "heizkreis",
    label: "Heizkreis",
    icon: "mdi:radiator",
    color: "#f44336",
    x: 344,
    y: 200,
    radius: 34,
  },
  heizkreis2: {
    id: "heizkreis2",
    label: "Heizkreis 2",
    icon: "mdi:heating-coil",
    color: "#ec407a",
    x: 322,
    y: 322,
    radius: 30,
  },
  aussen: {
    id: "aussen",
    label: "Außen",
    icon: "mdi:thermometer",
    color: "#78909c",
    x: 346,
    y: 54,
    radius: 24,
  },
  vorrat: {
    id: "vorrat",
    label: "Vorrat",
    icon: "mdi:silo",
    color: "#a1887f",
    x: 54,
    y: 346,
    radius: 24,
  },
};

/** Default pump glyph (used by the backward-compatible `solarpumpe:` block). */
export const PUMP_DEFAULTS = {
  label: "Pumpe",
  icon: "mdi:pump",
  radius: 15,
};

/** Roles rendered as full circular nodes. */
export const CIRCLE_ROLES = ["solar", "kessel", "warmwasser", "heizkreis", "heizkreis2", PUFFER_ID];

/** Roles rendered as small corner badges (no edge). */
export const BADGE_ROLES = ["aussen", "vorrat"];

/** Badges that render a fill gauge under the value by default. */
export const GAUGE_ROLES = ["vorrat"];

/** An edge definition: which two roles it connects and its config key. */
export interface EdgeDef {
  key: string;
  from: string;
  to: string;
}

/**
 * Fixed edges. Dots travel from `from` -> `to` when the edge is active.
 * Solar/Kessel charge the Puffer; the Puffer feeds Warmwasser/Heizkreis(e).
 */
export const EDGES: EdgeDef[] = [
  { key: "solar_to_puffer", from: "solar", to: "puffer" },
  { key: "kessel_to_puffer", from: "kessel", to: "puffer" },
  { key: "puffer_to_warmwasser", from: "puffer", to: "warmwasser" },
  { key: "puffer_to_heizkreis", from: "puffer", to: "heizkreis" },
  { key: "puffer_to_heizkreis2", from: "puffer", to: "heizkreis2" },
];

/**
 * Non-hydraulic "control" links drawn as thin dashed lines (no flow dots).
 * Communicate a control relationship, e.g. the outside temperature drives the
 * weather-compensated heating circuit.
 */
export interface ControlLinkDef {
  from: string;
  to: string;
}

export const CONTROL_LINKS: ControlLinkDef[] = [{ from: "aussen", to: "heizkreis" }];
