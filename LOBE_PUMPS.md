# LOBE_PUMPS.md
## Unibloc Pump Sizing Tool — Lobe Pump Reference Data

> **How to use this file:** This is the authoritative reference for all lobe pump (PD series) performance data. Update values here first, then mirror any changes into the application source code (`pump_sizing_html_v4.html` or its successor).  
> **Units:** Flow in GPM, pressure in PSI, temperature in °F, dimensions in mm.  
> **Schema definitions** (field names, types, relationships) live in `DATA_MODEL.md` — this file contains data only.

---

## Table of Contents

1. [Pump Models](#1-pump-models)
2. [Rotor Class Limits](#2-rotor-class-limits)
3. [Slip Factors — Classes E & F](#3-slip-factors--classes-e--f)
4. [Rotor Dimensions](#4-rotor-dimensions)
5. [Notes & Known Gaps](#5-notes--known-gaps)

---

## 1. Pump Models

| Name | Disp (gal/rev) | Max RPM | Max Flow (GPM) | Port Size(s) |
|---|---|---|---|---|
| PD200-0 | 0.003 | 1400 | 3.0 | 0.5" |
| PD200 | 0.008 | 1400 | 8.0 | 0.5" / 0.75" |
| PD250 | 0.011 | 1400 | 11.0 | 0.75" |
| PD275 | 0.014 | 1400 | 14.0 | 0.75" / 1.0" |
| PD300 | 0.028 | 1000 | 28.0 | 1.0" / 1.5" |
| PD350 | 0.040 | 1000 | 40.0 | 1.5" / 2.0" |
| PD400 | 0.081 | 900 | 72.9 | 1.5" |
| PD450 | 0.109 | 900 | 98.1 | 2.0" |
| PD500 | 0.221 | 800 | 176.8 | 2.5" |
| PD501 | 0.221 | 800 | 176.8 | 2.5" |
| PD550 | 0.285 | 800 | 228.0 | 3.0" |
| PD551 | 0.285 | 800 | 228.0 | 3.0" |
| PD575 | 0.361 | 700 | 252.7 | 3.0" / 4.0" |
| PD576 | 0.330 | 700 | 231.0 | 3.0" / 4.0" |
| PD600 | 0.460 | 600 | 276.0 | 4.0" |
| PD602 | 0.530 | 600 | 318.0 | 4.0" |
| PD650 | 0.700 | 500 | 350.0 | 4.0" / 6.0" |
| PD652 | 0.800 | 500 | 400.0 | 4.0" / 6.0" |
| PD677 | 1.000 | 500 | 500.0 | 6.0" / 8.0" |

**Paired models** — the following pairs share displacement and slip coefficients. They represent different mechanical configurations (seal type, material variants). The distinction should be documented here once confirmed with Unibloc engineering:

| Pair | Shared Disp | Likely Difference |
|---|---|---|
| PD500 / PD501 | 0.221 gal/rev | Unknown — needs confirmation |
| PD550 / PD551 | 0.285 gal/rev | Unknown — needs confirmation |
| PD575 / PD576 | Different (0.361 vs 0.330) | Different displacement — not a true pair |
| PD650 / PD652 | Different (0.700 vs 0.800) | Different displacement — not a true pair |

---

## 2. Rotor Class Limits

Maximum allowable pressure (PSI) and temperature (°F) per pump model and rotor class. Classes A, B, and C have identical limits for all models — they are listed as a single column.

| Model | A/B/C maxPSI | D maxPSI | E maxPSI | F maxPSI | A/B/C maxTF | D maxTF | E/F maxTF |
|---|---|---|---|---|---|---|---|
| PD200-0 | 90 | 150 | 165 | 200 | 257 | 329 | 401 |
| PD200 | 90 | 150 | 165 | 200 | 257 | 329 | 401 |
| PD250 | 90 | 120 | 150 | 185 | 257 | 329 | 401 |
| PD275 | 80 | 90 | 135 | 165 | 257 | 329 | 401 |
| PD300 | 90 | 165 | 200 | 250 | 257 | 329 | 401 |
| PD350 | 90 | 135 | 175 | 220 | 257 | 329 | 401 |
| PD400 | 150 | 200 | 220 | 275 | 257 | 329 | 401 |
| PD450 | 110 | 135 | 175 | 220 | 257 | 329 | 401 |
| PD500 | 150 | 250 | 300 | 375 | 257 | 329 | 401 |
| PD501 | 150 | 250 | 300 | 375 | 257 | 329 | 401 |
| PD550 | 150 | 200 | 225 | 280 | 257 | 329 | 401 |
| PD551 | 150 | 200 | 225 | 280 | 257 | 329 | 401 |
| PD575 | 120 | 150 | 150 | 185 | 257 | 329 | 401 |
| PD576 | 120 | 150 | 150 | 185 | 257 | 329 | 401 |
| PD600 | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing |
| PD602 | 200 | 350 | 500 | 500 | 257 | 329 | 401 |
| PD650 | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing |
| PD652 | 270 | 350 | 500 | 500 | 257 | 329 | 401 |
| PD677 | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing | ⚠ missing |

> ⚠ **PD600, PD650, PD677** have no rotor class limit data. The app currently falls back to a hardcoded default of **110 PSI / 257°F**, which may be incorrect. Engineering data needed.

**Rotor class temperature thresholds (all models):**

| Class | Max Temp (°F) | Max Temp (°C) |
|---|---|---|
| A, B, C | 257 | 125 |
| D | 329 | 165 |
| E, F | 401 | 205 |

---

## 3. Slip Factors — Classes E & F

Multiplier applied to the slip RPM equation for Classes E and F only. Classes A–D always use 1.0 for all models.

| Model | Class E Slip Factor | Class F Slip Factor |
|---|---|---|
| PD200-0 | 1.31 | 1.70 |
| PD200 | 1.31 | 1.70 |
| PD250 | 1.31 | 1.70 |
| PD275 | 1.31 | 1.70 |
| PD300 | 1.22 | 1.53 |
| PD350 | 1.22 | 1.53 |
| PD400 | 1.17 | 1.38 |
| PD450 | 1.17 | 1.38 |
| PD500 | 1.11 | 1.23 |
| PD501 | 1.11 | 1.23 |
| PD550 | 1.11 | 1.23 |
| PD551 | 1.11 | 1.23 |
| PD575 | 1.11 | 1.23 |
| PD576 | 1.11 | 1.23 |
| PD600 | ⚠ missing | ⚠ missing |
| PD602 | 1.11 | 1.23 |
| PD650 | ⚠ missing | ⚠ missing |
| PD652 | 1.11 | 1.23 |
| PD677 | 1.11 | 1.23 |

> ⚠ **PD600 and PD650** have no slip factor entries. The app defaults to 1.0, which likely underestimates slip for these models at Classes E and F.

---

## 4. Rotor Dimensions

Physical rotor geometry used for shear stress calculations. All dimensions in millimeters.

| Model | Inner Diameter (mm) | Outer Diameter (mm) | Depth (mm) | Available |
|---|---|---|---|---|
| PD200-0 | 29.87 | 52.01 | 11.91 | ✓ |
| PD200 | — | — | — | ⚠ needed |
| PD250 | — | — | — | ⚠ needed |
| PD275 | — | — | — | ⚠ needed |
| PD300 | — | — | — | ⚠ needed |
| PD350 | — | — | — | ⚠ needed |
| PD400 | — | — | — | ⚠ needed |
| PD450 | 46.73 | 108.47 | 53.53 | ✓ |
| PD500 | — | — | — | ⚠ needed |
| PD501 | — | — | — | ⚠ needed |
| PD550 | — | — | — | ⚠ needed |
| PD551 | — | — | — | ⚠ needed |
| PD575 | — | — | — | ⚠ needed |
| PD576 | — | — | — | ⚠ needed |
| PD600 | — | — | — | ⚠ needed |
| PD602 | — | — | — | ⚠ needed |
| PD650 | — | — | — | ⚠ needed |
| PD652 | — | — | — | ⚠ needed |
| PD677 | — | — | — | ⚠ needed |

> Until rotor dimension data is populated, shear stress displays as **N/A** in the UI for all models except PD200-0 and PD450.

---

## 5. Notes & Known Gaps

| # | Model(s) | Issue | Action Needed |
|---|---|---|---|
| 1 | PD600, PD650, PD677 | No rotor class limit data — app uses wrong fallback default | Obtain pressure/temp limits from Unibloc engineering |
| 2 | PD600, PD650 | No Class E/F slip factor | Obtain slip factors from Unibloc engineering |
| 3 | All except PD200-0, PD450 | No rotor dimension data — shear calc unavailable | Obtain ID, OD, depth from engineering drawings |
| 4 | PD500/501, PD550/551 | Identical displacement and slip coefficients — reason unknown | Confirm with Unibloc what distinguishes these paired models |
| 5 | PD600, PD650, PD677 | No slip equation — excluded from auto-sizing | Obtain performance curve data to derive slip coefficients |
