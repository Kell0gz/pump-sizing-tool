# CONFIGURATION.md
## Unibloc Pump Sizing Tool — Configure Page Design

> **Purpose:** Working document for designing the Configure page logic. Hash out field dependencies, smart defaults, PN preview, and open questions before implementing.
> **Source:** Unibloc Pump Build Code rev. 2-8-22

---

## 1. Build Code Structure

A complete PD pump part number follows this structure:

```
UNIBLOC-PD  [A]-[B]-[C]-[D]-[E type][E size][E orientation]-[F]-[G][drive suffix]-[H]-[J]
Example:     5400-10-10-P20H-60-10T-12-E
```

| Position | Label | Configure Field | Notes |
|---|---|---|---|
| A | Series | `series` | Gearbox/housing type |
| B | Pump Model | *(from sizing)* | Not on configure page |
| C | Rotor Cover Type | `coverType` | Cover style + FoodFirst/jacketed |
| D | Rotor Housing Type | `rotorHousing` | Housing body variant |
| E | Connection Type + Size | `connectionType` + `connectionSize` | Type code + size code |
| F | Rotor Type | `rotorStyle` + `rotorMaterial` + *(rotor class from sizing)* | Composite code — see Section 4 |
| G | Shaft Type | `shaft` | Includes drive orientation suffix |
| H | Shaft Seal Type | `seal` | Seal Type: O-ring, O-lip, Mechanical |
| J | Elastomer | `elastomer` | O-ring/seal elastomer material |

---

## 2. Current Field Options

### A — Series
| Value | Code | Notes |
|---|---|---|
| 5000 — SS Gearbox | 5000 | Most common for sanitary applications |
| 4000A — Alum. Bearing Housing | 4000A | Lighter, lower cost |
| 4000B — Alum. Gearbox | 4000B | |
| 3000 — Steel Gearbox | 3000 | |

**Flange Mounted Gearbox suffix** — appended directly to the combined series+model code (e.g., `5200F2`):

| Suffix | Description |
|---|---|
| F1 | Direct mount flange |
| F2 | Flex mount flange |

Availability by pump model:

| Pump Model | F1 | F2 |
|---|---|---|
| PD200 | Yes | Yes |
| PD300 | Yes | Yes |
| PD400 | No | Yes |
| PD500 | Yes | No |
| PD600 | No | No |

> **Motor dependency:** Flange mount has downstream effects on motor selection — see motor configuration document.

### C — Cover Type
| Value | Code | Notes |
|---|---|---|
| Standard (10) | 10 | Default |
| Drain in Cover (11) | 11 | |
| High Pressure (12) | 12 | Required when HP rotor selected |
| Port in Cover (13) | 13 | |
| HP with Port (14) | 14 | |
| Jacketed (15) | 15 | For heating/cooling — pair with Jacketed housing (D=15) |
| FoodFirst HP w/ Dual Handles (16) | 16 | |
| FoodFirst w/ Dual Handles (17) | 17 | Non-HP |
| FoodFirst HP w/o Handles (18) | 18 | |
| FoodFirst w/o Handles (19) | 19 | Non-HP |
| Vented — Integral RV (20) | 20 | Built-in relief valve — see note below |
| Vented #46 Style — Integral RV (21) | 21 | Built-in relief valve — see note below |
| Swing Arm (22) | 22 | |

> **Relief valve note:** Cover types 20 and 21 include an integral (built-in) relief valve. Relief valve selection is handled entirely through Cover Type — there is no separate relief valve checkbox.

> **FoodFirst dependency:** When a FoodFirst cover (16, 17, 18, or 19) is selected, rotor options must be limited to FoodFirst rotor variants only — see Section 3.7.

### D — Rotor Housing
| Value | Code | Notes |
|---|---|---|
| Standard Sanitary (10) | 10 | Default |
| Plugged Outlet (11) | 11 | |
| Jacketed (15) | 15 | Pair with Jacketed cover for full jacket |

### E — Connection Type
| Value | Code | Notes |
|---|---|---|
| Tri-Clamp (P) | P | Default — most common for food/bev |
| ACME Thread (L) | L | |
| NPT Male (KM) | KM | |
| NPT Female (KF) | KF | |
| DIN (D) | D | |
| DIN Flange (DF) | DF | |
| ANSI Flange 150# (AF) | AF | |
| SMS (SMS) | SMS | |
| Aseptic Union (AS) | AS | |

Connection size codes (E size): `037`=3/8" · `05`=1/2" · `07`=3/4" · `10`=1.0" · `15`=1.5" · `20`=2.0" · `25`=2.5" · `30`=3.0" · `40`=4.0" · `60`=6.0" · `80`=8.0"

Port orientation suffix: `H`=horizontal (default) · `V`=vertical

### F — Rotor Type (see Section 4 for full mapping)

Rotor type is a combined code encoding: **rotor class + material + lobe style + special variants (HP, FoodFirst)**

### G — Shaft Type

**Standard (no hydraulic motor)**
| Value | Code | Notes |
|---|---|---|
| Metal Rotors — Standard (10) | 10 | Default for 316SS and N60 rotors |
| Metal Rotors — Hardened Seal Area (11) | 11 | 200/300 series only |
| Metal Rotors — Hardened Wear Sleeve (12) | 12 | |
| Metal Rotors — Standard Wear Sleeve (13) | 13 | |
| Non-Metal Rotors — Standard (15) | 15 | Default for polymer/DuraCore rotors |
| Non-Metal Rotors — Hardened Seal Area (16) | 16 | |
| Non-Metal Rotors — Hardened Wear Sleeve (17) | 17 | |
| Non-Metal Rotors — Standard Wear Sleeve (18) | 18 | |

**Charlynn Hydraulic Motor**
| Value | Code | Notes |
|---|---|---|
| Metal Rotors + Charlynn Motor — Standard (20) | 20 | |
| Metal Rotors + Charlynn Motor — Hardened Seal Area (21) | 21 | |
| Metal Rotors + Charlynn Motor — Hardened Wear Sleeve (22) | 22 | |
| Metal Rotors + Charlynn Motor — Standard Wear Sleeve (23) | 23 | |
| Non-Metal Rotors + Charlynn Motor — Standard (25) | 25 | |
| Non-Metal Rotors + Charlynn Motor — Hardened Seal Area (26) | 26 | |
| Non-Metal Rotors + Charlynn Motor — Hardened Wear Sleeve (27) | 27 | |
| Non-Metal Rotors + Charlynn Motor — Standard Wear Sleeve (28) | 28 | |

**Danfoss Hydraulic Motor**
| Value | Code | Notes |
|---|---|---|
| Metal Rotors + Danfoss Motor — Standard (30) | 30 | |
| Metal Rotors + Danfoss Motor — Hardened Seal Area (31) | 31 | |
| Metal Rotors + Danfoss Motor — Hardened Wear Sleeve (32) | 32 | |
| Metal Rotors + Danfoss Motor — Standard Wear Sleeve (33) | 33 | |
| Non-Metal Rotors + Danfoss Motor — Standard (35) | 35 |  |
| Non-Metal Rotors + Danfoss Motor — Hardened Seal Area (36) | 36 | |
| Non-Metal Rotors + Danfoss Motor — Hardened Wear Sleeve (37) | 37 | |
| Non-Metal Rotors + Danfoss Motor — Standard Wear Sleeve (38) | 38 | |

Drive orientation suffix (appended to shaft code): `T`=top mounted · `B`=bottom mounted — not yet a separate field in the UI.

### H — Shaft Seal Type
| Value | Code | Notes |
|---|---|---|
| Single Mech — Carbon / Stainless (10) | 10 | Not for PD200 series |
| Single Mech — Carbon / Tungsten Carbide (11a) | 11a | Most common default |
| Single Mech — Carbon / Silicon Carbide (11b) | 11b | |
| Single Mech — SiC / Tungsten Carbide (12a) | 12a | Not for PD200 series |
| Single Mech — SiC / Silicon Carbide (12b) | 12b | Not for PD200 series |
| Single Mech — TC / TC (13) | 13 | Not for PD200 series |
| Single Mech — Carbon/SS + Flush Housing (40) | 40 | |
| Single Mech — Carbon/TC + Flush Housing (41a) | 41a | |
| Single Mech — Carbon/SiC + Flush Housing (41b) | 41b | |
| Single Mech — SiC/TC + Flush Housing (42a) | 42a | |
| Single Mech — SiC/SiC + Flush Housing (42b) | 42b | |
| Double Mech — C/SS + C/TC (30) | 30 | |
| Double Mech — SiC/TC + C/TC (31) | 31 | |
| Double Mech — SiC/SiC + C/TC (32) | 32 | |
| Double Mech — TC/TC (33) | 33 | |
| O-LIP Seal, Double (70) | 70 | |
| O-LIP Seal, Double, Front Load (70FL) | 70FL | |
| O-LIP Seal, Flushed (71) | 71 | |
| O-LIP Seal, Triple (72) | 72 | |
| Single O-Ring (60) | 60 | |
| Double O-Ring (61) | 61 | |
| Double O-Ring, Front Load (61FL) | 61FL | |
| Gland Packing PTFE (50) | 50 | |
| Gland Packing + Lantern Ring (51) | 51 | |

### J — Elastomer
| Value | Code | Notes |
|---|---|---|
| EPDM (E) | E | Dairy/food standard |
| Viton (V) | V | Default — chemical/solvent resistance |
| EPDM USP Class VI (EUSP) | EUSP | Pharma/biotech |
| Viton USP Class VI (VUSP) | VUSP | Pharma/biotech |
| Buna N (N) | N | General purpose |
| Silicone (S) | S | |
| FFKM (K) | K | Aggressive chemicals |
| Teflon Encapsulated Viton (TV) | TV | |

---

## 3. Field Dependencies (Logic to Implement)

These are rules where one field selection should constrain or change another.

### 3.1 Pump Type (Lobe vs Gear)
| Trigger | Effect |
|---|---|
| Gear pump selected in sizing | `rotorStyle` locked to `Gear` |
| Gear pump selected | `rotorMaterial` limited to `316L SS` and `Non-Galling N60 SS` |
| Gear pump selected | Rotor class pill hidden (gear pumps have no classes) |

### 3.2 Rotor Material → Shaft Type default

Shaft codes split into metal and non-metal rotor groups. The correct group should be selected based on rotor material.

| Rotor Material | Shaft Group | Available Codes |
|---|---|---|
| 316L SS, Non-Galling N60 SS, Alloy 88 SS | Metal Rotors | 10–13 (standard) · 20–23 (Charlynn) · 30–33 (Danfoss) |
| Hydex, MD Hydex, PEEK, PTFE, PTFE/SS, PolyFlex Acetal MD, DuraCore variants | Non-Metal Rotors | 15–18 (standard) · 25–28 (Charlynn) · 35–38 (Danfoss) |

> **Open question:** Should this auto-switch the shaft field when rotor material changes, or just warn?

> **FoodFirst shafts:** FoodFirst rotors (94, 95, 96, 96F) use the metal rotor shaft group — same as 316SS and N60 rotors.

### 3.2b Seal Type → Shaft Type requirement

Seal selection drives the shaft requirement. O-Ring and O-LIP seals require a hardened shaft variant.

| Seal Selection | Required Shaft Variants |
|---|---|
| O-LIP (70, 70FL, 71, 72) | Hardened Seal Area or Hardened Wear Sleeve |
| O-Ring (60, 61, 61FL) | Hardened Seal Area or Hardened Wear Sleeve |
| All other seal types | Any shaft variant |

Valid hardened codes by group:
- Metal Rotors: 11, 12 (standard) · 21, 22 (Charlynn) · 31, 32 (Danfoss)
- Non-Metal Rotors: 16, 17 (standard) · 26, 27 (Charlynn) · 36, 37 (Danfoss)

> **Open question:** Should the tool filter shaft options to hardened-only when O-ring/O-LIP is selected, or warn if a non-hardened shaft is chosen?

### 3.2a Drive Type → Shaft Type filtering

The shaft code group (standard vs hydraulic motor) must match the selected drive type. When drive type changes the shaft selection should update to stay in the correct group.

| Drive Type | Valid Shaft Codes | Notes |
|---|---|---|
| Direct Drive, Compac® FMS, Gearbox, VFD Ready, Air Motor | 10–18 | Standard shafts only |
| Hydraulic Motor — Charlynn | 20–28 | Charlynn variants only |
| Hydraulic Motor — Danfoss | 30–38 | Danfoss variants only |

Within each group, the metal vs non-metal split (rule 3.2) still applies.

> **Open question:** When drive type changes should the shaft field auto-reset to the matching default (e.g., switching to Charlynn resets to code 20 for metal or 25 for non-metal), or should it just filter available options and let the user re-select?

### 3.3 High Pressure Rotors → Cover Type
| Rotor Selection | Cover Constraint |
|---|---|
| HP rotor variants (codes 65–67, 85–87F, 94–96F) | Cover must be HP (12) or HP with Port (14) — enforced |
| Non-HP rotors selected | HP cover options (12, 14) should be hidden or disabled |

HP cover and HP rotors are a required pairing — the tool must filter cover options to enforce this in both directions.

### 3.4 Jacketed Housing → Cover pairing
If `rotorHousing` = `Jacketed (15)`, the cover should also be `Jacketed (15)` for a fully jacketed pump. No enforcement — independent selections with an advisory note to the user.

### 3.8 Pump Model → Cover Type restrictions
| Pump Model | Excluded Cover Codes | Notes |
|---|---|---|
| PD200 | 12, 14, 16, 17, 18, 19 | No HP or FoodFirst covers |
| PD300 | 12, 14 | No HP covers |
| PD400, PD500, PD600 | — | All covers available |

### 3.9 Pump Model → Rotor Housing restrictions
| Pump Model | Excluded Housing Codes | Notes |
|---|---|---|
| PD200 | 15 | Jacketed housing not available |
| PD300, PD400, PD500, PD600 | — | All housing options available |

### 3.5 Seal Type → PD200 series restrictions
Seal codes 10, 12a, 12b, 13 are not available for PD200 series pumps. The UI should hide or disable these when a PD200/PD200-0 is selected.

### 3.6 Shaft Type → PD200/300 series restriction
Shaft code 11 (Hardened Seal Area) is only for 200/300 series. Should be hidden for all other models.

### 3.7 FoodFirst Cover → Rotor filtering
| Trigger | Effect |
|---|---|
| Cover type 16, 17, 18, or 19 selected | Rotor options limited to FoodFirst variants only (codes 94, 95, 96, 96F) |
| Non-FoodFirst cover selected | All rotor options available per normal rules |

---

## 4. Rotor Type Code (Position F) — Full Mapping

The rotor type code encodes class + material + lobe style + special variants. The configure page currently captures these as separate fields (`rotorStyle`, `rotorMaterial`) plus the rotor class carried in from sizing. A PN preview would need to resolve these to the correct F code.

> **Material default:** Non-Galling N60 SS is the current standard and default rotor material. 316L SS is legacy — keep visible for occasional one-off orders but do not default to it.

### 316L SS Rotors
| Class | Bi-Lobe | Tri-Lobe | Bi-Lobe HP |
|---|---|---|---|
| C | 60 | 40 | 65 |
| D | 61 | 41 | 66 |
| E | 62 | 42 | 67 |
| F | 63 | 43 | — |
| G | 64 | — | — |

### Non-Galling N60 SS Rotors
| Class | Bi-Lobe | Tri-Lobe | Bi-Lobe HP |
|---|---|---|---|
| C | 80 | 90 | 85 |
| D | 81 | 91 | 86 |
| E | 82 | 92 | 87 |
| F | 83 | 93 | 87F |
| G | 84 | — | — |

FoodFirst HP variants: 94 (F, Tri-Lobe HP), 95 (HV), 96 (E, HP), 96F (F, HP)

### Polymer Rotors
| Material | Class A | Class B | Lobe Style |
|---|---|---|---|
| Hydex | 25 | 26 | Bi-Lobe |
| Hydex | 27 | 28 | Tri-Lobe |
| Metal Detectable Hydex | 23 | 24 | Bi-Lobe |
| PET | 20 | 21 | Bi-Lobe |
| PEEK | 50 | 51 | Bi-Lobe |
| PTFE | 70 | 71 | Bi-Lobe |
| PTFE/SS | 72 | 73 | Bi-Lobe |
| PolyFlex Acetal MD | 52 | — | Bi-Lobe |

### DuraCore Rotors (no class — single code per variant)
| Variant | Code |
|---|---|
| DuraCore (PTFE/SS/PTFE) | 30 |
| DuraCore MD | 32 |
| DuraCore HP | 34 |
| DuraCore HP MD | 36 |

### Alloy 88 SS
| Class | Code |
|---|---|
| B | 88 |
| C | 89 |

---

## 5. Smart Defaults (Sizing → Configure)

When "Configure This Pump →" is clicked, these values could be pre-set based on the sizing result.

| Sizing Condition | Suggested Default |
|---|---|
| Metal rotor selected (default) | Rotor material: Non-Galling N60 SS |
| Polymer rotor material selected | Shaft auto-group: Non-Metal Rotors |
| Speed > 500 RPM | Seal: Single Mech — Carbon / Stainless (10) |
| O-Ring or O-LIP seal selected | Shaft: default to hardened variant (11 or 12 for metal rotors · 16 or 17 for non-metal rotors) |

> Currently only `connectionSize` is auto-set from the sizing result. The above are not yet implemented.

---

## 6. Open Questions

1. ~~**Port orientation toggle**~~ — Resolved: Add a Horizontal/Vertical toggle to the Configure page. Default to Horizontal (`H`). Appended to connection size code (e.g., `P20H`).

2. ~~**Drive shaft orientation**~~ — Resolved: Add a Top/Bottom toggle to the Configure page. Default to Top (`T`). Appended to shaft type code (e.g., `10T`).

3. ~~**Hydraulic motor shafts (G codes 20–38)**~~ — Resolved: Show Charlynn (20–28) and Danfoss (30–38) shaft options on the Configure page when the corresponding hydraulic motor drive type is selected. Revisit once the motor selection tool is complete.

4. ~~**Rotor F code resolution**~~ — Resolved: Display the resolved F code (e.g., "61") on the Configure page as class + material + lobe style are selected. Separate input fields are kept for user selection, but the resolved code is shown.

5. ~~**HP rotor variant**~~ — Resolved: Add HP as a selectable rotor variant on the Configure page (alongside lobe style). Future enhancement: auto-default to HP if discharge pressure from sizing exceeds a defined threshold (threshold TBD).

6. ~~**FoodFirst variant**~~ — Resolved: No top-level toggle. FoodFirst is selected via Cover Type (codes 16–19), which appears early in the configure flow and drives rotor filtering per Section 3.7.

7. ~~**Low Ferrite / Hastelloy C**~~ — Resolved: Add a toggle on the Configure page to select Low Ferrite (`L` suffix) or Hastelloy C (`HC` suffix), appended to the rotor code. Mutually exclusive options.

8. ~~**PN Preview**~~ — Resolved: Show a partial part number on the Configure page that builds progressively as fields are selected. Unresolved positions are left blank or shown as placeholders until their fields are completed.

9. ~~**Validation warnings vs enforcement**~~ — Resolved: Silently filter invalid options. Invalid combinations are hidden from the UI rather than warned or blocked.

10. ~~**FoodFirst rotor → Shaft compatibility**~~ — Resolved: FoodFirst rotors (94, 95, 96, 96F) use the metal rotor shaft group (10–13 standard · 20–23 Charlynn · 30–33 Danfoss).

> ~~**HP cover enforcement**~~ — Resolved (Section 3.3): HP rotors require HP cover (12 or 14), enforced bidirectionally.

---

## 7. Datasheet Impact

All `config` fields render automatically in the Datasheet Configuration table via `Object.entries(config)` with key names formatted from camelCase to Title Case. No changes needed to the datasheet component when adding new config fields — they appear automatically.

The one exception is `reliefValve` (boolean), which has special rendering logic: `Included` or `Not included`.

---

## 8. Series Restrictions Matrix

All pumps within a series share the same option constraints — there are no per-model variations within a series. This matrix is the single source of truth; it supersedes the scattered notes in sections 3.5, 3.6, 3.8, and 3.9.

The implementation source is `src/data/configOptions.js` → `SERIES_RESTRICTIONS`.

### A — Gearbox / Bearing Housing Series availability

| Series Code | Description | PD200 | PD300 | PD400 | PD500 | PD600 |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 5000 | SS Gearbox | ✓ | ✓ | ✓ | ✓ | ✓ |
| 4000A | Aluminum Bearing Housing | — | ✓ | ✓ | ✓ | — |
| 4000B | Aluminum Gearbox | — | ✓ | ✓ | ✓ | — |
| 3000 | Cast Iron Gearbox | — | — | — | — | ✓ |

> SS Gearbox (5000) is universally available. Aluminum housings (4000A/4000B) are PD300–500 only. Cast Iron (3000) is PD600 only.

### C — Cover Type availability

| Cover Code | Description | PD200 | PD300 | PD400 | PD500 | PD600 |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 10 | Standard | ✓ | ✓ | ✓ | ✓ | ✓ |
| 11 | Drain in Cover | ✓ | ✓ | ✓ | ✓ | ✓ |
| 12 | High Pressure | — | — | ✓ | ✓ | ✓ |
| 13 | Port in Cover | ✓ | ✓ | ✓ | ✓ | ✓ |
| 14 | HP with Port | — | — | ✓ | ✓ | ✓ |
| 15 | Jacketed | ✓ | ✓ | ✓ | ✓ | ✓ |
| 16 | FoodFirst HP w/ Dual Handles | — | ✓ | ✓ | ✓ | ✓ |
| 17 | FoodFirst w/ Dual Handles | — | ✓ | ✓ | ✓ | ✓ |
| 18 | FoodFirst HP w/o Handles | — | ✓ | ✓ | ✓ | ✓ |
| 19 | FoodFirst w/o Handles | — | ✓ | ✓ | ✓ | ✓ |
| 20 | Vented — Integral RV | — | — | — | ✓ | — |
| 21 | Vented #46 Style — Integral RV | — | ✓ | ✓ | ✓ | ✓ |
| 22 | Swing Arm | ✓ | ✓ | ✓ | ✓ | ✓ |

> PD200: no HP (12, 14), no FoodFirst (16–19), no integral RV (20, 21). PD300–400, PD600: no integral RV (20). PD300: no HP covers (12, 14). Cover 20 (Integral RV) is PD500 only.

### D — Rotor Housing availability

| Housing Code | Description | PD200 | PD300 | PD400 | PD500 | PD600 |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 10 | Standard Sanitary | ✓ | ✓ | ✓ | ✓ | ✓ |
| 11 | Plugged Outlet | ✓ | ✓ | ✓ | ✓ | ✓ |
| 15 | Jacketed | — | ✓ | ✓ | ✓ | ✓ |

> PD200: Jacketed housing (15) not available.

### G — Shaft Type availability

| Shaft Code | Description | PD200 | PD300 | PD400 | PD500 | PD600 |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 10 | Metal — Standard | ✓ | ✓ | ✓ | ✓ | ✓ |
| 11 | Metal — Hardened Seal Area | ✓ | ✓ | — | — | — |
| 12 | Metal — Hardened Wear Sleeve | — | — | ✓ | ✓ | ✓ |
| 13 | Metal — Standard Wear Sleeve | — | — | ✓ | ✓ | ✓ |
| 15 | Non-Metal — Standard | ✓ | ✓ | ✓ | ✓ | ✓ |
| 16 | Non-Metal — Hardened Seal Area | ✓ | ✓ | ✓ | ✓ | ✓ |
| 17 | Non-Metal — Hardened Wear Sleeve | — | — | ✓ | ✓ | ✓ |
| 18 | Non-Metal — Standard Wear Sleeve | — | — | ✓ | ✓ | ✓ |
| 20–28 | Charlynn Hydraulic Motor variants | — | — | — | ✓ | — |
| 30–38 | Danfoss Hydraulic Motor variants | — | — | — | ✓ | — |

> Shaft code 11 (Hardened Seal Area): PD200 and PD300 only. Wear Sleeve shafts (12, 13, 17, 18): PD400+ only. Hydraulic motor shafts (20–38): PD500 only.

### H — Shaft Seal availability

| Seal Code | Description | PD200 | PD300 | PD400 | PD500 | PD600 |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 10 | Single Mech — Carbon / SS | — | ✓ | ✓ | ✓ | ✓ |
| 11a | Single Mech — Carbon / TC | ✓ | ✓ | ✓ | ✓ | ✓ |
| 11b | Single Mech — Carbon / SiC | ✓ | ✓ | ✓ | ✓ | ✓ |
| 12a | Single Mech — SiC / TC | — | ✓ | ✓ | ✓ | ✓ |
| 12b | Single Mech — SiC / SiC | — | ✓ | ✓ | ✓ | ✓ |
| 13 | Single Mech — TC / TC | — | ✓ | ✓ | ✓ | ✓ |
| 30 | Double Mech — C/SS + C/TC | — | ✓ | ✓ | excl. 501/551/576 | — |
| 31 | Double Mech — SiC/TC + C/TC | — | ✓ | ✓ | excl. 501/551/576 | — |
| 32 | Double Mech — SiC/SiC + C/TC | — | ✓ | ✓ | excl. 501/551/576 | — |
| 33 | Double Mech — TC/TC | — | ✓ | ✓ | excl. 501/551/576 | — |
| 40 | Single Mech — C/SS + Flush Housing | — | ✓ | ✓ | ✓ | ✓ |
| 41a | Single Mech — C/TC + Flush Housing | — | ✓ | ✓ | ✓ | ✓ |
| 41b | Single Mech — C/SiC + Flush Housing | — | ✓ | ✓ | ✓ | ✓ |
| 42a | Single Mech — SiC/TC + Flush Housing | — | ✓ | ✓ | ✓ | ✓ |
| 42b | Single Mech — SiC/SiC + Flush Housing | — | ✓ | ✓ | ✓ | ✓ |
| 50 | Gland Packing PTFE | ✓ | ✓ | ✓ | ✓ | ✓ |
| 51 | Gland Packing + Lantern Ring | ✓ | ✓ | ✓ | ✓ | ✓ |
| 60 | Single O-Ring | ✓ | — | — | 501, 551, 576 only | — |
| 61 | Double O-Ring | — | ✓ | ✓ | ✓ | ✓ |
| 61FL | Double O-Ring, Front Load | — | ✓ | ✓ | ✓ | ✓ |
| 70 | O-LIP Seal, Double | ✓ | ✓ | ✓ | ✓ | ✓ |
| 70FL | O-LIP Seal, Double, Front Load | — | ✓ | ✓ | ✓ | ✓ |
| 71 | O-LIP Seal, Flushed | — | ✓ | ✓ | ✓ | ✓ |
| 72 | O-LIP Seal, Triple | — | ✓ | ✓ | ✓ | ✓ |

> PD200: limited to single mechanical (11a, 11b only), gland packing (50, 51), single O-ring (60), and double O-LIP (70). No double/flushed mechanical, no flush housing variants, no double/front-load O-ring, no front-load/flushed/triple O-LIP.
>
> **Per-model exceptions (allowlist):** Single O-Ring (60) is also available on PD501, PD551, and PD576 despite the PD500 series exclusion.
>
> **Per-model exceptions (excludelist):** Double Mechanical seals (30–33) are excluded on PD501, PD551, and PD576 despite being available on the rest of the PD500 series.
>
> Both exception types are enforced via `MODEL_SEAL_ALLOWLIST` / `MODEL_SEAL_EXCLUDELIST` in `configOptions.js`.

### A — Flange Mount availability

| Flange Code | Description | PD200 | PD300 | PD400 | PD500 | PD600 |
|---|---|:---:|:---:|:---:|:---:|:---:|
| F1 | Direct Mount Flange | ✓ | ✓ | — | ✓ | — |
| F2 | Flex Mount Flange | ✓ | ✓ | ✓ | — | — |

### E — Connection Size by pump model

The connection size dropdown allows any size, but each pump model has a native port size that should normally be matched. The Configure page auto-sets the connection size to the pump's largest listed port when the user arrives from Sizing. Selecting a smaller or larger size than listed here is not blocked but would typically indicate a reducer fitting is being used.

| Pump Model | Native Port Size(s) | Auto-set code |
|---|---|---|
| PD200-0 | 1/2" | `05` |
| PD200 | 1/2" / 3/4" | `07` |
| PD250 | 3/4" | `07` |
| PD275 | 3/4" / 1.0" | `10` |
| PD300 | 1.0" / 1.5" | `15` |
| PD350 | 1.5" / 2.0" | `20` |
| PD400 | 1.5" | `15` |
| PD450 | 2.0" | `20` |
| PD500 | 2.5" | `25` |
| PD501 | 2.5" | `25` |
| PD550 | 3.0" | `30` |
| PD551 | 3.0" | `30` |
| PD575 | 3.0" / 4.0" | `40` |
| PD576 | 3.0" / 4.0" | `40` |
| PD600 | 4.0" | `40` |
| PD602 | 4.0" | `40` |
| PD650 | 4.0" / 6.0" | `60` |
| PD652 | 4.0" / 6.0" | `60` |
| PD677 | 6.0" / 8.0" | `80` |

> Auto-set logic in `handleConfigure` (App.jsx): takes the last port size listed in `pump.port_size` and maps it to the connection size code. Port sizes sourced from `data/lobe_pumps.json`.

> **Future enforcement:** The connection size dropdown is not currently filtered by pump model. A future enhancement could restrict available sizes to the pump's native port(s) and the next size up/down to allow for reducers.

### Summary table

| Restriction | PD200 | PD300 | PD400 | PD500 | PD600 |
|---|---|---|---|---|---|
| Available gearbox series | 5000 only | 5000, 4000A, 4000B | 5000, 4000A, 4000B | 5000, 4000A, 4000B | 5000, 3000 |
| Excluded Cover codes | 12, 14, 16–19 | 12, 14 | none | none | none |
| Excluded Housing codes | 15 | none | none | none | none |
| Excluded Seal codes | 10, 12a, 12b, 13 | none | none | none | none |
| Shaft code 11 available | Yes | Yes | No | No | No |
| Wear sleeve shafts (12, 13, 17, 18) | No | No | Yes | Yes | Yes |
| Hydraulic motor shafts (20–38) | No | No | No | Yes | No |
| Flange mounts available | F1, F2 | F1, F2 | F2 only | F1 only | None |
