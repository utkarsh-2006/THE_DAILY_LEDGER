# Economy System v1

**Status:** LOCKED FOR GAME DESIGN
**Authoritative Source:** This document is the authoritative source of truth for the game's core monetary/economic architecture.

---

## 1. Economic Objective

The economy should make players constantly balance:
**LIQUIDITY vs ASSET OWNERSHIP vs DEVELOPMENT vs MARKET OPPORTUNITY vs RISK**

The economy must feel financially meaningful without becoming a spreadsheet.

## 2. Currency

The core game uses ONE spendable currency: **$**

Do not introduce additional currencies such as development points, influence, energy, reputation currency, or market tokens. Physical development pieces are assets/components, not currencies.

## 3. Starting Cash

For the standard four-player game:
**STARTING CASH:** $1,800 per player.

## 4. City Dividend

When a player passes VELORA CENTRAL:
**CITY DIVIDEND:** $225

This is the primary reliable injection of new cash into the player economy. The dividend should be tied to actual movement around the board. Civic Hold and other movement restrictions therefore naturally affect a player's ability to complete circuits.

## 5. Bank

The digital bank is effectively unlimited. Game duration is controlled by the game/session horizon rather than the bank running out of money. The bank may issue additional money whenever rules require it.

## 6. Money Sources

**Primary:**
*   Velora Central Dividend

**Secondary:**
*   Civic Reserve / Treasury mechanisms
*   Selected News events

**Player-to-player transfers:**
*   Rent
*   Trading

Rent and trading do NOT create money. They only transfer money between players.

## 7. Money Sinks

**Primary economic sinks:**
*   Property acquisition
*   Development
*   Flagship development
*   Municipal Levy
*   Auction payments
*   Financial fees

Money paid to the city/bank is removed from player liquidity.

## 8. Property Price Bands

Exact property prices will be assigned later by the property catalogue. Economy establishes these target price bands:

*   **FOUNDATION:** $220–$280
*   **CORE:** $300–$380
*   **GROWTH:** $400–$480
*   **LANDMARK:** $520–$620

These are balancing bands, not four rigid global prices. District identity may shift a property's exact price within its tier band.

## 9. Base Yield

Base Yield is calculated from ASKING PRICE.

**Tier rates:**
*   **FOUNDATION:** 18% of Asking Price
*   **CORE:** 17%
*   **GROWTH:** 16%
*   **LANDMARK:** 15%

**Formula:** `BASE YIELD = ROUND(ASKING PRICE × TIER YIELD RATE)`

This creates higher absolute income for expensive property while giving lower-cost property better return on capital.
*   $250 Foundation → approximately $45 base yield
*   $340 Core → approximately $58
*   $450 Growth → approximately $72
*   $580 Landmark → approximately $87

*(Exact values will be generated from each property's final Asking Price.)*

## 10. Yield Stability

Market/news effects should influence Market Value more strongly than Yield. Ordinary Market/Yield effects should generally remain within approximately ±20% of the development-adjusted yield. Do not allow normal city headlines to turn one property landing into an arbitrary catastrophic payment. The exact Market System formula will be defined later.

## 11. Development Cost

Property development has TWO STANDARD PROJECT SLOTS as defined in `PROPERTY_SYSTEM.md`.

*   **FIRST STANDARD PROJECT Cost:** 35% of the property's Asking Price.
*   **SECOND STANDARD PROJECT Cost:** 50% of the property's Asking Price.

Development cost is tied to the property's base Asking Price. Development cost does NOT automatically increase because Market Value increased. This prevents market appreciation from making construction costs self-inflating.

## 12. Cashflow Development

A Cashflow Project increases recurring landing income. Each Cashflow Project adds **+50% of the property's BASE YIELD**.

This modifier is additive rather than exponential. Therefore:
*   0 Cashflow projects: 1.00× base yield
*   1 Cashflow project: 1.50× base yield
*   2 Cashflow projects: 2.00× base yield

Do not compound the 50% modifier. Exact Market/District modifiers will be layered later.

## 13. Resilience Development

Resilience Projects do NOT primarily increase rent. Their economic value comes from:
*   Reducing negative Market Value shocks
*   Protecting assets during adverse conditions
*   Improving recovery
*   Potentially protecting Yield during selected disruptions

The precise mathematical implementation belongs to `MARKET_SYSTEM.md`. Do not convert Resilience into generic additional rent.

## 14. Development Value Capitalization

When a development project is completed:
*   **75%** of the project's construction cost is initially capitalized into the property's Market Value.
*   **25%** is treated as construction/transaction friction.

*Example:* $200 project cost → $200 cash spent → approximately $150 initial Market Value contribution. Future Market behavior can move this value up or down. This prevents development from being a 1:1 cash-to-asset conversion.

## 15. Market Value

Every property begins with a Market Value based on its underlying asking-price value. Market Value is **PAPER WEALTH**. It is NOT automatically convertible into cash.

Market Value may be used for: portfolio evaluation, trading information, future financing, endgame valuation, and market analysis. A $650 Market Value does NOT mean the bank will automatically pay $650. The future Finance System will define actual liquidity mechanisms.

## 16. Rent

When a player lands on another player's property: Current Yield is transferred **LANDING PLAYER → pays → PROPERTY OWNER**.

The bank does not create the rent. This is a wealth-transfer mechanic. Exact Current Yield calculation will combine: Base Yield, Development, Market, and District effects. The Market System will define those formulas.

## 17. Municipal Levy

Municipal Levy is a percentage-based cash sink.
**Target:** 8% of the player's current cash
**Minimum:** $40
**Maximum:** $180

This prevents the levy from becoming irrelevant for wealthy players while protecting players with very low liquidity from an enormous proportional hit.

## 18. Auctions

When an unowned property is declined according to `PROPERTY_SYSTEM.md`, it enters the Quick Auction system.
*   Auction payments go: **PLAYER → CITY / BANK**
*   The auction price represents player willingness to pay.
    *   Asking Price: CITY LIST PRICE
    *   Market Value: ECONOMIC ESTIMATE
    *   Auction Price: PLAYER-DRIVEN PRICE DISCOVERY

Detailed auction state machine and tie-breaking will be specified separately.

## 19. Trading

Trading transfers money/assets between players. Trading does NOT create new money. Market Value is information; it is not a mandatory transaction price. Players may negotiate above or below Market Value. Detailed trading protocol will be specified separately.

## 20. Liquidity

Liquidity is a first-class economic concept. A player may have low cash, high property value, high future Yield, and high Market Value at the same time. These are intentionally different dimensions of wealth. The economy should make HIGH NET WORTH + LOW LIQUIDITY possible without making immediate defeat inevitable.

## 21. Debt

Debt is NOT part of the core money engine. Debt is a future liquidity-pressure system.
**Design principle:** Debt should solve short-term liquidity problems at a meaningful future economic cost. Debt must NOT become a universally optimal source of cheap money. Exact debt mechanics will be defined later in the FINANCE / DEBT system.

## 22. Market Value vs Cash

Market appreciation creates paper wealth. Market depreciation destroys paper wealth. Neither automatically creates or destroys spendable cash. Cash is realized through property sales/trades, financing/liquidation, or endgame valuation (depending on final rules).

## 23. Anti-Snowball Principle

Do not implement arbitrary punishment for the richest player. Instead, heavy concentration in one economic sector should increase exposure to that sector. Diversified portfolios should generally have greater resilience. The Market and News systems will create changing sector conditions. Therefore: **HIGHER UPSIDE can come with HIGHER CONCENTRATION RISK.**

## 24. Economic Phases

The economy is calibrated around a reference game of approximately 30 player turns.

*   **OPENING (approx. rounds 1–8):** Acquire, preserve liquidity, begin district races.
*   **EXPANSION (approx. rounds 9–20):** Development, district competition, market positioning, early trading.
*   **CLOSING (approx. rounds 21–30):** Liquidity management, portfolio decisions, trading, financing, extracting value from investments.

*(These are pacing targets, not UI phases.)*

## 25. Balance Guardrails

Use these as internal balancing targets (not as UI rules):
*   Typical cash: 20–40% of net worth during mid/late game.
*   Typical property ownership: ~3–5 properties per player during main game.
*   Typical late-game development: ~1–3 standard projects per player (Strong district controller: potentially more).
*   Typical ordinary rent: ~$40–$150.
*   Developed premium property rent: ~$100–$220.
*   Ordinary property landing should generally NOT remove more than ~15% of starting capital.
*   Normal Market Value fluctuation: ~±20–25% (Rare major events may temporarily exceed this).

## 26. Preliminary Calibration

A simplified internal simulation was performed using:
*   4 players, 30 turns each, 40 spaces, 2d6
*   $1,800 starting cash, $225 lap dividend
*   Price centers ~$250/$340/$450/$600
*   Tier yield rates 18/17/16/15%
*   35% / 50% project costs, percentage-based Municipal Levy

**Results:** ~$730 average ending cash, ~$2,630 average book net worth, ~28% wealth as cash, ~1.9 standard development projects, all 24 properties owned.

**This is NOT final balance data. It is a calibration signal only.** The full balance pass must be repeated after MARKET, NEWS, AUCTIONS, TRADING, DEBT, CIVIC HOLD, and DISTRICT CONTROL are designed.

## 27. Future System Dependencies

*   `PROPERTY_SYSTEM.md` provides: Asking Price, Market Value, Yield, development structure, Cashflow vs Resilience, two project slots, district requirements.
*   `BOARD_ARCHITECTURE.md` provides: 40-space traffic structure, district placement, financial/news/transport spaces.
*   **MARKET_SYSTEM.md** will define: sector indices, Market Value movement, Yield modifiers, shocks, recovery, resilience behavior.
*   **NEWS_SYSTEM.md** will define: event cadence, information, city events, economic triggers.
*   **DISTRICT_CONTROL.md** will define: Presence, Majority, Control, Flagship.
*   **FINANCE_SYSTEM.md** will define: debt, collateral, liquidation, liquidity crises.
*   **PLAYER_INTERACTION.md** will define: trading, negotiation, player-to-player transactions.
*   **AUCTION_SYSTEM.md** will define: Quick Auction implementation, tie handling, eligibility, timing.
*   **ENDGAME_AND_BALANCE.md** will define: final valuation, final market state, match length, victory calculation, final balance pass.

## 28. What is Not Yet Locked

Do NOT invent final values for: the exact 24 property prices, exact property catalog, exact market formulas, exact sector exposure, exact resilience effects, exact district bonuses, exact Flagship effects, exact development project catalogue, exact project supply, exact project compatibility, exact News effects, exact Debt rules, exact Trading rules, exact Auction tie-breakers, or final victory conditions.

## 29. Research Basis

The economy architecture was informed by established board-game mechanisms including:
*   **MONOPOLY:** property acquisition, auctions, development, mortgages, bank-controlled cash flow
*   **ACQUIRE:** changing asset value, majority ownership, sell/trade/hold decisions, investment concentration
*   **LORDS OF VEGAS:** physical development pieces, finite components, active property management, spending money to alter developed assets
*   **STOCKPILE:** information advantage, market uncertainty, auctions, price discovery, player interaction around valuation
*   **BRASS:** converting immediate liquidity into future economic cost through loans
*   **FOOD CHAIN MAGNATE:** deliberately controlled money supply, reserve structure influencing game horizon, strong economic pacing
*   **RICHUP:** digital pacing, turn clocks, debt-related decision windows, safeguards around player trades

*(Use these as design references, NOT templates. The Daily Ledger must remain its own game.)*
