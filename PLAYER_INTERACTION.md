# Player Interaction System v1

## Status
LOCKED FOR GAME DESIGN

## Purpose
The Player Interaction System defines how players interact economically with each other, primarily through structured property and cash trading. Trading exists to create strategic tension around district control, development, sector exposure, liquidity, and portfolio positioning. Trading must remain optional; a player should be able to complete a game normally even if they rarely trade.

## Design Philosophy
The system must be understandable as:
**SEE VALUE → MAKE OFFER → NEGOTIATE → ACCEPT / REJECT → TRANSFER → RECALCULATE**

Trading should remain optional, structured, fast, transparent, contextual, and strategically meaningful. It revolves entirely around properties, cash, district control, development, sector exposure, and liquidity. Do NOT turn trading into a negotiation minigame, diplomacy system, contract engine, or separate gameplay phase.

## Core Trade Model
Trading is a contextual, structured, digital proposal system. Players construct atomic offers. The receiving player evaluates the offer and chooses to Accept, Reject, or Counter. Market Value acts as an informational reference point, but players are free to negotiate based on strategic value.

## Tradable Assets
A trade may contain any combination of:
*   **CASH:** Spendable cash.
*   **OWNED PROPERTIES:** Properties transfer together with all attached developments.

## Non-Tradable Assets
To prevent the game from becoming a complicated contract engine, the following are explicitly PROHIBITED from trading:
*   Future rent or dividends
*   Future Market Value
*   Promises, favors, or votes
*   Development projects before construction
*   Detached physical developments (they must remain on the property)
*   Market Pulse cards or private information
*   Flagship eligibility or District Control itself
*   Debt obligations or loans between players

## Trade Construction
A trade may contain any combination of cash and owned properties from either side. 
*Examples:*
*   Property for cash
*   Property for property
*   Property plus cash for property
*   Multiple properties plus cash for multiple properties

## Trade Timing
Players may create and send trade proposals asynchronously when the game is not blocking interaction.
An accepted trade should execute only during a safe game-state window.

A trade **cannot**:
*   Execute while a player is resolving a mandatory board action (e.g., rent, Municipal Levy, auction payment).
*   Interrupt dice movement.
*   Interrupt rent/payment resolution.
*   Interrupt an auction.
*   Interrupt a development action already in progress.
*   Interrupt another atomic game-state transition.

Once the game reaches a safe resolution window, an accepted valid trade executes atomically.

## Offer Lifecycle
An offer remains valid until the receiving player's next turn begins, unless:
*   the sender cancels it,
*   the receiver rejects it,
*   a required asset becomes unavailable,
*   another transaction changes the validity of the offer,
*   or the game state otherwise makes the proposal invalid.

When the receiving player's next turn begins, unresolved offers expire automatically.

## Counteroffers
A counteroffer creates a new proposal in the same finite proposal thread.
*   Initial proposal = proposal 1.
*   The receiver may reject, accept, or issue a counteroffer.
*   A maximum of 2 counteroffers may be made within that proposal thread.
*   After the second counteroffer, the thread can only be accepted or rejected.
*   A new independent proposal may begin afterward.
*(This prevents infinite negotiation chains.)*

## Validation and Atomic Execution
At execution, the system verifies:
*   Both players still own all offered properties.
*   Both players still possess all offered cash.
*   No offered property is currently locked by an active auction or mandatory resolution.
*   Neither player is currently blocked by a mandatory payment.
*   No conflicting transaction has already transferred an offered asset.

If validation fails, the trade does not partially execute. It becomes invalid/expired and both players retain their existing assets.

## Property and Development Transfer
When a property is traded:
*   The property transfers to the new owner.
*   All attached standard developments transfer with it.
*   The property's development state remains intact (no refund occurs, no development is destroyed).
*   The property remains subject to the same development compatibility rules.
*   Flagship ownership behavior remains consistent with the existing District Control and Development systems.

## District Control Integration
After a property transfer, the district ownership count is recalculated immediately:
*   Presence / Established / Majority / Control state updates.
*   Control bonuses (+5% yield) update.
*   Development Network eligibility updates.
Existing developments are NOT destroyed when control changes. No new district trading subsystem is created.

## Market Integration
*   Market Value is informational.
*   Trading does not trigger a Market Pulse.
*   Trading does not independently recalculate Market Value.
*   Current Market Value is simply the latest available information when negotiating.
*   Players may trade above or below Market Value.

Explicitly: **Market Value ≠ Negotiated Value ≠ Strategic Value.** Do not introduce a mandatory fair-price system.

## News Integration
A completed trade may generate a Telegraph Wire entry ONLY when it is significant, for example:
*   Completes or breaks District Control.
*   Materially changes control of a district.
*   Involves a high-value property or substantial cash transaction.
*   Creates a notable portfolio shift or otherwise represents a meaningful city event.

Routine low-value trades do not need a news entry. `NEWS_SYSTEM.md` remains authoritative for editorial presentation.

## Multiplayer Rules
Trade proposals are synchronized. Accepted trades execute atomically. Only one accepted transaction can transfer a given asset. Simultaneous conflicting proposals are resolved by the first valid accepted transaction; subsequent proposals involving already-transferred assets become invalid.

## Trade History
Keep a minimal recent transaction history for transparency. It should show basic information such as players involved, properties exchanged, cash exchanged, and round/time. Do not create a financial analytics dashboard.

## UI Principles
The trading UI should remain contextual. A player should be able to:
1. Select another player.
2. Choose properties and/or cash.
3. Review the proposed exchange.
4. Send proposal.
5. Recipient accepts, rejects, or counters.
6. Valid accepted proposal executes atomically.

Keep the board visible behind the interaction. Do NOT create permanent trading dashboards, diplomacy screens, relationship meters, trade scores, automatic "good/bad deal" labels, complex spreadsheets, or negotiation minigames.

## Gameplay Examples
*   **Selling for Liquidity:** Vane needs $200 before hitting a Municipal Levy. She offers Utkarsh her Riverfront property (Market Value $350) for $250 cash. Utkarsh accepts. Vane survives; Utkarsh gains an asset. *(Note: If Vane lands on the Levy, she must resolve the mandatory payment and cannot execute a trade during the resolution window.)*
*   **Completing District Control:** Ravi owns 3/4 of Ironworks. Elena owns the 4th property. Ravi offers Elena $600 + a North Heights property to complete his district. Elena accepts. Ravi instantly gains District Control (+5% yield, Network eligibility).
*   **Restructuring Exposure:** Trading a developed Technology property for an undeveloped Heritage Commerce property to balance a player's sector portfolio against incoming shocks.

## Anti-Kingmaking Philosophy
The game should not automatically judge whether a trade is "fair." Do NOT introduce automatic fair-value enforcement, trade rejection based on perceived fairness, reputation penalties, relationship/diplomatic scores, or mandatory asset exchange rules. Extreme kingmaking or collusive trading should be evaluated during playtesting rather than solved prematurely through hard-coded restrictions.

## Balance Considerations
Trading redistributes wealth and sector exposure; it never creates or destroys money, nor does it independently alter Market Value.

## Out of Scope
Do NOT introduce: trade currencies, reputation, diplomacy points, relationship scores, future promises, loans, interest, contracts, partial ownership, shares, leasing, royalties, taxes/fees, automatic fair-value scoring, AI negotiation, trade skill trees, or mandatory trading phases.

## Dependencies
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md`
*   `DEVELOPMENT_SYSTEM.md`
*   `MARKET_SYSTEM.md`
*   `DISTRICT_CONTROL.md`
*   `NEWS_SYSTEM.md`
*   `AUCTION_SYSTEM.md`
*   `FINANCE_SYSTEM.md`
*   `ENDGAME_AND_BALANCE.md`

*(Note: The structured trade format is designed to remain compatible with future bot logic, but actual bot valuation and negotiation behavior belong to a future AI/player-agent system.)*

## Future Resolution Items
*(None currently flagged; previous naming inconsistencies resolved by `PROPERTY_CATALOGUE.md`.)*

## Final Design Rule
Player interaction must serve the strategic goals of the game through a clean, fast, structured digital interface that executes trades atomically within safe resolution windows, respecting the primacy of the main board and the authority of all other established systems.

---
**Document Status:**
PLAYER INTERACTION SYSTEM v1 — LOCKED FOR GAME DESIGN
