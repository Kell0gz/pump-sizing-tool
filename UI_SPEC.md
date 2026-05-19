# UI_SPEC.md
## Unibloc Pump Sizing Tool — UI Specification

> **Source:** Derived from `pump_sizing_html_v4.html`.  
> **Audience:** Developers building or extending the app, and anyone reviewing intended UX behavior.  
> **Scope:** Covers all 5 pages, their components, inputs, outputs, state interactions, and validation behavior. Layout and visual design details are intentional — do not change without team discussion.  
> **Status:** This spec reflects the current HTML prototype. Items marked 🚧 are placeholders or known gaps.

---

## Table of Contents

1. [Global Shell](#1-global-shell)
2. [Page: Sizing](#2-page-sizing)
3. [Page: Configure](#3-page-configure)
4. [Page: Datasheet](#4-page-datasheet)
5. [Page: Knowledge Base](#5-page-knowledge-base)
6. [Page: Applications](#6-page-applications)
7. [Shared Components](#7-shared-components)
8. [User Flows](#8-user-flows)
9. [Validation & Error States](#9-validation--error-states)
10. [Responsive & Print Behavior](#10-responsive--print-behavior)

---

## 1. Global Shell

### Navigation Bar

A fixed top navigation bar present on all pages.

| Element | Detail |
|---|---|
| Logo | "UNIBLOC" wordmark + red arc SVG icon |
| Subtitle | "Hygienic Technologies" / "Pump Sizing Tool — Internal Use Only" |
| Nav tabs | Sizing · Configure · Datasheet · Knowledge Base · Applications |
| Active tab | Red background, full opacity |
| Inactive tabs | Transparent background, 70% opacity |
| Bottom accent | 3px solid red bar below nav |

**Tab navigation behavior:**
- Any tab can be clicked at any time — no forced linear progression
- Configure and Datasheet tabs will show an empty state with a redirect button if accessed before completing the prior step
- No confirmation dialogs on tab switch; unsaved state is not warned

### Color System

| Token | Hex | Usage |
|---|---|---|
| Red | `#C8102E` | Primary action, active state, warnings |
| Red Dark | `#A50D25` | Hover, warning text |
| Red Light | `#FDECEA` | Warning backgrounds, subtle highlights |
| Steel | `#5B8FA8` | Section headers, secondary UI |
| Steel Dark | `#3D6E85` | Steel text, active secondary |
| Steel Light | `#E8EDF2` | Card backgrounds, panel fills |
| Navy | `#1B2A4A` | Reserved (not currently used in UI) |
| Charcoal | `#3D3D3D` | Nav bar background, body text |
| Gray | `#6B7A8D` | Labels, secondary text |
| Gray Light | `#F4F5F7` | Page background |
| Gray Border | `#D6DCE4` | Card borders, input borders |

---

## 2. Page: Sizing

The primary working page. Split into a left **Input Panel** (~260px fixed) and a right **Results Panel** (flexible width).

---

### 2.1 Input Panel — Process Inputs Card

**Unit toggle (US / SI)**
- Pill-style toggle in the card header, right-aligned
- Switching units converts all existing numeric inputs in-place (flow, pressure, temp)
- Viscosity does NOT convert — always in cPs regardless of unit system
- Default: US

**Customer & Quote fields**
- Customer Name — free text, placeholder: `e.g. Acme Dairy Co.`
- Quote Number — free text, placeholder: `e.g. Q-2026-0042`
- These flow through to the Datasheet header; no validation required

**Process inputs** (in order):

| Field | Label | Unit (US) | Unit (SI) | Type | Required for sizing |
|---|---|---|---|---|---|
| `flow` | Desired Flow | GPM | LPM | number | ✓ |
| `pressure` | Discharge Pressure | PSI | Bar | number | ✓ |
| `viscosity` | Viscosity | cPs | cPs | number | ✓ |
| `temp` | Product Temp | °F | °C | number | Used for rotor class filtering only |

- All inputs are `type="number"`, spinner arrows hidden via CSS
- Default temp: `70` (°F)
- Blank flow, pressure, or viscosity suppresses results entirely (no calculation attempted)

**Pump Type filter**
- Three-button toggle: `All` · `Lobe` · `Gear`
- Filters both the manual model dropdown and the auto-sizing candidate pool
- Default: `All`

---

### 2.2 Input Panel — Manual / Recommend Toggle

A toggle switch labeled **"Show Recommended Pumps"** controls the sizing mode.

| Switch State | Mode | Behavior |
|---|---|---|
| OFF (default) | Manual mode | User picks pump model + rotor class; results update live as inputs change |
| ON | Recommend mode | User clicks "Calculate Size" to trigger auto-sizing; results show ranked candidates |

**Manual mode sub-panel** (visible only when toggle is OFF):

- **Pump Model** dropdown — lists all pumps matching the Pump Type filter, excluding models with no slip equation. Format: `PD450 — Max 98.1 GPM`
  - Changing model resets rotor class to `D`
- **Rotor Class** buttons (A · B · C · D · E · F) — lobe pumps only; hidden for gear pumps
  - Each button shows class letter + max PSI for that class on the selected model
  - Below buttons: italic summary line — `Class D: Max 135 PSI · 329°F · Slip ×1.0`
- In manual mode, results update reactively — no button press needed

**Calculate Size button**
- Full-width, red primary button
- In Recommend mode: triggers `sizePumps()` — required to see results
- In Manual mode: button exists but sizing already updates live; pressing it in recommend mode populates the candidate list

---

### 2.3 Input Panel — Advanced Options (Collapsed by Default)

A full-width outline toggle button: `▼ Show Advanced Options` / `▲ Hide Advanced Options`

When expanded, two additional cards appear below:

**Product Database card**
- Search field filters the product list in real-time (name match, case-insensitive)
- Each row shows: product name (bold) · viscosity in cPs · shear in Pa (if > 0) · behavior notes
- Clicking a row sets the `viscosity` input to that product's value
- Does not set any other field
- List is scrollable (max height 170px)

**Friction Loss Calculator card**

Two sections: Suction and Discharge. Each has three inputs:

| Field | Label | Unit |
|---|---|---|
| `sDia` / `dDia` | Pipe Dia | inches |
| `sLen` / `dLen` | Length | ft |
| `sHead` / `dHead` | Head Ht | ft |

- **Fluid Density** field shared between both sections (default: `62.4` lb/ft³ = water)
- Results appear inline below each section when all three fields are filled:
  - `Loss: X.XX PSI · Vel: X.XX ft/s · Re: XXXXX`
  - Green background result panel (`#f0fdf4`)
- Friction loss results are **informational only** — they do not auto-add to the discharge pressure input. The user must manually incorporate them.
- Units for pipe inputs are fixed to US Customary (inches / feet) regardless of the unit toggle

---

### 2.4 Results Panel — Empty State

Shown when no result is available yet.

| Condition | Message |
|---|---|
| Manual mode, inputs incomplete | "Enter process conditions to see results" |
| Recommend mode, not yet calculated | "Enter conditions and click Calculate Size" |

Empty state shows a ⚙️ icon centered in the card.

---

### 2.5 Results Panel — Results Card

**Header:** Shows mode context — `Manual — PD450` or `Recommended — 6 matches`

**Recommend mode only — Pump candidate chips:**
- Up to 8 candidates shown as button chips, sorted by proximity to 60% adj. max RPM utilization
- Each chip: model name + `XX% adj RPM` sub-label
- Selected chip: red background; unselected: white with gray border
- Selecting a chip updates the results panel immediately

**Recommend mode only — Rotor Class selector:**
- Appears after a pump candidate is selected
- Shows all 6 classes (A–F) as buttons, each with max PSI and max °F sub-labels
- Invalid classes (pressure or temp out of range) are greyed out and non-clickable (`cursor: not-allowed`, 40% opacity)
- Default selected class: `D`, or the first valid class if D is invalid

**Warning banner** (manual mode only, shown when warnings exist):
- Red background, red border
- Header: `⚠ Out-of-Range Warnings`
- Lists each warning message as a bullet

**Results table + pump curve** (via `ResultsPanel` component — see Section 7.1):
- Shown once a valid result exists in either mode

**"Configure This Pump →" button:**
- Red, full-width within the results table column
- Navigates to the Configure page, carrying the current result forward

---

### 2.6 Results Panel — Recommendations Card

A 2×2 grid of advisory tiles shown below the results card when a valid result exists.

| Tile | Label | Value | Advisory Logic |
|---|---|---|---|
| Seal | Seal | Recommended seal type | viscosity > 5000 → Double Mechanical; viscosity > 1000 → Monitor; else → Single Mechanical suitable |
| Duty Point | Duty Point | `XX% of adj. max RPM` | duty/adjMax > 85% → "Consider sizing up"; else → "Good operating range" |
| Motor | Motor | `Min X HP` | Next standard HP above BHP: 1, 1.5, 2, 3, 5, 7.5 HP |
| Viscosity | Viscosity | `K = X.XXX` | viscosity > 10,000 → "High vis — verify inlet & NPSH"; else → "Standard conditions apply" |

Each tile has a colored left border accent and colored header text (red, steel, amber, charcoal respectively).

---

## 3. Page: Configure

Reached via "Configure This Pump →" on the Sizing page. Shows the selected pump model and class in the card header.

**Guard:** If no pump is selected (accessed directly via nav), shows an empty state with a "← Back to Sizing" button.

---

### 3.1 Project Name Field

- Full-width text input at the top
- Label: `Project / Job Name`
- Placeholder: `e.g. Dairy Line 3 — Feed Pump`
- Flows to Datasheet header as the main project title

---

### 3.2 Configuration Options Grid

Fields are organized into five labeled sections, each rendered as a 2-column grid. All fields have defaults pre-populated. Fields are sourced from the Unibloc Pump Build Code (rev. 2-8-22).

**Pump Body**

| Field | Label | Default | Options |
|---|---|---|---|
| `series` | Series | 5000 — SS Gearbox | 5000 — SS Gearbox · 4000A — Alum. Bearing Housing · 4000B — Alum. Gearbox · 3000 — Steel Gearbox |
| `coverType` | Cover Type | Standard (10) | Standard (10) · Drain in Cover (11) · High Pressure (12) · Port in Cover (13) · HP with Port (14) · Jacketed (15) · FoodFirst HP w/ Dual Handles (16) · FoodFirst w/ Dual Handles (17) · FoodFirst HP w/o Handles (18) · FoodFirst w/o Handles (19) · Vented — Integral RV (20) · Vented #46 Style — Integral RV (21) · Swing Arm (22) |
| `rotorHousing` | Rotor Housing | Standard Sanitary (10) | Standard Sanitary (10) · Plugged Outlet (11) · Jacketed (15) |

**Connections**

| Field | Label | Default | Options |
|---|---|---|---|
| `connectionType` | Connection Type | Tri-Clamp (P) | Tri-Clamp (P) · NPT Male (KM) · NPT Female (KF) · DIN (D) · DIN Flange (DF) · ANSI Flange 150# (AF) · SMS (SMS) · Aseptic Union (AS) |
| `connectionSize` | Connection Size | First port size from pump | Derived from pump's port field — one option per `/`-delimited size |

**Rotors**

| Field | Label | Default | Options |
|---|---|---|---|
| `rotorStyle` | Rotor Style | Bi-Lobe | Bi-Lobe · Tri-Lobe (lobe pumps) or Gear (gear pumps) |
| `rotorMaterial` | Rotor Material | 316L SS | 316L SS · Non-Galling N60 SS · Hydex (Polymer) · Metal Detectable Hydex · PEEK (Polymer) · DuraCore (PTFE/SS/PTFE) · DuraCore MD · PolyFlex Acetal MD · PTFE (Polymer) |

**Drive & Shaft**

| Field | Label | Default | Options |
|---|---|---|---|
| `drive` | Drive Type | Direct Drive | Direct Drive · Compac® FMS · Gearbox · VFD Ready · Air Motor · Hydraulic Motor — Charlynn · Hydraulic Motor — Danfoss |
| `shaft` | Shaft Type | Metal Rotors — Standard (10) | Metal Rotors — Standard (10) · Metal Rotors — Hardened Seal Area (11) · Metal Rotors — Hardened Wear Sleeve (12) · Metal Rotors — Standard Wear Sleeve (13) · Non-Metal Rotors — Standard (15) · Non-Metal Rotors — Hardened Wear Sleeve (17) · Non-Metal Rotors — Standard Wear Sleeve (18) |

**Sealing**

| Field | Label | Default | Options |
|---|---|---|---|
| `seal` | Shaft Seal Type | Single Mech — Carbon / Tungsten Carbide (11a) | Single Mech variants (10, 11a, 11b, 12a, 12b, 13) · Single Mech with flush housing (40, 41a, 42a) · Double Mech (30, 31, 33) · O-LIP Seal variants (70, 70FL, 71, 72) · O-Ring (60, 61) · Gland Packing (50, 51) |
| `elastomer` | Elastomer | EPDM (E) | EPDM (E) · Viton (V) · EPDM USP Class VI (EUSP) · Viton USP Class VI (VUSP) · Buna N (N) · Silicone (S) · Kalrez (K) |

**Default population logic:** `connectionSize` is set from the pump's port field when the user clicks "Configure This Pump →". `rotorStyle` auto-sets to `Gear` for gear pump selections and resets from `Gear` to `Bi-Lobe` if switching back to a lobe pump. All other defaults are set in the App component's initial state.

---

### 3.3 Footer Buttons

Two buttons below the config card, full-width combined:

| Button | Style | Action |
|---|---|---|
| `← Back to Sizing` | Outline (red border) | Returns to Sizing page; config state is preserved |
| `✓ Confirm & Generate Datasheet` | Solid red (2× width) | Generates Sizing ID, sets `saved = true`, navigates to Datasheet |

---

## 4. Page: Datasheet

A print-ready summary of the completed sizing. Reached via "Confirm & Generate Datasheet" on the Configure page.

**Guard:** If no pump is selected or `saved` is false, shows a prompt to complete sizing first with a "← Back to Sizing" button.

---

### 4.1 Datasheet Header

| Element | Detail |
|---|---|
| Logo | UNIBLOC wordmark + red arc icon |
| Division | "Hygienic Technologies" / "Application Sizing Datasheet" |
| Project name | Right-aligned, bold — `projectName` or `"Unnamed Project"` if blank |
| Customer name | Right-aligned, gray — shown only if filled |
| Quote number | Right-aligned, gray — shown only if filled |
| Date | Right-aligned — auto-generated on page load (`new Date().toLocaleDateString()`) |
| Sizing ID | Right-aligned, monospace — format `UNI-YYYYMMDD-XXXX` |
| "Internal Use Only" badge | Small red pill label, right-aligned |

---

### 4.2 Two-Column Data Grid

**Left column:**

*Process Conditions table*
- Customer (if filled)
- Quote No. (if filled)
- Sizing ID
- Flow Rate (with unit label)
- Discharge Pressure (with unit label)
- Viscosity (always cPs)
- Product Temp (with unit label)

*Calculated Performance table*
- Model
- Type (Sanitary Gear or Rotary Lobe)
- Rotor Class
- Adj. Pressure (with unit)
- Slip RPM
- Duty RPM
- Adj. Max RPM
- % Adj. Max
- Power (primary unit)
- Power (alternate unit)
- K Factor

**Right column:**

*Pump Specifications table*
- Max Flow (with unit)
- Max Pressure (with unit)
- Max RPM
- Max Temp (with unit)
- Displacement (gal/rev)
- Port Size

*Configuration table*
- All config fields (Series, Cover Type, Rotor Housing, Rotor Style, Rotor Material, Connection Type, Connection Size, Seal, Shaft, Elastomer, Drive) — field names auto-formatted from camelCase to Title Case with spaces via `toCfg()`

---

### 4.3 Performance Curve

Full-width SVG pump curve chart (460×270px) centered below the data grid.  
See Section 7.2 for Pump Curve component spec.

---

### 4.4 Footer Buttons (no-print)

| Button | Style | Action |
|---|---|---|
| `← Edit Configuration` | Outline | Returns to Configure page |
| `🖨 Print / Save as PDF` | Solid red (2× width) | Calls `window.print()` |

Both buttons are hidden on print via `.no-print` CSS class.

---

## 5. Page: Knowledge Base

A searchable, filterable library of 12 engineering reference articles.

---

### 5.1 Filter Bar

At the top of the page in a card:

- **Search input** — full-text search across title, summary, and body content; case-insensitive; real-time filtering; left-padded 🔍 icon
- **Result count** — pill badge showing `N articles` (or `1 article`), updates with filter
- **Pump Type filter** — button group: `All` · `Lobe` · `Gear`
  - Lobe active: steel blue highlight; Gear active: red highlight
- **Category filter** — button group: `All` · `General` · `Sizing` · `Seals` · `Installation` · `Maintenance` · `Troubleshooting`
  - Each category has its own color (green for Sizing, pink for Seals, purple for Installation, orange for Maintenance, red for Troubleshooting)

---

### 5.2 Disclaimer Banner

A fixed amber/yellow banner below the filter bar:

> ⚠ Information drawn from the Unibloc Engineering Manual (EMPD200-677, Rev. 12/2016). Verify critical applications with Unibloc engineering.

---

### 5.3 Article List

Accordion-style list. Each article row:

**Collapsed state:**
- Title (bold) + category badge + pump type badge(s)
- Summary text (gray)
- ▼ chevron (right-aligned)
- Hover: light gray background

**Expanded state:**
- Steel blue background on header
- Red border accent on left of expanded body
- ▲ chevron
- Full article content in pre-wrap plain text (preserves manual line breaks and bullet formatting)
- Border color changes from gray to red when open

**Search highlighting:**
- All matching search terms are highlighted with a yellow `<mark>` background (`#fef08a`) across title, summary, and body content

**Empty state** (no articles match filters):
- 📭 icon + "No articles match your search" message

---

## 6. Page: Applications

🚧 **Placeholder — not yet implemented.**

Displays a centered empty state card:

- 🗂 icon
- Title: "Applications Database"
- Description: "This tab will display all saved pump sizings and allow you to search and filter by customer, pump model, product, quote number, and more."
- Badge: "Coming Soon — Database Integration Pending"

**Intended future functionality:**
- List of all saved Sizing Records (see `DATA_MODEL.md` Section 13)
- Search and filter by customer, pump model, quote number, date
- Click-through to view/re-print individual datasheets

---

## 7. Shared Components

### 7.1 ResultsPanel

Displayed on both Sizing (live) and embedded in Datasheet (static).

**Left sub-panel — Data table** (~210px wide):

| Row | Value |
|---|---|
| Model | pump name |
| Type | `Sanitary Gear` or `Rotary Lobe` |
| Rotor Class | A–F or `—` for gear pumps |
| Port Size | pump port string |
| Adj. Pressure | converted to display unit |
| Slip RPM | rounded to integer |
| Duty RPM | rounded to integer |
| Adj. Max RPM | rounded to integer |
| % Adj. Max | `duty / adjMax × 100`, rounded |
| Power | primary unit (HP or kW depending on unit toggle) |
| Power (alt) | alternate unit |
| K Factor | 3 decimal places |
| Max Flow | converted to display unit |
| Max Press. | converted to display unit |
| Shear Rate | in Pa if rotor dimensions available; `N/A` if not |

- Shear Rate value is styled in steel-dark color when a value is present
- "Configure This Pump →" button below the table (on Sizing page only)

**Right sub-panel — Pump Curve** (see Section 7.2)

---

### 7.2 PumpCurve (SVG Chart)

An inline SVG rendering of the pump's flow-vs-speed performance curve.

| Property | Sizing page (compact) | Datasheet |
|---|---|---|
| Width | 340px | 460px |
| Height | 210px | 270px |

**Chart elements:**

| Element | Description |
|---|---|
| Background | Light gray fill (`#F4F5F7`) with rounded corners |
| Grid lines | Horizontal (flow) and vertical (RPM) at 5 evenly spaced ticks each |
| Axis labels | Speed (RPM) on x-axis; Flow (GPM) on y-axis |
| Slip region line | Dashed steel-mid line for the zero-flow portion up to slip RPM |
| Operating curve | Solid steel-blue line from slip RPM to max RPM |
| Adj. Max RPM line | Dashed red vertical line; red shaded region to the right |
| "Adj Max" label | Red label above the adj. max line |
| Duty point | Red filled circle with white stroke ring; label showing `X GPM @ XXX RPM` in red-dark |

**Note:** The chart always renders in GPM/RPM regardless of the unit toggle — unit conversion is not applied to the chart axes in the current implementation. 🚧

---

## 8. User Flows

### 8.1 Primary Flow — Manual Sizing

```
[Sizing page]
  → Enter Customer Name, Quote Number (optional)
  → Set unit toggle (US / SI)
  → Enter Flow, Pressure, Viscosity, Temp
  → Select Pump Type filter (optional)
  → Toggle "Show Recommended Pumps" = OFF
  → Select Pump Model from dropdown
  → Select Rotor Class (lobe pumps only)
  → Results update live → review table + curve
  → Review Recommendations tile
  → Click "Configure This Pump →"

[Configure page]
  → Enter Project / Job Name
  → Adjust configuration dropdowns as needed
  → Check "Include Relief Valve" if required
  → Click "✓ Confirm & Generate Datasheet"

[Datasheet page]
  → Review full datasheet
  → Click "🖨 Print / Save as PDF"
```

### 8.2 Primary Flow — Auto-Sizing (Recommend Mode)

```
[Sizing page]
  → Enter process conditions (same as above)
  → Toggle "Show Recommended Pumps" = ON
  → Click "Calculate Size"
  → Review up to 8 ranked pump candidates
  → Click a candidate chip to select it
  → Review/adjust Rotor Class (invalid classes greyed out)
  → Review results table + curve
  → Click "Configure This Pump →"
  → [Continue same as Manual flow from Configure page]
```

### 8.3 Secondary Flow — Friction Loss Estimation

```
[Sizing page]
  → Enter process conditions
  → Click "▼ Show Advanced Options"
  → Enter Suction pipe: diameter, length, head height
  → Enter Discharge pipe: diameter, length, head height
  → Adjust Fluid Density if not water
  → Read PSI loss, velocity, and Reynolds number inline
  → Manually add friction loss to Discharge Pressure input if significant
```

### 8.4 Secondary Flow — Product Lookup

```
[Sizing page]
  → Click "▼ Show Advanced Options"
  → Type product name in Product Database search
  → Click matching product row
  → Viscosity field auto-populates
```

---

## 9. Validation & Error States

### Input Validation

| Field | Validation | Behavior on Failure |
|---|---|---|
| Flow | Must be > 0 | Results suppressed; no error message shown |
| Pressure | Must be > 0 | Results suppressed; no error message shown |
| Viscosity | Must be > 0 | Results suppressed; no error message shown |
| Temp | Optional; defaults to 70°F | Rotor class filtering uses 70°F if blank |
| Friction inputs | All three fields (dia, len, head) must be filled | Friction result simply does not appear |

> **Current behavior:** Validation is implicit — incomplete inputs produce no result rather than an error message. There are no inline validation error messages or red border states. This is intentional for the v1 prototype but should be revisited.

### Out-of-Range Warnings (Manual Mode)

Shown as a red warning banner above the results table when any of the following are true:

| Warning | Condition |
|---|---|
| Pressure exceeds rotor class limit | `pressure > rc.maxPSI` |
| Flow exceeds pump max | `flow > pump.maxFlow` |
| RPM exceeds viscosity-adjusted limit | `dutyRPM > adjMaxRPM` |
| RPM exceeds mechanical max | `dutyRPM > pump.maxRPM` |

Warnings do not block the user — results are still shown and "Configure This Pump →" remains accessible. The engineer must decide how to respond to warnings.

### Rotor Class Availability (Recommend Mode)

In recommend mode, rotor class buttons that are invalid for the selected pump and current conditions are:
- Greyed out (40% opacity)
- Non-clickable (`cursor: not-allowed`)
- A class is invalid if `pressure > rc.maxPSI` OR `temp > rc.maxTF`

### Configure Page Guard

If the user navigates to Configure without completing Sizing, a centered message reads: "Please complete pump sizing first." with a "← Back to Sizing" button.

### Datasheet Page Guard

If the user navigates to Datasheet without confirming a configuration, a centered message reads: "No saved datasheet yet. Complete sizing and configuration first." with a "← Back to Sizing" button.

---

## 10. Responsive & Print Behavior

### Responsive Layout

| Page | Layout |
|---|---|
| Sizing | Two-column flex layout; wraps to single column on narrow viewports (min-width 260px left panel) |
| Configure | Single centered column (max-width 680px) |
| Datasheet | Single centered column (max-width 700px) |
| Knowledge Base | Single centered column (max-width 900px) |
| Applications | Single centered column (max-width 900px) |

Navigation bar wraps on narrow viewports (`flexWrap: wrap`).

### Print Behavior

Triggered by `window.print()` on the Datasheet page.

| Element | Print behavior |
|---|---|
| Nav bar | Hidden (`display: none`) |
| `.no-print` elements | Hidden — includes the footer action buttons |
| Page background | White (overrides gray page background) |
| Pump curve SVG | Renders inline — included in print output |
| All data tables | Print as visible |

> **Note:** The Datasheet is the only page intended for printing. Other pages have not been tested or optimized for print output.
