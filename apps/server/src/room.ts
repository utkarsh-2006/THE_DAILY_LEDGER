import colyseus from "colyseus";
import type { Client } from "colyseus";
const { Room } = colyseus;
import { Schema, type } from "@colyseus/schema";
import { GameState, RulesEngine, ProductionRandomSource, DeterministicTestRandomSource, createInitialGameState } from "game-core";

export class GameRoomState extends Schema {
    @type("string")
    publicStateJson: string = "";
    
    @type("string")
    eventsJson: string = "[]";
}

export class DailyLedgerRoom extends Room<GameRoomState> {
    private engine!: RulesEngine;
    private internalGameState!: GameState;
    private connectedPlayers: Set<string> = new Set();
    
    // For development, we'll auto-fill up to 2 players then start
    private p1Id = "p1";
    private p2Id = "p2";

    onCreate(options: any) {
        this.maxClients = 2;
        this.setState(new GameRoomState());
        
        // Initialize game core
        const randomSource = new DeterministicTestRandomSource();
        // Just as an example, we can use ProductionRandomSource, but for testing predictable dev:
        // Actually, let's just use standard Math.random for now so it's playable, or ProductionRandomSource
        // The prompt says "preserve injectable RandomSource architecture". We will implement ProductionRandomSource.
        
        // For development let's initialize 2 fixed players immediately.
        this.internalGameState = createInitialGameState([
            { id: this.p1Id, name: "Player 1" },
            { id: this.p2Id, name: "Player 2" }
        ]);
        
        // Use a simple production random source inside the room
        const productionRandom = new ProductionRandomSource();
        this.engine = new RulesEngine(productionRandom);

        this.syncState();

        this.onMessage("READY", (client) => {
            const playerId = client.userData?.playerId;
            if (playerId) {
                client.send("YOU_ARE", playerId);
                client.send("STATE_UPDATE", this.state.publicStateJson);
                client.send("EVENTS_UPDATE", this.state.eventsJson);
            }
        });
        
        // Handle intents from clients
        this.onMessage("INTENT", (client, message) => {
            const playerId = client.userData?.playerId;
            if (!playerId) return;

            // Construct intent
            const intent = {
                type: message.type,
                playerId: playerId,
                payload: message.payload
            };

            const result = this.engine.process(this.internalGameState, intent as any);
            
            // If the intent produced an error for the active player, we could send it directly.
            const privateEvents = result.events.filter((e: any) => e.type === "ERROR" && e.playerId === playerId);
            if (privateEvents.length > 0) {
                client.send("ERROR", privateEvents[0]);
                return; // state didn't change successfully
            }

            // Valid state transition
            this.internalGameState = result.state;
            this.syncState(result.events.filter((e: any) => e.type !== "ERROR"));
        });
    }

    private syncState(events: any[] = []) {
        const pState = JSON.stringify(this.internalGameState.public);
        const eState = JSON.stringify(events);
        this.state.publicStateJson = pState;
        this.state.eventsJson = eState;
        
        this.broadcast("STATE_UPDATE", pState);
        if (events.length > 0) {
            this.broadcast("EVENTS_UPDATE", eState);
        }
    }

    onJoin(client: Client, options: any) {
        let assignedId = "spectator";
        if (!this.connectedPlayers.has(this.p1Id)) {
            assignedId = this.p1Id;
        } else if (!this.connectedPlayers.has(this.p2Id)) {
            assignedId = this.p2Id;
        }
        
        client.userData = { playerId: assignedId };
        this.connectedPlayers.add(assignedId);
        
        console.log(`Client ${client.sessionId} joined as ${assignedId}`);
    }

    onLeave(client: Client, consented?: boolean) {
        if (client.userData?.playerId) {
            this.connectedPlayers.delete(client.userData.playerId);
        }
        console.log(`Client ${client.sessionId} left.`);
    }
}
