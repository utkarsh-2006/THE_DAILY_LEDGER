# The Daily Ledger - Development Setup

This document outlines the exact steps required to clone, build, and run the playable vertical slice of The Daily Ledger locally.

## PREREQUISITES

*   **Git**
*   **Node.js** (v18 or higher recommended)
*   **npm** (comes with Node.js)

## INSTALLATION

1.  Clone the repository:
    ```bash
    git clone https://github.com/utkarsh-2006/THE_DAILY_LEDGER.git
    cd THE_DAILY_LEDGER
    ```

2.  Install all dependencies across the monorepo:
    ```bash
    npm install
    ```

## RUNNING LOCALLY

To run the playable game locally, you need to start both the Colyseus game server and the Next.js web application.

1.  **Start the Game Server:**
    In your first terminal, run:
    ```bash
    npm run dev --prefix apps/server
    ```
    *This runs on `ws://localhost:2567` by default.*

2.  **Start the Web Application:**
    In a second terminal, run:
    ```bash
    npm run dev --prefix apps/web
    ```
    *This runs on `http://localhost:3000`.*

3.  **Play the Game:**
    Open your browser and navigate to:
    `http://localhost:3000`

    *(Note: To test multiplayer locally, open multiple tabs or browsers to the same address. The first connection acts as Player 1, the second as Player 2. If one drops, the server frees up the slot for a reconnection.)*

## BUILDING FOR PRODUCTION

To compile the entire monorepo (type-checking):
```bash
npm run build
```

To build individual applications for deployment:
```bash
# Build the Next.js web client
npm run build --prefix apps/web

# Build the Node.js server
npm run build --prefix apps/server
```

## TESTING

The project relies on Playwright for end-to-end testing of the core gameplay loop (vertical slice).

To run the Playwright tests (ensure your server and web app are running first):
```bash
cd apps/web
npx playwright test
```

*(Note: There are currently no unit tests defined in `packages/game-core`. Do not run `npm test --prefix packages/game-core`)*

## ENVIRONMENT VARIABLES

**No environment variables are currently required** to run the playable vertical slice locally.

## DATABASE / EXTERNAL SERVICES

**No external services are required.** 
The current playable version does not require PostgreSQL, Redis, or any external authentication. All game state is handled entirely in-memory by the Colyseus room state engine.
