"use client";

import React from 'react';
import type { GameState, PublicEvent } from 'game-core';
import { getPropertyById } from 'game-data';

interface Props {
    gameState: GameState["public"];
    playerId: string | null;
}

export function RightSidebar({ gameState, playerId }: Props) {
    const displayPlayerId = playerId || 'p1';
    const player = gameState.players.find(p => p.id === displayPlayerId);
    
    if (!player) return null;

    const isP1 = displayPlayerId === 'p1';
    const localMoney = player.cash;
    const netWorth = localMoney + player.ownedProperties.reduce((sum, pId) => sum + (getPropertyById(pId)?.basePrice || 0), 0);
    
    return (
        <aside className="w-[18%] min-w-[240px] max-w-[320px] h-full flex flex-col gap-4 flex-shrink-0">
            {/* Player Desk */}
            <div className="bg-paper-light border-2 border-ink p-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-ink/30 pb-1.5 mb-3">
                    <span className="font-stamp text-[12px] uppercase tracking-wider text-ink font-bold">PLAYER DESK</span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 border-2 border-ink rounded-sm shadow-sm flex items-center justify-center ${isP1 ? 'bg-brass text-ink' : 'bg-carmine text-paper'}`}>
                        <span className="font-stamp text-[18px] font-bold">{isP1 ? 'P1' : 'P2'}</span>
                    </div>
                    <div>
                        <h3 className="font-masthead font-bold text-[20px] uppercase text-ink leading-none">{player.name}</h3>
                        <span className="font-mono text-[10px] text-ink-muted">ID: {player.id.toUpperCase()}</span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 font-mono text-[11px] uppercase border-t border-ink/20 pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-ink-muted">Cash</span>
                        <span className="font-bold text-[15px] text-ink">${localMoney}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-ink-muted">Market Value</span>
                        <span className="font-bold text-[14px] text-ink">${netWorth - localMoney}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-ink/20 border-dashed">
                        <span className="text-ink font-bold">Net Worth</span>
                        <span className="font-bold text-[16px] text-ink">${netWorth}</span>
                    </div>
                </div>
            </div>

            {/* Contextual Actions Placeholder */}
            <div className="bg-paper-light border-2 border-ink p-3 shadow-sm flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-ink/30 pb-1.5 mb-3">
                    <span className="font-stamp text-[12px] uppercase tracking-wider text-ink font-bold">ACTIONS</span>
                </div>
                
                <div className="flex flex-col gap-2 font-mono text-[11px] text-ink-muted uppercase">
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="w-1.5 h-1.5 bg-ink rounded-full"></span> DEVELOP
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="w-1.5 h-1.5 bg-ink rounded-full"></span> TRADE
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="w-1.5 h-1.5 bg-ink rounded-full"></span> MARKET
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="w-1.5 h-1.5 bg-ink rounded-full"></span> PROPERTY DESK
                    </div>
                </div>

                <div className="mt-auto pt-3 border-t border-ink/20 text-[10px] font-mono text-ink-muted text-center opacity-70">
                    Hover over properties to view details
                </div>
            </div>
        </aside>
    );
}
