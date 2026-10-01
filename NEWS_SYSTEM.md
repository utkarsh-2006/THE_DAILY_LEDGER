# News System v1

**Status:** LOCKED FOR GAME DESIGN

## Purpose
The News System is the editorial presentation and information distribution layer of Velora City. The newspaper is a supporting information and world-building layer, giving context to the mechanical state of the game without overwhelming the primary board experience.

The Daily Ledger should feel like: **SEE → UNDERSTAND → DECIDE → PLAY**
Not: **READ → ANALYZE → MANAGE NEWS → PLAY**

Players should be able to temporarily ignore News and continue playing normally without losing control of the game.

## Design Principles
1.  **Market mechanically drives, News editorially explains:** The Market System is the mechanical authority. News must NEVER silently modify Market state.
2.  **Understandability over simulation:** Information should be premium, readable, and strategically useful without turning into a stock market simulator.
3.  **No new currencies:** Do not introduce information tokens, news points, or reputation.
4.  **Board primacy:** The board remains the primary game surface.
5.  **Information, not instruction:** News provides context but never explicitly tells players what to buy, sell, or build.

## News Categories
1.  **CITY:** World-building and city-wide events.
2.  **MARKET:** Editorial explanation of mechanical market events driven by `MARKET_SYSTEM.md`.
3.  **LEDGER:** Meaningful player-generated stories.
4.  **OUTLOOK:** Forward-looking information that may help players anticipate future conditions.

## Information States
1.  **CONFIRMED:** Factual reports of resolved mechanics or finalized player actions.
2.  **OUTLOOK:** Contextual hints or probabilities for upcoming market/development trends.
3.  **RUMOR:** Rare and lightweight speculation. Do not create a complex misinformation system.

## News Hierarchy
A strict hierarchy applies to visible news elements:
1.  **BREAKING NEWS** (Demands attention)
2.  **CURRENT MARKET / CITY STORY** (Demands attention)
3.  **TELEGRAPH WIRE** (Passive)
4.  **ARCHIVE** (Optional)

## Breaking News
Normally allow only **ONE** active Breaking News story.
Reserved for meaningful events: major Market Pulse, major player acquisition, major development, major city event, or significant game milestone. Do not make Breaking News constantly refresh.

## Velora Telegraph Wire
A lightweight, live event feed for routine game activity.
*Example:*
`10:45 UTKARSH ROLLED 8 → NOVA TOWER`
`10:43 VANE BUILT AN OFFICE ANNEX`
`10:41 MARKET PULSE REVEALED: FIN −5`
`10:38 RAVI PAID $84 RENT`

*   Only approximately 4–5 recent entries should be visible at once.
*   It is NOT a chat system and should not dominate the UI.

## Player Generated News
Only significant player events qualify for full Ledger stories:
*   First property acquisition / High-value acquisition
*   Significant trade
*   Major/Flagship development
*   Major auction
*   District milestone / Notable game milestone
*   Final result

Routine movement and routine rent remain Telegraph Wire events to avoid news spam.

## Market Integration
The News System interacts with `MARKET_SYSTEM.md` timing:
*   **Before resolution:** Outlook, Rumor, context.
*   **When Market Pulse is revealed:** Public mechanical information exists.
*   **When Market Pulse resolves:** News may publish a confirmed editorial explanation.

*Example:*
*   **Mechanical:** INDUSTRY & LOGISTICS −5
*   **Editorial:** FREIGHT ACTIVITY COOLS (Several incoming shipments have been delayed this week.)

*The editorial story must NOT replace the mechanical Market information.*

## Development Exchange Integration
News may influence the probability or editorial context surrounding Development families entering the Development Exchange.
*Example:* "ENERGY COSTS RISE ACROSS VELORA" may make Energy Retrofit more likely to appear.

However, News must NOT guarantee a specific development. `DEVELOPMENT_SYSTEM.md` remains authoritative for mechanics.

## Velora Bourse Integration
Public News provides contextual information. When a player lands on Velora Bourse, they may privately inspect the next Market Pulse (per `MARKET_SYSTEM.md`). Do not introduce another currency, information tokens, or reputation.

## News Timing
*   **Every player turn:** Telegraph Wire may update; no full article required.
*   **Every Market Round:** Relevant Market story may appear.
*   **Periodically:** City stories may appear.
*   **Significant player events:** Ledger story may appear.
*   **End of game:** Final Edition is generated.
*(Avoid constant news spam.)*

## Editorial Selection
A lightweight, deterministic editorial selection system prioritizes candidate stories based on: importance, recency, gameplay relevance, novelty, and duplication.

The UI should normally show:
*   One primary story
*   A small number of supporting items
*   A short Telegraph Wire
*(Do NOT create a giant content dashboard. AI-generated journalism is NOT required for v1.)*

## Content Architecture
Reusable news templates generate replayable match-specific stories without requiring hundreds of unique articles.

*Example Template:*
*   **CATEGORY:** MARKET
*   **EVENT:** INDUSTRY_NEGATIVE
*   **HEADLINE:** FREIGHT ACTIVITY COOLS
*   **BODY:** Several incoming shipments have been delayed this week.
*   **STATE:** CONFIRMED
*   **SECTOR:** INDUSTRY & LOGISTICS

Player templates use variables: `{PLAYER}`, `{PROPERTY}`, `{DISTRICT}`, `{SECTOR}`.

## Content Guidelines
Headlines must be short, specific, believable, newspaper-like, and easy to scan.
Avoid excessive drama, meme language, exclamation marks, generic AI-sounding writing, long paragraphs, or repetitive mechanical wording.

*   **GOOD:** FREIGHT ACTIVITY COOLS
*   **BAD:** WOW!!! INDUSTRY MARKET INDEX DROPS BY 5 POINTS!!!

Strategic Information: News must NOT explicitly instruct players what to buy/sell/build (e.g., never generate "BUY INDUSTRIAL PROPERTY NOW"). Instead, provide context: "FREIGHT CONTRACTS RISE". Players interpret the information themselves.

## News UI Principles
*   The board remains the primary game surface.
*   News is a contextual sidebar or temporary overlay.
*   The system must remain understandable during a 20–30 round match.

## News Archive
A lightweight optional Archive allows players to review meaningful previous stories. It must NOT become a dense encyclopedia.

## Final Edition
An end-of-match newspaper that summarizes the match: major story, market close, notable deal, major development, selected Telegraph events, final result context. The Final Edition is a presentation and replayability feature, not a new gameplay system.

## Replayability
Structured templates and variable injection ensure that every game feels dynamically reported without the overhead of massive content generation.

## Explicitly Out of Scope
Do NOT introduce: player-controlled newspapers, journalism skill trees, news currency, reputation points, journalism quests, journalist units, newspaper upgrades, advertising management, long-form articles, mandatory article reading, dozens of simultaneous stories, stock market commentary simulator, explicit investment recommendations, automatic news cash rewards/penalties, separate news resource, complex misinformation mechanics, AI-generated articles as a gameplay requirement, or giant random event decks.

## Dependencies
*   `BOARD_ARCHITECTURE.md`
*   `PROPERTY_SYSTEM.md`
*   `ECONOMY_SYSTEM.md`
*   `DEVELOPMENT_SYSTEM.md`
*   `MARKET_SYSTEM.md`

## Design Authority
Where conflicts exist, `MARKET_SYSTEM.md` owns market mechanics and `DEVELOPMENT_SYSTEM.md` owns development mechanics. `NEWS_SYSTEM.md` provides only the information and narrative presentation layer.

## Final Design Rule
Every proposed mechanic in this document must justify its existence as part of a polished digital board game designed to a premium standard.

---
**Document Status:**
NEWS SYSTEM v1 — LOCKED FOR GAME DESIGN
