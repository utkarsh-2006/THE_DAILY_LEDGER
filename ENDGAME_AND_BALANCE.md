# Endgame and Balance System v1

## 1. Status
LOCKED FOR GAME DESIGN

## 2. Purpose
The Endgame and Balance System defines how a match of The Daily Ledger ends, how the winner is determined, and how the complete economy should be calibrated and evaluated during playtesting. This is a final specification that integrates existing locked systems rather than creating new gameplay mechanics.

## 3. Core Endgame Philosophy
The match must begin quickly, develop organically through ownership and market shifts, create meaningful liquidity pressure, and reach a decisive ending. The game should feel like a complete board game rather than an endless economic simulation. It must avoid dragging into a prolonged, mathematically solved cleanup phase.

## 4. Match End Conditions
The game ends immediately when either of the following conditions is met:
1.  **Round Limit Reached:** The predetermined final round (e.g., Round 30) concludes.
2.  **Last Player Standing (Early Termination):** All but one player have declared bankruptcy/eliminated.

There are no complex victory objectives, secret missions, or variable ending triggers. The system clearly answers when the game stops.

## 5. Round Structure
Following `MARKET_SYSTEM.md`, **One Market Round = every active player has taken one normal turn.**
*   **Starting Round:** Round 1 begins with the first player's turn.
*   **Active Round:** The round counter advances only after the last active player completes their turn.
*   **Final Round:** A predetermined target (e.g., Round 30) acts as the hard stop. 
If a player is eliminated during a round, the turn order simply skips them; the round still concludes when the remaining active players have finished their turns.

## 6. Early Termination
If all but one player are eliminated due to bankruptcy (`FINANCE_SYSTEM.md`), the game ends immediately. The sole remaining player is declared the winner. The game does not play out empty rounds.

## 7. Final Round Resolution
If the match reaches the target round limit, the final round executes normally:
`FINAL TURN → RESOLVE BOARD ACTION → RESOLVE REQUIRED PAYMENT (Rent/Levy) → RESOLVE DEVELOPMENT / TRADE IF LEGALLY AVAILABLE → COMPLETE ROUND → FREEZE GAME STATE → FINAL VALUATION → DETERMINE WINNER`
No special final-round economy or market pulse is introduced. Existing mechanics resolve normally.

## 8. Final Valuation
Final Wealth determines the winner. The calculation strictly uses the frozen game state.
**FINAL WEALTH = CURRENT CASH + CURRENT MARKET VALUE OF OWNED PROPERTIES**
*   **Market Value** naturally includes the capitalized value of attached developments (75% of cost, per `ECONOMY_SYSTEM.md` and `MARKET_SYSTEM.md`).
*   Current Yield, future rent, and future dividends are explicitly **NOT** counted.
*   Liquidation value (50% Asset Base) is **NOT** used for final scoring, as Market Value represents the true paper wealth of the portfolio at the game's end.

## 9. Flagship Treatment
Following `FLAGSHIP_DESIGN.md`, Flagships are the highest visible property state. 
*   Their construction cost is 100% of the Anchor Property's Asking Price.
*   75% of this Flagship construction cost is capitalized into the property's Asset Base.
*   Previous standard development capitalization is explicitly removed upon Flagship construction.
*   The Flagship Asset Base integrates naturally into the Market Value, maintaining the Final Wealth formula without requiring a separate Victory Point or scoring system.

## 10. District Control Treatment
District Control matters naturally because it allows development and provides Yield bonuses, which generate the cash and property values used in Final Valuation. There is no separate endgame score, influence point, or victory point awarded for Presence, Established, Majority, Control, or Development Networks.

## 11. Market Treatment
At the moment the game ends:
*   The game uses the latest resolved Market Index and latest Market Value.
*   No additional Market Pulse is drawn solely for final scoring.
*   Players cannot manipulate the market or execute trades after the final round concludes.
Market Value remains paper wealth and is calculated directly into Final Wealth without being converted into literal cash.

## 12. Bankruptcy / Elimination
Following `FINANCE_SYSTEM.md`, a bankrupt player is eliminated.
*   Active-player count decreases.
*   The eliminated player's properties revert to the City (Unowned), instantly recalculating District Control.
*   If only one active player remains, the game terminates early.

## 13. Tie Breakers
If two or more players have identical Final Wealth, use the following deterministic hierarchy:
1.  **Highest Cash Balance** (rewards liquidity/safety).
2.  **Highest Market Value of Property Portfolio** (if cash is also tied).
3.  **Turn Order Proximity:** The tied player closest in sequence to the First Player wins.
No random dice rolls or sudden-death rounds are used.

## 14. Winner Presentation
The game transitions smoothly into a final results screen framed as the newspaper's final edition.
**THE FINAL EDITION: VELORA CITY HAS A NEW TYCOON**
*   **Winner:** UTKARSH
*   **Final Wealth:** $4,820
*   **Compact Breakdown:** Cash ($1,200) | Property Portfolio ($3,620)
*   **Notable Achievements:** Major districts controlled, Flagships completed.
*   **Match Duration:** e.g., 28 Rounds.
The board remains visible behind a clean, readable overlay. It does not become a giant analytics dashboard.

## 15. Balance Targets
Using the baseline calibration (4 players, 30 turns, 40 spaces, $1800 start, $225 dividend):
*   **Average Ending Cash:** Should remain tight (e.g., $500–$1500) to ensure liquidity pressure exists until the end.
*   **Median Final Wealth:** Expected to be roughly 2x to 3x starting cash ($3,600–$5,500), reflecting development and market growth.
*   **District Control:** 1–3 districts should reach Control (4/4) per game.
*   **Bankruptcy Frequency:** 0–1 players eliminated in a typical healthy match; 2+ indicates overly harsh penalties or extreme risks taken.
*   **Liquidity Crisis:** Every player should face at least one meaningful liquidity decision per match.

## 16. Healthy Match Profile
A healthy 20–30 round match should exhibit the following playtest targets:
*   Players acquire multiple properties early (Rounds 1–8).
*   Districts develop gradually; development requires pacing due to cash limits.
*   Market movement creates tension but does not randomly destroy players.
*   Auctions and Trading occur contextually but are never mandatory.
*   The leader does not become mathematically untouchable by Round 15.
*   The final rounds remain tense as players balance hoarding cash against buying final developments to boost Market Value.

## 17. Snowball Analysis
**Existing Snowball Risks:** District Control (+5% yield) combined with Development Networks (+5% yield) and Cashflow projects (+50% base yield). 
**Counterbalances:** The strict limits on development slots (max 2 per property), the 75% capitalization friction on development costs (`ECONOMY_SYSTEM.md`), Market Shocks, and the Municipal Levy (8% wealth tax on hoarded cash).
No artificial anti-leader penalties (e.g., rubber-banding, leader taxes) are added. Playtesting must measure if the natural friction is sufficient.

## 18. Comeback Analysis
**Existing Comeback Mechanics:** Market movement (Reversal cards), liquidity pressure forcing the leader to liquidate assets cheaply at 50% Asset Base, targeted trading, and Quick Auctions. The game relies on risk, market timing, and smart capitalization for comebacks, not artificial catch-up currencies or forced redistribution.

## 19. Replayability
Replayability emerges naturally from interacting systems: different dice distributions, shifting Market Pulses (Trend/Shock/Reversal), randomized News events, Development Exchange availability, varying District ownership races, and distinct player negotiation styles. No new replayability mechanics (e.g., random scenarios) are needed for the core loop.

## 20. Calibration Framework
Playtesting must log and compare:
A.  **Log:** Final wealth spread, auction prices, development frequency, bankruptcies.
B.  **Compare:** Yield income vs. Municipal Levy / Development sinks.
C.  **Warning Signs:** No trading occurs, passing is systematically preferred to buying, zero bankruptcies across multiple games, or the same player always wins by Round 15.
D.  **Serious Problems:** Runaway inflation (infinite money loop) or complete deflation (nobody can afford rent).
E.  **Adjustments:** If balance is off, adjust these locked parameters in order: (1) Starting Cash, (2) Velora Central Dividend, (3) Minimum Auction Bid, (4) Municipal Levy percentage. Do NOT rewrite core rules before adjusting these numbers.

## 21. Endgame UX
`NORMAL PLAY (Round 28) → FINAL ROUND WARNING (Round 29) → FINAL ROUND (Round 30) → GAME ENDS (Board freezes) → FINAL VALUATION (Instant calculation) → FINAL EDITION (UI Overlay) → WINNER REVEALED.`
The result is understandable within seconds. No long cinematic sequences delay the gratification.

## 22. Out of Scope
Explicitly excluded: Victory points, prestige, reputation, influence, hidden scoring, achievements, leader penalties, comeback bonuses, endgame currencies, random final scoring, secret objectives, contracts, missions, quests, new financial instruments, new property classes, new board spaces, and new development types.

## 23. Dependencies
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md` (Capitalization rules, Starting cash, Dividend)
*   `DEVELOPMENT_SYSTEM.md`
*   `MARKET_SYSTEM.md` (Market Value definition)
*   `NEWS_SYSTEM.md`
*   `DISTRICT_CONTROL.md`
*   `PLAYER_INTERACTION.md`
*   `AUCTION_SYSTEM.md`
*   `FINANCE_SYSTEM.md` (Bankruptcy triggers early termination)

## 24. Future Systems
*(All core systems governing endgame calculation are now locked.)*

## 25. Final Design Rule
The match must end decisively and deterministically based on the frozen paper wealth (Cash + Market Value) of the players, relying on the friction of existing economic systems rather than artificial catch-up mechanics to keep the final rounds competitive.

---
**Document Status:**
ENDGAME AND BALANCE SYSTEM v1 — LOCKED FOR GAME DESIGN
