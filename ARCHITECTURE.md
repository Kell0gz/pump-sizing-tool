# ARCHITECTURE.md
## Unibloc Pump Sizing Tool — Architecture Reference

> **Last updated:** April 2026  
> **Status:** This document covers both the current prototype state and the intended target architecture. Sections marked 🔮 describe future planned state. Sections marked 🚧 cover decisions still to be made.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Current State — Single-File Prototype](#2-current-state--single-file-prototype)
3. [Target State — React Project + Backend](#3-target-state--react-project--backend)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture (Planned)](#5-backend-architecture-planned)
6. [Data Flow](#6-data-flow)
7. [Hosting & Deployment](#7-hosting--deployment)
8. [Migration Path: Prototype → Production](#8-migration-path-prototype--production)
9. [Open Decisions](#9-open-decisions)

---

## 1. System Overview

The Unibloc Pump Sizing Tool is an internal engineering tool used by Unibloc sales and applications engineers to size hygienic pumps (lobe and gear) for customer applications. It performs all calculations client-side and generates a printable datasheet.

### Current Capabilities
- Pump sizing calculations (slip, duty RPM, BHP, K factor, friction loss, shear stress)
- Manual and auto-recommendation sizing modes
- Pump configuration selection
- Printable application datasheet with a generated Sizing ID
- Engineering knowledge base

### Planned Capabilities 🔮
- Persistent storage of completed sizings (Applications tab)
- Search and filter saved records by customer, pump model, quote number
- Backend API serving pump data and storing sizing records
- User authentication (scope TBD)

---

## 2. Current State — Single-File Prototype

### Stack

| Layer | Technology | Notes |
|---|---|---|
| UI Framework | React 18 | Loaded from CDN (`cdnjs.cloudflare.com`) |
| Transpilation | Babel Standalone | In-browser JSX transpilation — not for production |
| Styling | Inline styles (JS objects) | No CSS framework or stylesheet |
| State | React `useState` / `useMemo` | Component-local, no global state manager |
| Data | Hardcoded JS constants | Pump DB, product DB, KB articles all in-file |
| Storage | None | All state lost on page refresh |
| Build | None | Single HTML file, no build step |
| Deployment | File distribution | Shared as a `.html` file — opened directly in a browser |

### File Structure

```
pump_sizing_html_v4.html     ← entire application in one file
```

Everything — data, logic, components, styles — lives in this single file. There is no build process, no package management, and no external dependencies beyond the three CDN scripts loaded in `<head>`.

### Key Constraints of Current State

- **No persistence:** Closing or refreshing the tab loses all work. The Sizing ID is generated but never saved anywhere.
- **In-browser Babel:** Transpiling JSX in the browser is slow on first load and is explicitly not recommended for production use.
- **No module system:** All functions and constants share a single global scope. Name collisions are a growing risk as the file grows.
- **CDN dependency:** The app requires internet access to load React and Babel from CDN. It will not work offline unless those scripts are bundled locally.
- **No API layer:** Pump data and KB articles cannot be updated without editing the HTML file and redistributing it.

---

## 3. Target State — React Project + Backend

### Stack

| Layer | Technology | Decision Status |
|---|---|---|
| Frontend framework | React (Vite project) | ✅ Decided |
| Frontend language | JavaScript or TypeScript | 🚧 Not decided |
| Styling | TBD | 🚧 Not decided — inline styles, Tailwind, or CSS modules all viable |
| State management | TBD | 🚧 Not decided — likely React Context or Zustand given app size |
| Backend runtime | Node.js or Python | ✅ Decided (one of these) |
| Backend framework | TBD | 🚧 Not decided — Express/Fastify (Node) or FastAPI/Django (Python) |
| Database | SQL (relational) | ✅ Decided |
| Database engine | TBD | 🚧 Not decided — PostgreSQL recommended |
| ORM / query layer | TBD | 🚧 Not decided |
| Authentication | TBD | 🚧 Not decided — scope (who can access) not yet defined |
| Hosting | TBD | 🚧 Not decided — see Section 7 |

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│                                                  │
│   ┌──────────────────────────────────────────┐  │
│   │         React App (Vite build)           │  │
│   │                                          │  │
│   │  ┌──────────┐  ┌──────────┐  ┌───────┐  │  │
│   │  │  Sizing  │  │ Config / │  │  KB   │  │  │
│   │  │   Page   │  │Datasheet │  │ Page  │  │  │
│   │  └──────────┘  └──────────┘  └───────┘  │  │
│   │                                          │  │
│   │  ┌────────────────────────────────────┐  │  │
│   │  │     Applications Page              │  │  │
│   │  │   (reads/writes via API)           │  │  │
│   │  └────────────────────────────────────┘  │  │
│   │                                          │  │
│   │  Calculation engine (pure JS functions)  │  │
│   │  Pump / product data (static imports)    │  │
│   └──────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────┘
                         │ HTTPS (REST or similar)
┌────────────────────────▼────────────────────────┐
│                  Backend API                     │
│           (Node.js or Python)                    │
│                                                  │
│   POST /sizings      ← save a completed sizing   │
│   GET  /sizings      ← list saved sizings        │
│   GET  /sizings/:id  ← retrieve one sizing       │
│                                                  │
└────────────────────────┬────────────────────────┘
                         │
┌────────────────────────▼────────────────────────┐
│                SQL Database                      │
│                                                  │
│   sizings table  ← see DATA_MODEL.md §13         │
│   (pump & product data stays in frontend         │
│    until a data-management need emerges)         │
└─────────────────────────────────────────────────┘
```

---

## 4. Frontend Architecture

### Component Structure (Target)

The current single-file structure maps naturally to this component tree:

```
App
├── Nav
├── SizingPage
│   ├── ProcessInputsCard
│   │   ├── UnitToggle
│   │   └── PumpTypeFilter
│   ├── ManualModePanel
│   │   ├── PumpModelSelect
│   │   └── RotorClassSelector
│   ├── AdvancedOptionsPanel
│   │   ├── ProductDatabase
│   │   └── FrictionLossCalculator
│   ├── ResultsCard
│   │   ├── CandidateChips          (recommend mode)
│   │   ├── RotorClassSelector      (recommend mode)
│   │   ├── WarningBanner
│   │   └── ResultsPanel
│   │       └── PumpCurve
│   └── RecommendationsTiles
├── ConfigPage
├── DatasheetPage
│   └── PumpCurve
├── KnowledgePage
└── ApplicationsPage
```

### Calculation Engine

All engineering calculations are **pure functions** with no side effects. They currently live inline in the HTML file but should be extracted to a dedicated module:

```
src/
└── lib/
    └── calculations.js    ← getK, adjPressure, getSlipRPM, calcResult,
                              sizePumps, calcFric, calcShear, unit converters
```

These functions have no React dependency and can be unit tested independently. This is the highest-value extraction from the single-file prototype.

### Static Data

Pump databases, rotor limits, slip equations, and product lists should move to static data files:

```
src/
└── data/
    ├── lobePumps.js       ← LOBE_PUMPS, PUMP_ROTOR_LIMITS, PUMP_SLIP_EF, ROTOR_DIMS
    ├── gearPumps.js       ← GEAR_PUMPS, GEAR_LIMITS
    ├── products.js        ← PRODUCT_DB
    └── knowledgeBase.js   ← KB_ARTICLES
```

> **Important:** The JS data files are the source of truth for the running app. The `data/*.md` files in this repo are the human-readable reference. Whenever a data value changes, **both** must be updated. Consider a future build step or validation script to keep them in sync.

### State Management

The current app uses `useState` lifted to the `App` root component and passed down via props. This works for the current scope. For the production build, evaluate whether this remains manageable or if a lightweight global store (React Context or Zustand) is warranted — particularly once the Applications tab introduces async data fetching.

Recommended decision point: **after the Vite migration, before adding the backend.**

---

## 5. Backend Architecture (Planned) 🔮

### Responsibility Split

The backend is intentionally narrow in scope. All engineering calculations stay in the frontend — the backend only handles persistence and retrieval of completed sizings.

| Concern | Lives In | Rationale |
|---|---|---|
| Sizing calculations | Frontend | Pure math — no benefit to server-side execution; avoids round-trips |
| Pump & product data | Frontend (static import) | Read-only reference data; no multi-user update conflicts |
| KB articles | Frontend (static import) | Same as above |
| Saving sizing records | Backend API | Requires persistence and shared access |
| Listing / searching sizings | Backend API | Requires querying across records |
| Authentication | Backend API | If required, handled at API layer |

### Proposed API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/sizings` | Save a completed sizing record |
| `GET` | `/api/sizings` | List all sizings (with optional filter params) |
| `GET` | `/api/sizings/:id` | Retrieve a single sizing by Sizing ID |
| `PUT` | `/api/sizings/:id` | Update an existing sizing (if editing is supported) |
| `DELETE` | `/api/sizings/:id` | Soft-delete a sizing record |

Filter params for `GET /api/sizings` (proposed):

| Param | Type | Description |
|---|---|---|
| `customer` | string | Partial match on customer name |
| `quote` | string | Partial match on quote number |
| `pump` | string | Exact match on pump model name |
| `from` | date | Created after this date |
| `to` | date | Created before this date |

### Database Schema

The core table is the `sizings` record. See **`DATA_MODEL.md` Section 13** for the full proposed field list.

Additional tables to consider at design time:
- `users` — if authentication is added
- `pump_models` — if pump data moves server-side for admin management
- `products` — same as above

> **Recommendation:** Start with pump and product data as static frontend files. Only move them to the database if a non-developer needs to manage them (e.g. a product manager updating viscosity values). That use case likely arrives within the first year — plan the schema now even if you don't build it yet.

### Sizing ID

The current format (`UNI-YYYYMMDD-XXXX`) uses a random 4-digit suffix with no uniqueness guarantee. Before implementing the database, adopt one of:

- **Sequential integer ID** — simple, human-readable (`UNI-00001`, `UNI-00002`)
- **UUID v4** — universally unique, no coordination needed, less readable
- **Hybrid** — keep the `UNI-YYYYMMDD-` prefix for human context, append a short UUID segment

The current format can be preserved as a display label while using a proper UUID as the database primary key.

---

## 6. Data Flow

### Sizing Calculation Flow (Current & Future Frontend)

```
User Input (flow, pressure, viscosity, temp)
        │
        ▼
toInternal()          ← convert SI → US if needed
        │
        ▼
adjPressure()         ← viscosity correction on pressure
getK()                ← K factor from viscosity
        │
        ▼
getSlipRPM()          ← per-pump quadratic slip equation
        │
        ▼
calcResult()          ← assembles: dutyRPM, adjMaxRPM, BHP, kW, warnings
        │
        ▼
ResultsPanel          ← display; toDisplay() converts back to SI if needed
        │
        ▼
[User clicks Configure This Pump →]
        │
        ▼
ConfigPage            ← user selects options; config object built
        │
        ▼
[User clicks Confirm & Generate Datasheet]
        │
        ▼
generateSizingId()    ← UNI-YYYYMMDD-XXXX
DatasheetPage         ← renders printable output
        │
        ▼ 🔮 (future)
POST /api/sizings     ← persists to database
```

### Applications Tab Data Flow (Future) 🔮

```
ApplicationsPage mounts
        │
        ▼
GET /api/sizings       ← fetch list (with optional filters)
        │
        ▼
Render sizing records table
        │
        ▼
User clicks a record
        │
        ▼
GET /api/sizings/:id   ← fetch full record
        │
        ▼
Render datasheet view (read-only)
```

---

## 7. Hosting & Deployment

🚧 **Not yet decided.** The following options are under consideration:

### Option A — Internal Hosted Web App
- Deployed to a company server or cloud VM (AWS, Azure, GCP, DigitalOcean)
- Access via browser on company network or VPN
- Pros: Easy to update, no installation, works on any device
- Cons: Requires always-on server; needs network access

### Option B — Authenticated Public Web App
- Same as Option A but accessible from any internet connection
- Requires authentication (login) to prevent public access
- Pros: Accessible from customer sites, trade shows, remote work
- Cons: Higher security surface; auth layer adds complexity

### Option C — Local / Offline Deployment
- Packaged as a desktop app (Electron) or served from a local server
- Pros: No internet dependency; works in facilities with restricted networks
- Cons: Requires installation and updates per machine; harder to maintain

### Recommendation
Given that the app is currently distributed as a single HTML file and the team is small, **Option A (internal hosted)** is the natural next step. It requires the least infrastructure change while enabling the backend database. Option B can be layered on later if remote access becomes a requirement.

---

## 8. Migration Path: Prototype → Production

The migration from the current single HTML file to a proper React project should be done incrementally. Suggested sequence:

### Phase 1 — Vite Project Setup (no behavior change)
- Scaffold a new Vite + React project
- Extract calculation functions to `src/lib/calculations.js` — **add unit tests at this point**
- Extract static data to `src/data/` files
- Migrate components one page at a time, starting with the simplest (Knowledge Base, Applications placeholder)
- Migrate inline styles to CSS modules or Tailwind (team decision)
- **Deliverable:** Identical app behavior, now with a build pipeline and testable calc layer

### Phase 2 — Backend Scaffolding
- Stand up the API server (Node or Python)
- Create the `sizings` database table
- Implement `POST /api/sizings` and wire it to the "Confirm & Generate Datasheet" button
- Implement `GET /api/sizings` and begin building the Applications page
- **Deliverable:** Sizings are saved and retrievable; Applications tab shows real data

### Phase 3 — Applications Tab Completion
- Add search and filter to `GET /api/sizings`
- Build the Applications page list/detail UI
- Add datasheet re-print from saved record
- **Deliverable:** Full sizing record lifecycle

### Phase 4 — Data Management (if needed)
- Evaluate whether pump/product data needs to move to the database
- If yes: admin interface or migration scripts to move `src/data/` content to DB tables
- **Deliverable:** Non-developer pump data management

---

## 9. Open Decisions

These decisions need to be made before or during Phase 1/2. Capture the outcome in `DECISIONS.md` once resolved.

| # | Decision | Options | Blocking What |
|---|---|---|---|
| 1 | Backend language | Node.js or Python | Phase 2 start |
| 2 | Backend framework | Express / Fastify (Node) or FastAPI / Django (Python) | Phase 2 start |
| 3 | Database engine | PostgreSQL (recommended), MySQL, SQLite | Phase 2 start |
| 4 | Hosting environment | Internal server, cloud VM, managed PaaS | Phase 2 deployment |
| 5 | Authentication | None (network-restricted), SSO, username/password | Phase 2 design |
| 6 | Frontend language | JavaScript or TypeScript | Phase 1 start |
| 7 | Styling approach | Inline styles (keep), Tailwind, CSS modules | Phase 1 start |
| 8 | State management | Props drilling (keep), React Context, Zustand | Phase 2 (async data) |
| 9 | Sizing ID format | Random suffix (keep), sequential, UUID | Phase 2 start |
| 10 | Pump data ownership | Static frontend files (keep) vs. database-managed | Phase 4 trigger |
