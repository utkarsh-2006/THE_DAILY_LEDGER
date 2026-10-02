"use client";

import React from 'react';
import type { GameState } from 'game-core';
import { BOARD_SPACES, getPropertyById } from 'game-data';

interface Props {
    gameState: GameState["public"];
    playerId: string | null;
    sendIntent?: (type: string, payload?: any) => void;
}

// ─── THEME & CONSTANTS ────────────────────────────────────────────────────────

const DISTRICT_COLOR: Record<string, string> = {
    "D01": "#6B2D30",
    "D02": "#4B306A",
    "D03": "#2B5A40",
    "D04": "#8B5A2B",
    "D05": "#2B5A8B",
    "D06": "#5A5A5A",
};

const DISTRICT_NAME: Record<string, string> = {
    "D01": "Old Quarter",
    "D02": "Exchange",
    "D03": "Civic Mile",
    "D04": "Industrial",
    "D05": "Waterfront",
    "D06": "Aerodrome",
};

const PLAYER_COLORS = ['#A7833A', '#9F3030', '#2B6CB0', '#276749'];

const SPECIAL_ICONS: Record<number, string> = {
    0: '🗞️', 10: '🏛️', 20: '📈', 30: '⚖️',
    4: '◆', 38: '◆', // Tax spaces
    5: '🚆', 15: '🚆', 25: '🚆', 35: '🚆', // Transport
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function RailCard({ index, orientation, gameState }: { index: number, orientation: 'top' | 'bottom' | 'left' | 'right', gameState: GameState["public"] }) {
    const space = BOARD_SPACES[index];
    if (!space) return null;

    const isProperty = !!space.propertyId;
    const propInfo = isProperty && space.propertyId ? getPropertyById(space.propertyId) : null;
    const ownerId = isProperty && space.propertyId ? gameState.properties[space.propertyId]?.ownerId : null;
    const ownerIdx = ownerId ? gameState.players.findIndex((p: any) => p.id === ownerId) : -1;
    const playersHere = gameState.players.filter(p => p.position === index);

    const isRotated = orientation === 'left' || orientation === 'right';
    const isBottom = orientation === 'bottom';
    
    // Some names need standardizing for display
    const displayName = space.name.replace(/\[.*?\]\s*/g, '').trim();
    const districtColor = propInfo ? (DISTRICT_COLOR[propInfo.districtId] || '#151515') : null;

    // The wrapper swaps dimensions for left/right to normalize aspect ratios internally.
    const wrapperStyle = isRotated ? {
        width: '100cqh',
        height: '100cqw',
        transform: `translate(-50%, -50%) rotate(${orientation === 'left' ? '-90deg' : '90deg'})`
    } : {
        width: '100%',
        height: '100%'
    };

    const priceBlock = (
        <div className="w-full shrink-0 flex items-center justify-center bg-[#EDE8DF]"
             style={{ height: '22%', borderBottom: isBottom ? 'none' : '1px solid rgba(21,21,21,0.15)', borderTop: isBottom ? '1px solid rgba(21,21,21,0.15)' : 'none' }}>
            {propInfo && <span className="font-mono font-bold text-ink" style={{ fontSize: 'clamp(7px, 11cqmin, 11px)' }}>${propInfo.basePrice}</span>}
        </div>
    );

    const colorBlock = (
        <div className="w-full shrink-0 relative"
             style={{ height: '18%', backgroundColor: districtColor || '#E8E2D6', borderTop: isBottom ? 'none' : '1px solid rgba(21,21,21,0.15)', borderBottom: isBottom ? '1px solid rgba(21,21,21,0.15)' : 'none' }}>
            {!districtColor && <div className="absolute inset-0 flex items-center justify-center opacity-40 text-[8px]">◆</div>}
        </div>
    );

    return (
        <div data-space={index} className="relative bg-[#FBF9F6] overflow-hidden flex-1 group" style={{ containerType: 'size' }}>
            <div className="absolute inset-0 bg-ink/[0.03] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
            
            <div className={`absolute flex flex-col items-center ${isRotated ? 'top-1/2 left-1/2' : 'inset-0'}`} style={wrapperStyle}>
                {isBottom ? colorBlock : priceBlock}

                <div className="flex-1 flex flex-col items-center justify-center px-[6%] w-full text-center overflow-hidden">
                    {SPECIAL_ICONS[index] && (
                        <div className="opacity-60 grayscale filter mb-0.5 leading-none" style={{ fontSize: 'clamp(10px, 16cqmin, 18px)' }}>
                            {SPECIAL_ICONS[index]}
                        </div>
                    )}
                    <span className="font-masthead font-bold uppercase text-ink leading-[1.05]" style={{ fontSize: 'clamp(7.5px, 13cqmin, 13px)', wordBreak: 'break-word', hyphens: 'auto' }}>
                        {displayName}
                    </span>
                    {ownerIdx !== -1 && (
                        <div className="rounded-sm border border-ink mt-[4px]" style={{ backgroundColor: PLAYER_COLORS[ownerIdx], width: 'clamp(6px, 10cqmin, 10px)', height: 'clamp(6px, 10cqmin, 10px)' }} />
                    )}
                </div>

                {isBottom ? priceBlock : colorBlock}
            </div>

            {/* PLAYER TOKENS Z-30 */}
            {playersHere.length > 0 && (
                <div className="absolute inset-0 z-30 flex flex-wrap items-center justify-center gap-1 p-1 pointer-events-none drop-shadow-md">
                    {playersHere.map((p) => {
                        const pIdx = gameState.players.indexOf(p);
                        return (
                            <div key={p.id} className="rounded-full border-[1.5px] border-paper shadow-sm"
                                style={{ 
                                    backgroundColor: PLAYER_COLORS[pIdx] || '#888',
                                    width: 'clamp(14px, 24cqmin, 24px)',
                                    height: 'clamp(14px, 24cqmin, 24px)'
                                }} 
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function CentralGameStage({ gameState, playerId, sendIntent }: Props) {
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const isMyTurn = activePlayer?.id === playerId;

    if (!activePlayer) return null;

    const currentSpace = BOARD_SPACES[activePlayer.position];
    const isProperty = !!currentSpace?.propertyId;
    const propInfo = isProperty && currentSpace.propertyId ? getPropertyById(currentSpace.propertyId) : null;
    const isUnowned = isProperty && currentSpace.propertyId ? !gameState.properties[currentSpace.propertyId]?.ownerId : false;
    const displayName = currentSpace?.name.replace(/\[.*?\]\s*/g, '').trim() || '';

    return (
        <div className="flex-1 relative flex flex-col items-center justify-center bg-[#EAE5D9] rounded-md border-2 border-ink shadow-[inset_0_0_60px_rgba(0,0,0,0.05)] overflow-hidden">
            
            {/* Elegant Background Skyline / Art Placeholder */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04]">
                <svg viewBox="0 0 800 600" className="w-[80%] h-[80%] fill-ink" preserveAspectRatio="xMidYMid meet">
                    <path d="M100 600 L100 400 L150 400 L150 300 L250 300 L250 200 L350 200 L350 150 L450 150 L450 250 L550 250 L550 350 L650 350 L650 450 L750 450 L750 600 Z" />
                    <rect x="380" y="100" width="40" height="50" />
                    <circle cx="400" cy="50" r="20" />
                    <rect x="280" y="220" width="20" height="20" />
                    <rect x="310" y="220" width="20" height="20" />
                    <rect x="470" y="270" width="20" height="20" />
                    <rect x="500" y="270" width="20" height="20" />
                </svg>
            </div>

            {/* Gameplay Interaction Plaque */}
            <div className="relative z-10 bg-[#FBF9F6] border-[3px] border-ink shadow-[8px_8px_0_rgba(21,21,21,0.9)] w-[85%] max-w-[440px] flex flex-col items-center text-center">
                
                {/* Header Strip */}
                <div className="w-full bg-ink text-[#FBF9F6] px-4 py-2 flex justify-between items-center border-b-2 border-ink">
                    <span className="font-stamp uppercase tracking-widest text-[10px] md:text-xs">
                        {isMyTurn ? 'YOUR TURN' : `${activePlayer.name}'S TURN`}
                    </span>
                    <span className="font-mono font-bold text-[10px] md:text-xs">
                        RD {gameState.currentRound}
                    </span>
                </div>

                <div className="p-5 md:p-6 w-full flex flex-col items-center">
                    <div className="font-mono text-ink-muted uppercase tracking-widest text-[10px] md:text-xs mb-1">
                        {isMyTurn ? 'You Landed On' : `${activePlayer.name} Landed On`}
                    </div>
                    <div className="font-masthead font-bold uppercase text-ink leading-[1.05] text-[20px] md:text-[28px] mb-5">
                        {displayName}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full">
                        {isMyTurn && gameState.turnPhase === 'MOVE' && (
                            <button onClick={() => sendIntent?.("ROLL_DICE")} className="w-full bg-ink text-[#FBF9F6] font-masthead font-bold uppercase tracking-widest text-sm md:text-base py-3.5 hover:bg-[#2A2A2A] active:translate-y-px transition-all">
                                ROLL DICE
                            </button>
                        )}

                        {isMyTurn && gameState.turnPhase === 'RESOLVE_PROPERTY_OR_SPECIAL_SPACE' && isProperty && isUnowned && (
                            <div className="flex gap-2">
                                <button onClick={() => sendIntent?.("BUY_PROPERTY")} className="flex-1 bg-ink text-[#FBF9F6] font-masthead font-bold uppercase tracking-wider text-xs md:text-sm py-2.5 hover:bg-[#2A2A2A] active:translate-y-px transition-all">
                                    BUY PROPERTY
                                </button>
                                <button onClick={() => sendIntent?.("START_AUCTION")} className="flex-1 bg-transparent text-ink border-2 border-ink font-masthead font-bold uppercase tracking-wider text-xs md:text-sm py-2.5 hover:bg-ink/5 active:translate-y-px transition-all">
                                    AUCTION
                                </button>
                            </div>
                        )}

                        {isMyTurn && (gameState.turnPhase === 'OPTIONAL_ACTIONS' || (gameState.turnPhase === 'RESOLVE_PROPERTY_OR_SPECIAL_SPACE' && (!isProperty || !isUnowned))) && (
                            <button onClick={() => sendIntent?.("END_TURN")} className="w-full bg-ink text-[#FBF9F6] font-masthead font-bold uppercase tracking-widest text-sm md:text-base py-3.5 hover:bg-[#2A2A2A] active:translate-y-px transition-all">
                                END TURN
                            </button>
                        )}

                        {!isMyTurn && (
                            <div className="w-full font-mono text-ink-muted uppercase border-t border-ink/10 pt-4 text-[10px] md:text-xs">
                                Waiting for {activePlayer.name}...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Legend */}
            <div className="absolute bottom-[4%] flex flex-wrap items-center justify-center gap-3 px-6 pointer-events-none">
                {Object.entries(DISTRICT_COLOR).map(([id, color]) => (
                    <div key={id} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: color }} />
                        <span className="font-mono text-ink-muted uppercase text-[9px] md:text-[10px] tracking-wider">
                            {DISTRICT_NAME[id]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function GameBoard(props: Props) {
    // 40 spaces distributed exactly into 4 rails of 10 spaces each.
    // Flow: Left (19 -> 10) | Top (20 -> 29) | Right (30 -> 39) | Bottom (9 -> 0)
    
    const leftSpaces = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10];
    const topSpaces = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const rightSpaces = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
    const bottomSpaces = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    return (
        <section className="flex-1 w-full h-full p-2 lg:p-4 flex flex-col justify-center items-center overflow-hidden min-h-0 bg-[#DED6C5]">
            <div className="w-full h-full max-w-[1400px] flex flex-row gap-2 md:gap-3">
                
                {/* LEFT RAIL (Full Height) */}
                <div className="flex flex-col w-[15%] min-w-[90px] max-w-[160px] gap-[2px] bg-ink border-2 border-ink rounded-[4px] shadow-lg overflow-hidden">
                    {leftSpaces.map(i => <RailCard key={i} index={i} orientation="left" gameState={props.gameState} />)}
                </div>

                {/* MIDDLE COLUMN (Top Inset, Center Stage, Bottom Inset) */}
                <div className="flex-1 flex flex-col gap-2 md:gap-3 min-w-0">
                    
                    {/* TOP RAIL (Inset) */}
                    <div className="flex flex-row h-[16%] min-h-[90px] max-h-[160px] gap-[2px] bg-ink border-2 border-ink rounded-[4px] shadow-lg overflow-hidden">
                        {topSpaces.map(i => <RailCard key={i} index={i} orientation="top" gameState={props.gameState} />)}
                    </div>

                    {/* CENTRAL GAMEPLAY STAGE */}
                    <CentralGameStage {...props} />

                    {/* BOTTOM RAIL (Inset) */}
                    <div className="flex flex-row h-[16%] min-h-[90px] max-h-[160px] gap-[2px] bg-ink border-2 border-ink rounded-[4px] shadow-lg overflow-hidden">
                        {bottomSpaces.map(i => <RailCard key={i} index={i} orientation="bottom" gameState={props.gameState} />)}
                    </div>
                    
                </div>

                {/* RIGHT RAIL (Full Height) */}
                <div className="flex flex-col w-[15%] min-w-[90px] max-w-[160px] gap-[2px] bg-ink border-2 border-ink rounded-[4px] shadow-lg overflow-hidden">
                    {rightSpaces.map(i => <RailCard key={i} index={i} orientation="right" gameState={props.gameState} />)}
                </div>

            </div>
        </section>
    );
}
