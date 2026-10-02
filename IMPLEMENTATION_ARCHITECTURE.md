# IMPLEMENTATION ARCHITECTURE
## The Daily Ledger

**`IMPLEMENTATION ARCHITECTURE v1 — LOCKED FOR IMPLEMENTATION`**

This document outlines the concrete engineering architecture for implementing The Daily Ledger. It translates the locked game design and Software Requirements Specification (SRS) into a scalable, server-authoritative implementation plan.

---

## 1. Engineering Architecture Overview
The Daily Ledger will be implemented as a server-authoritative, browser-first multiplayer application. The architecture enforces a strict separation of concerns:
*   **Clients** act as renderers and intent dispatchers.
*   **The Game Server** holds the canonical state and synchronizes it to clients.
*   **The Pure Game Core** is an isolated, framework-agnostic rules engine responsible for validating intents and mutating state deterministically.
*   **The Database** provides persistent storage for long-term data (users, match history, event logs) but does not act as the real-time state authority.

## 2. Technology Decisions
The following stack is selected to provide a robust, TypeScript-native developer experience:
*   **Frontend:** Next.js + React + TypeScript.
*   **Realtime Multiplayer:** Colyseus (authoritative rooms/state synchronization).
*   **Persistence:** PostgreSQL.
*   **Database Layer:** Drizzle ORM.
*   **Testing:** Vitest (for rules/unit/integration) and Playwright (for browser/e2e tests).
*   **Board Rendering:** React DOM / CSS / SVG. No heavy canvas game engine (Phaser/PixiJS) is required because the game's primary interactions are deeply UI-driven.

## 3. Repository Structure
The repository structure cleanly separates data, core logic, server, and client:

```text
/
├── apps/
│   ├── web/                  # Next.js frontend
│   └── server/               # Colyseus server
│
├── packages/
│   ├── game-core/            # Pure TypeScript rules/state/turn engine/formulas
│   ├── game-data/            # Static Velora City game definitions
│   └── db/                   # Drizzle schemas/migrations
│
├── tests/                    # Cross-package/integration test support if required
├── docs/                     # Documentation
├── UI_REFERENCE/
├── package.json
└── ...
```

**Package Responsibilities:**
*   `game-data`: Static game content (board definitions, 40 board spaces, 24 property definitions, districts, sectors, development catalogue, flagships, market pulse definitions, news templates).
*   `game-core`: Game rules and behavior. Does not contain React, Colyseus, or PostgreSQL APIs.

## 4. Frontend Architecture
The React frontend (`apps/web`) is responsible exclusively for presentation and dispatching intents. It does not predict or speculatively execute dice rolls, market pulses, or turn outcomes. It only updates its visual state when the server pushes a synchronized state update or private message.

## 5. Game Server Architecture
The Node.js/Colyseus server (`apps/server`) manages multiplayer networking, authoritative runtime, private state handling, intent routing, and persistence boundaries.

## 6. Pure Game Core Architecture
The `game-core` package is completely framework-agnostic.
*   **Dependency Flow:** `game-data` (Static Definitions) → `game-core` (Rules, State, Turn Engine, Formulas, Actions, Randomness Interfaces) → `server` (Colyseus Runtime) → `web` (Renderer/Dispatcher).
*   No React, Colyseus, PostgreSQL code, or browser APIs are allowed inside `game-core`.

## 7. Explicit State Visibility Architecture
The architecture mandates an explicit boundary between different types of state:

*   **PUBLIC SYNCHRONIZED STATE:** Synchronized to all clients. Contains board positions, player cash, property ownership, public development state, public market indices, public district control, public news, public Telegraph Wire entries, current turn state, and legally visible public auction state.
*   **PRIVATE PLAYER STATE:** Delivered only to the entitled player. Contains the next unresolved Market Pulse revealed through Velora Bourse, player-specific private information, and any future explicitly authorized private info.
*   **SERVER ONLY STATE:** Never synchronized to clients. Contains the unrevealed Market Pulse deck/order, server randomness state, sealed auction bids before resolution, private server audit information, and internal validation data.

**PRIVATE PLAYER STATE MUST NEVER BE EMBEDDED IN THE PUBLIC SYNCHRONIZED GAME STATE.**
**SERVER ONLY STATE MUST NEVER BE SYNCHRONIZED TO CLIENTS.**
The client must never be able to infer private information merely because it exists somewhere inside a shared state object.

## 8. Game State Model
Explicitly mapped from the SRS, the state is categorized strictly by visibility:

**PUBLIC:**
*   Game status (INIT, IN_PROGRESS, ENDED, FINAL_ROUND_FREEZE), current round, turn state.
*   Player public state (cash, position, status, LOCKED).
*   Board configuration and Property ownership.
*   District state and public Market state (6 sector indices, active disruption).
*   Public Development supply.
*   Public News / Telegraph Wire.
*   Public Auction resolution state.

**PRIVATE:**
*   Player-specific private information.
*   Velora Bourse inspection result.

**SERVER ONLY:**
*   Unrevealed Market Pulse deck.
*   Sealed auction bids before resolution.
*   Authoritative randomness state.
*   Server audit information / internal validation state.

## 9. Intent / Action Model
The architecture distinguishes **PLAYER INTENT** from **AUTHORITATIVE STATE TRANSITION**.

**Client Intents:**
`ROLL_DICE`, `BUY_PROPERTY`, `PASS_PROPERTY`, `SUBMIT_AUCTION_BID`, `BUILD_DEVELOPMENT`, `TRADE_PROPOSE`, `TRADE_COUNTER`, `TRADE_ACCEPT`, `TRADE_REJECT`, `ACCEPT_LIQUIDITY_TRADE`, `LIQUIDATE_PROPERTY`, `LIQUIDATE_DEVELOPMENT`, `USE_TRANSPORT`, `CLAIM_TREASURY`, `INSPECT_PROPERTY`.

**State Transitions (Server-driven events):**
`APPLY_RENT_OBLIGATION`, `TRIGGER_LIQUIDITY_WINDOW`, `ELIMINATE_PLAYER`, `ACTIVATE_CIVIC_RESERVE`, `REVEAL_MARKET_PULSE`.

## 10. State Transition Model
`State(n+1) = RulesEngine.process(State(n), Intent, RandomSource)`
Invalid intents simply return an error event without mutating state.

## 11. Multiplayer Synchronization Model
The pipeline is strictly one-way:
**Client** → **Intent** → **Colyseus Server** → **Rules Engine** → **State Mutation** → **Public Event / Private Event** → **Public State Sync and/or Private Response** → **Client Render**.

**Authoritative Restrictions:**
*   Clients never mutate authoritative state directly.
*   Clients never generate authoritative dice.
*   Clients never resolve market pulses.
*   Clients never determine rent.
*   Clients never determine Treasury eligibility.
*   Clients never determine Civic Reserve state.
*   Clients never resolve Transport.
*   Clients never enforce Civic Hold.
*   Clients never resolve auctions.
*   Clients never determine final wealth.

## 12. Turn Engine Sequence Mapping
The core turn loop strictly enforces the SRS sequence:
`MOVE → IDENTIFY_SPACE → CHECK_FOR_FORCED_STATE → RESOLVE_PROPERTY_OR_SPECIAL_SPACE → RESOLVE_MANDATORY_PAYMENT → OPTIONAL_ACTIONS → END_TURN`

## 13. Room Lifecycle
Colyseus maps one Room to one game match (2-4 players). Lobby → Join (assign bots) → Start → Execute → EndGame → Dispose.

## 14. Persistence Architecture
*   **LIVE MATCH STATE:** Held entirely in memory by the authoritative Colyseus Room.
*   **POSTGRESQL:** Persistence for users, completed match summaries, and finalized public event history.

**MVP crash recovery is NOT a gameplay requirement.** Do NOT require PostgreSQL reads/writes during normal realtime turn execution. If the authoritative process fails before a match is persisted, the active in-memory match may be lost. Future crash recovery/snapshots/event sourcing may be added later without changing the game rules.

## 15. Event Log Architecture
The Event Log is separated into three conceptual streams:

**PUBLIC EVENT LOG:**
*   Authoritative public events.
*   Drives the Telegraph Wire.
*   Suitable for public match replay/history.
*   Contains only information legally visible to all players.

**PRIVATE EVENT STREAM:**
*   Player-specific information (e.g., Velora Bourse info).
*   Delivered only to the entitled player.
*   Never exposed through the public Telegraph Wire.

**SERVER AUDIT LOG:**
*   Internal debugging, security, and reconstruction information.
*   Includes rejected intents and server diagnostics.
*   Never synchronized to clients.

*Not every internal state transition becomes a Telegraph Wire entry.* For example, `SUBMIT_AUCTION_BID` must not expose a sealed bid before resolution. `AUCTION_RESOLVED` may produce a public event. Private Bourse inspections do not enter the Telegraph Wire.

## 16. Deterministic Randomness Architecture
Randomness must be explicitly injectable into the rules engine:
`State(n+1) = RulesEngine.process(State(n), Intent, RandomSource)`

**RandomSource Abstraction:**
*   `ProductionRandomSource`: Secure server-authoritative randomness for real matches.
*   `DeterministicTestRandomSource`: Allows tests to provide predetermined outcomes (e.g., predetermined dice results, predetermined market pulses, deterministic auction tie resolution).

**GAME RULES MUST NOT DIRECTLY CALL GLOBAL RANDOMNESS.** Randomness must enter the rules engine through an explicit dependency for testing and debugging.

## 17. Shared Types
The `game-core` package exports framework-agnostic TypeScript interfaces used by Client and Server, maintaining consistency without tight coupling.

## 18. Data Ownership
Public data is broadcast in the Room state. Private data (Bourse predictions) is pushed individually via direct client messaging or heavily filtered schemas to prevent memory sniffing.

## 19. Error Handling
Invalid intents generate Private Events containing the rejection reason. System errors are caught and logged to the Server Audit Log.

## 20. Reconnection Strategy
Clients reconnect natively via Colyseus and receive the full current state. Disconnect timeouts and exact bot-takeover timings are implementation decisions left to the engineering team.

## 21. Bot Architecture
Bots are simulated via server-side controllers that evaluate the current public GameState (plus their private data) and dispatch valid Intents directly to the Rules Engine.

## 22. Testing Architecture
Tests must construct scenarios using:
`Initial State + Intent + Deterministic RandomSource`
and explicitly assert:
`Expected State + Expected Public Events + Expected Private Events`

**Information Isolation Testing:**
*   Private Bourse information is not present in public state.
*   Sealed auction bids are not synchronized before resolution.
*   Private events do not enter Telegraph Wire.
*   Server-only state is never exposed to clients.

## 23. Development Environment
Node.js (LTS), npm workspaces, and Docker (for PostgreSQL).

## 24. Local Development Workflow
Run frontend (Next.js) and backend (Colyseus) concurrently via workspace scripts, supporting full HMR.

## 25. Deployment Architecture
Frontend on Vercel/Static CDN. Backend on Node-compatible PaaS (Render/Fargate). Database on RDS/Supabase.

## 26. Security / Anti Cheat Boundary
Sealed auction bids and unrevealed pulse decks are STRICTLY SERVER-ONLY until legally resolved by the rules engine.

## 27. Performance Considerations
Low tick rates and delta-syncing fit the fundamentally turn-based gameplay without requiring high-throughput continuous state broadcasts.

## 28. Platform Independence & Steam Readiness
The implementation architecture establishes that the game must remain **platform agnostic at the rules and protocol layers**. The same multiplayer protocol and shared contracts must conceptually support:

```text
Browser Client
Steam/Desktop Client
Future Client
        ↓
Authoritative Game Server
        ↓
Game Core
```

*   **Game Core (`packages/game-core`)**: Must not depend on React, Next.js, browser APIs, DOM, CSS, Canvas, Steam APIs, Steamworks, Colyseus, PostgreSQL, Drizzle, or any platform-specific APIs. It operates exclusively on explicit inputs, authoritative state, deterministic/injectable randomness, and domain actions.
*   **Game Data (`packages/game-data`)**: Contains static game definitions and configuration required by the rules. It must not depend on presentation or platform APIs.
*   **Shared Contracts**: Shared types and protocol contracts must remain platform neutral.
*   **Web Client**: The React/Next.js client is strictly a presentation layer. It must not become the owner of game rules.
*   **Steam/Desktop Integration**: Future Steam support is treated as a **platform integration layer**, not as a modification to the game core. Future integrations (Steam authentication, lobbies, friends/invites, achievements, overlay, cloud saves, presence, or networking) are platform concerns and must not be embedded into the rules engine. No specific desktop technology (Electron, Tauri, Steamworks SDK) is chosen yet; the architecture simply guarantees that introducing such a layer later does not require rewriting the game rules.

## 29. Implementation Order
**PHASE 1: Authoritative Game Kernel**
*   Monorepo foundation, `game-data` package, `game-core` package.
*   GameState public/private/server boundaries.
*   Turn State Machine.
*   Deterministic `RandomSource` abstraction.
*   Basic authoritative kernel tests.
*(Do NOT introduce React or Colyseus into Phase 1 game rules).*

**PHASE 2:** Property + Economy
**PHASE 3:** Development + District
**PHASE 4:** Market
**PHASE 5:** Special Spaces
**PHASE 6:** News
**PHASE 7:** Trading + Auctions
**PHASE 8:** Flagships + Endgame
**PHASE 9:** Bots
**PHASE 10:** Testing / Balance
**PHASE 11:** UI Polish

## 30. Engineering Decisions Still Open
*   Disconnect timeout length before bot takeover / elimination.
*   Advanced bot trading heuristics and evaluation thresholds.
*   Horizontal scaling architecture for Colyseus (if Redis is required at MVP scale).

## 31. Formulas
Formulas exist as pure, deterministic functions in `game-core`:
*   `PRE-DISTRICT CURRENT YIELD = Base Yield × (1.0 + (0.50 × Num_Primary_Cashflow) + (0.35 × Num_Secondary_Cashflow)) × Market Yield Modifier`
*   `FINAL CURRENT YIELD = Pre-District Current Yield × (1.0 + District_Control_Modifier + Network_Modifier)`

## 32. Architectural Invariants
1. The server is authoritative.
2. `game-core` is framework agnostic.
3. Clients dispatch intents; clients do not mutate game state.
4. Public state may be synchronized.
5. Private player state is delivered only to the entitled player.
6. Server-only state is never synchronized.
7. Private information never enters the public Telegraph Wire.
8. Sealed auction bids remain private until resolution.
9. Game rules never directly call global randomness.
10. PostgreSQL is not the realtime match authority.
11. Gameplay mechanics remain defined by the locked design documents and SRS.
12. Implementation architecture must not introduce new gameplay mechanics.
13. **Platform Independence Invariant:** Game rules, game state transitions, game data, and shared multiplayer contracts must not depend on browser, desktop, Steam, or rendering APIs.
