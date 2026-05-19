# Unibloc Pump Sizing Tool

> **Internal use only.** This tool is intended for Unibloc sales and applications engineers.

A browser-based engineering tool for sizing hygienic rotary lobe and sanitary gear pumps. Enter process conditions, get a ranked pump recommendation, configure the build options, and generate a printable application datasheet.

---

## What It Does

- **Sizes pumps** from the PD and GP series against flow, pressure, viscosity, and temperature requirements
- **Auto-recommends** ranked pump candidates or allows manual model selection
- **Calculates** duty RPM, slip, BHP, K factor, adjusted max RPM, and shear stress
- **Generates datasheets** with a unique Sizing ID (`UNI-YYYYMMDD-XXXX`) for quoting and recordkeeping
- **Friction loss estimation** for suction and discharge piping (Darcy-Weisbach)
- **Engineering knowledge base** — 12 reference articles covering sizing, seals, installation, and maintenance
- **US and SI units** — converts in-place; all internal calculations use US Customary

---

## Current Status

The app is a **single-file HTML prototype** (`pump_sizing_html_v4.html`). It runs entirely in the browser with no backend, no build step, and no persistent storage. Completed sizings are lost on page refresh — the Datasheet must be printed or saved as PDF to retain a record.

The **Applications tab** is a placeholder. Database integration is planned. See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the migration roadmap.

---

## Running the App

No installation required.

1. Open `pump_sizing_html_v4.html` in a modern browser (Chrome or Edge recommended)
2. An internet connection is required on first load — React and Babel are loaded from CDN

> The app will not work offline unless the CDN scripts are bundled locally. This is a known limitation of the prototype that will be resolved in the Vite migration.

---

## Pump Coverage

| Family | Models | Notes |
|---|---|---|
| Rotary Lobe (PD series) | 19 models — PD200-0 through PD677 | Full rotor class support (A–F) |
| Sanitary Gear (GP series) | 9 models — GP175/22 through GP375/52 | Single pressure/temp limit; no rotor classes |

A handful of models are excluded from auto-sizing due to missing slip equation data. See [`data/LOBE_PUMPS.md`](data/LOBE_PUMPS.md) and [`data/GEAR_PUMPS.md`](data/GEAR_PUMPS.md) for full model tables and known data gaps.

---

## Documentation

| Document | Description |
|---|---|
| [`CALCULATIONS.md`](CALCULATIONS.md) | Every formula used — K factor, slip RPM, BHP, friction loss, shear stress. Start here to understand the math. |
| [`DATA_MODEL.md`](DATA_MODEL.md) | Entity schemas, field definitions, state shapes, and relationships |
| [`data/LOBE_PUMPS.md`](data/LOBE_PUMPS.md) | PD series pump models, rotor class limits, slip factors, rotor dimensions |
| [`data/GEAR_PUMPS.md`](data/GEAR_PUMPS.md) | GP series pump models and pressure/temperature limits |
| [`data/PRODUCTS.md`](data/PRODUCTS.md) | Product viscosity database — update here when adding new fluids |
| [`UI_SPEC.md`](UI_SPEC.md) | All 5 pages — inputs, outputs, states, flows, and validation behavior |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Current stack, target architecture, backend plan, and migration roadmap |
| [`DECISIONS.md`](DECISIONS.md) | Log of key technical decisions and the reasoning behind them |

---

## Updating Pump or Product Data

Pump and product data is currently hardcoded in the HTML file. The `data/` markdown files are the human-readable source of truth — **update those first**, then mirror the change into the source code.

**To update a pump value** (e.g. correct a max PSI):
1. Edit the relevant row in [`data/LOBE_PUMPS.md`](data/LOBE_PUMPS.md) or [`data/GEAR_PUMPS.md`](data/GEAR_PUMPS.md)
2. Find the corresponding constant in `pump_sizing_html_v4.html` (`PUMP_ROTOR_LIMITS`, `LOBE_PUMPS`, etc.) and update it to match
3. Test by entering conditions that exercise the changed value

**To add a new product** to the viscosity database:
1. Add a row to [`data/PRODUCTS.md`](data/PRODUCTS.md) following the format described there
2. Add the matching entry to `PRODUCT_DB` in the HTML file

---

## Tech Stack (Current Prototype)

| | |
|---|---|
| UI | React 18 (CDN) |
| Transpilation | Babel Standalone (in-browser) |
| Styling | Inline JS style objects |
| State | React `useState` / `useMemo` |
| Storage | None — session only |
| Build | None — single HTML file |

The planned production stack is a **Vite + React** frontend with a **Node.js or Python REST API** and a **SQL database**. See [`ARCHITECTURE.md`](ARCHITECTURE.md) for details.

---

## Project Structure (Current)

```
pump_sizing_html_v4.html     ← entire application
docs/
├── README.md
├── CALCULATIONS.md
├── DATA_MODEL.md
├── UI_SPEC.md
├── ARCHITECTURE.md
├── DECISIONS.md
└── data/
    ├── LOBE_PUMPS.md
    ├── GEAR_PUMPS.md
    └── PRODUCTS.md
```

---

## Known Limitations

| # | Limitation | Priority |
|---|---|---|
| 1 | No persistence — sizings lost on refresh | High — requires backend |
| 2 | PD600, PD650, PD677 missing rotor class and slip data | High — data collection needed |
| 3 | Shear stress only available for PD200-0 and PD450 | Medium — rotor dimensions needed for all models |
| 4 | Friction loss is informational — does not auto-add to discharge pressure | Medium — UX improvement |
| 5 | Pump curve chart does not convert to SI units | Low — always shows GPM / RPM |
| 6 | In-browser Babel transpilation — slow first load, not production-suitable | Resolved by Vite migration |
| 7 | CDN dependency — app requires internet access | Resolved by Vite migration |

A full list of data gaps is in [`data/LOBE_PUMPS.md § Notes`](data/LOBE_PUMPS.md#5-notes--known-gaps) and [`data/GEAR_PUMPS.md § Notes`](data/GEAR_PUMPS.md#4-notes--known-gaps).

---

## Engineering Reference

All calculations are based on the **Unibloc Engineering Manual (EMPD200-677, Rev. 12/2016)**. Verify critical applications with Unibloc engineering before specifying.
