# Auction System v1

## Status
LOCKED FOR GAME DESIGN

## Purpose
The Auction System solves a specific economic problem: when a player lands on an available property and passes, that property must have a secondary mechanism to enter the economy rather than sitting permanently idle. The Quick Auction acts as a fast, deterministic secondary acquisition mechanic, transforming a pass into a simultaneous price-discovery event for all players.

## Design Philosophy
The system must follow a clean, fast pipeline:
**PASS → QUICK AUCTION → SEALED BIDS → HIGHEST VALID BID → PROPERTY TRANSFER**

It relies on one format, one bid, one winner, one payment, and immediate resolution. It must not become a separate game phase, a long negotiation, or an ascending bidding war. Do not expand the system unnecessarily.

## Quick Auction Trigger
An auction triggers deterministically and immediately when:
*   The active player lands on an unowned property AND explicitly selects the **PASS** action.
*   (Or if the active player lands on an unowned property but possesses insufficient cash to buy it at the Asking Price, forcing an automatic PASS).

The auction is a mandatory resolution step for that space. The turn cannot proceed to the next player until the Quick Auction completes.

## Auction Eligibility
All active, non-bankrupt players in the game are eligible to participate, **including** the active player who triggered the auction. 
*   A player who cannot afford the property's Asking Price may still participate in the Quick Auction if they can afford the Minimum Bid.
*   A player whose available cash is strictly below the Minimum Bid is ineligible.
*   Players blocked by an existing mandatory resolution are ineligible.

## Auction Format
The Quick Auction uses a **single sealed bid**. No player can see another player's bid before the simultaneous reveal. Players may not react to or increase their bids once submitted.

## Minimum Bid
To ensure price discovery while preventing the auction from becoming a reliable way to acquire $300–$600 properties for trivial amounts (which would make passing systematically optimal), the Quick Auction uses a deterministic floor:
**Minimum Bid = 50% of the Asking Price** (rounded up to the nearest integer).

*Rationale:* A 50% floor ensures that acquiring the property still requires a meaningful commitment of liquidity, preserving the economic pressure of the $1,800 starting cash and property price bands, while still offering enough of a discount to encourage competitive bidding.
*Calibration Point:* If playtesting shows this floor is too restrictive or still too generous, this percentage explicitly remains a calibration point, but the rule itself remains deterministic. Do not create an auction-specific Market Value formula.

## Bid Submission Window
The auction has a bounded bid-submission window. During this window:
*   Eligible players submit one sealed bid or NO BID.
*   Submitted bids remain hidden.
*   Players cannot change their bid after submission.
*   When the window closes, players who have not submitted are treated as NO BID.
*   All valid bids are revealed simultaneously.

*(The exact UI/network timeout duration will be calibrated during implementation; the game rule is simply that it cannot remain open indefinitely).*

## Invalid Bid Handling
The authoritative game state must validate bids. If a submitted bid is invalid because it exceeds the player's available cash or violates the minimum bid, **that bid is invalid and is treated as NO BID.** The system must NOT silently modify or "clamp" a player's intended bid.

## Winner Determination
The highest valid bid wins. The winning player becomes the buyer.

## Tie Resolution
In the event of a tie for the highest valid bid, the winner is determined deterministically by turn order proximity. 
*   **Rule:** Starting from the active player (who triggered the auction) and moving sequentially in standard turn order, the tied player encountered first wins.
*   Eliminated or inactive players are skipped.
*   The active player's position is the reference point.
*   No second bidding round occurs, and no randomizer is introduced.

## No-Bid Resolution
If all eligible players submit NO BID (or if no valid bids are received), the auction closes without a winner. The property remains unowned and the active player's turn proceeds normally.

## Payment and Atomic Execution
The auction must resolve atomically. Before committing the winning bid, the system verifies:
1.  Winning player still exists as an eligible player.
2.  Winning player still possesses sufficient cash.
3.  Property remains unowned.
4.  No mandatory resolution blocks the transaction.
5.  No conflicting transaction has transferred the property.

If validation fails, the transaction does not partially execute.
If the highest bid becomes invalid before execution: **invalidate that bid and evaluate the next highest valid bid.** 
If no valid bids remain: **auction closes with no winner and the property remains unowned.** (Do not restart the auction or introduce a second round).

If valid:
1.  Deduct the winning bid amount from the winner's cash.
2.  Transfer that cash to the bank/city (removing it from player circulation).
3.  Transfer the property deed to the winner.
4.  Immediately recalculate district ownership logic.

## Property Transfer
The property transfers cleanly to the winner. 

## Economy Integration
Auction payments go directly to the CITY / BANK and are removed from player liquidity, acting as an existing cash sink. This respects `ECONOMY_SYSTEM.md`. The auction does not create new money.

## Market Integration
*   **Asking Price ≠ Market Value ≠ Minimum Bid ≠ Winning Bid**
*   Market Value is strictly informational, not a mandatory transaction price.
*   Winning bids may be below, equal to, or above Market Value.
*   The auction does NOT trigger a Market Pulse or recalculate Market Value.

## Development Integration
Newly auctioned properties have no attached developments because they were previously unowned. Future development follows the normal `DEVELOPMENT_SYSTEM.md` rules. Auction acquisition does not bypass development requirements. No special auction development rules are created.

## District Control Integration
Following `DISTRICT_CONTROL.md`, immediately after the property transfer:
*   District ownership count updates immediately.
*   Presence / Established / Majority / Control state recalculates.
*   Relevant Control bonuses (+5% yield) and Network eligibilities instantly update.
*   Flagship eligibility updates where applicable.
No auction-specific district bonuses exist, and existing developments in the district are not destroyed.

## Player Interaction Integration
While an auction is active:
*   The property cannot be traded.
*   Players cannot use a trade to manipulate the auction.
*   The auction cannot be interrupted by a normal trade.
After the auction completes, the property becomes normally tradable according to `PLAYER_INTERACTION.md` rules.

## News Integration
Routine auctions remain quiet. Only significant auctions may enter the Telegraph Wire (e.g., unusually high winning bid, district control changes, strategically notable acquisition). `NEWS_SYSTEM.md` remains authoritative for editorial presentation. Do not create a separate numerical "newsworthiness score."

## Multiplayer Rules
*   **Auction Start:** Server broadcasts auction state to all clients.
*   **Participant List & Window:** Bounded submission window starts.
*   **Bid Lock:** Clients submit sealed bids; server holds them invisibly until the window closes.
*   **Simultaneous Reveal & Resolution:** Server calculates the winner, resolves the atomic transaction, and broadcasts the result. No client can determine the winner independently.

## UI Principles
The auction uses a compact contextual overlay to keep the board visible.
**Flow:**
1. `QUICK AUCTION: NOVA TOWER | ASKING PRICE: $360 | MARKET VALUE: $375 | CURRENT YIELD: $61`
2. `YOUR BID: $___ [SUBMIT] [PASS]`
3. `AUCTION RESULTS | WINNER: VANE | WINNING BID: $410`
The interface must remain minimal. Do NOT add auction dashboards, bid charts, live bidding animations, multiple bidding screens, auction analytics, fair-price indicators, recommended bids, or "good/bad deal" labels.

## Edge Cases
1.  **No valid bids:** Property remains unowned.
2.  **Only one valid bid:** They win at their submitted bid.
3.  **Highest-bid tie:** Turn-order proximity to the active player breaks the tie.
4.  **Invalid submitted bid:** Treated as NO BID.
5.  **Winning player loses sufficient cash before execution:** Their bid is invalidated; the next highest valid bid wins.
6.  **Highest bid becomes invalid and next highest bid remains valid:** Next highest valid bid wins.
7.  **Property becomes unavailable before resolution:** Auction cancels.
8.  **Player becomes inactive/eliminated:** Their bid is invalidated.
9.  **Player attempts to trade the auctioned property:** Blocked by Player Interaction rules.
10. **Auction changes District Control:** Instantly recalculates bonuses.
11. **Winning bid differs from Market Value:** Fully allowed; Market Value is informational.
12. **Conflicting transactions:** Atomic execution locks the state, preventing conflicts.

## Bot Compatibility
The auction exposes structured information (Asking Price, Market Value, Current Yield, District, development state, owner status). Future bots can use this clear data to programmatically calculate a maximum bid limit. Do NOT create that valuation formula now.

## Balance Considerations
Auctions act as a secondary acquisition channel that sinks liquidity. By enforcing a Minimum Bid of 50% of the Asking Price, the game prevents systematic exploitation of passing without destroying the price-discovery aspect of the auction. The $1,800 starting cash and the existing property price bands are respected.
*Calibration Point:* The exact 50% threshold is a deterministic v1 rule, but remains a playtest calibration point if it drains liquidity too fast or still enables properties to be acquired too cheaply.

## Out of Scope
Explicitly excluded: Live ascending auctions, multiple auction rounds, auction currencies, auction points, auction reputation, auction skill, auction levels, auction houses, player loans, auction financing, hidden reserve prices (unless absolutely required), property shares, partial ownership, automatic fair-price enforcement, automatic bid recommendations, AI bidding, auction-specific market manipulation, auction-specific development rules, auction-specific district rules, mandatory trading phases, and separate auction dashboards.

## Dependencies
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md`
*   `DEVELOPMENT_SYSTEM.md`
*   `MARKET_SYSTEM.md`
*   `DISTRICT_CONTROL.md`
*   `PLAYER_INTERACTION.md`
*   `NEWS_SYSTEM.md`
*   `FINANCE_SYSTEM.md`
*   `ENDGAME_AND_BALANCE.md`

## Final Design Rule
The Auction System is a fast, deterministic, single-bid secondary acquisition mechanic that strictly respects existing economic, market, and district rules without introducing new phases, currencies, or prolonged negotiations.

---
**Document Status:**
AUCTION SYSTEM v1 — LOCKED FOR GAME DESIGN
