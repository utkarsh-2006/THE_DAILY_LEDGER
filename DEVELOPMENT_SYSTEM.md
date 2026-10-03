# Development System

> **DEVELOPMENT SYSTEM v1.1 — COMPATIBILITY AND NETWORK AMENDMENT**
> The property compatibility matrix requirement and complete Network registry have been strictly locked and reconciled across all design documents.
 v1

**Status:** LOCKED FOR GAME DESIGN

## Core Purpose
Development is a scarce city resource that allows players to specialize properties.

Development decisions should involve:
1. Capital
2. Opportunity
3. Property compatibility
4. Timing
5. Market risk

Development should feel like transforming a property into a more specialized operating asset rather than simply paying money for a larger rent number.

## Development Slots
Every purchasable property has exactly two development slots.

Slot 1 and Slot 2 unlock according to the district ownership thresholds already defined in `PROPERTY_SYSTEM.md`.
Do not redefine or modify those ownership thresholds.
No third development slot exists in v1.

## Standard Development Supply
There are 32 standard development projects.
8 project families × 4 copies each.

The project families are:

**CASHFLOW:**
1. Office Annex
2. Retail Arcade
3. Production Line
4. Hospitality Wing

**RESILIENCE:**
5. Transit Access
6. Energy Retrofit
7. Logistics Hub
8. Civic Infrastructure

Standard project supply is finite.

## Development Profiles
Every property has a Development Profile:

*   **PRIMARY:** 2 strongly compatible project families.
*   **SECONDARY:** 2 compatible but weaker project families.
*   **RESTRICTED:** All remaining project families.

Primary compatibility gives the full intended project effect.
Secondary compatibility gives a reduced effect.
Restricted projects cannot be constructed on the property.

*(The fully reconciled property-by-property compatibility matrix is explicitly listed in `PROPERTY_CATALOGUE.md` under the v1.1 amendment. Exactly 2 Primary, 2 Secondary, and 4 Restricted families apply to each property.)*

## Project Cost
Do not introduce an independent project pricing system.
Construction cost is determined entirely by the property's development slot:

*   **FIRST DEVELOPMENT:** 35% of the property's Asking Price.
*   **SECOND DEVELOPMENT:** 50% of the property's Asking Price.

Use the Asking Price defined by `ECONOMY_SYSTEM.md`.
Project type does not introduce another construction price multiplier in v1.

## Development Exchange
Four standard development projects are publicly available at any time.

The Exchange is a scarce opportunity market.
When a player takes a project, that project is removed from the Exchange and replaced by another available project from the remaining supply.
Ordinary projects are first-come, first-served.
There is no ordinary development auction in v1.

The Exchange should not become a permanent heavy UI panel. It can be surfaced contextually when a player chooses to develop.


## Authoritative Network Registry
The following is the exhaustive list of valid Development Network combinations. No other family pair may activate a Development Network.

1.  **Connected Commerce:** Office Annex + Transit Access
2.  **Leisure Transit:** Hospitality Wing + Transit Access
3.  **Resilient Hospitality:** Hospitality Wing + Energy Retrofit
4.  **Clean Production:** Production Line + Energy Retrofit
5.  **Industrial Flow:** Production Line + Logistics Hub
6.  **Civic Supply:** Logistics Hub + Civic Infrastructure
7.  **Civic Commerce:** Civic Infrastructure + Retail Arcade
8.  **Commercial Exchange:** Retail Arcade + Office Annex

*(Note: Network activation requires the participating properties to be distinct. A single property holding both families does not form a network.)*

## Development Timing
A player may perform at most one development action per turn.

**Turn flow:**
`ROLL → MOVE → LAND → RESOLVE → DEVELOP 0 OR 1 → NEXT PLAYER`

Buying and construction occur as one action.
There is no permit stage, construction timer, or waiting period.

## Cashflow Projects
Cashflow projects increase property yield.

The `ECONOMY_SYSTEM.md` rule remains authoritative:
Each fully compatible Cashflow development contributes **+50% of base yield**.

Therefore:
*   0 Cashflow projects = 1.00× base yield
*   1 Cashflow project = 1.50× base yield
*   2 Cashflow projects = 2.00× base yield

**For Secondary compatibility:**
The project operates at 70% effectiveness.
Therefore each Secondary Cashflow project contributes **+35% of base yield**.
*(This is a compatibility reduction of the standard +50% project effect, not a replacement of the underlying project rule.)*

Cashflow projects are: Office Annex, Retail Arcade, Production Line, Hospitality Wing.

## Resilience Projects
Resilience projects do not primarily increase rent.
They provide protection against market disruptions.

Projects are: Transit Access, Energy Retrofit, Logistics Hub, Civic Infrastructure.

*(The exact numerical resilience effects are defined in `MARKET_SYSTEM.md`. Do not invent resilience percentages in this document.)*

## Market Value Capitalization
Use the existing `ECONOMY_SYSTEM.md` rule:
**75%** of development construction cost capitalizes into Market Value.
The remaining **25%** represents development friction.

Market Value is paper wealth and is not guaranteed liquidity.
Do not modify this rule.

## Redevelopment
A player may replace an existing development.

**Redevelopment rules:**
1. Remove the old project.
2. Purchase the new project at the current slot construction cost.
3. Receive redevelopment credit equal to 50% of the original project's construction cost.
4. The old project returns to the available development supply unless another future system explicitly changes this rule.

Redevelopment should be possible but economically costly.

## Trading
Developments remain attached to their property.
When a developed property is traded, the development transfers with the property.
The buyer receives the developed asset as a complete package.
Market Value remains informational rather than a mandatory transaction price.

## Development and News
News can influence the probability of project families appearing in the Development Exchange.

*Example:* A major metro expansion story may increase the probability of Transit Access appearing.

News should provide information and opportunity, not guaranteed outcomes.
News must not directly tell the player what decision to make.

## District Development Network
Compatible developments within the same district may form a Development Network.

*Example:* Office Annex + Transit Access → Connected Commerce

A district may have at most one active Development Network bonus.
*(The detailed Network bonus rules are governed by `DISTRICT_CONTROL.md`.)*

## Flagship Developments
Flagship developments are NOT part of the 32 standard development supply.

Flagships represent the ultimate transformation of a property and are governed entirely by `FLAGSHIP_DESIGN.md`. Constructing a Flagship absorbs and replaces standard development slots.

## Explicitly Out of Scope
Do not add:
- development permits
- construction resources
- construction workers
- construction timers
- maintenance currencies
- even-build rules
- ordinary development auctions
- third development slots
- project XP
- project levels
- construction queues
- separate construction currency
- additional development layers

## Design Principles
1. Development must create meaningful decisions.
2. Development must remain understandable.
3. Development must visibly change properties.
4. Scarcity should create opportunity and competition.
5. Development should interact with Market and News systems.
6. Development should not become a separate city simulator.
7. Board readability remains more important than displaying development data.
8. Detailed development information should be surfaced contextually rather than permanently cluttering the board.
9. Existing locked systems are authoritative where referenced.
10. Future systems should own mechanics that have intentionally been deferred.

## Dependencies
**Development System depends on:**
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md`
*   `MARKET_SYSTEM.md`
*   `NEWS_SYSTEM.md`
*   `DISTRICT_CONTROL.md`
*   `PLAYER_INTERACTION.md`

---
**Document Status:**
DEVELOPMENT SYSTEM v1 — LOCKED FOR GAME DESIGN
