# Property System v1

**Status:** LOCKED FOR GAME DESIGN
**Authoritative Source:** This document is the authoritative source of truth for the conceptual PROPERTY SYSTEM of The Daily Ledger.

---

## 1. Core Principle

Properties are living economic assets rather than static Monopoly-style deeds. A property's economy is represented by three separate concepts:

*   **Asking Price:** The amount required to acquire an unowned property.
*   **Market Value:** The property's current estimated economic value.
*   **Yield:** The recurring income generated when another player lands on the property.

These values are intentionally separate:
*   ASKING PRICE != MARKET VALUE
*   MARKET VALUE != YIELD
*   MARKET VALUE != LIQUIDATION VALUE

## 2. Property Progression

Every property follows the conceptual progression:
`ACQUIRED → DEVELOPED → DEVELOPED → FLAGSHIP`

A property has a maximum of **TWO STANDARD DEVELOPMENT SLOTS**. The property may therefore contain:
*   no development
*   one development project
*   two development projects
*   one flagship state after district control

## 3. Development is Not Just Spending Money

**IMPORTANT DESIGN RULE:** Cash alone does NOT create development.

A standard development requires:
1.  Property ownership
2.  Sufficient district position
3.  An available development project
4.  Sufficient cash to fund the project (The cash funds the construction)

The actual development is represented by a visible physical/isometric asset attached to the property.
**Do NOT implement development as:** "Pay money -> hidden number increases." Development must create a visible board state.

## 4. District Requirements

Development is tied to district ownership progression.

*   **1/4 District Ownership:** The player owns a single property. No standard development is unlocked solely from this state.
*   **2/4 District Position:** The player has established a meaningful district presence. The player may unlock the **FIRST STANDARD DEVELOPMENT SLOT** on eligible owned properties.
*   **3/4 District Majority:** The player controls a majority of the district's four properties. The player may unlock the **SECOND STANDARD DEVELOPMENT SLOT**.
*   **4/4 District Control:** The player owns all four properties. The player becomes eligible for the district's **FLAGSHIP** system.

*(The exact gameplay benefits of District Presence, Majority, Control, and Flagship are specified in `DISTRICT_CONTROL.md` and `FLAGSHIP_DESIGN.md`.)*

## 5. Development Project Types

There are two strategic development families:

### A. Cashflow Projects
These primarily improve recurring landing income/yield.
*Examples:* Office Annex, Retail Arcade, Production Line, Hospitality Wing

### B. Resilience Projects
These primarily improve the property's ability to withstand unfavorable economic conditions or recover from them.
*Examples:* Transit Access, Energy Retrofit, Infrastructure Upgrade, Service Centre

*(These examples establish design language. Exact numerical effects are specified in `DEVELOPMENT_SYSTEM.md` and `MARKET_SYSTEM.md`.)*

## 6. Development Combinations

The two development slots can create different property profiles. The combination itself is a strategic choice:
*   **Cashflow + Cashflow:** Highly income-oriented asset.
*   **Resilience + Resilience:** Highly defensive asset.
*   **Cashflow + Resilience:** Balanced asset.

**Do NOT** collapse these combinations into a single generic "Level 2" number.

## 7. Development As Physical Game State

Every standard development must have a visible representation using small, elegant, isometric-style development assets. The assets should feel like miniature pieces of Velora rather than generic mobile-game icons (e.g., Office, Retail, Factory, Transit infrastructure).

The implementation must make the development visible directly on the property card/space. The board should physically show:
**WHO OWNS THIS PROPERTY + WHAT HAS BEEN BUILT HERE**

## 8. Development Supply

Development projects are finite city resources. Players do NOT have unlimited access to every project. There should be a limited supply of available development projects to create competition and timing. A wealthy player cannot simply spend cash to manufacture arbitrary development.

*(The `DEVELOPMENT_SYSTEM.md` defines pool size, replenishment, acquisition, cost, and scarcity.)*

## 9. Property Compatibility

Not every property should be able to host every possible project. Properties should have compatible development families based on what the property represents.
*   *Nova Tower:* Office/commercial/infrastructure
*   *Ironward Works:* Manufacturing/logistics/infrastructure
*   *Grand Promenade:* Hospitality/retail/waterfront/infrastructure

This creates property identity. Use a manageable reusable catalogue of project archetypes with property compatibility rules, rather than 24 completely unique development systems.

## 10. Flagship

Flagship is the highest visible property state.
*   **Requirements:** Governed entirely by `FLAGSHIP_DESIGN.md` (requires District Control, Anchor Ownership, and Capital; there are no permits).
*   Only **ONE** property in a controlled district should normally become its primary Flagship.

Flagship is NOT simply "three houses" or "a hotel." It is a major landmark transformation (e.g., major tower, landmark hotel, industrial complex) and should be significantly more prominent than standard development visually.

## 11. Market Value vs Yield

Market changes should generally affect MARKET VALUE more strongly than recurring landing yield. This prevents a single city news event from arbitrarily making a property economically catastrophic to land on.

## 12. Development + Market

Development influences how a property responds to the city economy. Cashflow-oriented development should primarily reinforce recurring income. Resilience-oriented development should primarily reduce downside exposure and/or improve recovery.

## 13. Property Acquisition

When landing on an unowned property: **BUY** or **PASS**

*   **BUY:** Player pays ASKING PRICE and receives ownership.
*   **PASS:** Property enters a fast sealed Quick Auction.
    *   Eligible players submit one sealed bid.
    *   Bids are revealed simultaneously.
    *   Highest valid bid wins, winner pays the bid.
    *   If nobody bids, property remains unowned.

## 14. Property Trading

Properties are transferable between players. Market Value is information, not a mandatory transaction price; players may negotiate above or below it. *(Detailed trading mechanics are defined in `PLAYER_INTERACTION.md`.)*

## 15. Liquidity Distinction

Market Value is NOT guaranteed cash. A property worth $600 on the market should not automatically be redeemable by the bank for $600. *(Detailed liquidity and liquidation mechanics are defined in `FINANCE_SYSTEM.md`.)*

## 16. Anti-Snowball Principle

Property development should encourage specialization and exposure. A player heavily invested in one sector may have greater upside during favorable conditions but greater vulnerability during unfavorable conditions. A diversified portfolio should generally have greater resilience. The market system should create natural strategic counterpressure rather than arbitrary leader punishment.

## 17. Critical UI Principle

**THE BOARD MUST REMAIN MINIMAL.**
Do NOT permanently display the full property data model (market value, yield numbers, asking price, large action panels) on every property card.

The property card/space should communicate visually:
*   Property name
*   District identity
*   Owner
*   Visible development assets

## 18. Hover Inspection

Full property information should be revealed through HOVER. The hover panel should be compact, editorial, readable, fast, and non-intrusive. It should contain:
*   Property name & District
*   Asking Price, Market Value, Current Yield
*   Primary/Secondary Sector
*   Development projects & orientation
*   Owner & District position

## 19. Landing Decision UI

When the active player lands on a property, the actual decision should appear in the **SIDEBAR** / contextual action area.
*Example:* [P07] Nova Tower / Exchange District / Asking Price: $480 / Market Value: $510 / [BUY $480] [PASS]

Do not place large permanent action controls on the board. The board remains the game surface; the sidebar becomes the decision surface.

## 20. Example Property State

A clean board-state representation at a glance:
```text
[P07] NOVA TOWER
EXCHANGE DISTRICT
[ small isometric office asset ]
[ small isometric transit asset ]
OWNER: UTKARSH
```
Hovering reveals deeper economic information.

## 21. Design Intent

The player should feel:
1. "I own this place."
2. "I built something here."
3. "My property has become an important part of Velora."

The physical development pieces are a CORE ENGAGEMENT MECHANIC, not merely decoration.

## 22. System Authority

This document defines the high-level philosophy and UI for properties. Detailed mechanics and formulas are now locked and governed authoritatively by the following specialized systems:
*   **Property Identities & Values:** `PROPERTY_CATALOGUE.md`
*   **Economic Baseline:** `ECONOMY_SYSTEM.md`
*   **Development Rules:** `DEVELOPMENT_SYSTEM.md`
*   **Market Fluctuations:** `MARKET_SYSTEM.md`
*   **District Bonuses:** `DISTRICT_CONTROL.md`
*   **Trading Rules:** `PLAYER_INTERACTION.md`
*   **Auctions:** `AUCTION_SYSTEM.md`
*   **Liquidation & Insolvency:** `FINANCE_SYSTEM.md`
*   **Final Scoring:** `ENDGAME_AND_BALANCE.md`
*   **Flagships:** `FLAGSHIP_DESIGN.md`

---
**Document Status:**
PROPERTY SYSTEM v1 — LOCKED FOR GAME DESIGN
