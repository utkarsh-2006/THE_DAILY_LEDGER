# BOARD UI ARCHITECTURE

**Status:** DESIGN SPECIFICATION
**Purpose:** This document defines exactly how the existing locked game architecture of *The Daily Ledger* is represented visually in the frontend. It is a strict UI specification. It does not modify game rules, board mapping, or backend logic.

---

## 1. CORE VISUAL PRINCIPLE

The board is a **COMPACT CONNECTED SQUARE BOARD**.

> [!IMPORTANT]
> The "Disconnected Four-Row Board" direction has been formally rejected and superseded. The authoritative visual direction is now the compact connected square perimeter, referencing the structural efficiency of physical tabletop boards.

It prioritizes:
1. Physical Board Presence (one unified object, not four floating rails)
2. Property Readability
3. Continuous Perimeter (visually unbroken loop)
4. Dominant Spatial Footprint

The board **must** read as a **single designed object** — a board shell → perimeter → 40 tiles → central gameplay stage.

It rejects:
- Four independent floating strips with open corners
- Disconnected rails separated by a giant empty rectangle
- Dashboard-style layout

The Daily Ledger must visually feel like:
**PHYSICAL BOARD GAME FIRST** → **NEWSPAPER SECOND** → **DIGITAL APPLICATION THIRD**

The board is the primary object. The UI must never resemble a generic web dashboard.

---

## 2. THREE COLUMN DESKTOP STRUCTURE

The desktop game view consists of exactly three visual zones that must fit within one viewport without page scrolling (optimized for 1440×900 up to 1920×1080).

**[ LEFT SIDEBAR (18-22%) ] | [ CENTER BOARD (56-64%) ] | [ RIGHT SIDEBAR (18-22%) ]**

### Left Sidebar (Shared Table Information)
*   **Players:** Compact list showing Player Name, Cash, Marker color, and current turn indicator.
*   **Velora News:** A dedicated news feed modeled on the newspaper/editorial style (City, Market, Ledger, Outlook). Must visibly distinguish between Confirmed, Outlook, and Rumor.
*   **Telegraph Wire:** A distinct, chronological live event feed.
*   **Chat:** Small, persistent communications area.

### Center Board (Active Game Stage)
*   **Macro Layout:** Classic Monopoly-style square perimeter using an 11×11 CSS grid.
    *   **Corner cells:** 4 corner spaces (0, 10, 20, 30) are larger square tiles (1.7fr).
    *   **Bottom Row:** spaces 0–10, left to right (grid row 11).
    *   **Right Column:** spaces 11–19, bottom to top (grid col 11).
    *   **Top Row:** spaces 20–30, right to left (grid row 1).
    *   **Left Column:** spaces 31–39, top to bottom (grid col 1).
*   **Perimeter Rule:** All tiles are visually connected as a continuous border. No gaps between adjacent tiles.
*   **Velora City Center:** The 9×9 interior (cols 2–10, rows 2–10) is the gameplay stage with watermark artwork and the active interaction panel.

### Right Sidebar (Player Desk)
*   **Player Overview:** Current player's Cash, Market Value, Net Worth.
*   **Contextual Property Information:** Detailed data when a property is hovered or selected.
*   **Actions:** Develop, Trade, Market, Property Desk.

---

## 3. TILE ORIENTATION

*   **TOP ROW:** Normal horizontal. Color accent band faces the board center (bottom edge of tile).
*   **BOTTOM ROW:** Normal horizontal. Color accent band faces the board center (top edge of tile).
*   **LEFT COLUMN:** Rotated +90°. Text reads bottom-to-top from the left edge. Color band faces center (right edge of rotated tile).
*   **RIGHT COLUMN:** Rotated -90°. Text reads top-to-bottom from the right edge. Color band faces center (left edge of rotated tile).
*   **CORNERS:** Unrotated. Displayed as larger square landmark tiles with icon and name.

---

## 4. THE CIVIC MILE CONSTRAINT

According to `BOARD_ARCHITECTURE.md`, the fourth side of the board (spaces 31-39) is the "Civic Mile" — a dense corridor of institutional, news, financial, and transport spaces with zero standard properties.
*   **Visual Rule:** Do not "correct" this asymmetry by inventing properties. The visual specification must make the Civic Mile look deliberate. The right side of the board will visually contrast the other three sides by presenting a continuous strip of civic seals, newspaper icons, and architectural symbols, emphasizing the transition from property markets into institutional machinery.

---

## 5. PROPERTY TILE VISUALS

Property cards must be extremely minimal. They contain **ONLY**:
1. District visual identifier (small icon / restrained accent strip).
2. Complete property name.
3. Asking price.
4. Tiny ownership indicator (when owned).
5. Minimal development indicator (when developed).

**Strict Exclusions:**
*   NO technical metadata: `[P01]`, `D04`, `NODE`, `EVENT`, `PROPERTY ID`, etc.
*   NO deep financial data permanently on the tile: Yield, Market Value, Slot 1/2 text.
*   NO giant solid district-colored backgrounds. The paper/ivory texture must remain dominant.

### Property Name Rule (Non-Negotiable)
Property names must **NEVER** be artificially truncated. They must be rendered completely using intelligent line-wrapping (e.g., "ORBITAL LOGISTICS CENTER"). The tile dimensions must be designed to accommodate the longest names gracefully.

### Hover Information
Detailed data belongs strictly in the hover/context layer. When hovering, a compact tooltip/detail panel appears containing:
*   Property Name & District
*   Asking Price, Market Value, Current Yield
*   Development Slots
*   Sector Exposure

---

## 6. SPECIAL SPACES & CORNERS

### Special Spaces
Must look distinct from properties. They use an icon, name, restrained category accent, and a very short contextual descriptor if necessary (e.g., `CITY DESK`, `CENTRAL METRO`). No technical IDs.

### Corners
Corners (00, 10, 20, 30) are landmarks and must be visually stronger than standard spaces. Since corners are part of the Top/Bottom rails, they sit at the ends of these rails.
*   `00 VELORA CENTRAL` (Signature Corner)
*   `10 CIVIC HOLD`
*   `20 CITY HALL`
*   `30 VELORA BOURSE`
They require unique architectural/editorial identity, not just oversized generic rectangles.

---

## 7. CENTRAL GAMEPLAY LAYER

The central board area contains the **Velora City Image**. This is an engraved/architectural illustration printed on paper that sits underneath the gameplay layer. It must be visible but subtle enough to not overpower the interactions.

**The Interaction Overlay:**
The player should never leave the board to perform primary actions. The central overlay manages:
*   **Pre-Roll:** "YOUR TURN", Dice visuals, "ROLL DICE" button.
*   **Post-Roll:** Dice result (e.g., "RESULT: 8"), landed space name.
*   **Decisions:** "BUY PROPERTY", "AUCTION", "PASS" (these appear directly in the center, not in the sidebar).

---

## 8. PLAYER PIECES AND OWNERSHIP

*   **Player Pieces:** Small circular/compact tokens that physically sit on spaces without obscuring the property name. Maximum 4 players visually accommodated (cleanly offset).
*   **Ownership:** Indicated by a tiny visual marker (e.g., small player colored dot or thin line). Do NOT recolor the entire property tile.

---

## 9. DISTRICT IDENTITY & VISUAL LANGUAGE

### District Palette
*   **Old Quarter:** Deep burgundy
*   **Exchange District:** Imperial purple
*   **Riverfront:** Teal
*   **Ironworks:** Burnt copper
*   **North Heights:** Forest green
*   **West Aerodrome:** Aviation blue

Colors are restrained to thin borders or small accent strips. Special spaces use separate civic/editorial accents.

### Newspaper Visual Language
The existing Daily Ledger identity from `UI_REFERENCE/code.html` is strictly preserved:
*   Serif newspaper masthead (THE DAILY LEDGER, VELORA CITY CHRONICLE, BOURSE TICKER).
*   Condensed editorial typography.
*   Warm ivory/paper background.
*   Dark ink borders and thin black rules.
*   No SaaS/dashboard styling, no oversized shadows, no glowing gradients.
