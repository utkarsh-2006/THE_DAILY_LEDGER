"use client";

import { useGame } from "./useGame";
import { LedgerHeader } from "../components/LedgerHeader";
import { GameBoard } from "../components/GameBoard";
import { LeftSidebar } from "../components/LeftSidebar";
import { RightSidebar } from "../components/RightSidebar";

export default function GamePage() {
    const { gameState, events, playerId, sendIntent, error } = useGame();

    if (!gameState) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3EFE6] text-[#151515] font-masthead text-2xl font-bold uppercase tracking-widest">
                Connecting to Velora City... {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
            </div>
        );
    }

    return (
        <>
            <LedgerHeader gameState={gameState} />
            <main className="flex-1 flex flex-row overflow-hidden p-4 gap-6 min-h-0 bg-[#E5DFD1] justify-center items-center">
                <LeftSidebar 
                    gameState={gameState} 
                    events={events} 
                />
                
                <GameBoard 
                    gameState={gameState} 
                    playerId={playerId} 
                    sendIntent={sendIntent} 
                />

                <RightSidebar 
                    gameState={gameState} 
                    playerId={playerId} 
                />
            </main>
        </>
    );
}
