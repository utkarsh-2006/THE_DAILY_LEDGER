# Flagship Design v1

## 1. Purpose
The Flagship System represents the pinnacle of property development in The Daily Ledger. A Flagship transforms a fully controlled district into a defining landmark of Velora City. It serves as a massive capital sink in the mid-to-late game, converting liquidity into highly resilient paper wealth and commanding yields without introducing new game phases, currencies, or victory points. 

## 2. Authority and Dependencies
This document builds directly upon:
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md`
*   `DEVELOPMENT_SYSTEM.md`
*   `MARKET_SYSTEM.md`
*   `NEWS_SYSTEM.md`
*   `DISTRICT_CONTROL.md`
*   `PLAYER_INTERACTION.md`
*   `AUCTION_SYSTEM.md`
*   `FINANCE_SYSTEM.md`
*   `ENDGAME_AND_BALANCE.md`
*   `PROPERTY_CATALOGUE.md`

## 3. Flagship Philosophy
A Flagship communicates **CONTROL → INVESTMENT → IDENTITY → VALUE**.
It is not a third development slot, a victory point, a mini-game, or a complicated subsystem. It is a massive, unified upgrade to a district's designated anchor property that locks in significant wealth for the final valuation.

## 4. Flagship Eligibility
To construct a Flagship, a player must satisfy all of the following requirements:
1.  **District Control:** The player must currently control the district (4/4 ownership).
2.  **Anchor Ownership:** The player must own the district's designated Anchor Property (defined in the catalogue).
3.  **Capital:** The player must have sufficient cash to pay the Flagship Construction Cost.
4.  **Timing:** The player must be in a valid development/action window during their turn.

There are no permits, timers, XP levels, missions, or special construction resources required. 

## 5. Flagship Catalogue
There are exactly 6 Flagships, one for each district, tied to their specific Anchor Properties (`PROPERTY_CATALOGUE.md`).

1. **OLD QUARTER: The Velora Heritage Exchange**
   *   **Anchor Property:** Crown Customs House (P04)
   *   **City Role:** The ultimate cultural and historical centerpiece.
   *   **Visual Identity:** The historic neoclassical building expanded with modern glass atriums.
   *   **Economic Identity:** Highly stable retail and tourism anchor.

2. **EXCHANGE DISTRICT: The Apex Financial Spire**
   *   **Anchor Property:** Velora World Bank (P08)
   *   **City Role:** The undisputed center of global capital in Velora.
   *   **Visual Identity:** A towering, aggressive monolith of black glass and gold trim.
   *   **Economic Identity:** The highest raw value asset in the game.

3. **RIVERFRONT: The Grand Promenade Pavilion**
   *   **Anchor Property:** Grand Promenade (P11)
   *   **City Role:** The premier waterfront entertainment destination.
   *   **Visual Identity:** A sprawling luxury casino and hospitality complex extending over the water.
   *   **Economic Identity:** Massive cashflow engine driven by hospitality.

4. **IRONWORKS: The Ironward Industrial Complex**
   *   **Anchor Property:** Velora Heavy Industries (P16)
   *   **City Role:** The automated heart of Velora's manufacturing.
   *   **Visual Identity:** A hyper-modern, clean-energy robotics and logistics plant.
   *   **Economic Identity:** The ultimate high-ROI foundation engine.

5. **NORTH HEIGHTS: The Crown Residences**
   *   **Anchor Property:** The Mayor's Estate (P20)
   *   **City Role:** Unmatched luxury civic real estate.
   *   **Visual Identity:** A fortified, hyper-luxury residential compound.
   *   **Economic Identity:** Defensive, resilient wealth preservation.

6. **WEST AERODROME: The Stratos Aviation Hub**
   *   **Anchor Property:** Velora International (P24)
   *   **City Role:** The global gateway to the future.
   *   **Visual Identity:** A sprawling orbital and international logistics terminal.
   *   **Economic Identity:** High-growth tech and logistics powerhouse.

## 6. Construction Cost
The construction cost of a Flagship is **100% of the Anchor Property's Asking Price**.
*   *Rationale:* Standard development slots cost 35% and 50% (85% total). Charging 100% makes the Flagship a massive, deliberate capital allocation decision (ranging from $460 to $620 for the high-end anchors) that severely drains liquidity, creating strategic risk.

## 7. Market Value Integration
Following `ECONOMY_SYSTEM.md`, development costs are capitalized at 75%.
When a Flagship is constructed, **75% of the Flagship Construction Cost is permanently added to the property's Asset Base**. 
The Market System then naturally calculates Market Value (`Asset Base × Exposure Index`). The Flagship does not introduce a separate Market Value formula or Victory Points.

## 8. Yield Integration
FLAGSHIP CURRENT YIELD CONTRIBUTION = 100% OF THE ORIGINAL BASE YIELD

Therefore, before Market and District modifiers:
**Flagship Yield = Base Yield × 2.0**

*   *Rationale:* This is an additive replacement for the standard Cashflow development structure, not a +100 percentage point increase and not a compounded modifier. The normal Market and District modifiers then continue to apply according to their existing systems. This avoids uncontrolled stacking multiplier loops.

## 9. Interaction with Existing Developments
Constructing a Flagship represents a total redevelopment of the Anchor Property.
*   When built, **any existing standard developments on the Anchor Property are absorbed and removed from the property**. 
*   Their previous capitalized Market Value contribution must also be explicitly removed from the property's Asset Base.
*   No cash refund is given for those absorbed developments.
*   The Flagship construction then adds its own capitalized value equal to 75% of the Flagship construction cost.
*   The property must therefore never double count both the old standard development capitalization and the Flagship capitalization.
*   The property's two standard development slots are permanently closed. The property state is simply: **FLAGSHIP**.
*   *Strategic impact:* Players must decide whether to build cheap standard developments early for quick cash, knowing they will lose that sunk cost when upgrading to the Flagship later.

## 10. District Control Interaction
Following `DISTRICT_CONTROL.md`, a Flagship requires 4/4 District Control to *construct*.
However, if a player subsequently loses District Control (drops to 3/4 or lower):
*   **The completed Flagship remains attached to the property and remains active.** 
*   The player loses the +5% District Control Yield Bonus and Network eligibility, but the physical Flagship asset is not magically destroyed.
*   A district can only ever contain ONE Flagship, tied to the Anchor Property.

## 11. Trading Interaction
Following `PLAYER_INTERACTION.md`, properties transfer as a complete asset package. If an Anchor Property with a completed Flagship is traded, the Flagship transfers intact to the new owner. There is no special Flagship trading currency or tax.

## 12. Finance and Liquidation
Following `FINANCE_SYSTEM.md`, if a player is forced to liquidate the Flagship property to the City:
*   The property sells for **50% of its Asset Base** (Asking Price + Capitalized Flagship Value).
*   The Flagship is completely **destroyed** (the property reverts to Unowned).
*   This is a devastating financial blow, ensuring that building a Flagship without adequate remaining liquidity is extremely risky.

## 13. Auction Interaction
Following `AUCTION_SYSTEM.md`, an unowned Anchor Property can be auctioned normally. A Flagship can **never** be built via auction; the winner acquires the bare property and must fulfill the District Control and capital requirements to build the Flagship later.

## 14. Market Interaction
The Flagship uses the existing Market System mechanics. It does not introduce a new Market Pulse, index, or sector. It adopts the Sector Exposure (Primary/Secondary) of its Anchor Property. 
**Resilience:** A Flagship is built to weather storms. It inherently counts as **one universal Resilience project** for the Anchor Property, providing a permanent `0.5^1` buffer against matching Sector Shocks without requiring a standard development slot.

## 15. Development Network Interaction
For the purpose of Development Networks (`DISTRICT_CONTROL.md`), a Flagship inherently counts as a compatible development-family link for Development Network eligibility.
Therefore:
*   A controlled district containing a Flagship and at least one compatible standard development on another property satisfies the compatible-family requirement.
*   The Flagship may act as the universal compatibility anchor.
*   The Flagship itself does not receive the Development Network bonus more than once.
*   Development Network remains a single +5% Current Yield modifier.
*   Flagship + District Control + Development Network must not accidentally stack the same network bonus multiple times.

## 16. News Interaction
Flagship construction is a major event. It automatically generates a **BREAKING NEWS** / Ledger story (e.g., *"VELORA WORLD BANK COMPLETES APEX FINANCIAL SPIRE"*), governed purely by `NEWS_SYSTEM.md` presentation rules. 

## 17. Visual Identity
The Flagship fundamentally changes the visual presence of the Anchor Property on the board.
*   The standard property tile upgrades to a unique, visually dominant Landmark graphic that breaks the visual bounds of standard properties.
*   Hover/context states display **[FLAGSHIP]** instead of standard development slots.
*   No complex 3D rendering is required; a distinct, premium 2D/UI asset suffices.

## 18. Endgame Integration
Following `ENDGAME_AND_BALANCE.md`, Final Wealth is determined by `Current Cash + Current Market Value of Owned Properties`. 
Because the Flagship construction cost is capitalized into the Asset Base (at 75%) and subjected to the Market Exposure Index, it perfectly integrates into the existing Final Wealth formula. It forces players to choose between holding safe Cash (100% value) or sinking it into a Flagship (75% paper value, but massive recurring Yield and Network utility).

## 19. Balance and Snowball Analysis
**Cost vs Reward:** Costing 100% of the Asking Price, Flagships drain massive liquidity. For example, building the Apex Financial Spire requires $620 cash—more than a third of starting cash. 
**Snowball Friction:** The massive capital requirement creates a "vulnerability window." A player who completes a Flagship is highly exposed to Municipal Levies, Rents, or Market Shocks immediately afterward due to low liquidity. If forced to liquidate, they lose 50% of that massive Asset Base. This naturally limits runaway snowballing.

## 20. Explicitly Out of Scope
Do NOT introduce: Victory Points, prestige, reputation, influence, district levels, district currencies, special Flagship currencies, Flagship cards, Flagship missions, Flagship quests, Flagship XP, multiple Flagship tiers, third development slots, new property classes, new market sectors, new board spaces, stock trading, debt, maintenance currencies, construction timers, construction workers, population, happiness, political systems, separate Flagship scoring, or secret objectives.

## 21. Dependencies and Future Systems
**Dependencies:**
*   `PROPERTY_CATALOGUE.md` (Defines the exact Anchor Properties)
*   `ECONOMY_SYSTEM.md` (Defines the 75% capitalization rule)
*   `ENDGAME_AND_BALANCE.md` (Relies on this document to define the Market Value contribution without adding Victory Points)

**Future Systems:**
*   POC Implementation & Rendering UI (requires distinct visual assets for the 6 Flagships).

## 22. Consistency Audit
[X] Exactly 6 Flagships (One per district).
[X] Each Flagship has a valid Anchor Property assigned from the Catalogue.
[X] West Aerodrome remains a district; Grand Promenade remains a Riverfront property.
[X] Flagships do not create new properties or a third development slot (they replace existing slots).
[X] Flagship cost (100% Asking Price) fits the existing economy perfectly.
[X] Flagship Market Value integrates cleanly (75% Capitalized Asset Base).
[X] Final Wealth remains Cash + Market Value.
[X] No Victory Points, new currencies, or new district mechanics.
[X] No uncontrolled yield multiplier loops (+100% flat Base Yield).
[X] All existing Liquidation, Trade, Auction, Market, and News rules are strictly respected.

---
**Document Status:**
FLAGSHIP DESIGN v1 — LOCKED FOR GAME DESIGN
