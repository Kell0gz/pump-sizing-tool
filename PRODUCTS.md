# PRODUCTS.md
## Unibloc Pump Sizing Tool — Product Viscosity Database

> **How to use this file:** This is the authoritative reference for the product lookup database. Selecting a product in the tool auto-populates the viscosity field. Update values here first, then mirror changes into the application source code.  
> **Units:** Viscosity in cPs (centipoise), shear in Pa (Pascal).  
> **Schema definitions** live in `DATA_MODEL.md` — this file contains data only.

---

## Product List

| Product | Viscosity (cPs) | Shear (Pa) | Fluid Behavior |
|---|---|---|---|
| Water | 1 | 0 | Newtonian |
| Milk | 2 | 0 | Newtonian |
| Cream (40%) | 15 | 0 | Newtonian |
| Vegetable Oil | 65 | 0 | Newtonian |
| Ice Cream Mix | 300 | 55 | Emulsified dairy |
| Salsa | 500 | 5 | Contains particles |
| Chocolate | 800 | 10 | Thixotropic |
| Ketchup | 1,000 | 20 | Shear thinning |
| Yogurt | 1,500 | 8 | Shear thinning |
| Glycerin | 1,500 | 0 | Newtonian |
| Corn Syrup | 2,500 | 0 | Newtonian |
| Tomato Paste | 5,000 | 25 | Shear thinning |
| Mayonnaise | 6,000 | 30 | Shear thinning |
| Honey | 10,000 | 0 | Newtonian |
| Peanut Butter | 25,000 | 40 | Viscoplastic |

---

## Notes on the Shear Field

The `shear` column is stored in the application but is **not currently used in any calculation**. The intended use is a future shear sensitivity warning — comparing this value against the computed rotor shear stress to flag whether a product may be degraded.

Before implementing that feature, the team should confirm the semantics of this field:

- Is it a **maximum tolerable shear stress** (Pa) above which product degrades?
- Or is it a **reference shear stress** measured at a standard condition?

Viscosity values represent typical values at ambient/process temperature. For shear-thinning products especially, actual viscosity at pump speed may be lower — the app does not currently correct for this.

---

## Adding New Products

When adding a product entry, include all four fields:

| Field | Required | Notes |
|---|---|---|
| `name` | ✓ | Display name shown in the product search dropdown |
| `viscosity` | ✓ | Absolute viscosity in cPs at typical process temperature |
| `shear` | ✓ | Use `0` if not shear-sensitive or value is unknown |
| `notes` | ✓ | One of: `Newtonian`, `Shear thinning`, `Thixotropic`, `Viscoplastic`, `Dilatant`, or a brief descriptor |
