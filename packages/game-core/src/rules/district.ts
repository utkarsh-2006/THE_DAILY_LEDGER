import { GameState } from "../state/index.js";
import { PublicEvent } from "../events/index.js";
import { PROPERTIES, NETWORK_COMBINATIONS, getDevelopmentProjectById } from "game-data";

export interface DistrictControlState {
    districtId: string;
    ownershipCount: Record<string, number>;
    controlPlayerId: string | null;
    isNetworkActive: boolean;
    participatingPropertyIds: string[];
}

export function getDistrictControlState(state: GameState, districtId: string): DistrictControlState {
    const districtProps = PROPERTIES.filter(p => p.districtId === districtId);
    const ownershipCount: Record<string, number> = {};
    let controlPlayerId: string | null = null;
    let isNetworkActive = false;
    let participatingPropertyIds: string[] = [];

    for (const prop of districtProps) {
        const ownerId = state.public.properties[prop.id]?.ownerId;
        if (ownerId) {
            ownershipCount[ownerId] = (ownershipCount[ownerId] || 0) + 1;
            if (ownershipCount[ownerId] === 4) {
                controlPlayerId = ownerId;
            }
        }
    }

    if (controlPlayerId) {
        // Collect all built families on player's properties in this district
        const builtFamilies = new Map<string, string[]>(); // familyId -> propertyIds

        for (const prop of districtProps) {
            const pState = state.public.properties[prop.id];
            if (!pState) continue;

            const addFamily = (projectId: string | null) => {
                if (!projectId) return;
                const project = getDevelopmentProjectById(projectId);
                if (project) {
                    if (!builtFamilies.has(project.familyId)) {
                        builtFamilies.set(project.familyId, []);
                    }
                    builtFamilies.get(project.familyId)!.push(prop.id);
                }
            };
            
            addFamily(pState.slot1);
            addFamily(pState.slot2);
        }

        // Check against valid network combinations
        for (const combo of NETWORK_COMBINATIONS) {
            // Must have all required families
            const hasAll = combo.requiredFamilies.every(fam => builtFamilies.has(fam));
            if (hasAll) {
                // Must be represented across at least 2 properties
                const involvedProps = new Set<string>();
                for (const fam of combo.requiredFamilies) {
                    for (const pid of builtFamilies.get(fam)!) {
                        involvedProps.add(pid);
                    }
                }

                if (involvedProps.size >= 2) {
                    isNetworkActive = true;
                    participatingPropertyIds = Array.from(involvedProps);
                    break; // District can have at most ONE active network
                }
            }
        }
    }

    return {
        districtId,
        ownershipCount,
        controlPlayerId,
        isNetworkActive,
        participatingPropertyIds
    };
}

export function getPlayerDistrictStatus(ownership: number): "NONE" | "PRESENCE" | "ESTABLISHED" | "MAJORITY" | "CONTROL" {
    if (ownership === 1) return "PRESENCE";
    if (ownership === 2) return "ESTABLISHED";
    if (ownership === 3) return "MAJORITY";
    if (ownership === 4) return "CONTROL";
    return "NONE";
}

export function generateDistrictEvents(oldState: GameState, newState: GameState): PublicEvent[] {
    const events: PublicEvent[] = [];
    const timestamp = Date.now();
    const changedDistricts = new Set<string>();
    
    for (const prop of PROPERTIES) {
        const oldP = oldState.public.properties[prop.id];
        const newP = newState.public.properties[prop.id];
        if (!oldP || !newP) continue;
        if (oldP.ownerId !== newP.ownerId || oldP.slot1 !== newP.slot1 || oldP.slot2 !== newP.slot2) {
            changedDistricts.add(prop.districtId);
        }
    }

    for (const districtId of changedDistricts) {
        const oldD = getDistrictControlState(oldState, districtId);
        const newD = getDistrictControlState(newState, districtId);
        
        events.push({
            type: "DISTRICT_CONTROL_CHANGED",
            payload: {
                districtId,
                ownership: newD.ownershipCount,
                controlPlayerId: newD.controlPlayerId,
                isNetworkActive: newD.isNetworkActive
            },
            timestamp
        });

        const allPlayers = new Set([...Object.keys(oldD.ownershipCount), ...Object.keys(newD.ownershipCount)]);
        for (const playerId of allPlayers) {
            const oldStatus = getPlayerDistrictStatus(oldD.ownershipCount[playerId] || 0);
            const newStatus = getPlayerDistrictStatus(newD.ownershipCount[playerId] || 0);
            
            if (oldStatus !== newStatus) {
                if (newStatus === "PRESENCE") {
                    events.push({ type: "INFORMATION_REVEALED", payload: { message: playerId + " gained Presence in " + districtId }, timestamp });
                } else if (newStatus === "ESTABLISHED") {
                    events.push({ type: "INFORMATION_REVEALED", payload: { message: playerId + " became Established in " + districtId + " (1st Slot Unlocked)" }, timestamp });
                } else if (newStatus === "MAJORITY") {
                    events.push({ type: "INFORMATION_REVEALED", payload: { message: playerId + " gained Majority in " + districtId + " (2nd Slot Unlocked)" }, timestamp });
                } else if (newStatus === "CONTROL") {
                    events.push({ type: "INFORMATION_REVEALED", payload: { message: playerId + " gained Control of " + districtId + " (+5% Yield, Flagship Eligible)" }, timestamp });
                }
                
                if (oldStatus === "CONTROL" && newStatus !== "CONTROL") {
                    events.push({ type: "INFORMATION_REVEALED", payload: { message: playerId + " lost Control of " + districtId }, timestamp });
                }
            }
        }

        if (!oldD.isNetworkActive && newD.isNetworkActive) {
            events.push({ type: "INFORMATION_REVEALED", payload: { message: "Development Network activated in " + districtId + " (+5% Yield)" }, timestamp });
        } else if (oldD.isNetworkActive && !newD.isNetworkActive) {
            events.push({ type: "INFORMATION_REVEALED", payload: { message: "Development Network deactivated in " + districtId }, timestamp });
        }
    }
    
    return events;
}

export function getUnlockedDevelopmentSlots(state: GameState, districtId: string, playerId: string): number {
    const dState = getDistrictControlState(state, districtId);
    const count = dState.ownershipCount[playerId] || 0;
    if (count >= 3) return 2;
    if (count >= 2) return 1;
    return 0;
}
