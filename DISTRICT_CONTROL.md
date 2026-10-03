# District Control

> **DEVELOPMENT SYSTEM v1.1 — COMPATIBILITY AND NETWORK AMENDMENT**
> Network eligibility is now strictly governed by the authoritative Network Registry defined in `DEVELOPMENT_SYSTEM.md`.
 System v1

## Status
LOCKED FOR GAME DESIGN

## 1. Purpose
District Control exists to create a simple ownership race across Velora City's six property districts. It determines how much of a district a player controls and what that ownership unlocks. The system provides ownership progression, development progression, competition between players, eventual access to a district Flagship, and a small connection between property ownership and city identity. The system remains lightweight, playable, and understandable within seconds. It does not turn Velora City into a second strategy or management game.

## 2. Core Principle
The entire system is understandable as:
*   **1/4 PRESENCE:** "You've entered."
*   **2/4 ESTABLISHED:** "First development slot."
*   **3/4 MAJORITY:** "Second development slot."
*   **4/4 CONTROL:** "+5% yield, network eligibility, flagship eligibility."

## 3. District Structure
The board contains six property districts, each containing exactly four properties.
The authoritative district identities are:
1. Old Quarter
2. Exchange District
3. Riverfront
4. Ironworks
5. North Heights
6. West Aerodrome

## 4. District Progression
The central mechanic is ownership count. Each player can have:
*   **0/4:** NO PRESENCE
*   **1/4:** PRESENCE
*   **2/4:** ESTABLISHED
*   **3/4:** MAJORITY
*   **4/4:** CONTROL

## 5. Presence (1/4)
Owning one property establishes District Presence.
*   **Gameplay effect:** None.
Presence simply means the player has entered the district and started competing for it.

## 6. Established (2/4)
Owning two of the four properties establishes the player in the district.
*   **Gameplay effect:** The player's eligible properties in that district unlock their **FIRST standard development slot**.
*(Note: Owning 2/4 does not automatically build anything. The player still needs an eligible property, an available development project, and sufficient cash, as defined in `DEVELOPMENT_SYSTEM.md`.)*

## 7. Majority (3/4)
Owning three of four properties establishes District Majority.
*   **Gameplay effect:** The player's eligible properties in that district unlock their **SECOND standard development slot**.
The additional development access is already a meaningful advantage; no additional numerical bonus is added here.

## 8. District Control (4/4)
Owning all four properties establishes District Control.
District Control unlocks:
1.  **Flagship eligibility**
2.  **Development Network eligibility**
3.  **District Control Yield Modifier:** +5% Current Yield

The +5% yield modifier applies only to properties owned by the player within that controlled district. It is intentionally modest to avoid creating a large rent multiplier or snowball mechanism.

## 9. Development Network
A controlled district may have **ONE** active Development Network.

A Development Network requires:
*   The player controls the district (4/4).
*   Compatible development families exist across at least two properties in that district. The families must perfectly match one of the 8 explicit combinations in the Authoritative Network Registry (see `DEVELOPMENT_SYSTEM.md`).

*   **Gameplay effect:** The active network provides an additional **+5% Current Yield** to the participating properties.

A district can have **AT MOST ONE** active Development Network. There are no network levels, points, currencies, XP, skill trees, or multiple simultaneous networks.

## 10. Ownership Changes
District ownership can change through normal acquisition or future trading. District state must update immediately whenever ownership changes.

If a player loses Control (e.g., drops from 4/4 to 3/4):
*   The +5% District Control bonus is immediately removed.
*   The Development Network becomes inactive if requirements are no longer satisfied.
*   **Existing standard developments are NOT destroyed** simply because district control was lost.
*   **Completed Flagships are NOT automatically removed.** A completed Flagship remains attached to its property.

## 11. Flagship Eligibility
District Control (4/4) makes a player eligible to pursue a district Flagship.
*   Only ONE primary Flagship should normally exist in a controlled district.
*   Flagship is the highest visible property state.
*   A Flagship remains attached to the property if ownership later changes.

*(The exact Flagship cost, construction mechanics, final effects, and balance are deferred to a future Flagship/Endgame design pass. This document establishes only the eligibility requirements.)*

## 12. Market Integration
Do not create a second market system. `MARKET_SYSTEM.md` remains authoritative for Sector Index, Market Value, Yield, Market shocks, and Resilience.

District Control only contributes the defined District Modifiers.
Conceptually:
`BASE YIELD → DEVELOPMENT → MARKET → DISTRICT → CURRENT YIELD`

*(Maximum district-specific yield advantage = +5% Control + +5% Network = +10%, applied before other mechanics.)*

## 13. News Integration
`NEWS_SYSTEM.md` supports district milestones as meaningful Ledger stories. District Control should expose simple events to the News layer (e.g., *"UTKARSH ESTABLISHES A FOOTHOLD IN EXCHANGE DISTRICT"*). News remains responsible for presentation; no separate District News mechanics are created here.

## 14. UI Representation
The board remains the primary game surface. Do NOT create a permanent district dashboard.

District status should be visible through compact visual indicators on the board:
`EXCHANGE DISTRICT | ● ● ○ ○ | UTKARSH 2/4`

Hover/contextual information may show deeper status:
```text
EXCHANGE DISTRICT
UTKARSH  2/4
VANE     1/4
RAVI     1/4
ESTABLISHED: First development unlocked
```
For a controlled district:
```text
EXCHANGE DISTRICT
UTKARSH 4/4
DISTRICT CONTROL: +5% CURRENT YIELD
FLAGSHIP AVAILABLE
```

## 15. Gameplay Examples
*   **Player A** owns 2 properties (Established, Slot 1 open). **Player B** owns 1 property. If Player B buys another property, they both become Established (2/4). Ownership itself is the competition; no separate "district contest" actions exist.
*   **Player A** owns 4 properties (Control) and has built an Office Annex and Transit Access. They activate a Development Network. Later, Player A trades 1 property to Player B. Player A drops to Majority (3/4). Player A instantly loses the +5% Control yield and the +5% Network yield. The Office Annex and Transit Access physical assets remain safely on their respective properties.

## 16. Explicitly Out of Scope
Do NOT add: district currency, district points, influence points, district XP, district levels, district taxes, district upkeep, district population, district happiness, district permits, district reputation, district missions, district quests, district-specific auctions, district resources, district management screens, district skill trees, district cards, separate district phases, district-specific dice, district-specific movement rules, multiple district bonus layers, complicated majority calculations, or hidden district statistics.

## 17. Dependencies
*   `BOARD_ARCHITECTURE.md` (District identities and property count)
*   `PROPERTY_SYSTEM.md` (Slot thresholds, Flagship state)
*   `ECONOMY_SYSTEM.md`
*   `DEVELOPMENT_SYSTEM.md` (Development slots and compatible families)
*   `MARKET_SYSTEM.md` (Yield interactions)
*   `NEWS_SYSTEM.md` (Ledger story milestones)

## 18. Resolved Naming Inconsistencies
The previously flagged West Aerodrome / Grand Promenade nomenclature discrepancy has been resolved by `PROPERTY_CATALOGUE.md` and `FLAGSHIP_DESIGN.md`. West Aerodrome is the 6th District. Grand Promenade is the Riverfront Flagship Anchor.

## 19. Design Principles
1. Minimal UI footprint.
2. Immediate response to ownership changes.
3. Readable progression (1/4, 2/4, 3/4, 4/4).
4. No stacking multiplier snowball effects.
5. Integration with, rather than duplication of, existing game systems.

## Final Rule
The District Control System must remain a lightweight ownership progression track. It serves to unlock development potential and endgame eligibility without introducing complex micro-management mechanics.
