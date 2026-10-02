"use client";

import React from 'react';
import type { GameState, PublicEvent } from 'game-core';

interface Props {
    gameState: GameState["public"];
    events: (PublicEvent & { timestamp: number })[];
}

export function LeftSidebar({ gameState, events }: Props) {
    const activePlayerId = gameState.players[gameState.activePlayerIndex]?.id;

    return (
        <aside className="w-[18%] min-w-[240px] max-w-[320px] h-full flex flex-col gap-4 flex-shrink-0">
            {/* Match Status / Players */}
            <div className="bg-paper-light border-2 border-ink p-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-ink/30 pb-1.5 mb-3">
                    <span className="font-stamp text-[12px] uppercase tracking-wider text-ink font-bold">PLAYERS</span>
                </div>
                
                <div className="flex flex-col gap-3">
                    {gameState.players.map(p => {
                        const isTurn = p.id === activePlayerId;
                        const isP1 = p.id === 'p1';
                        return (
                            <div key={p.id} className={`flex items-center justify-between p-2 rounded-sm border ${isTurn ? 'border-ink bg-paper shadow-sm' : 'border-transparent'}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full border border-ink ${isP1 ? 'bg-brass' : 'bg-carmine'}`}></div>
                                    <span className="font-masthead font-bold uppercase text-[15px] leading-none text-ink">{p.name}</span>
                                </div>
                                <div className="font-mono font-bold text-[13px] text-ink">
                                    ${p.cash}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Telegraph Wire */}
            <div className="bg-paper-light border-2 border-ink p-3 shadow-sm flex flex-col justify-between min-h-0 flex-1">
                <div className="border-b border-ink/20 pb-1.5 mb-2 flex items-center justify-between font-mono text-[11px] text-ink uppercase">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-carmine animate-pulse"></span>
                        <span className="font-stamp font-bold tracking-wider">VELORA NEWS</span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-1.5 font-mono text-[10px] text-ink-muted overflow-y-auto flex-1 pr-1">
                    {[...events].reverse().slice(0, 8).map((e, i) => {
                        let text = "";
                        const pid = e.payload?.playerId || "";
                        if (e.type === "DICE_ROLLED") {
                            const total = e.payload?.total ?? 0;
                            text = `${pid} rolled ${total}.`;
                        }
                        else if (e.type === "PROPERTY_PURCHASED") text = `${pid} acquired property for $${e.payload?.price ?? 0}.`;
                        else if (e.type === "RENT_PAID") text = `${pid} paid $${e.payload?.amount ?? 0} in rent.`;
                        else text = `${e.type} occurred.`;
                        
                        return (
                            <div key={i} className="flex items-start gap-1.5 leading-tight border-b border-dashed border-ink/20 pb-1 pt-1">
                                <span className="text-ink font-bold shrink-0">[{new Date(e.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                                <span>{text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Compact Chat */}
            <div className="bg-paper-light border-2 border-ink p-2 shadow-sm flex flex-col shrink-0 h-[100px]">
                <div className="border-b border-ink/20 pb-0.5 mb-1 flex items-center font-mono text-[10px] text-ink uppercase">
                    <span className="font-stamp font-bold tracking-wider text-ink-muted">COMMUNICATIONS</span>
                </div>
                <div className="flex-1 flex items-center justify-center text-ink-muted font-mono text-[10px]">
                    (Comms offline)
                </div>
                <input 
                    type="text" 
                    placeholder="Send message..." 
                    disabled
                    className="w-full bg-paper border border-ink/30 px-2 py-1 font-mono text-[10px] text-ink outline-none opacity-60 cursor-not-allowed"
                />
            </div>
        </aside>
    );
}
