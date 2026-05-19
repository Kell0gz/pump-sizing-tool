# GEAR_PUMPS.md
## Unibloc Pump Sizing Tool — Gear Pump Reference Data

> **How to use this file:** This is the authoritative reference for all sanitary gear pump (GP series) performance data. Update values here first, then mirror any changes into the application source code.  
> **Units:** Flow in GPM, pressure in PSI, temperature in °F.  
> **Schema definitions** (field names, types, relationships) live in `DATA_MODEL.md` — this file contains data only.

---

## Table of Contents

1. [Pump Models](#1-pump-models)
2. [Pressure & Temperature Limits](#2-pressure--temperature-limits)
3. [Behavioral Notes](#3-behavioral-notes)
4. [Notes & Known Gaps](#4-notes--known-gaps)

---

## 1. Pump Models

| Name | Disp (gal/rev) | Max RPM | Max Flow (GPM) | Port Size |
|---|---|---|---|---|
| GP200/07 | 0.002 | 1400 | 2.8 | 0.5" |
| GP200/10 | 0.003 | 1400 | 4.2 | 0.75" |
| GP175/22 | 0.007 | 1400 | 9.8 | 1.0" |
| GP175/38 | 0.010 | 1400 | 14.0 | 1.5" |
| GP275/22 | 0.007 | 1400 | 9.8 | 1.0" |
| GP275/38 | 0.010 | 1400 | 14.0 | 1.5" |
| GP300/28 | 0.016 | 1200 | 19.2 | 1.0" |
| GP350/40 | 0.023 | 1200 | 27.6 | 1.5" |
| GP375/52 | 0.030 | 1200 | 36.0 | 2.0" |

> **Model naming convention:** The suffix number (e.g. `/07`, `/22`, `/38`) likely refers to displacement in cc/rev or a Unibloc series code. This has not been confirmed — update this note once verified.

---

## 2. Pressure & Temperature Limits

Gear pumps do not use rotor classes — one limit set applies per model.

| Model | Max PSI | Max Temp (°F) | Max Temp (°C) |
|---|---|---|---|
| GP200/07 | 100 | 212 | 100 |
| GP200/10 | 100 | 212 | 100 |
| GP175/22 | 100 | 212 | 100 |
| GP175/38 | 100 | 212 | 100 |
| GP275/22 | 100 | 212 | 100 |
| GP275/38 | 100 | 212 | 100 |
| GP300/28 | 150 | 212 | 100 |
| GP350/40 | 125 | 212 | 100 |
| GP375/52 | 125 | 212 | 100 |

> All gear pumps share a maximum temperature of 212°F (100°C / boiling water). This is a hard limit — no high-temperature class option exists for gear pumps.

---

## 3. Behavioral Notes

These apply to all GP series models unless otherwise noted:

- **Rotor class:** Gear pumps do not have rotor classes. The app internally maps gear pumps to class `'A'` as a placeholder — this is a code convention only, not a product distinction.
- **Slip factor:** Always 1.0. No class-based slip multiplier applies.
- **Shear calculation:** Not supported. Rotor dimensions are not defined for gear pumps.
- **Auto-sizing exclusions:** GP200/07, GP200/10, and GP375/52 have no slip equations and are excluded from auto-sizing results. They can still be selected manually.
- **Slip equations:** GP175/22 and GP175/38 share the same slip coefficients. GP275/22 and GP275/38 use different coefficients despite the shared frame designation.

---

## 4. Notes & Known Gaps

| # | Model(s) | Issue | Action Needed |
|---|---|---|---|
| 1 | GP200/07, GP200/10, GP375/52 | No slip equation — excluded from auto-sizing | Obtain performance curve data to derive slip coefficients |
| 2 | GP175/22, GP175/38 | Share identical slip coefficients — intentional? | Confirm with Unibloc engineering |
| 3 | All GP models | Model naming convention (suffix number) undocumented | Confirm what the suffix represents |
