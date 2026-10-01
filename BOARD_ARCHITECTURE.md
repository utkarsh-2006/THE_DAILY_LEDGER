# Board Architecture v1

**Status:** LOCKED FOR GAME DESIGN
**Authoritative Source:** This document is the authoritative source of truth for the board layout of The Daily Ledger.

---

## 1. Design Intent

The Daily Ledger board is designed to represent the living, breathing economy of Velora City. It serves as the physical layer where players navigate the city's districts, acquire properties, and interact with the broader economic mechanisms. The board must not feel like a Monopoly reskin; districts and spaces should be distinguished through economic identity, editorial language, typography, and subtle visual systems, avoiding bright, generic color groupings or simple punishment spaces. 

## 2. Board Philosophy

The board consists of 40 total spaces. It is intentionally asymmetrical: three sides of the board comprise the six property districts, while the fourth side consists entirely of the "Civic Mile"—a dense corridor of institutional, news, financial, and transport spaces. This asymmetry is a core feature, intended to make navigating the final stretch of the board feel like entering a distinct phase of Velora's machinery.

## 3. 40-Space Master Table

| # | Name | Type | Purpose / Identity |
|:---|:---|:---|:---|
| 00 | VELORA CENTRAL | Start | City dividend / lap reset |
| 01 | [P01] WEAVER'S MARKET | Old Quarter property | |
| 02 | [P02] FOUNDERS' SQUARE | Old Quarter property | |
| 03 | [P03] THE ROYAL ARCADE | Old Quarter property | |
| 04 | [P04] CROWN CUSTOMS HOUSE | Old Quarter property | |
| 05 | CITY DESK | News / information | |
| 06 | [P05] BROKER'S ROW | Exchange District property | |
| 07 | [P06] MERCANTILE EXCHANGE | Exchange District property | |
| 08 | [P07] NOVA TOWER | Exchange District property | |
| 09 | [P08] VELORA WORLD BANK | Exchange District property | |
| 10 | CIVIC HOLD | Special / temporary lock | |
| 11 | [P09] BAYSIDE MARINA | Riverfront property | |
| 12 | [P10] PIER 14 PAVILION | Riverfront property | |
| 13 | [P11] GRAND PROMENADE | Riverfront property | |
| 14 | [P12] AZURE RESORT | Riverfront property | |
| 15 | VELORA PORT | Transport | |
| 16 | [P13] SCRAP YARD DEPOT | Ironworks property | |
| 17 | [P14] STEEL FOUNDRY | Ironworks property | |
| 18 | [P15] RIVER PORT TERMINAL | Ironworks property | |
| 19 | [P16] VELORA HEAVY INDUSTRIES | Ironworks property | |
| 20 | CITY HALL | Civic special | |
| 21 | [P17] HIGHVIEW TERRACES | North Heights property | |
| 22 | [P18] NORTH UNIVERSITY | North Heights property | |
| 23 | [P19] CIVIC CENTER | North Heights property | |
| 24 | [P20] THE MAYOR'S ESTATE | North Heights property | |
| 25 | MUNICIPAL LEVY | Financial | Pressure |
| 26 | [P21] ASSEMBLY HANGAR | West Aerodrome property | |
| 27 | [P22] NEXUS TECH PARK | West Aerodrome property | |
| 28 | [P23] ORBITAL LOGISTICS CENTER | West Aerodrome property | |
| 29 | [P24] VELORA INTERNATIONAL | West Aerodrome property | |
| 30 | VELORA BOURSE | Civic special | Market interaction |
| 31 | MARKET DESK | News / market information | |
| 32 | CENTRAL METRO | Transport | |
| 33 | TREASURY WINDOW | Financial | Liquidity/choice |
| 34 | FOREIGN DESK | News / external information | |
| 35 | AERODROME LINK | Transport | |
| 36 | PROPERTY DESK | News / property information | |
| 37 | EASTERN RAIL TERMINAL | Transport | |
| 38 | REGULATORY COURT | Special | Sends player to Civic Hold |
| 39 | CIVIC RESERVE | Financial | Opportunity |

## 4. District Definitions

**Old Quarter (01–04)**
*   **Identity:** Historic commercial centre, traditional markets, established local businesses.
*   **Gameplay identity:** Accessible and resilient.

**Exchange District (06–09)**
*   **Identity:** Financial and commercial core of Velora. (Nova Tower remains a central landmark property).
*   **Gameplay identity:** High-value and financially sensitive.

**Riverfront (11–14)**
*   **Identity:** Waterfront commercial, hospitality, retail and leisure.
*   **Gameplay identity:** Growth and consumer/tourism exposure.

**Ironworks (16–19)**
*   **Identity:** Manufacturing, freight, processing and industrial logistics.
*   **Gameplay identity:** Higher volatility and economic exposure.

**North Heights (21–24)**
*   **Identity:** Affluent residential and institutional district.
*   **Gameplay identity:** Stable / defensive.

**West Aerodrome (26–29)**
*   **Identity:** Airport, expansion, technology and new development.
*   **Gameplay identity:** Speculative / future growth.

## 5. The Civic Mile Definition

Spaces 30–39 form the "Civic Mile." It is deliberately designed as a non-property-heavy institutional corridor representing the core machinery of Velora (market, news, transport, treasury, regulation, city administration). Navigating this stretch should mechanically and atmospherically feel distinctly different from traversing the property districts. It must not be flattened into a generic sequence of punishment spaces.

## 6. Architecture of Specific Systems

### News Spaces
There are four News spaces:
*   05 City Desk
*   31 Market Desk
*   34 Foreign Desk
*   36 Property Desk

These act as the city's information infrastructure. They are NOT generic random-punishment spaces. The future News System will dictate the specific information, forecasts, events, or choices they provide.

### Transport
There are four Transport spaces:
*   15 Velora Port
*   32 Central Metro
*   35 Aerodrome Link
*   37 Eastern Rail Terminal

These will eventually form a coherent infrastructure network.

### Financial Spaces
There are three Financial spaces, each representing a different type of financial interaction:
*   25 Municipal Levy (Pressure)
*   33 Treasury Window (Liquidity / choice)
*   39 Civic Reserve (Opportunity)

### Special Spaces (Locks and Regulations)
*   **10 Civic Hold:** The equivalent of a "Jail." However, landing on this space normally should NOT automatically lock the player. Entry is determined by the Risk & Locks system.
*   **38 Regulatory Court:** Specifically designed to send players to Civic Hold. It is positioned near the end of the Civic Mile.

## 7. Traffic-Design Rationale

The initial layout was tested against a two-dice traffic distribution. The first part of the board naturally receives stronger early exposure (since players start at 00 Velora Central, and 2d6 statistically favors 6–8). The layout has been arranged so that long-run exposure between property districts remains reasonably close. 

**Note:** Traffic must be recalculated after movement, doubles, and Civic Hold systems are finalized. This preliminary traffic simulation is not considered final balance data.

## 8. Explicitly Not Yet Designed

The following mechanics and systems are NOT YET DESIGNED and should not be assumed or invented within this document:
*   Property prices
*   Rent
*   Development
*   District-control abilities
*   Market formulas
*   News cadence
*   Auction rules
*   Trading rules
*   Debt
*   Civic Hold duration
*   Civic Hold release mechanics
*   Victory conditions
*   Final round count
