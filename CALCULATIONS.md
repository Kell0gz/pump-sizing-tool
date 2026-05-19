# CALCULATIONS.md
## Unibloc Pump Sizing Tool — Engineering Calculation Reference

> **Source:** Derived from `pump_sizing_html_v4.html` and the Unibloc Engineering Manual (EMPD200-677, Rev. 12/2016).  
> **Unit convention:** All internal calculations use **US Customary units** (GPM, PSI, °F, cPs, in-lbs, HP). SI values are converted before input and after output only — never mid-calculation.  
> **Scope:** Lobe pumps (PD series) and Sanitary Gear pumps (GP series).

---

## Table of Contents

1. [Unit Conversions](#1-unit-conversions)
2. [K Factor (Viscosity Correction)](#2-k-factor-viscosity-correction)
3. [Adjusted Pressure](#3-adjusted-pressure)
4. [Slip RPM](#4-slip-rpm)
5. [Duty RPM](#5-duty-rpm)
6. [Adjusted Maximum RPM](#6-adjusted-maximum-rpm)
7. [Brake Horsepower & Power](#7-brake-horsepower--power)
8. [Friction Loss (Darcy-Weisbach)](#8-friction-loss-darcy-weisbach)
9. [Shear Stress](#9-shear-stress)
10. [Pump Auto-Selection Ranking](#10-pump-auto-selection-ranking)
11. [Validation Warnings](#11-validation-warnings)
12. [Known Gaps & Open Items](#12-known-gaps--open-items)

---

## 1. Unit Conversions

All conversions are applied at the UI boundary. Internal state is always US Customary.

| Quantity    | US Unit | SI Unit | US → SI                        | SI → US                        |
|-------------|---------|---------|-------------------------------|-------------------------------|
| Flow        | GPM     | LPM     | `LPM = GPM × 3.78541`         | `GPM = LPM ÷ 3.78541`         |
| Pressure    | PSI     | Bar     | `Bar = PSI × 0.0689476`       | `PSI = Bar ÷ 0.0689476`       |
| Temperature | °F      | °C      | `°C = (°F − 32) ÷ 1.8`        | `°F = °C × 1.8 + 32`          |
| Power       | HP      | kW      | `kW = HP × 0.7457`            | `HP = kW ÷ 0.7457`            |

> **Note:** Viscosity (cPs) and displacement (gal/rev) have no unit toggle — they are always entered and stored in the same units.

---

## 2. K Factor (Viscosity Correction)

The K Factor accounts for the effect of fluid viscosity on pump power and speed. It is a cubic polynomial fit on the log₁₀ of viscosity.

### Formula

```
L = log₁₀( max(viscosity, 1) )

K = 1.263 − (0.384 × L) + (0.314 × L²) + (0.076 × L³)

K = max(K, 2.0)          ← floor of 2.0 enforced
```

### Inputs

| Variable    | Unit | Description                        |
|-------------|------|------------------------------------|
| `viscosity` | cPs  | Absolute (dynamic) viscosity of the fluid |

### Output

| Variable | Description                                  |
|----------|----------------------------------------------|
| `K`      | Dimensionless viscosity correction factor (≥ 2.0) |

### Behavior

- At water viscosity (1 cPs): L = 0, K ≈ 1.263 → clamped to **2.0**
- At moderate viscosity (100 cPs): K ≈ 2.6
- At high viscosity (10,000 cPs): K ≈ 5.5
- K increases monotonically with viscosity

### Source

Unibloc Engineering Manual — Section: Viscosity & the K Factor.

---

## 3. Adjusted Pressure

High-viscosity fluids reduce internal slip due to their resistance to flow back across rotor clearances. The adjusted pressure reflects the effective differential the pump "sees" for slip calculations.

### Formula

```
if viscosity ≥ 1000 cPs:
    correction = pressure              ← full correction; no effective slip pressure
else:
    correction = 0.1486 × pressure × ln(viscosity)

adjusted_pressure = max(0, pressure − correction)
```

### Inputs

| Variable     | Unit | Description                  |
|--------------|------|------------------------------|
| `pressure`   | PSI  | Discharge pressure           |
| `viscosity`  | cPs  | Absolute viscosity           |

### Output

| Variable            | Unit | Description                                      |
|---------------------|------|--------------------------------------------------|
| `adjusted_pressure` | PSI  | Effective pressure used in slip RPM calculation  |

### Behavior

- At viscosity ≥ 1000 cPs: `adjusted_pressure = 0` → effectively zero slip from pressure
- At low viscosity (e.g. water): minimal correction, nearly full pressure drives slip
- Result is always clamped to 0 (cannot be negative)

### Source

Unibloc Engineering Manual — Section: Viscosity & the K Factor, Pressure Correction.

---

## 4. Slip RPM

Slip is the internal recirculation of fluid back from the discharge side to the suction side across rotor-to-rotor and rotor-to-housing clearances. It is modeled as RPM lost from theoretical displacement speed.

Each pump model has a unique empirical quadratic slip equation of the form:

```
Slip RPM = [ (−b + √(b² + 4·a·P_adj)) / (2·a) ] × slip_factor
```

where `a` and `b` are pump-specific empirical constants derived from Unibloc performance data, and `P_adj` is the adjusted pressure.

### Slip Equation Coefficients by Model

| Model     | a        | b        | Notes                    |
|-----------|----------|----------|--------------------------|
| PD200-0   | 0.00003  | −0.0076  |                          |
| PD200     | 0.00008  | −0.0097  |                          |
| PD250     | 0.0001   | −0.0277  |                          |
| PD275     | 0.0001   | −0.0221  |                          |
| PD300     | 0.00008  | +0.122   |                          |
| PD350     | 0.0001   | −0.1305  |                          |
| PD400     | 0.0016   | +0.0428  |                          |
| PD450     | 0.0011   | −0.1458  |                          |
| PD500     | 0.0041   | +0.008   |                          |
| PD501     | 0.0041   | +0.008   | Same coefficients as PD500 |
| PD550     | 0.0039   | −0.0679  |                          |
| PD551     | 0.0039   | −0.0679  | Same coefficients as PD550 |
| PD575     | 0.0037   | −0.0354  |                          |
| PD576     | 0.0037   | −0.0354  | Same coefficients as PD575 |
| PD602     | 0.0016   | +0.0319  |                          |
| PD652     | 0.004    | +0.2484  |                          |
| GP175/22  | 0.00002  | −0.0284  | Gear pump; slip_factor ignored |
| GP175/38  | 0.00002  | −0.0284  | Gear pump; slip_factor ignored |
| GP275/22  | 0.0002   | −0.0379  | Gear pump; slip_factor ignored |
| GP275/38  | 0.0001   | −0.014   | Gear pump; slip_factor ignored |
| GP300/28  | 0.0003   | −0.012   | Gear pump; slip_factor ignored |
| GP350/40  | 0.0002   | −0.0151  | Gear pump; slip_factor ignored |

### Pumps Without Slip Equations

The following models do not have slip equations and are excluded from auto-sizing:

`PD600`, `PD650`, `PD677`, `GP200/07`, `GP200/10`, `GP375/52`

> **Open Item:** Slip data for these models is not yet available. They can be manually selected but will not appear in auto-sizing results.

### Slip Factor

Lobe pump slip is multiplied by a rotor-class-specific `slip_factor`. Gear pumps always use `slip_factor = 1.0` (rotor classes do not apply).

| Rotor Class | Slip Factor                                  |
|-------------|----------------------------------------------|
| A, B, C, D  | 1.0 (for all lobe pump models)               |
| E           | Per-pump value (range: 1.11 – 1.31)          |
| F           | Per-pump value (range: 1.23 – 1.70)          |

Selected slip factors for Class E and F:

| Model    | Class E | Class F |
|----------|---------|---------|
| PD200-0 through PD275 | 1.31 | 1.70 |
| PD300, PD350          | 1.22 | 1.53 |
| PD400, PD450          | 1.17 | 1.38 |
| PD500–PD677 (large)   | 1.11 | 1.23 |

### Inputs

| Variable            | Unit | Description                          |
|---------------------|------|--------------------------------------|
| `adjusted_pressure` | PSI  | From Section 3                       |
| `slip_factor`       | —    | From rotor class lookup              |

### Output

| Variable   | Unit | Description                             |
|------------|------|-----------------------------------------|
| `slip_RPM` | RPM  | Speed lost to internal recirculation (≥ 0) |

### Source

Unibloc Engineering Manual — pump performance curve data, Section: Pump Selection Procedure.

---

## 5. Duty RPM

The speed the pump shaft must run to deliver the required flow, accounting for slip.

### Formula

```
duty_RPM = (flow / displacement) + slip_RPM
```

### Inputs

| Variable       | Unit    | Description                       |
|----------------|---------|-----------------------------------|
| `flow`         | GPM     | Required flow rate                |
| `displacement` | gal/rev | Pump displacement per revolution  |
| `slip_RPM`     | RPM     | From Section 4                    |

### Output

| Variable    | Unit | Description              |
|-------------|------|--------------------------|
| `duty_RPM`  | RPM  | Required operating speed |

---

## 6. Adjusted Maximum RPM

Viscous fluids increase the torque required to turn the pump. The adjusted maximum RPM limits speed to prevent motor overload and product degradation.

### Formula

```
adj_max_RPM = max( pump_max_RPM × (2 / K),  pump_max_RPM × 0.25 )
```

The factor `2 / K` reduces max RPM as viscosity (and K) increases. The floor of `0.25 × pump_max_RPM` ensures the pump is never speed-limited to an impractical value.

### Inputs

| Variable        | Unit | Description                        |
|-----------------|------|------------------------------------|
| `pump_max_RPM`  | RPM  | Mechanical speed limit for the model |
| `K`             | —    | K Factor from Section 2            |

### Output

| Variable       | Unit | Description                                      |
|----------------|------|--------------------------------------------------|
| `adj_max_RPM`  | RPM  | Viscosity-corrected maximum operating speed      |

### Behavior

- At K = 2.0 (minimum, low viscosity): `adj_max_RPM = pump_max_RPM × 1.0` — no reduction
- At K = 4.0 (moderate viscosity): `adj_max_RPM = pump_max_RPM × 0.5`
- At K = 8.0 (high viscosity): `adj_max_RPM = pump_max_RPM × 0.25` — floor applies

---

## 7. Brake Horsepower & Power

### Formula

```
BHP = (pressure / 8 + K) × (duty_RPM / 1080)

kW = BHP × 0.7457
```

### Inputs

| Variable    | Unit | Description                   |
|-------------|------|-------------------------------|
| `pressure`  | PSI  | Discharge pressure (unadjusted) |
| `K`         | —    | K Factor from Section 2       |
| `duty_RPM`  | RPM  | From Section 5                |

### Output

| Variable | Unit | Description               |
|----------|------|---------------------------|
| `BHP`    | HP   | Brake horsepower required |
| `kW`     | kW   | Equivalent in kilowatts   |

### Motor Sizing Note

Per the Unibloc Engineering Manual, the **minimum motor HP = Duty BHP × 1.2** (20% service factor). This motor sizing step is not performed inside the tool — it is left to the engineer.

### Source

Unibloc Engineering Manual — Section: Pump Selection Procedure.  
Torque reference: `T (in-lbs) = HP × 5250 ÷ RPM × 12`

---

## 8. Friction Loss (Darcy-Weisbach)

Used in the Advanced / Friction Loss panel to estimate suction and discharge pipe pressure drop. Results are additive to the user's stated discharge pressure.

### Formula

```
pipe_area   = π × (diameter / 24)²          [ft²; diameter in inches → ÷ 24 converts to radius in ft]
velocity     = (flow / 448.83) / pipe_area    [ft/s; 448.83 converts GPM to ft³/s... see note]
reynolds     = (density × velocity × (diameter / 12)) / (viscosity × 0.000672)
                                              [dimensionless; 0.000672 converts cPs to lb/(ft·s)]

if reynolds < 2300 (laminar):
    friction_factor = 64 / reynolds           [Hagen-Poiseuille]
else (turbulent):
    friction_factor = 0.316 / reynolds^0.25   [Blasius approximation]

head_friction = friction_factor × (length / (diameter / 12)) × velocity² / (2 × 32.174)
                                              [ft of head; 32.174 = g in ft/s²]

pressure_loss = ((head_friction + static_head) × density) / 144
                                              [PSI; 144 converts lb/ft² to PSI]
```

> **Note on flow conversion:** `448.83` is the factor converting GPM to ft³/min, then dividing by 60 gives ft³/s. The implementation combines these as `flow / 448.83 / area` which is equivalent to `(flow / 7.4805) / 60 / area`.

### Inputs

| Variable      | Unit    | Description                         |
|---------------|---------|-------------------------------------|
| `diameter`    | inches  | Pipe inner diameter                 |
| `length`      | feet    | Pipe run length                     |
| `static_head` | feet    | Elevation head (positive = uphill)  |
| `flow`        | GPM     | Flow rate                           |
| `density`     | lb/ft³  | Fluid density (default: 62.4 for water) |
| `viscosity`   | cPs     | Absolute viscosity                  |

### Outputs

| Variable         | Unit    | Description                         |
|------------------|---------|-------------------------------------|
| `pressure_loss`  | PSI     | Total friction + static pressure loss |
| `reynolds`       | —       | Reynolds number (flow regime indicator) |
| `velocity`       | ft/s    | Mean fluid velocity in pipe         |

### Limitations

- Uses the **Blasius correlation** for turbulent flow — valid for smooth pipes at Re < ~100,000. For rough pipes or high Re, a Colebrook-White or Moody chart approach would be more accurate.
- Does not account for fittings, valves, or bends (no K-factor or equivalent length for minor losses).
- Separate calculations are run for suction and discharge sides; the tool displays each independently.

---

## 9. Shear Stress

Estimates the mechanical shear stress applied to the fluid inside the rotor cavity. Used to assess suitability for shear-sensitive products (e.g. yogurt, gels, emulsions).

### Method

Four stress points are calculated inside the rotor cavity and averaged. All geometry is converted to meters.

```
IR          = (rotor_id / 2) / 1000           [inner radius, m]
OR          = (rotor_od / 2) / 1000           [outer radius, m]
half_depth  = (rotor_depth / 2) / 1000        [half rotor depth, m]
gap         = OR − IR                          [radial clearance, m]

vel_inner   = duty_RPM × 2π × IR / 60         [m/s, inner tip velocity]
vel_outer   = duty_RPM × 2π × OR / 60         [m/s, outer tip velocity]
vis_Pa      = viscosity_cPs × 0.001           [Pa·s]

Point 1 (housing shear):    P1 = vis_Pa × (vel_outer / gap)
Point 2 (min cover shear):  P2 = vis_Pa × (vel_inner / half_depth)
Point 3 (max cover shear):  P3 = vis_Pa × (vel_outer / half_depth) + P1
Point 4 (centerpoint):      P4 = 0

shear_stress = (P1 + P2 + P3 + P4) / 4       [Pa]
```

### Inputs

| Variable         | Unit  | Description                           |
|------------------|-------|---------------------------------------|
| `rotor_id`       | mm    | Inner diameter of rotor               |
| `rotor_od`       | mm    | Outer diameter of rotor               |
| `rotor_depth`    | mm    | Rotor depth (axial)                   |
| `duty_RPM`       | RPM   | From Section 5                        |
| `viscosity`      | cPs   | Absolute viscosity                    |

### Output

| Variable       | Unit | Description                      |
|----------------|------|----------------------------------|
| `shear_stress` | Pa   | Average shear stress in the rotor cavity |

### Data Availability

Rotor dimensions are currently only populated for **PD200-0** and **PD450**. All other models return `null` and display "N/A" in the UI.

> **Open Item:** Rotor dimension data needs to be collected and entered for all remaining PD models. Gear pumps do not use this calculation.

### Limitations

- This is a simplified 4-point average model, not a full CFD analysis.
- Assumes Newtonian fluid behavior. Shear-thinning fluids (yogurt, ketchup, etc.) will have lower actual viscosity at high shear, making this a conservative overestimate of stress.
- Does not account for rotor lobe geometry beyond the inner/outer radius and depth.

---

## 10. Pump Auto-Selection Ranking

When the user clicks **Size Pumps**, the tool filters all eligible pumps and ranks them by how close the duty RPM is to 60% of the viscosity-adjusted maximum RPM.

### Filter Criteria (a pump is excluded if any of the following are true)

1. The pump has no slip equation (see `NO_SLIP_EQ` set in Section 4)
2. The required pressure exceeds the pump's maximum pressure across all rotor classes
3. After sizing, any warning is generated **other than** `"Pressure exceeds rotor class limit"` (i.e., flow or RPM warnings disqualify a pump)

> Note: "Pressure exceeds rotor class limit" is not a disqualifier at auto-selection time because a higher rotor class may resolve it — the user selects rotor class after choosing a pump.

### Ranking Formula

```
score = | (duty_RPM / adj_max_RPM) − 0.60 |

Pumps are sorted ascending by score → closest to 60% utilization ranks first.

Only the top 3 pumps (lowest scores) are returned as recommendations.
```

The 60% target represents a good operating point: sufficient speed for stable flow metering while leaving headroom for viscosity variation and speed increases without exceeding limits. Limiting results to 3 keeps the recommendation focused on the best-fit options.

### Auto-Selection Sizing Mode

During auto-selection, `slip_factor = 1.0` is used regardless of rotor class (i.e., `sizeOnly = true`). The actual slip factor is applied once the user selects a specific rotor class.

---

## 11. Validation Warnings

The following warnings are evaluated after every calculation and displayed in the results panel. A pump with any warning (except as noted in Section 10) is considered out of specification.

| Warning Message                          | Condition                                       |
|------------------------------------------|-------------------------------------------------|
| Pressure exceeds rotor class limit       | `pressure > rc.maxPSI` for selected rotor class |
| Flow exceeds pump max                    | `flow > pump.maxFlow`                           |
| RPM exceeds viscosity-adjusted limit     | `duty_RPM > adj_max_RPM`                        |
| RPM exceeds mechanical max               | `duty_RPM > pump.maxRPM`                        |

---

## 12. Known Gaps & Open Items

| # | Area             | Description                                                                                   | Priority |
|---|------------------|-----------------------------------------------------------------------------------------------|----------|
| 1 | Slip equations   | PD600, PD650, PD677, GP200/07, GP200/10, GP375/52 have no slip equations — excluded from auto-sizing | High |
| 2 | Rotor dimensions | Only PD200-0 and PD450 have rotor geometry data; shear calc unavailable for all other models  | Medium   |
| 3 | Friction losses  | Blasius correlation only; no minor loss (fitting) support; no rough-pipe correction            | Medium   |
| 4 | Motor sizing     | BHP × 1.2 service factor is documented but not calculated in the tool                        | Low      |
| 5 | Shear model      | Non-Newtonian correction not implemented; shear-thinning products are conservatively estimated | Low      |
| 6 | NPSH             | NPSH calculation is documented in the Knowledge Base but not computed by the tool             | Medium   |
| 7 | PD677 slip factor | `PUMP_SLIP_EF` has no entry for PD677 — defaults to slip_factor = 1 for classes E and F     | Low      |
