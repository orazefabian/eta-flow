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
}

/** Center hub. */
export const PUFFER_ID = "puffer";

/**
 * Fixed radial layout: Puffer in the center, peripherals around it.
 * Coordinates are on a 0..400 SVG viewBox.
 */
export const ROLES: Record<string, RoleDef> = {
  puffer: {
    id: "puffer",
    label: "Puffer",
    icon: "mdi:storage-tank",
    color: "#4caf50",
    x: 200,
    y: 200,
  },
  solar: {
    id: "solar",
    label: "Solar",
    icon: "mdi:solar-power-variant",
    color: "#ff9800",
    x: 200,
    y: 62,
  },
  kessel: { id: "kessel", label: "Kessel", icon: "mdi:fire", color: "#9c27b0", x: 200, y: 338 },
  warmwasser: {
    id: "warmwasser",
    label: "Warmwasser",
    icon: "mdi:water-thermometer",
    color: "#03a9f4",
    x: 62,
    y: 200,
  },
  heizkreis: {
    id: "heizkreis",
    label: "Heizkreis",
    icon: "mdi:radiator",
    color: "#f44336",
    x: 338,
    y: 200,
  },
  aussen: { id: "aussen", label: "Außen", icon: "mdi:thermometer", color: "#78909c", x: 60, y: 56 },
};

/** Roles rendered as full circular nodes (everything except the corner badge). */
export const CIRCLE_ROLES = ["solar", "kessel", "warmwasser", "heizkreis", PUFFER_ID];

/** The role rendered as a small corner badge (no edge). */
export const BADGE_ROLE = "aussen";

/** An edge definition: which two roles it connects and its config key. */
export interface EdgeDef {
  key: string;
  from: string;
  to: string;
}

/**
 * Fixed edges. Dots travel from `from` -> `to` when the edge is active.
 * Solar/Kessel charge the Puffer; the Puffer feeds Warmwasser/Heizkreis.
 */
export const EDGES: EdgeDef[] = [
  { key: "solar_to_puffer", from: "solar", to: "puffer" },
  { key: "kessel_to_puffer", from: "kessel", to: "puffer" },
  { key: "puffer_to_warmwasser", from: "puffer", to: "warmwasser" },
  { key: "puffer_to_heizkreis", from: "puffer", to: "heizkreis" },
];

export const NODE_RADIUS = 46;
