# BOARD UI ARCHITECTURE

## 1. CORE VISUAL PRINCIPLE: MODULAR FOUR-RAIL GEOMETRY

The physical board is represented as **four independent visual rails** structured dynamically into the available viewport, breaking away from the classic 11x11 square grid.

There are NO distinct corner tiles in this implementation. The logical corner spaces (0, 10, 20, 30) are rendered as regular spaces belonging to the horizontal Top and Bottom rails.

### Geometry Breakdown

1. **LEFT RAIL**: Full-height vertical rail spanning the extreme left. Contains spaces 19 -> 10 (top to bottom on screen, though logically 10 is bottom, 19 is top. Wait, in layout: [19, 18, 17, 16, 15, 14, 13, 12, 11, 10]).
2. **RIGHT RAIL**: Full-height vertical rail spanning the extreme right. Contains spaces 30 -> 39 (top to bottom).
3. **TOP RAIL**: Horizontal rail spanning the gap **inset between** the Left and Right rails. Contains spaces 20 -> 29 (left to right).
4. **BOTTOM RAIL**: Horizontal rail spanning the gap **inset between** the Left and Right rails. Contains spaces 9 -> 0 (left to right visually on screen... Wait! Space 9 is left-most, space 0 is right-most).

### 2. VISUAL SPACE DISTRIBUTION (THE CARD NORMALIZATION)

To utilize wide rectangular displays without squashing the board:
- The top and bottom rails occupy height proportional to h-[16%].
- The left and right rails occupy width proportional to w-[15%].
- All cards share the exact same intrinsic "tall rectangle" layout (Color block inner, Price block outer, Name middle). 
- Left and Right rail card contents are cleanly rotated (-90deg and 90deg respectively) using a container query wrapper trick, which normalizes the aspect ratio perfectly regardless of viewport.

### 3. CENTRAL GAMEPLAY STAGE

The massive space formed centrally between the four rails is dedicated to the core gameplay stage. 
- It houses a decorative background representing Velora City (utilizing a subtle SVG skyline).
- Overlaid in the center is the authoritative **Gameplay Interaction Plaque**, presenting contextually correct choices (Roll Dice, Buy Property, Auction, End Turn, Waiting).

### 4. TECHNICAL IMPLEMENTATION

- **Framework**: Standard React/Next.js using Tailwind CSS Flexbox. No CSS Grids are used for the outer shell to allow fluid scaling.
- **Responsiveness**: containerType: 'size' (@container) is used on the rail cards to calculate typography (cqmin, cqw, cqh) strictly relative to the card's dimensions.
- **Token Positioning**: Player tokens are absolute-positioned in a z-30 flex container inside the card, wrapping neatly over the background.

This is a **DESIGN SPECIFICATION ONLY** mapping the 40 authoritative spaces into the modern modular tabletop form.
