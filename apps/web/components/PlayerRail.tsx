"use client";

import React from 'react';
import type { GameState, PublicEvent } from 'game-core';
import { getPropertyById } from 'game-data';

interface Props {
    gameState: GameState["public"];
    playerId: string | null;
    sendIntent?: (type: string, payload?: any) => void;
    events: (PublicEvent & { timestamp: number })[];
}

export function PlayerRail({ gameState, playerId, events }: Props) {
    const isP1 = playerId === 'p1';
    
    // We only care about displaying the dossier for the connected player, 
    // or if not found, just default to player 1
    const displayPlayerId = playerId || 'p1';
    const player = gameState.players.find(p => p.id === displayPlayerId);
    
    if (!player) return null;

    const localMoney = player.cash;
    const propertyCount = player.ownedProperties.length;
    const netWorth = localMoney + player.ownedProperties.reduce((sum, pId) => sum + (getPropertyById(pId)?.basePrice || 0), 0);
    
    return (
        <aside className="w-[22%] min-w-[260px] max-w-[340px] h-full flex flex-col gap-2.5 flex-shrink-0">
            {/* 1. Dossier */}
            <div className="bg-paper-light border-2 border-ink p-2.5 shadow-sm">
                <div className="flex items-center justify-between border-b border-ink/30 pb-1 mb-2">
                    <span className="font-stamp text-[11px] uppercase tracking-wider text-ink font-bold">PLAYER DESK</span>
                    <span className="font-mono text-[10px] text-ink-muted">CONFIDENTIAL</span>
                </div>
                
                <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-10 h-10 border-2 border-ink rounded-sm shadow-sm flex items-center justify-center ${isP1 ? 'bg-brass text-ink' : 'bg-carmine text-paper'}`}>
                        <span className="font-stamp text-[16px] font-bold">{isP1 ? 'P1' : 'P2'}</span>
                    </div>
                    <div>
                        <h3 className="font-masthead font-bold text-[18px] uppercase text-ink leading-none">{player.name}</h3>
                        <span className="font-mono text-[10px] text-ink-muted">ID: {player.id.toUpperCase()}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="bg-paper border border-ink/20 p-1.5 rounded-sm">
                        <span className="text-[9px] text-ink-muted block uppercase">Cash</span>
                        <span className="font-bold text-[14px] text-ink">${localMoney}</span>
                    </div>
                    <div className="bg-paper border border-ink/20 p-1.5 rounded-sm">
                        <span className="text-[9px] text-ink-muted block uppercase">Market Value</span>
                        <span className="font-bold text-[14px] text-ink">${netWorth - localMoney}</span>
                    </div>
                    <div className="bg-paper border border-ink/20 p-1.5 rounded-sm col-span-2">
                        <span className="text-[9px] text-ink-muted block uppercase">Net Worth</span>
                        <span className="font-bold text-[14px] text-ink">${netWorth}</span>
                    </div>
                </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-paper-light border-2 border-ink p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-mono text-ink-muted uppercase">
                    <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <span className="w-1 h-1 bg-ink rounded-full"></span> DEVELOP
                    </div>
                    <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <span className="w-1 h-1 bg-ink rounded-full"></span> TRADE
                    </div>
                    <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <span className="w-1 h-1 bg-ink rounded-full"></span> MARKET
                    </div>
                    <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <span className="w-1 h-1 bg-ink rounded-full"></span> PROPERTY DESK
                    </div>
                </div>
            </div>

            {/* 2. Telegraph Wire */}
            <div className="bg-paper-light border-2 border-ink p-2 shadow-sm flex flex-col justify-between min-h-0 flex-1">
                <div className="border-b border-ink/20 pb-0.5 mb-1 flex items-center justify-between font-mono text-[10px] text-ink uppercase">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-carmine animate-pulse"></span>
                        <span className="font-stamp font-bold tracking-wider">VELORA TELEGRAPH WIRE</span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-1 font-mono text-[10px] text-ink-muted overflow-y-auto flex-1 pr-1">
                    {[...events].reverse().slice(0, 5).map((e, i) => {
                        let text = "";
                        const pid = e.payload?.playerId || "";
                        if (e.type === "DICE_ROLLED") {
                            const d1 = e.payload?.d1 ?? 0;
                            const d2 = e.payload?.d2 ?? 0;
                            const total = e.payload?.total ?? (d1 + d2);
                            text = `${pid} rolled ${total}.`;
                        }
                        else if (e.type === "PROPERTY_PURCHASED") text = `${pid} acquired property for $${e.payload?.price ?? 0}.`;
                        else if (e.type === "RENT_PAID") text = `${pid} paid $${e.payload?.amount ?? 0} in rent.`;
                        else text = `${e.type} occurred.`;
                        
                        return (
                            <div key={i} className="flex items-start gap-1 leading-tight border-b border-dashed border-ink/20 pb-0.5 pt-0.5">
                                <span className="text-ink font-bold shrink-0">[{new Date(e.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                                <span>{text}</span>
                            </div>
                        );
                    })}
                </div>
                
                <div className="flex items-center justify-between pt-1 border-t border-ink/20 text-[10px] font-mono mt-0.5 shrink-0">
                    <span className="text-ink-muted flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-fgreen"></span> 
                        System Active
                    </span>
                </div>
            </div>

            {/* 3. Compact Chat */}
            <div className="bg-paper-light border-2 border-ink p-2 shadow-sm flex flex-col justify-between shrink-0 h-[100px]">
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
