# DECISIONS.md
## Unibloc Pump Sizing Tool — Architecture Decision Record

> **Purpose:** This file logs key technical and product decisions — both the ones already made and the ones still open. For every decision, we record *what* was decided, *why*, and *what was considered but rejected*. This prevents the team from relitigating settled questions and helps new developers understand the reasoning behind the codebase.
>
> **How to use this file:**
> - When a decision is made, move it from the Open section to the Decided section and fill in all fields
> - Keep entries concise — a few sentences is enough; link to longer discussions if they exist
> - Date every decision so the team can understand the context it was made in

---

## Table of Contents

1. [Decided](#1-decided)
2. [Open](#2-open)

---

## 1. Decided

---

### ADR-001 — Single HTML File for Prototype

**Date:** Early 2026  
**Status:** Decided ✅  
**Deciders:** Development team

**Decision:**  
Build the initial version as a single self-contained HTML file with React loaded from CDN and Babel transpiling JSX in the browser.

**Context:**  
The team needed a working tool quickly to validate the sizing logic and UX with engineers before committing to a full project setup.

**Rationale:**  
A single file is zero-friction to distribute — email it, drop it on a shared drive, open it in a browser. No install, no setup, no deployment. For a prototype that needs to get in front of users fast, this was the right tradeoff.

**What was rejected:**  
Starting with a full Vite project from day one. This would have been the right long-term choice but would have added tooling overhead before the core logic was validated.

**Consequences:**  
- No persistence — all session state is lost on refresh
- In-browser Babel is slow on first load and not production-suitable
- CDN dependency means the app requires internet access
- All code shares a single global scope — name collision risk grows with file size
- The file will need to be migrated to a Vite project before the backend is added

---

### ADR-002 — All Internal Calculations in US Customary Units

**Date:** Early 2026  
**Status:** Decided ✅  
**Deciders:** Development team

**Decision:**  
All engineering calculations use US Customary units internally (GPM, PSI, °F, cPs, HP). SI values are converted to US at the input boundary and converted back to SI at the display boundary only.

**Context:**  
The Unibloc Engineering Manual is written in US Customary units. The pump database (displacement in gal/rev, pressure in PSI, temperature in °F) reflects this.

**Rationale:**  
Maintaining a single internal unit system eliminates an entire class of conversion bugs. The conversion boundary is explicit and testable. Engineers working from the manual can verify calculations directly against documented formulas without unit translation.

**What was rejected:**  
Storing state in SI and converting to US for calculations. This would have been correct if the manual were metric-first, but would have introduced unnecessary conversions throughout the calculation chain.

**Consequences:**  
- Viscosity (cPs) has no unit toggle — it is the same in both systems
- The pump curve chart renders in GPM/RPM regardless of the unit toggle (known gap — see UI_SPEC.md §7.2)
- Friction loss inputs are fixed to US Customary (inches/feet) regardless of unit toggle

---

### ADR-003 — Pump Type Inferred from Model Name Prefix

**Date:** Early 2026  
**Status:** Decided ✅  
**Deciders:** Development team

**Decision:**  
Pump type (Lobe vs. Gear) is determined at runtime by checking whether the model name starts with `'G'`. No explicit `type` field is stored on the pump object.

**Context:**  
All gear pump model names begin with `GP`. All lobe pump names begin with `PD`. This is a consistent naming convention in the Unibloc product line.

**Rationale:**  
Avoids redundant data — the information is already encoded in the name. Keeps the pump object schema minimal.

**What was rejected:**  
Adding an explicit `type: 'Lobe' | 'Gear'` field to each pump. This would be more readable and self-documenting but adds a field that can fall out of sync with the name.

**Consequences:**  
- Any future pump model that starts with `G` but is not a gear pump would be misclassified — this is an unlikely but non-zero risk
- If a new pump series is introduced with a different naming convention, this logic must be updated
- Code reading `pump.name.startsWith('G')` is less immediately obvious than `pump.type === 'Gear'` — document clearly when encountered

---

### ADR-004 — Auto-Sizing Uses slip_factor = 1.0 During Candidate Filtering

**Date:** Early 2026  
**Status:** Decided ✅  
**Deciders:** Development team

**Decision:**  
During auto-sizing (`sizePumps()`), slip is calculated with `slip_factor = 1.0` regardless of rotor class. The actual slip factor is only applied once the user selects a specific rotor class.

**Context:**  
Slip factor varies by rotor class (E and F have higher slip). During auto-sizing the rotor class has not yet been selected, so there is no basis for applying a class-specific factor.

**Rationale:**  
Using `slip_factor = 1.0` gives a baseline performance estimate that is consistent across all candidates. Applying class-specific slip during filtering would bias results toward lower classes and potentially exclude pumps that would be perfectly valid at Class D.

**What was rejected:**  
Defaulting to Class D slip factors during auto-sizing. This would produce slightly more realistic estimates but would bake in an assumption about rotor class before the user has made that choice.

**Consequences:**  
- Auto-sizing results are slightly optimistic for Class E and F selections — duty RPM will be higher than the initial candidate estimate once a class is applied
- The `sizeOnly` flag in `calcResult()` implements this behavior and must be set correctly on all auto-sizing calls

---

### ADR-005 — Pump Candidate Ranking Targets 60% of Adjusted Max RPM

**Date:** Early 2026  
**Status:** Decided ✅  
**Deciders:** Development team

**Decision:**  
Auto-sizing ranks candidates by proximity to 60% of viscosity-adjusted maximum RPM (`| dutyRPM / adjMaxRPM − 0.60 |`), ascending. The pump closest to 60% utilization ranks first.

**Context:**  
A pump running at 100% of its speed limit has no headroom for viscosity variation, flow surges, or speed increases. A pump running too slowly may have metering stability issues.

**Rationale:**  
60% is an established rule-of-thumb operating point for positive displacement pumps — enough speed for stable flow metering, with meaningful headroom on both sides. It is sourced from the Unibloc Engineering Manual.

**What was rejected:**  
Ranking by smallest pump that fits (minimizes cost) or largest pump (maximizes headroom). Both produce less well-balanced operating points in practice.

**Consequences:**  
- A pump at exactly 60% adj. max RPM ranks above a larger pump that might be more suitable for future flow increases — engineers should review the full candidate list, not just the top result
- The 60% target is currently hardcoded; if the preferred operating point changes, it must be updated in `sizePumps()`

---

### ADR-006 — Reference Data Split into Separate MD Files

**Date:** April 2026  
**Status:** Decided ✅  
**Deciders:** Development team

**Decision:**  
Pump and product reference data (tables of values) is maintained in separate markdown files under `docs/data/` rather than inline in `DATA_MODEL.md`.

**Context:**  
The pump data tables are expected to change frequently during the first year of use as rotor class limits, slip factors, and rotor dimensions are confirmed with Unibloc engineering. Keeping mutable data in the same file as the schema definitions would create noisy git history and increase the risk of accidental schema edits.

**Rationale:**  
Separating schema (what fields exist and why) from data (what values those fields hold) makes each file easier to own, edit, and review. A non-developer updating a pressure limit only needs to open `LOBE_PUMPS.md` — they never need to touch `DATA_MODEL.md`.

**What was rejected:**  
Keeping all data inline in `DATA_MODEL.md` (original approach). Suitable for stable data but not for data under active revision.

**Consequences:**  
- Two sources of truth for pump data: the `data/*.md` files and the JS source constants. These must be kept in sync manually until a validation script or build step is added
- Any developer updating pump data must update both the markdown file and the source code

---

### ADR-007 — Friction Loss Results Are Informational Only

**Date:** Early 2026  
**Status:** Decided ✅  
**Deciders:** Development team

**Decision:**  
Friction loss calculations (suction and discharge pipe pressure drop) are displayed inline as reference values. They are not automatically added to the discharge pressure input.

**Context:**  
The friction loss calculator uses only simplified inputs (pipe diameter, length, static head). It does not account for fittings, valves, bends, or rough pipe surfaces. Its results are estimates, not precise values.

**Rationale:**  
Auto-adding an approximate friction loss to the sizing pressure would give a false sense of precision. The engineer must review the estimate and decide whether and how to incorporate it — that judgment call should not be made automatically by the tool.

**What was rejected:**  
Auto-adding friction loss to discharge pressure. This was considered but rejected because the Blasius correlation used is an approximation and does not include minor losses. An engineer might also want to apply only a portion of the calculated loss, or use a different value entirely.

**Consequences:**  
- Users must manually add friction loss to their discharge pressure input if they want it reflected in sizing
- This is a potential UX confusion point — the UI should make the informational nature of the results clear (currently relies on context)

---

## 2. Open

The following decisions are unresolved. Each is blocking a specific phase of development — see `ARCHITECTURE.md §9` for context. When a decision is made, move it to Section 1 and complete all fields.

---

### ADR-008 — Backend Language

**Status:** Open 🚧  
**Blocking:** Phase 2 (backend scaffolding)  
**Options under consideration:**

| Option | Pros | Cons |
|---|---|---|
| Node.js | Same language as frontend; large ecosystem; easy JSON handling | Less familiar to teams with Python background |
| Python | Strong data/engineering library ecosystem; widely known | Separate runtime from frontend; slightly more setup |

**Questions to answer before deciding:**
- Does the team have an existing preference or more experience with one language?
- Will the backend ever need engineering calculation capabilities (e.g. server-side sizing validation)? If so, Python's scientific libraries (NumPy, SciPy) become an argument.
- Is there an existing company infrastructure (servers, CI/CD) that favors one runtime?

---

### ADR-009 — Backend Framework

**Status:** Open 🚧  
**Blocking:** Phase 2 (backend scaffolding)  
**Depends on:** ADR-008 (Backend Language)

| If Node.js | Pros | Cons |
|---|---|---|
| Express | Minimal, widely known, easy to start | Unopinionated — requires more manual setup |
| Fastify | Faster, built-in schema validation | Less documentation and community resources |

| If Python | Pros | Cons |
|---|---|---|
| FastAPI | Modern, async, automatic OpenAPI docs, fast | Newer — smaller community than Django |
| Django REST Framework | Batteries-included, mature, admin UI built-in | Heavier; more overhead for a small API |

**Recommendation (if no strong preference):** FastAPI (Python) or Express (Node) — both are minimal, well-documented, and appropriate for a small internal API.

---

### ADR-010 — Database Engine

**Status:** Open 🚧  
**Blocking:** Phase 2 (backend scaffolding)

| Option | Pros | Cons |
|---|---|---|
| PostgreSQL | Robust, open source, excellent JSON support, widely hosted | Slightly more setup than SQLite |
| MySQL / MariaDB | Widely supported, familiar to many teams | Slightly less feature-rich than PostgreSQL |
| SQLite | Zero setup, single file, great for development | Not suitable for concurrent multi-user production use |

**Recommendation:** PostgreSQL for production. SQLite is acceptable for local development and early testing.

---

### ADR-011 — Hosting Environment

**Status:** Open 🚧  
**Blocking:** Phase 2 deployment  
**Options:** See `ARCHITECTURE.md §7` for a full breakdown of Options A, B, and C.

**Questions to answer before deciding:**
- Does the app need to be accessible outside the office / VPN?
- Is there existing company cloud infrastructure (AWS, Azure, GCP) to deploy into?
- Who will own server maintenance and uptime?

---

### ADR-012 — Authentication

**Status:** Open 🚧  
**Blocking:** Phase 2 design  
**Depends on:** ADR-011 (Hosting Environment)

| Option | Appropriate When |
|---|---|
| No auth (network-restricted) | App is only accessible on company network/VPN |
| Username / password | Simple internal user management; no SSO infrastructure |
| SSO / OAuth (Google, Azure AD) | Company already uses identity provider; preferred for low friction |

**Note:** If the app is hosted internally and accessible only over VPN (Option A from ADR-011), authentication may be optional in Phase 2. If the app is accessible from the public internet (Option B), authentication is required before launch.

---

### ADR-013 — Frontend Language (JS vs TypeScript)

**Status:** Open 🚧  
**Blocking:** Phase 1 (Vite migration)

| Option | Pros | Cons |
|---|---|---|
| JavaScript | Faster to start; no compilation step; familiar | No type safety; refactoring is riskier at scale |
| TypeScript | Catches errors at compile time; better IDE support; safer refactoring | Adds learning curve and config overhead |

**Recommendation:** TypeScript. The calculation engine in particular has many numeric inputs and outputs — type signatures on `calcResult()`, `getRC()`, and the pump objects would prevent a significant class of bugs. The upfront cost is low if adopted from the start of the Vite migration.

---

### ADR-014 — Frontend Styling Approach

**Status:** Open 🚧  
**Blocking:** Phase 1 (Vite migration)

| Option | Pros | Cons |
|---|---|---|
| Keep inline styles | No migration needed; already works | Verbose; hard to theme; no responsive utilities |
| Tailwind CSS | Utility-first; fast to write; consistent design tokens | Requires build config; learning curve |
| CSS Modules | Scoped styles; standard React approach | More boilerplate; no utility class system |

**Recommendation:** Tailwind CSS. The existing inline style system already uses a design token approach (the `B` color object) — Tailwind formalizes this pattern and adds responsive utilities. The migration cost is moderate but the long-term maintainability gain is high.

---

### ADR-015 — State Management

**Status:** Open 🚧  
**Blocking:** Phase 2 (async data from backend)  
**Note:** This decision can wait until after the Vite migration. The current prop-drilling approach works fine for the synchronous single-page prototype.

| Option | Appropriate When |
|---|---|
| Props (keep current) | App remains small; no async global state needed |
| React Context | Moderate complexity; team prefers no external dependencies |
| Zustand | Async state, multiple components reading the same data; minimal boilerplate |

**Trigger for revisiting:** When the Applications tab starts fetching data from the backend, the current pattern of lifting state to `App` and passing through props becomes unwieldy. That is the right time to introduce a store.

---

### ADR-016 — Sizing ID Format

**Status:** Open 🚧  
**Blocking:** Phase 2 (database schema)

The current format `UNI-YYYYMMDD-XXXX` uses a random 4-digit suffix. This is adequate for a printable label but is not suitable as a database primary key (collision risk, no uniqueness guarantee).

| Option | Pros | Cons |
|---|---|---|
| Keep current format as-is | No change needed | Collisions possible; unsuitable as DB PK |
| Sequential integer (`UNI-00001`) | Human-readable; unambiguous ordering | Requires coordination; exposes record count |
| UUID v4 | Universally unique; no coordination | Not human-friendly as a display label |
| Hybrid: `UNI-YYYYMMDD-` prefix + short UUID | Human context preserved; unique | Slightly long for a label |

**Recommendation:** Use a UUID v4 as the database primary key. Keep a separate, human-readable `display_id` column using the current `UNI-YYYYMMDD-XXXX` format (or sequential) for the datasheet label. This separates the concerns of uniqueness (DB) and readability (UI).

---

### ADR-017 — Pump Data Ownership (Frontend vs. Database)

**Status:** Open 🚧  
**Blocking:** Phase 4 (data management)  
**Note:** This decision does not need to be made until Phase 4. Keep pump data as static frontend files until a clear need emerges.

**Trigger for moving pump data to the database:** A non-developer (e.g. product manager, applications engineer) needs to add or update pump data without touching source code or asking a developer.

| Option | Appropriate When |
|---|---|
| Static frontend files (current) | Developers own data updates; update frequency is low-to-moderate |
| Database-managed with admin UI | Non-developers need to manage data; update frequency is high |

**Note:** The `data/*.md` files in this repo already serve as a non-developer-readable reference. If the update workflow is "engineer edits MD file → developer mirrors change to JS" and that remains manageable, there is no urgency to move pump data to the database.
