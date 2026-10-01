# Market System v1

**Status:** LOCKED FOR GAME DESIGN

## Purpose

The Market System represents the changing economic conditions of Velora City. The market exists to make property ownership, development, trading, news and risk more meaningful. It is NOT intended to simulate a real financial market.

The Market System should make players feel:
*"The city is changing, and my assets are exposed to those changes."*

## Design Principles

1. Market Value changes more strongly than Yield.
2. Market information should create decisions before market changes occur.
3. Sector concentration should create natural exposure rather than arbitrary leader punishment.
4. Market changes must not directly create or destroy player cash.
5. Resilience should protect downside rather than become disguised rent income.
6. The board remains the primary game surface.
7. Market information should remain understandable.
8. News provides context and information; Market provides the mechanical economic state.
9. Market changes occur at controlled round intervals rather than every player action.
10. Do not turn The Daily Ledger into a stock market simulator.

## Sectors

Velora City has six market sectors:

1. **HERITAGE COMMERCE** (District identity: Old Quarter) - Traditional retail, local commerce, heritage economy.
2. **FINANCE & ENTERPRISE** (District identity: Exchange District) - Banking, corporate services, investment, financial activity.
3. **LEISURE & HOSPITALITY** (District identity: Riverfront) - Tourism, hospitality, leisure, waterfront consumption.
4. **INDUSTRY & LOGISTICS** (District identity: Ironworks) - Manufacturing, freight, processing and industrial logistics.
5. **RESIDENTIAL & CIVIC** (District identity: North Heights) - Housing, education, institutions and services.
6. **TECHNOLOGY & AVIATION** (District identity: West Aerodrome) - Technology, aviation, innovation and expansion.

*(The final 24 property sector assignments are NOT defined here. They belong to the future property catalogue.)*

## Property Sector Exposure

Each property has:
*   **PRIMARY SECTOR:** 70% exposure.
*   **SECONDARY SECTOR:** 30% exposure.
*(If a property has only one meaningful sector, it may use 100% Primary exposure.)*

**Exposure Index:**
`EXPOSURE INDEX = (Primary Sector Index × 0.70) + (Secondary Sector Index × 0.30)`

If a future property catalogue defines a different valid exposure structure, this document must be revised intentionally rather than silently overridden.

## Sector Market Index

Every sector has a public Market Index.

*   **Starting value:** 100
*   **Normal range:** 80 to 120
*   **Exceptional Shock range:** 75 to 125

Ordinary market movement occurs in increments of 5.

**Market conditions:**
*   80–89 = DISTRESSED
*   90–94 = WEAK
*   95–105 = STABLE
*   106–114 = STRONG
*   115–120 = BOOM

Market Index is not spendable money.

## Market Value

The Market Value of a property is determined by its Asset Base and current sector exposure.

**ASSET BASE =** `ASKING PRICE + CAPITALIZED DEVELOPMENT VALUE`
*(Development capitalization follows ECONOMY_SYSTEM.md: 75% of development construction cost is capitalized into Market Value.)*

**Market Value formula:**
`MARKET VALUE = ROUND( ASSET BASE × EXPOSURE INDEX ÷ 100 )`

Market Value represents paper wealth. Market Value does not automatically become cash. Market Value is information and may be relevant to trading, auctions, future financing and endgame valuation according to other systems.

## Yield

Market effects must influence Yield more gently than Market Value.

**Market Yield Modifier:**
`1 + (Exposure Index − 100) / 200`
**Clamp:** `0.85× to 1.15×`

Normal sector movement therefore changes recurring landing income much less aggressively than Market Value.

**Final Current Yield will eventually combine:**
`BASE YIELD × DEVELOPMENT MULTIPLIER × MARKET YIELD MODIFIER × DISTRICT MODIFIER`

The Development multiplier must preserve the authoritative Economy System rule that each fully compatible Cashflow project adds +50% of BASE YIELD. Do not compound the Cashflow modifier. District modifiers belong to `DISTRICT_CONTROL.md`.

## Market Pulse Deck

The standard Market Pulse Deck contains 36 cards.

**24 TREND CARDS:**
Each of the six sectors receives: 2 positive +5 cards & 2 negative −5 cards.

**6 SHOCK CARDS:**
One for each sector. Each Shock produces a −10 sector movement and has a Shock Type.

**6 REVERSAL CARDS:**
One for each sector. A Reversal card resolves as:
*   If target sector > 100: −10
*   If target sector < 100: +10
*   If target sector = 100: +5

This creates natural correction and recovery behavior. Across the complete deck, each sector receives a broadly balanced long term distribution.

## Market Round Timing

For Market purposes: **One round = every active player has taken one normal turn.**

At the beginning of the round:
1. Reveal the next Market Pulse.
2. Display the relevant sector and direction publicly.
3. Players take their normal turns.
4. Players may act using the known market outlook.
5. At the end of the round, resolve the revealed Pulse.
6. Recalculate affected property Market Values and Current Yields.
7. Begin the next round.

Market state remains stable between round resolutions. Do not update Market Index after every player movement.

## Opening Market Protection

During rounds 1–8: Only ordinary +5 and −5 Trend cards are eligible. Shock and Reversal cards do not enter the active market during the opening phase.
From round 9 onward, the complete Market Pulse system may operate.
*(The system should remain compatible with a future 20–30 round final game.)*

## Shock Types

Standard Resilience related Shock Types:
1. **MOBILITY DISRUPTION:** Protected by Transit Access.
2. **ENERGY DISRUPTION:** Protected by Energy Retrofit.
3. **SUPPLY DISRUPTION:** Protected by Logistics Hub.
4. **CIVIC / REGULATORY DISRUPTION:** Protected by Civic Infrastructure.

Not every negative market event needs to be a Shock. Normal −5 market movement does not activate Resilience protection.

## Resilience

Resilience protects a property's effective exposure during matching adverse Shock events. The public sector Index still moves normally for the entire city. Only the property's effective exposure is protected.

For a matching Shock Type (where R = Number of matching Resilience projects):
`EFFECTIVE SECTOR INDEX = 100 + (SECTOR INDEX − 100) × 0.5^R`

Therefore:
*   0 matching projects: 100% of deviation applies.
*   1 matching project: 50% of deviation applies.
*   2 matching projects: 25% of deviation applies.

Only matching Resilience projects provide this protection. Do not convert Resilience into generic Yield income. Do not introduce Resilience currency, tokens, permits or resource systems. Resilience improves recovery primarily by limiting the original drawdown. No separate recovery currency or recovery timer exists in v1.

## Market Information

The current Market Pulse is public once revealed. The market system intentionally gives players information before market movement, creating timing and speculation decisions.

Future `NEWS_SYSTEM.md` may provide: early forecasts, additional information, market context, event explanations, private information, sector outlooks.
Do not make the market silently change without a visible mechanical reason.

## Velora Bourse

VELORA BOURSE is a market information interaction. When a player lands on VELORA BOURSE, the player may privately inspect the next Market Pulse card after the currently revealed card.

This provides one extra round of information. The information is private unless the player chooses to share it through future player interaction systems. Do not add another currency for this ability.

## News Integration

The Market System defines the mechanical market movement. `NEWS_SYSTEM.md` will define the editorial presentation and information distribution.

A Market Pulse may later be represented by a newspaper story.
*   *Example mechanical effect:* FINANCE & ENTERPRISE | −10 | SHOCK | CIVIC / REGULATORY
*   *Possible future editorial presentation:* A fictional Velora newspaper headline explaining the event.

News should provide information and context rather than directly telling players what they should purchase.

## Player Portfolio Exposure

Do not add an arbitrary richest player penalty. Players who concentrate heavily in one sector naturally become more exposed to that sector's movement. Diversified portfolios naturally have less sensitivity to a single sector movement. Do not create an additional concentration penalty formula in Market System v1.

## Auctions and Trading

Market Value updates only when the Market Pulse resolves. Auctions and trades use the latest resolved Market Value as information.
Market Value does not force a transaction price. Trading may occur above or below Market Value according to the future `PLAYER_INTERACTION.md` system. Auction rules belong to `AUCTION_SYSTEM.md`. Finance and liquidation rules belong to `FINANCE_SYSTEM.md`.

## UI Principles

The board remains the main game surface.
The main interface may show a compact Market Ticker. Example:
`FIN 110 ↑ | IND 95 ↓ | TECH 105 ↑`
Do not permanently display a large six sector dashboard.

Property hover may show: Property Name, District, Market Value, Current Yield, Primary Sector, Secondary Sector, Current Market Conditions.
Detailed market information can be surfaced contextually through: Market Desk, Velora Bourse, Hover panels, News, Contextual sidebar.

## Example

**Property:** NOVA TOWER
*   **Asking Price:** $400
*   **Development:** Office Annex
*   **Development Cost:** $140
*   **Capitalized Development Value:** $105
*   **Asset Base:** $505
*   **Finance Index:** 115
*   **Technology Index:** 105
*   **Exposure Index:** 112

**Market Value:** `ROUND($505 × 1.12) ≈ $566`
This Market Value is paper wealth. It is not automatically paid to the player.

## Explicitly Out of Scope

Do not introduce: stock trading, company shares, commodity inventories, multiple currencies, interest rate systems, central bank management, real time price updates, market permits, market tokens, market resource points, futures contracts, player controlled sector manipulation, automatic cash creation from appreciation, automatic cash destruction from depreciation, additional property development layers.

## Dependencies

**Depends on:**
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md`
*   `DEVELOPMENT_SYSTEM.md`

**Future interaction with:**
*   `NEWS_SYSTEM.md`
*   `DISTRICT_CONTROL.md`
*   `FINANCE_SYSTEM.md`
*   `PLAYER_INTERACTION.md`
*   `AUCTION_SYSTEM.md`
*   `ENDGAME_AND_BALANCE.md`

## Design Authority
Where a conflict exists: `BOARD_ARCHITECTURE.md`, `PROPERTY_SYSTEM.md`, `ECONOMY_SYSTEM.md`, and `DEVELOPMENT_SYSTEM.md` remain authoritative for their respective systems. Do not silently modify locked systems.

---
**Document Status:**
MARKET SYSTEM v1 — LOCKED FOR GAME DESIGN
