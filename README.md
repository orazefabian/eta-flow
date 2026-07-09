# ETA Flow Card

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![license][license-badge]

An animated heat-flow card for [Home Assistant][ha] that visualizes an
**ETA pellet heating** system — glowing nodes and flowing dots showing heat moving between
the boiler, buffer tank, solar collectors, hot water and heating circuits.

Inspired by the look of [`power-flow-card-plus`][pfcp], but for heat instead of electricity.

<p align="center">
  <img src="docs/screenshot.png" alt="ETA Flow Card" width="440">
</p>

## ⚠️ Prerequisite: the ETA sensor integration

**This card does not talk to your heating system.** It only *visualizes* entities that
already exist in Home Assistant. You must first install an integration that exposes your
ETA data as sensors:

👉 **[Tidone/homeassistant_eta_integration][eta-integration]** (recommended)

Once that integration is set up and you have entities like `sensor.eta_puffer_...`,
`sensor.eta_kessel_...`, etc., this card can draw them.

## Features

- Radial layout with the **Puffer** (buffer tank) as the central hub — rendered as a
  **stratified fill gauge** (level = charge %, warm-top / cool-bottom gradient), mirroring
  ETA's Schichtpuffer.
- Nodes for **Kessel** (boiler), **Solar**, **Warmwasser** (DHW), **Heizkreis**
  (heating circuit) and an optional second circuit **Heizkreis 2**.
- Two context badges: **Außentemperatur** (top-right, linked to the heating circuit it
  weather-compensates) and **Pelletvorrat** (a fuel-stock gauge).
- **Pump glyphs on any edge** that spin while their pump runs (Solar, Heizkreis, …).
- Optional **boiler state pill** (Bereit / Heizen / Ausbrand) and **edge value labels**
  (flow temperature, ΔT, power) for at-a-glance feedback.
- Animated flow dots on each connection; **speed and direction driven per edge** by a
  power sensor, a pump/on-off state, or a temperature difference.
- Nodes you don't configure are hidden, so it adapts to simpler setups.
- Graphical editor for mapping node entities (edges via YAML).

## Installation

### Option 1 — HACS (recommended)

1. In HACS, open the ⋮ menu → **Custom repositories**.
2. Add `https://github.com/orazefabian/eta-flow` with category **Dashboard**.
3. Search for **ETA Flow Card** and download it.
4. HACS adds the Lovelace resource automatically. (Reload your browser if the card
   doesn't appear yet.)

### Option 2 — Manual

1. Download `eta-flow-card.js` from the [latest release][release-url].
2. Copy it to `config/www/eta-flow-card.js`.
3. Add it as a resource: **Settings → Dashboards → ⋮ → Resources → Add resource**
   - URL: `/local/eta-flow-card.js`
   - Type: **JavaScript Module**

## Configuration

Add a **Manual card** and paste the YAML below, or use the graphical editor to map the
node entities. Every `nodes` and `edges` entry is optional.

```yaml
type: custom:eta-flow-card
title: Heizung
show_edge_labels: true # show flow temp / ΔT / power on the connections
nodes:
  puffer:
    primary: sensor.eta_puffer_ladezustand # charge %
    secondary: sensor.eta_puffer_temp_oben # optional, e.g. °C
    level: sensor.eta_puffer_ladezustand # drives the stratified fill height
    layers: # top → bottom temperatures color the fill
      - sensor.eta_puffer_temp_oben
      - sensor.eta_puffer_temp_mitte
      - sensor.eta_puffer_temp_unten
  kessel:
    primary: sensor.eta_kessel_leistung
    state: sensor.eta_kessel_status # "Bereit"/"Heizen" pill
  solar:
    primary: sensor.eta_solar_kollektor_temp
  warmwasser:
    primary: sensor.eta_warmwasser_temp
  heizkreis:
    primary: sensor.eta_heizkreis_vorlauf_temp
  heizkreis2: # optional second heating circuit
    primary: sensor.eta_heizkreis2_vorlauf_temp
  aussen:
    primary: sensor.eta_aussentemperatur # corner badge, linked to Heizkreis
  vorrat:
    primary: sensor.eta_pellet_vorrat # fuel-stock gauge (0..100 by default)
edges:
  solar_to_puffer:
    type: state
    entity: binary_sensor.eta_solarpumpe
    active_states: ["on"]
  kessel_to_puffer:
    type: power
    entity: sensor.eta_kessel_leistung
    # power_reference: 15   # set for a boiler reporting kW instead of W
  puffer_to_warmwasser:
    type: delta
    from_entity: sensor.eta_puffer_temp_oben
    to_entity: sensor.eta_warmwasser_temp
  puffer_to_heizkreis:
    type: state
    entity: binary_sensor.eta_heizkreis_pumpe
    active_states: ["on"]
    label_entity: sensor.eta_heizkreis_vorlauf_temp # what the edge label shows
    pump: # a pump glyph on this edge
      entity: binary_sensor.eta_heizkreis_pumpe
      hide_label: true
  puffer_to_heizkreis2:
    type: state
    entity: binary_sensor.eta_heizkreis2_pumpe
    active_states: ["on"]
solarpumpe: # shorthand for a pump on the solar_to_puffer edge
  entity: binary_sensor.eta_solarpumpe
```

### Nodes

| Key          | Position          | Typical value                     |
| ------------ | ----------------- | --------------------------------- |
| `puffer`     | center (hub)      | charge % + stratified temperatures |
| `solar`      | top               | collector temperature             |
| `kessel`     | bottom            | output % / kW + state             |
| `warmwasser` | left              | DHW temperature                   |
| `heizkreis`  | right             | flow temperature                  |
| `heizkreis2` | bottom-right      | 2nd circuit flow temperature      |
| `aussen`     | top-right badge   | outside temperature               |
| `vorrat`     | bottom-left gauge | pellet stock (%)                  |

Every node is fully customizable:

| Option         | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `primary`      | entity shown as the big value (with its unit)                            |
| `secondary`    | optional entity shown as a smaller value below                           |
| `state`        | text/state entity rendered as a small pill (e.g. boiler `Heizen`)        |
| `name`         | override the label under the circle                                      |
| `icon`         | override the mdi icon (shown above the value)                            |
| `color`        | ring / flow accent color                                                 |
| `radius`       | circle size in canvas units (≈ % of card width; e.g. `34`), default per role |
| `stroke_width` | outline thickness (default `2.5`)                                        |

**Puffer stratification** (buffer only): `level` sets the fill height (0..100 charge %,
falls back to `primary`); `layers` is a top→bottom list of temperature entities whose values
color the fill with a warm-top / cool-bottom gradient.

**Gauge nodes** (e.g. `vorrat`): a fill bar is drawn under the value; tune its range with
`gauge: true|false`, `min`, and `max` (default `0`..`100`).

### Pumps

Any edge can carry a spinning **pump glyph** via a `pump:` block
(`entity`, `active_states`, `name`, `icon`, `color`, `hide_label`). The top-level
`solarpumpe:` key is a shorthand for a pump on the `solar_to_puffer` edge.

### Edges

Dots travel `from → to` when active. The five edge keys are fixed:
`solar_to_puffer`, `kessel_to_puffer`, `puffer_to_warmwasser`, `puffer_to_heizkreis`,
`puffer_to_heizkreis2`.

| `type`  | Active when…                                   | Fields                          |
| ------- | ---------------------------------------------- | ------------------------------- |
| `power` | numeric `entity` magnitude > `threshold`       | `entity`, `threshold`, `invert`, `power_reference` |
| `state` | `entity` state is in `active_states`           | `entity`, `active_states`       |
| `delta` | `from_entity` warmer than `to_entity`          | `from_entity`, `to_entity`, `threshold` |

For `type: power`, a negative value reverses the dot direction; `invert: true` flips it.
`power_reference` is the magnitude that maps to full dot speed (default `5000`, tuned for
watts — set it to ~`15` for a boiler reporting kW).

Set `show_edge_labels: true` at the card level (or `show_label: true` per edge) to print the
driving value beside each connection; `label_entity` overrides which entity the label reads.

## Development

```bash
scripts/setup     # install dependencies
scripts/develop   # rollup --watch → dist/eta-flow-card.js
scripts/lint      # eslint + prettier + tsc
npm run demo      # build + serve a local mock preview (no Home Assistant needed)
```

`npm run demo` starts a static server at <http://localhost:8080/demo/> that renders the
card against mock ETA data, with sliders/toggles to preview how nodes light up and flow
dots react. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

Not affiliated with, endorsed by, or connected to ETA Heiztechnik GmbH. "ETA" is used only
to describe compatibility. Provided as-is under the [MIT License](LICENSE).

<!-- badges -->
[hacs-badge]: https://img.shields.io/badge/HACS-Custom-41BDF5.svg
[hacs-url]: https://github.com/orazefabian/eta-flow
[release-badge]: https://img.shields.io/github/v/release/orazefabian/eta-flow
[release-url]: https://github.com/orazefabian/eta-flow/releases
[license-badge]: https://img.shields.io/github/license/orazefabian/eta-flow
[ha]: https://www.home-assistant.io/
[pfcp]: https://github.com/flixlix/power-flow-card-plus
[eta-integration]: https://github.com/Tidone/homeassistant_eta_integration
