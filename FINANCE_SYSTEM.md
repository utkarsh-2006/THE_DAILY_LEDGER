# Finance System v1

## Status
LOCKED FOR GAME DESIGN

## Purpose
The Finance System defines how The Daily Ledger handles financial obligations, liquidity pressure, inability to pay, asset liquidation, and bankruptcy. It exists to resolve financial pressure created by the game's economic mechanics. 

## Core Finance Philosophy
Finance is a fast, deterministic resolution mechanism, not an accounting simulator. The system revolves around a simple logic flow: **"I owe money → I need liquidity → I liquidate assets → I pay → I continue."** It relies on liquidity pressure to force strategic decisions and deliberately avoids loans, interest rates, and complex banking mechanics.

## Financial Obligations
Mandatory payments occur when a player must pay:
1.  **Rent:** Owed to another player upon landing on their property.
2.  **Municipal Levy:** Owed to the City (8% of cash, min $40, max $180) upon landing on the Levy space.
3.  **Quick Auction Winning Bid:** Owed to the City upon winning a property.
*(Property and Development purchases are voluntary and cannot trigger a mandatory liquidity crisis, as players cannot initiate them without sufficient cash).*

## Universal Payment Resolution
All mandatory obligations follow a strict resolution path:
**OBLIGATION → CHECK CASH → PAY (if sufficient) → IF INSUFFICIENT, LIQUIDITY RESOLUTION → RECHECK → PAY OR INSOLVENCY**

The game pauses the active player's turn inside this safe resolution window until the obligation is satisfied or bankruptcy occurs.

## Liquidity Resolution
When a player lacks sufficient cash to satisfy a mandatory obligation, they enter a temporary Liquidity Resolution window. 
During this window, the player may raise cash through:
1.  **Development Liquidation** (Demolition)
2.  **Property Liquidation** (Selling to the City)
3.  **Accepting existing Trade Offers** (Player-to-Player)

Players may perform these actions in any combination until they possess enough cash to satisfy the obligation. Once the obligation can be met, it is automatically paid, and the game continues.

## Property Liquidation
A player may liquidate a property by selling it back to the City.
*   **Sale Value:** 50% of the property's ASSET BASE (`Asking Price + Capitalized Development Value`, per `MARKET_SYSTEM.md`).
*   Market Value is explicitly ignored for liquidation to prevent players from exploiting market highs for guaranteed cash.
*   The property immediately reverts to an **Unowned** state.
*   All attached developments are destroyed (they do not return cash beyond their 75% capitalized contribution to the Asset Base).
*   District Control and Network eligibility recalculate instantly.
*   Flagships attached to liquidated properties are destroyed.

## Development Liquidation
A player may choose to liquidate (demolish) an existing standard development without selling the underlying property.
*   **Recovery Value:** 50% of the original construction cost.
*   The development slot opens up, and the property's Current Yield and Asset Base instantly recalculate.
*   The development returns to the available supply (as per `DEVELOPMENT_SYSTEM.md`).

## Player-to-Player Liquidity
To avoid stalling the game with infinite emergency negotiation phases, a player in a Liquidity Resolution window **cannot** halt the game to actively solicit new trade offers. 
*   However, they **may** accept any pre-existing, valid trade offers sitting in their inbox (per `PLAYER_INTERACTION.md`) if those trades yield cash. 
*   Because trades are atomic and fast, accepting an existing offer immediately updates their cash balance, potentially saving them from forced liquidation.

## Debt Decision
**Debt is EXPLICITLY REJECTED for v1.**
*Rationale:* Introducing debt (even simple IOU mechanics) instantly creates the need for repayment tracking, interest, credit limits, and complex default logic, turning the game into a spreadsheet simulator. In Velora City, if you cannot raise the cash, you must liquidate assets. 

## Insolvency / Bankruptcy
If a player exhausts all properties, developments, and valid trade offers, and still cannot satisfy the mandatory obligation, they are **Insolvent**.
*   **Elimination:** The player is immediately eliminated from the game.
*   **If owed to another player (Rent):** The bankrupt player's remaining cash transfers to the owed player. (Since they liquidated all properties trying to survive, no properties transfer).
*   **If owed to the City (Levy/Auction):** The remaining cash is surrendered to the City.
*   Their board piece is removed, all pending trade offers involving them are instantly invalidated, and any future turns are skipped.
*   *Note:* Because players must liquidate to the City to raise cash *before* declaring bankruptcy, complex "transfer of portfolio" bankruptcy rules are avoided. The owed player gets exactly what cash could be scrounged.

## Rent Resolution
`Player A lands on Player B's property → Rent calculated → Player A pays → Player B receives → Turn continues.`
If Player A cannot pay full rent, they enter Liquidity Resolution. 
*   No partial payments are allowed.
*   No "forgiveness" or rent negotiation can occur during the mandatory payment window to preserve deterministic resolution.
*   Player A must liquidate until they can pay the full amount, or until they go bankrupt.

## Municipal Levy Integration
Follows the same Universal Payment Resolution. The debt is owed to the City. If the player cannot raise the funds through liquidation, they go bankrupt and are eliminated.

## Auction Integration
As defined in `AUCTION_SYSTEM.md`, the UI prevents submitting a bid higher than available cash. However, if an asynchronous edge case occurs where the winner's cash drops below the winning bid before execution, their bid simply becomes invalid. The auction evaluates the next valid bid. Therefore, Quick Auctions **cannot** force a player into Liquidity Resolution or Bankruptcy.

## District Control Integration
Any asset liquidation (Property or Development) immediately triggers `DISTRICT_CONTROL.md` logic.
*   Losing a property recalculates Presence/Established/Majority/Control.
*   Losing a development may break a Development Network.
*   Control yield bonuses (+5%) are instantly removed if control is lost.

## Market Integration
Market Value remains paper wealth. Fluctuations in the Market Index do not directly force players to pay cash, nor do they alter the deterministic 50% Asset Base liquidation value. 

## News Integration
Routine rent payments and minor liquidations remain quiet.
*   A Ledger story is generated for a Player Bankruptcy (e.g., *"UTKARSH DECLARES BANKRUPTCY, FORCED OUT OF VELORA"*).
*   A Telegraph Wire entry may be generated for extreme liquidations (e.g., selling a Flagship).
No separate financial news system is required; `NEWS_SYSTEM.md` remains authoritative.

## UI / Player Experience
The UI relies on a contextual resolution overlay.
```text
PAYMENT DUE: RENT TO VANE
AMOUNT: $180
YOUR CASH: $72
SHORTFALL: $108

[RAISE CASH] 
```
*(Note: [DECLARE BANKRUPTCY] only appears after all valid liquidity options are exhausted to prevent premature elimination.)*
Clicking `[RAISE CASH]` opens a compact menu allowing the player to quickly click properties/developments to liquidate them for immediate cash, or accept inbox trade offers. The board remains fully visible. There are no balance sheets, loan screens, or accounting tabs.

## Balance Considerations
By setting liquidation returns at 50% of the Asset Base, liquidation is inherently painful, actively destroying wealth. This creates severe liquidity pressure and makes hoarding properties with zero cash a highly risky strategy. 
*Calibration Point:* If 50% proves too punishing (causing runaway bankruptcy chains), it can be adjusted to 75% during playtesting. For v1, 50% enforces tight economic discipline.

## Out of Scope
Explicitly excluded: Debt, credit scores, banks as player entities, multiple currencies, stocks, bonds, interest-rate markets, insurance, mortgages, loans between players, complex debt instruments, credit ratings, financial advisors, tax systems beyond the existing Levy, financial skill trees, finance XP, financial reputation, accounting dashboards, automated portfolio optimization, AI financial advice, and complicated liquidation markets.

## Dependencies
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md`
*   `DEVELOPMENT_SYSTEM.md`
*   `MARKET_SYSTEM.md`
*   `DISTRICT_CONTROL.md`
*   `PLAYER_INTERACTION.md`
*   `AUCTION_SYSTEM.md`
*   `NEWS_SYSTEM.md`
*   `ENDGAME_AND_BALANCE.md`

## Final Design Rule
The Finance System ensures that mandatory obligations halt the game only long enough for the owing player to rapidly and deterministically liquidate assets or declare bankruptcy, preserving the fast-paced, cutthroat nature of Velora City without introducing accounting simulators.

---
**Document Status:**
FINANCE SYSTEM v1 — LOCKED FOR GAME DESIGN
