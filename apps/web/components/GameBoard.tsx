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

const CORNER_ICONS: Record<number, string> = {
    0: '🗞️', 10: '🏛️', 20: '📈', 30: '⚖️'
};

const CORNER_LABELS: Record<number, string> = {
    0: 'VELORA CENTRAL', 10: 'CITY HALL', 20: 'VELORA BOURSE', 30: 'CIVIC HOLD'
};

// ─── GEOMETRY ─────────────────────────────────────────────────────────────────

// Maps 0-39 clockwise starting from Bottom-Right
function getGridCoords(index: number): { gridColumn: number, gridRow: number } {
    if (index <= 10) return { gridColumn: 11 - index, gridRow: 11 };
    if (index <= 19) return { gridColumn: 1, gridRow: 11 - (index - 10) };
    if (index <= 30) return { gridColumn: 1 + (index - 20), gridRow: 1 };
    if (index <= 39) return { gridColumn: 11, gridRow: 1 + (index - 30) };
    return { gridColumn: 1, gridRow: 1 };
}

function getTileType(index: number): 'corner' | 'top' | 'bottom' | 'left' | 'right' {
    if (index % 10 === 0) return 'corner';
    if (index < 10) return 'bottom';
    if (index < 20) return 'left';
    if (index < 30) return 'top';
    return 'right';
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function EdgeContent({ space, type, propInfo, ownerId, gameState }: any) {
    const isRotated = type === 'left' || type === 'right';
    const isBottom = type === 'bottom';
    const displayName = space.name.replace(/\[.*?\]\s*/g, '').trim();
    const districtColor = propInfo ? (DISTRICT_COLOR[propInfo.districtId] || '#151515') : null;
    const ownerIdx = ownerId ? gameState.players.findIndex((p: any) => p.id === ownerId) : -1;

    // For Left/Right, we use a wrapper that swaps width and height, then rotates.
    // Left: rotate -90 (Price -> Left, Color -> Right)
    // Right: rotate 90 (Price -> Right, Color -> Left)
    const wrapperStyle = isRotated ? {
        width: '100cqh',
        height: '100cqw',
        transform: `translate(-50%, -50%) rotate(${type === 'left' ? '-90deg' : '90deg'})`
    } : {
        width: '100%',
        height: '100%'
    };

    const priceBlock = (
        <div className="w-full shrink-0 flex items-center justify-center bg-[#EDE8DF]"
             style={{ height: '22%', borderBottom: isBottom ? 'none' : '1px solid rgba(21,21,21,0.2)', borderTop: isBottom ? '1px solid rgba(21,21,21,0.2)' : 'none' }}>
            {propInfo && <span className="font-mono font-bold text-ink" style={{ fontSize: 'clamp(7px, 11cqmin, 11px)' }}>${propInfo.basePrice}</span>}
        </div>
    );

    const colorBlock = (
        <div className="w-full shrink-0 relative"
             style={{ height: '20%', backgroundColor: districtColor || '#E8E2D6', borderTop: isBottom ? 'none' : '1px solid rgba(21,21,21,0.2)', borderBottom: isBottom ? '1px solid rgba(21,21,21,0.2)' : 'none' }}>
            {!districtColor && <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[8px]">◆</div>}
        </div>
    );

    return (
        <div className={`absolute flex flex-col items-center ${isRotated ? 'top-1/2 left-1/2' : 'inset-0'}`} style={wrapperStyle}>
            {isBottom ? colorBlock : priceBlock}

            <div className="flex-1 flex flex-col items-center justify-center px-[4%] w-full text-center overflow-hidden">
                <span className="font-masthead font-bold uppercase text-ink leading-[1.05]" style={{ fontSize: 'clamp(7.5px, 13cqmin, 13px)', wordBreak: 'break-word', hyphens: 'auto' }}>
                    {displayName}
                </span>
                {ownerIdx !== -1 && (
                    <div className="rounded-sm border border-ink mt-[4px]" style={{ backgroundColor: PLAYER_COLORS[ownerIdx], width: 'clamp(6px, 10cqmin, 10px)', height: 'clamp(6px, 10cqmin, 10px)' }} />
                )}
            </div>

            {isBottom ? priceBlock : colorBlock}
        </div>
    );
}

function CornerContent({ index, displayName }: { index: number, displayName: string }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-[5%] bg-[#DED6C5]">
            <span className="opacity-60 grayscale filter" style={{ fontSize: 'clamp(18px, 35cqmin, 44px)' }}>
                {CORNER_ICONS[index]}
            </span>
            <span className="font-masthead font-black uppercase text-ink text-center leading-[1.0] mt-[8%]" style={{ fontSize: 'clamp(8px, 15cqmin, 16px)', wordBreak: 'break-word' }}>
                {CORNER_LABELS[index] || displayName}
            </span>
        </div>
    );
}

function BoardTile({ index, gameState }: { index: number, gameState: GameState["public"] }) {
    const space = BOARD_SPACES[index];
    if (!space) return null;

    const coords = getGridCoords(index);
    const type = getTileType(index);
    const isProperty = !!space.propertyId;
    const propInfo = isProperty && space.propertyId ? getPropertyById(space.propertyId) : null;
    const ownerId = isProperty && space.propertyId ? gameState.properties[space.propertyId]?.ownerId : null;
    const playersHere = gameState.players.filter(p => p.position === index);

    return (
        <div
            data-space={index}
            className="relative bg-paper group overflow-hidden"
            style={{ 
                gridColumn: coords.gridColumn, 
                gridRow: coords.gridRow,
                containerType: 'size' // Crucial for responsive cqw/cqh inside the tile
            }}
        >
            {/* Tile Background Hover Effect */}
            <div className="absolute inset-0 bg-ink/[0.04] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />

            {/* Players Layer (Top-most) */}
            {playersHere.length > 0 && (
                <div className="absolute inset-0 z-30 flex flex-wrap items-center justify-center gap-1 p-1 pointer-events-none drop-shadow-md">
                    {playersHere.map((p) => {
                        const pIdx = gameState.players.indexOf(p);
                        return (
                            <div key={p.id} className="rounded-full border-[1.5px] border-paper shadow-sm"
                                style={{ 
                                    backgroundColor: PLAYER_COLORS[pIdx] || '#888',
                                    width: 'clamp(12px, 20cqmin, 20px)',
                                    height: 'clamp(12px, 20cqmin, 20px)'
                                }} 
                            />
                        );
                    })}
                </div>
            )}

            {/* Content Layer */}
            {type === 'corner' ? (
                <CornerContent index={index} displayName={space.name} />
            ) : (
                <EdgeContent space={space} type={type} propInfo={propInfo} ownerId={ownerId} gameState={gameState} />
            )}
        </div>
    );
}

function CenterStage({ gameState, playerId, sendIntent }: Props) {
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const isMyTurn = activePlayer?.id === playerId;

    if (!activePlayer) return null;

    const currentSpace = BOARD_SPACES[activePlayer.position];
    const isProperty = !!currentSpace?.propertyId;
    const propInfo = isProperty && currentSpace.propertyId ? getPropertyById(currentSpace.propertyId) : null;
    const isUnowned = isProperty && currentSpace.propertyId ? !gameState.properties[currentSpace.propertyId]?.ownerId : false;
    const displayName = currentSpace?.name.replace(/\[.*?\]\s*/g, '').trim() || '';

    return (
        <div
            className="relative flex flex-col items-center justify-center bg-[#E5DFD1] overflow-hidden"
            style={{
                gridColumn: '2 / 11',
                gridRow: '2 / 11',
                backgroundImage: 'radial-gradient(circle, rgba(21,21,21,0.06) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)'
            }}
        >
            {/* Board Branding (Watermark) */}
            <div className="absolute top-[8%] flex flex-col items-center opacity-[0.85] pointer-events-none select-none">
                <h1 className="font-masthead font-black uppercase tracking-[0.2em] text-ink" style={{ fontSize: 'clamp(28px, 5vw, 64px)' }}>
                    Velora City
                </h1>
                <div className="w-[60%] h-[2px] bg-ink/30 my-[1%]" />
                <h2 className="font-stamp uppercase tracking-[0.45em] text-ink-muted" style={{ fontSize: 'clamp(10px, 1.5vw, 18px)' }}>
                    The Daily Ledger
                </h2>
            </div>

            {/* Gameplay Interaction Plaque */}
            <div className="relative z-10 bg-paper border-[3px] border-ink shadow-[8px_8px_0_rgba(21,21,21,0.9)] w-[85%] max-w-[420px] flex flex-col items-center text-center mt-[10%]">
                
                {/* Header Strip */}
                <div className="w-full bg-ink text-paper-light px-4 py-2 flex justify-between items-center border-b-2 border-ink">
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
                    <div className="font-masthead font-bold uppercase text-ink leading-[1.05] text-[20px] md:text-[28px] mb-4">
                        {displayName}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full">
                        {isMyTurn && gameState.turnPhase === 'MOVE' && (
                            <button onClick={() => sendIntent?.("ROLL_DICE")} className="w-full bg-ink text-paper-light font-masthead font-bold uppercase tracking-widest text-sm md:text-base py-3 hover:bg-[#2A2A2A] active:translate-y-px transition-all">
                                ROLL DICE
                            </button>
                        )}

                        {isMyTurn && gameState.turnPhase === 'RESOLVE_PROPERTY_OR_SPECIAL_SPACE' && isProperty && isUnowned && (
                            <div className="flex gap-2">
                                <button onClick={() => sendIntent?.("BUY_PROPERTY")} className="flex-1 bg-ink text-paper-light font-masthead font-bold uppercase tracking-wider text-xs md:text-sm py-2 hover:bg-[#2A2A2A] active:translate-y-px transition-all">
                                    BUY PROPERTY
                                </button>
                                <button onClick={() => sendIntent?.("START_AUCTION")} className="flex-1 bg-paper text-ink border-2 border-ink font-masthead font-bold uppercase tracking-wider text-xs md:text-sm py-2 hover:bg-paper-light active:translate-y-px transition-all">
                                    AUCTION
                                </button>
                            </div>
                        )}

                        {isMyTurn && (gameState.turnPhase === 'OPTIONAL_ACTIONS' || (gameState.turnPhase === 'RESOLVE_PROPERTY_OR_SPECIAL_SPACE' && (!isProperty || !isUnowned))) && (
                            <button onClick={() => sendIntent?.("END_TURN")} className="w-full bg-ink text-paper-light font-masthead font-bold uppercase tracking-widest text-sm md:text-base py-3 hover:bg-[#2A2A2A] active:translate-y-px transition-all">
                                END TURN
                            </button>
                        )}

                        {!isMyTurn && (
                            <div className="w-full font-mono text-ink-muted uppercase border-t border-ink/10 pt-3 text-[10px] md:text-xs">
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
                        <span className="font-mono text-ink-muted uppercase text-[8px] md:text-[10px] tracking-wider">
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
    // The physical board shell:
    // Fits the max available height/width while remaining a perfect square.
    // 11x11 Grid, where corners are slightly larger (1.6fr vs 1fr).
    return (
        <section className="flex-1 w-full h-full flex flex-col items-center justify-center p-2 md:p-4 bg-[#DCD4C3] overflow-hidden">
            <div 
                className="relative bg-ink rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.25)] border-[4px] border-ink overflow-hidden"
                style={{
                    width: '100%',
                    maxWidth: 'calc(100vh - 120px)',
                    aspectRatio: '1 / 1',
                    display: 'grid',
                    gridTemplateColumns: '1.6fr repeat(9, 1fr) 1.6fr',
                    gridTemplateRows: '1.6fr repeat(9, 1fr) 1.6fr',
                    gap: '2px', // This creates the 2px ink grid lines!
                    padding: '2px', // Exposes the grid line around the outer perimeter
                }}
            >
                {/* 40 spaces */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <BoardTile key={i} index={i} gameState={props.gameState} />
                ))}

                {/* Integrated Center Gameplay Mat */}
                <CenterStage {...props} />
            </div>
        </section>
    );
}
