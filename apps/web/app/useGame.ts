import { useState, useEffect } from 'react';
import * as Colyseus from 'colyseus.js';
import type { GameState, PublicEvent } from 'game-core';

export function useGame() {
    const [room, setRoom] = useState<Colyseus.Room | null>(null);
    const [gameState, setGameState] = useState<GameState["public"] | null>(null);
    const [events, setEvents] = useState<PublicEvent[]>([]);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isUnmounted = false;
        
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.hostname;
        // In some dev environments like Codespaces, you might need to use a specific port or proxy
        // But for local dev, 2567 is standard.
        const client = new Colyseus.Client("ws://localhost:2567"); 
        // Wait, if it's localhost, we can just use localhost or window.location.hostname
        // Let's use window.location.hostname just in case they're accessing via 192.168.x.x
        // Actually, if Colyseus is bound to 127.0.0.1, it WON'T accept 192.168.x.x
        // The safest default for local dev is localhost OR window.location.hostname.
        const wsUrl = wsProtocol + '//' + wsHost + ':2567';
        
        const colyseusClient = new Colyseus.Client(wsUrl);

        let currentRoom: Colyseus.Room | null = null;

        colyseusClient.joinOrCreate('daily_ledger').then((r: Colyseus.Room) => {
            if (isUnmounted) {
                r.leave();
                return;
            }
            
            currentRoom = r;
            setRoom(r);
            setPlayerId(r.sessionId); 
            
            r.onMessage("YOU_ARE", (pid: string) => {
                setPlayerId(pid);
            });

            r.onMessage("ERROR", (err: any) => {
                setError(err.message || "Unknown error");
                setTimeout(() => setError(null), 3000);
            });

            r.onMessage("STATE_UPDATE", (json: string) => {
                try {
                    setGameState(JSON.parse(json));
                } catch (e) {
                    console.error("Failed to parse STATE_UPDATE", e);
                }
            });

            r.onMessage("EVENTS_UPDATE", (json: string) => {
                try {
                    const parsed = JSON.parse(json);
                    if (parsed.length > 0) {
                        setEvents(prev => [...prev, ...parsed].slice(-20));
                    }
                } catch (e) {
                    console.error("Failed to parse EVENTS_UPDATE", e);
                }
            });

            // Handshake: tell the server we are ready to receive initial payload!
            r.send("READY");

        }).catch((e: any) => {
            if (!isUnmounted) {
                console.error("Join error", e);
                setError("Failed to connect to server at " + wsUrl);
            }
        });

        return () => {
            isUnmounted = true;
            if (currentRoom) currentRoom.leave();
        };
    }, []);

    const sendIntent = (type: string, payload?: any) => {
        if (room) {
            room.send("INTENT", { type, payload });
        }
    };

    return { gameState, events, playerId, sendIntent, error };
}
