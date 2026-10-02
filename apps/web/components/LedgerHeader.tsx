import React from 'react';
import type { GameState } from 'game-core';

interface Props {
    gameState: GameState["public"];
}

export function LedgerHeader({ gameState }: Props) {
    const p1 = gameState.players.find(p => p.id === 'p1');
    const p2 = gameState.players.find(p => p.id === 'p2');
    
    const p1Balance = p1?.cash ?? 0;
    const p2Balance = p2?.cash ?? 0;
    const p1Name = p1?.name ?? "Player 1";
    const p2Name = p2?.name ?? "Player 2";
    const activePlayerId = gameState.players[gameState.activePlayerIndex]?.id;

    return (
        <header className="w-full bg-paper-light border-b-2 border-ink flex-shrink-0 z-30 shadow-sm">
            <div className="px-4 py-1.5 flex items-center justify-between border-b border-ink/20 text-[11px] font-mono">
                <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-2">
                        <span className="font-masthead text-[20px] font-bold uppercase tracking-tight text-ink">
                            THE DAILY LEDGER
                        </span>
                        <span className="font-stamp text-[11px] tracking-wider text-ink-muted uppercase hidden sm:inline">
                            • VELORA CITY CHRONICLE
                        </span>
                    </div>
                    
                    <span className="text-ink/30 hidden md:inline">|</span>
                    
                    <span className="font-bold text-ink bg-paper-dark px-2 py-0.5 rounded-sm border border-ink/30 hidden md:inline">
                        ROUND 1 / 30
                    </span>
                    
                    <span className="text-ink/30 hidden md:inline">|</span>
                    
                    <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-stamp text-ink font-bold">PLAYERS:</span>
                        
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                            activePlayerId === 'p1' ? 'bg-paper border-ink/40 font-bold text-ink' : 'text-ink-muted border-transparent'
                        }`}>
                            <span className="w-2 h-2 rounded-full bg-brass"></span> 
                            {p1Name} ${p1Balance} 
                            {activePlayerId === 'p1' && <span className="text-[9px] bg-ink text-paper-light px-1 font-stamp uppercase ml-0.5">TURN</span>}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                            activePlayerId === 'p2' ? 'bg-paper border-ink/40 font-bold text-ink' : 'text-ink-muted border-transparent'
                        }`}>
                            <span className="w-2 h-2 rounded-full bg-carmine"></span> 
                            {p2Name} ${p2Balance}
                            {activePlayerId === 'p2' && <span className="text-[9px] bg-ink text-paper-light px-1 font-stamp uppercase ml-0.5">TURN</span>}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 bg-paper-dark px-2.5 py-0.5 border border-ink/30 rounded font-mono text-[10px]">
                        <span className="font-stamp font-bold text-ink">BOURSE:</span>
                        <span className="text-fgreen font-bold">TECH ▲24%</span>
                        <span className="text-ink/30">•</span>
                        <span className="text-carmine font-bold">COMMERCE ▼4%</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
