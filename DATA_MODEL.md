# DATA_MODEL.md
## Unibloc Pump Sizing Tool — Data Model Reference

> **Source:** Derived from `pump_sizing_html_v4.html`.  
> **Current storage:** All data is hardcoded as JavaScript constants (in-memory, client-side only). No database or persistence layer exists yet.  
> **Future state:** The Applications tab is a placeholder for a backend database. This document defines the logical data model now so the team can design that schema consistently when the time comes.
>
> **Reference data** (pump tables, rotor limits, product viscosities) lives in the `data/` folder, separate from this schema document:
> - [`data/LOBE_PUMPS.md`](data/LOBE_PUMPS.md) — PD series models, rotor class limits, slip factors, rotor dimensions
> - [`data/GEAR_PUMPS.md`](data/GEAR_PUMPS.md) — GP series models and pressure/temperature limits
> - [`data/PRODUCTS.md`](data/PRODUCTS.md) — product viscosity database

---

## Table of Contents

1. [Entity Overview](#1-entity-overview)
2. [Pump](#2-pump)
3. [Rotor Class Limits (Lobe Pumps)](#3-rotor-class-limits-lobe-pumps)
4. [Gear Pump Limits](#4-gear-pump-limits)
5. [Rotor Dimensions](#5-rotor-dimensions)
6. [Slip Factors (Classes E & F)](#6-slip-factors-classes-e--f)
7. [Product](#7-product)
8. [Knowledge Base Article](#8-knowledge-base-article)
9. [Process Inputs (Session State)](#9-process-inputs-session-state)
10. [Friction Loss Inputs (Session State)](#10-friction-loss-inputs-session-state)
11. [Sizing Result (Computed)](#11-sizing-result-computed)
12. [Configuration](#12-configuration)
13. [Sizing Record (Datasheet / Future Persistence)](#13-sizing-record-datasheet--future-persistence)
14. [Enum Reference](#14-enum-reference)
15. [Entity Relationship Summary](#15-entity-relationship-summary)
16. [Data Gaps & Future Schema Notes](#16-data-gaps--future-schema-notes)

---

## 1. Entity Overview

| Entity | Type | Storage | Description |
|---|---|---|---|
| Pump | Static reference | Hardcoded array | Physical pump models and their performance parameters |
| RotorClassLimits | Static reference | Hardcoded lookup | Per-pump, per-class pressure/temperature/slip limits (lobe only) |
| GearPumpLimits | Static reference | Hardcoded lookup | Pressure and temperature limits for gear pumps |
| RotorDimensions | Static reference | Hardcoded lookup | Physical rotor geometry for shear calculations (partial) |
| SlipFactorEF | Static reference | Hardcoded lookup | Class E and F slip multipliers per lobe pump model |
| Product | Static reference | Hardcoded array | Common fluid products with viscosity and shear properties |
| KnowledgeBaseArticle | Static reference | Hardcoded array | Engineering reference articles |
| ProcessInputs | Session state | React useState | User-entered sizing inputs |
| FrictionLossInputs | Session state | React useState | Optional pipe geometry inputs |
| SizingResult | Computed | In-memory | Output of the sizing calculation |
| Configuration | Session state | React useState | User-selected pump build options |
| SizingRecord | Persisted (future) | Planned database | Saved datasheet output for the Applications tab |

---

## 2. Pump

The core reference entity. Two pump families exist: **Lobe** (PD series) and **Gear** (GP series).

### Schema

| Field | Type | Unit | Required | Description |
|---|---|---|---|---|
| `name` | string | — | ✓ | Unique model identifier (e.g. `"PD450"`, `"GP300/28"`) |
| `disp` | number | gal/rev | ✓ | Displacement per revolution — the theoretical volume moved per shaft rotation |
| `maxRPM` | number | RPM | ✓ | Mechanical speed limit for the model |
| `maxFlow` | number | GPM | ✓ | Maximum rated flow at optimal conditions |
| `port` | string | — | ✓ | Port size(s) available (e.g. `'2.0"'` or `'1.5" / 2.0"'`). Multiple sizes are `/`-delimited |

### Identification

- **Pump type** is inferred from the model name prefix: `G` → Gear, otherwise → Lobe. No explicit `type` field exists.
- **Primary key:** `name` (unique string, used as a lookup key across all related tables)

### Reference Data

→ See **[`data/LOBE_PUMPS.md`](data/LOBE_PUMPS.md)** for all PD series model values, rotor class limits, slip factors, and rotor dimensions.  
→ See **[`data/GEAR_PUMPS.md`](data/GEAR_PUMPS.md)** for all GP series model values and pressure/temperature limits.

---

## 3. Rotor Class Limits (Lobe Pumps)

Defines the operating envelope for each combination of pump model and rotor class. Rotor class is a physical rotor material/geometry selection — higher classes tolerate more pressure and temperature at the cost of increased slip.

### Rotor Classes

| Class | Designation | Max Temp (°F) | Notes |
|---|---|---|---|
| A | Standard | 257 | Same limits as B and C for all models |
| B | Standard | 257 | Same limits as A and C for all models |
| C | Standard | 257 | Same limits as A and B for all models |
| D | Heavy Duty | 329 | Higher pressure than A/B/C |
| E | High Pressure/Temp | 401 | Elevated slip factor |
| F | High Pressure/Temp+ | 401 | Same max temp as E; highest pressure rating; highest slip factor |

> **Note:** Classes A, B, and C have identical pressure and temperature limits for every model currently in the database. They are distinct classes in the Unibloc product line but the differences (likely material or surface treatment variants) are not yet differentiated in this tool.

### Schema

| Field | Type | Unit | Description |
|---|---|---|---|
| `pumpName` | string | — | FK → Pump.name |
| `class` | enum(A–F) | — | Rotor class |
| `maxPSI` | number | PSI | Maximum allowable differential pressure |
| `maxTF` | number | °F | Maximum allowable product temperature |

Derived fields (computed at runtime, not stored):

| Field | Type | Unit | How Derived |
|---|---|---|---|
| `maxBar` | number | Bar | `maxPSI × 0.069` |
| `maxTC` | number | °C | `round((maxTF − 32) / 1.8)` |
| `slip` | number | — | From SlipFactorEF lookup (Section 6); 1.0 for classes A–D |

### Reference Data

→ See **[`data/LOBE_PUMPS.md § Rotor Class Limits`](data/LOBE_PUMPS.md#2-rotor-class-limits)** for per-model pressure and temperature values.

---

## 4. Gear Pump Limits

Gear pumps do not use rotor classes. They have a single set of pressure and temperature limits per model.

### Schema

| Field | Type | Unit | Description |
|---|---|---|---|
| `pumpName` | string | — | FK → Pump.name |
| `maxPSI` | number | PSI | Maximum allowable differential pressure |
| `maxTF` | number | °F | Maximum allowable product temperature |

### Reference Data

→ See **[`data/GEAR_PUMPS.md § Pressure & Temperature Limits`](data/GEAR_PUMPS.md#2-pressure--temperature-limits)** for per-model values.

---

## 5. Rotor Dimensions

Physical geometry of the rotor cavity, used exclusively for shear stress calculation. Data is in **millimeters**.

### Schema

| Field | Type | Unit | Description |
|---|---|---|---|
| `pumpName` | string | — | FK → Pump.name |
| `id` | number | mm | Inner diameter of the rotor |
| `od` | number | mm | Outer diameter of the rotor |
| `depth` | number | mm | Axial depth of the rotor |

### Reference Data

→ See **[`data/LOBE_PUMPS.md § Rotor Dimensions`](data/LOBE_PUMPS.md#4-rotor-dimensions)** for available geometry values.  
Currently only **PD200-0** and **PD450** have data — all other models return `null` and display "N/A" for shear stress.

---

## 6. Slip Factors (Classes E & F)

A multiplier applied to the slip RPM equation for lobe pumps when rotor class E or F is selected. Classes A through D always use a factor of 1.0.

### Schema

| Field | Type | Description |
|---|---|---|
| `pumpName` | string | FK → Pump.name |
| `classE` | number | Slip multiplier for Class E |
| `classF` | number | Slip multiplier for Class F |

### Reference Data

→ See **[`data/LOBE_PUMPS.md § Slip Factors`](data/LOBE_PUMPS.md#3-slip-factors--classes-e--f)** for per-model values.

---

## 7. Product

A reference database of common fluids used in hygienic processing. Selecting a product auto-populates the viscosity field in the sizing inputs.

### Schema

| Field | Type | Unit | Description |
|---|---|---|---|
| `name` | string | — | Display name of the fluid |
| `viscosity` | number | cPs | Typical absolute (dynamic) viscosity at process temperature |
| `shear` | number | Pa | Shear sensitivity threshold (0 = not shear-sensitive / Newtonian) |
| `notes` | string | — | Fluid behavior description (e.g. "Newtonian", "Shear thinning") |

> **Note on `shear` field:** Stored in the product record but not currently used in any calculation. Intended for a future shear sensitivity warning. The field semantics — threshold vs. measured value — should be clarified before implementation.

### Reference Data

→ See **[`data/PRODUCTS.md`](data/PRODUCTS.md)** for the full product list and guidance on adding new entries.

---

## 8. Knowledge Base Article

Engineering reference content displayed in the Knowledge Base tab.

### Schema

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique integer identifier |
| `title` | string | Article title |
| `summary` | string | One-line description shown in collapsed list view |
| `content` | string | Full article body (plain text with `\n` line breaks) |
| `category` | enum | Topic category (see enum reference, Section 14) |
| `pumpTypes` | string[] | Applicable pump types: `["Lobe"]`, `["Gear"]`, or `["Lobe","Gear"]` |

### Current Articles (12 total)

| ID | Title | Category | Pump Types |
|---|---|---|---|
| 1 | How Rotary Lobe Pumps Work | General | Lobe, Gear |
| 2 | Fluid Flow Fundamentals | General | Lobe, Gear |
| 3 | NPSH — Net Positive Suction Head | Sizing | Lobe, Gear |
| 4 | Pump Selection Procedure | Sizing | Lobe |
| 5 | Rotor Class Selection Guide | Sizing | Lobe |
| 6 | Viscosity & the K Factor | Sizing | Lobe, Gear |
| 7 | Shaft Seal Selection Guide | Seals | Lobe, Gear |
| 8 | Safety Equipment | Installation | Lobe, Gear |
| 9 | Motor & Drive Selection | Installation | Lobe |
| 10 | CIP / SIP & Cleaning | Maintenance | Lobe, Gear |
| 11 | Common Performance Issues | Troubleshooting | Lobe, Gear |
| 12 | Rotor & Gear Material Selection | General | Lobe, Gear |

---

## 9. Process Inputs (Session State)

User-entered values that drive the sizing calculation. Stored in React `useState`. Values are entered in the display unit (US or SI) and converted to US Customary internally before any calculation.

### Schema

| Field | Type | Default | Display Unit (US) | Display Unit (SI) | Description |
|---|---|---|---|---|---|
| `flow` | string | `''` | GPM | LPM | Desired flow rate |
| `pressure` | string | `''` | PSI | Bar | Required discharge pressure |
| `viscosity` | string | `''` | cPs | cPs | Absolute (dynamic) viscosity — no unit toggle |
| `temp` | string | `'70'` | °F | °C | Product temperature (defaults to 70°F) |

> Fields are stored as strings (not numbers) to allow empty/partial input states in the form. They are cast to numbers (`+val`) when passed to calculations.

### Related Session Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `units` | enum('US','SI') | `'US'` | Current display unit system |
| `pumpTypeFilter` | enum('All','Lobe','Gear') | `'All'` | Filters pump list in auto-selection |
| `manualMode` | boolean | `false` | `false` = manual model selection; `true` = auto-recommendation mode |
| `manualPump` | string | `'PD450'` | Selected pump model name in manual mode |
| `manualCls` | string | `'D'` | Selected rotor class in manual mode |
| `customerName` | string | `''` | Customer name for datasheet header |
| `quoteNumber` | string | `''` | Quote reference number for datasheet header |

---

## 10. Friction Loss Inputs (Session State)

Optional inputs for the Advanced / Friction Loss calculator. Stored separately from process inputs. All values are in US Customary units regardless of the unit toggle.

### Schema

| Field | Type | Default | Unit | Description |
|---|---|---|---|---|
| `sDia` | string | `''` | inches | Suction pipe inner diameter |
| `sLen` | string | `''` | feet | Suction pipe run length |
| `sHead` | string | `''` | feet | Suction static head (elevation) |
| `dDia` | string | `''` | inches | Discharge pipe inner diameter |
| `dLen` | string | `''` | feet | Discharge pipe run length |
| `dHead` | string | `''` | feet | Discharge static head (elevation) |
| `density` | string | `'62.4'` | lb/ft³ | Fluid density (defaults to water) |

---

## 11. Sizing Result (Computed)

The output object produced by `calcResult()`. This is not stored — it is computed on every render and passed through component props. Included here to define the shape of data that flows from Sizing → Configure → Datasheet.

### Schema

| Field | Type | Unit | Description |
|---|---|---|---|
| `pump` | Pump | — | Reference to the selected Pump object |
| `cls` | string | — | Selected rotor class (`'A'`–`'F'`, or `'—'` for gear pumps) |
| `rc` | object | — | Resolved rotor class limits: `{ maxPSI, maxTF, maxBar, maxTC, slip }` |
| `slipRPM` | number | RPM | Calculated slip speed |
| `dutyRPM` | number | RPM | Required shaft speed to deliver target flow |
| `adjMaxRPM` | number | RPM | Viscosity-adjusted maximum operating speed |
| `bhp` | number | HP | Brake horsepower required |
| `kw` | number | kW | Power in kilowatts (`bhp × 0.7457`) |
| `K` | number | — | K Factor (viscosity correction) |
| `aP` | number | PSI | Adjusted pressure (viscosity-corrected) |
| `isGear` | boolean | — | `true` if the pump is a gear pump |
| `warnings` | string[] | — | List of out-of-range warning messages (empty array if none) |

---

## 12. Configuration

User-selected pump build options captured on the Configure page. Stored in React `useState` as a flat object in `App.jsx`. Defaults are set when the user clicks "Configure This Pump →" from the Sizing page (`handleConfigure`). All option lists and series-level restrictions live in `src/data/configOptions.js`. Build code positions correspond to the Unibloc PD part number format: `UNIBLOC-PD [A]-[B]-[C]-[D]-[E]-[F]-[G]-[H]-[J]`.

### Schema

| Field | Build Code | Type | Default | Source |
|---|---|---|---|---|
| `series` | A | string | `'5000'` | `SERIES` — filtered by `SERIES_RESTRICTIONS[n].excludedSeries` |
| `flangeMount` | A suffix | string | `''` | `SERIES_RESTRICTIONS[n].flangeMounts` — `''`, `'F1'`, or `'F2'` |
| `materialGrade` | C/D/F/G suffix | string | `'Standard'` | `'Standard'`, `'Low Ferrite'` (L), `'Hastelloy C'` (HC) |
| `coverType` | C | string | `'10'` | `COVER_TYPES` — filtered by series restrictions + HP/FoodFirst rules |
| `rotorHousing` | D | string | `'10'` | `ROTOR_HOUSINGS` — filtered by `SERIES_RESTRICTIONS[n].excludedHousings` |
| `connectionType` | E type | string | `'P'` | `CONNECTION_TYPES` |
| `connectionSize` | E size | string | `'20'` | `CONNECTION_SIZES` — auto-set from pump port on configure entry |
| `portOrientation` | E suffix | string | `'H'` | `'H'` (horizontal) or `'V'` (vertical) |
| `rotorCode` | F | string | `'81'` | `ROTOR_CODES` — filtered by rotor class from sizing + FoodFirst flag; auto-set by class on configure entry |
| `shaft` | G | string | `'10'` | `SHAFT_OPTS` — filtered by drive group, rotor metal/non-metal, series restrictions |
| `driveOrientation` | G suffix | string | `'T'` | `'T'` (top) or `'B'` (bottom) |
| `drive` | G group | string | `'Direct Drive'` | Carried over from Sizing page `driveType`; not editable on Configure page |
| `seal` | H | string | `'11a'` | `SEALS` — filtered by series restrictions + per-model allowlist/excludelist; auto-set by RPM on configure entry |
| `elastomer` | J | string | `'V'` | `ELASTOMERS` |

> **Rotor code default logic:** `handleConfigure` maps sizing result class to default N60 SS Bi-Lobe code: `{A:'25', B:'26', C:'80', D:'81', E:'82', F:'83', G:'84'}`.
>
> **Seal default logic:** if `dutyRPM > 500` → `'10'` (Carbon/SS mech), else → `'11a'` (Carbon/TC mech).
>
> **Material grade suffix:** `'Low Ferrite'` appends `L` to build code positions C, D, G, and F (if rotor `allowsSuffix: true`). `'Hastelloy C'` appends `HC`. Polymer/DuraCore rotors do not take a material suffix.

---

## 13. Sizing Record (Datasheet / Future Persistence)

This entity represents a completed, saved sizing — what would be stored in the Applications database. Currently the data lives only in session state and is printed/exported manually. The Sizing ID is the only persistent identifier generated today.

### Sizing ID Format

```
UNI-YYYYMMDD-XXXX

Examples: UNI-20260408-4721
          UNI-20260408-1093
```

- `YYYYMMDD` — date the record was saved
- `XXXX` — 4-digit random number (1000–9999)
- **Collision risk:** Random suffix only; no uniqueness guarantee. Suitable for low-volume internal use. A sequential or UUID-based approach should be considered for the database.

### Future Schema (Proposed)

When the Applications tab is backed by a database, a Sizing Record would logically contain:

| Field | Type | Source | Description |
|---|---|---|---|
| `sizingId` | string | Generated | Unique identifier (`UNI-YYYYMMDD-XXXX` or equivalent) |
| `createdAt` | datetime | Generated | Timestamp of record creation |
| `projectName` | string | User input | Job or project name |
| `customerName` | string | User input | Customer name |
| `quoteNumber` | string | User input | Quote reference |
| `units` | enum('US','SI') | Session | Unit system used during sizing |
| `flow` | number | Process inputs | GPM (stored internally always in US units) |
| `pressure` | number | Process inputs | PSI |
| `viscosity` | number | Process inputs | cPs |
| `temp` | number | Process inputs | °F |
| `pumpName` | string | Sizing result | FK → Pump.name |
| `rotorClass` | string | Sizing result | A–F or — |
| `dutyRPM` | number | Sizing result | RPM |
| `bhp` | number | Sizing result | HP |
| `series` | string | Configuration | Gearbox series code (e.g. `5000`) |
| `flangeMount` | string | Configuration | `''`, `'F1'`, or `'F2'` |
| `materialGrade` | string | Configuration | `'Standard'`, `'Low Ferrite'`, `'Hastelloy C'` |
| `coverType` | string | Configuration | Build code position C |
| `rotorHousing` | string | Configuration | Build code position D |
| `connectionType` | string | Configuration | Build code position E type |
| `connectionSize` | string | Configuration | Build code position E size |
| `portOrientation` | string | Configuration | `'H'` or `'V'` |
| `rotorCode` | string | Configuration | Build code position F |
| `shaft` | string | Configuration | Build code position G |
| `driveOrientation` | string | Configuration | `'T'` or `'B'` |
| `drive` | string | Configuration | Drive type carried from sizing |
| `seal` | string | Configuration | Build code position H |
| `elastomer` | string | Configuration | Build code position J |

---

## 14. Enum Reference

### Rotor Classes (Lobe Pumps Only)
`A` | `B` | `C` | `D` | `E` | `F`

### Pump Type Filter
`All` | `Lobe` | `Gear`

### Knowledge Base Categories
`All` | `General` | `Sizing` | `Seals` | `Installation` | `Maintenance` | `Troubleshooting`

### Knowledge Base Pump Types
`All` | `Lobe` | `Gear`

### Unit System
`US` | `SI`

### Rotor Style
`Bi-Wing` | `Tri-Lobe` | `Gear`

### Rotor Material
`316SS` | `Non-Galling Alloy` | `Polyflex®` | `Polyflex MD®` | `DuraCore®`

### Housing
`Standard Aluminum` | `316L SS` | `Jacketed`

### Seal Type
`Single Mechanical` | `Double Mechanical` | `Lip Seal` | `QuickStrip® Mech`

### Shaft
`Standard` | `Hardened Sleeved` | `Extended`

### Drive Type
`Direct Drive` | `Compac® FMS` | `Gearbox` | `VFD Drive` | `Air Motor`

---

## 15. Entity Relationship Summary

```
Pump ──────────────────── RotorClassLimits  (1 lobe pump → 6 class entries)
Pump ──────────────────── GearPumpLimits    (1 gear pump → 1 limit entry)
Pump ──────────────────── RotorDimensions   (1 pump → 0 or 1 dimension entry)
Pump ──────────────────── SlipFactorEF      (1 lobe pump → 1 E/F slip entry)

ProcessInputs ─────────── SizingResult      (inputs → computed on every change)
SizingResult ─────────── Configuration     (user selects options after result)
SizingResult + Config ──► SizingRecord     (saved on "Confirm & Generate Datasheet")

Product ──────────────── ProcessInputs     (selecting a product pre-fills viscosity)
KnowledgeBaseArticle  ── (standalone, no relations)
```

---

## 16. Data Gaps & Future Schema Notes

| # | Area | Gap | Impact | Priority |
|---|---|---|---|---|
| 1 | Rotor dimensions | Only PD200-0 and PD450 have geometry data | Shear stress shown as N/A for all other models | High |
| 2 | Rotor class limits | PD600, PD650, PD677 missing from `PUMP_ROTOR_LIMITS` | Falls back to hardcoded default (110 PSI / 257°F) which may be wrong | High |
| 3 | Slip factors | PD600 and PD650 missing from `PUMP_SLIP_EF` | Class E/F slip defaults to 1.0 — may underestimate slip | Medium |
| 4 | Paired models | PD500/501, PD550/551, PD575/576, PD650/652 distinction not documented | Unclear to engineers why two model names share identical performance data | Medium |
| 5 | Product `shear` field | Stored but never used in calculations | Field semantics undefined — threshold or property? | Low |
| 6 | Sizing ID uniqueness | Random 4-digit suffix only | Collision possible; unsuitable for a shared database without change | Medium |
| 7 | Persistence | No storage layer; all data lost on page refresh | Applications tab cannot function until a backend is added | High |
| 8 | Gear pump rotor classes | Gear pumps always use a hardcoded `'A'` class internally | Class selector correctly hidden in UI but mapping is implicit, not explicit | Low |
