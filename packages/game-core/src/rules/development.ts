import { GameState, Player } from "../state/index.js";
import { PublicEvent } from "../events/index.js";
import { getPropertyById, getDevelopmentProjectById } from "game-data";
import { getUnlockedDevelopmentSlots } from "./district.js";

export function resolveConstructDevelopment(
    state: GameState,
    player: Player,
    propertyId: string,
    projectId: string,
    slot: 1 | 2
): { success: boolean; error?: string; events: PublicEvent[] } {
    const timestamp = Date.now();
    const propState = state.public.properties[propertyId];
    if (!propState || propState.ownerId !== player.id) {
        return { success: false, error: "You do not own this property", events: [] };
    }

    const propData = getPropertyById(propertyId);
    if (!propData) return { success: false, error: "Invalid property", events: [] };

    const project = getDevelopmentProjectById(projectId);
    if (!project) return { success: false, error: "Invalid development project", events: [] };

    // Enforce District Control locks
    const unlockedSlots = getUnlockedDevelopmentSlots(state, propData.districtId, player.id);
    if (slot > unlockedSlots) {
        const needed = slot === 1 ? 'Established (2/4)' : 'Majority (3/4)';
        return { success: false, error: `Slot ${slot} is locked. You need ${needed} status in this district.`, events: [] };
    }

    // Enforce Compatibility
    const compat = propData.developmentCompatibility;
    const famId = project.familyId;
    if (!compat) return { success: false, error: "Property has no development profile", events: [] };
    
    const isPrimary = compat.primary.includes(famId);
    const isSecondary = compat.secondary.includes(famId);
    if (!isPrimary && !isSecondary) {
        return { success: false, error: `${project.familyName} is a Restricted development family for this property.`, events: [] };
    }

    // Cost rule
    let cost = Math.floor(propData.basePrice * (slot === 1 ? 0.35 : 0.50));
    
    // Redevelopment credit
    const existingProject = slot === 1 ? propState.slot1 : propState.slot2;
    let credit = 0;
    if (existingProject) {
        credit = Math.floor(cost * 0.50); // 50% of the slot's original cost
    }

    const finalCost = cost - credit;

    if (player.cash < finalCost) {
        return { success: false, error: "Insufficient funds", events: [] };
    }

    
    const exchangeIdx = state.public.developmentExchange.indexOf(projectId);
    if (exchangeIdx === -1) {
        return { success: false, error: "Project is not available in the Development Exchange.", events: [] };
    }

    // Execute
    player.cash -= finalCost;
    if (slot === 1) propState.slot1 = projectId;
    else propState.slot2 = projectId;

    // Exchange / Supply handling
    state.public.developmentExchange.splice(exchangeIdx, 1);
    
    // Draw replacement if available
    if (state.public.developmentSupply.length > 0) {
        const replacement = state.public.developmentSupply.shift(); // take from top
        if (replacement) {
            state.public.developmentExchange.push(replacement);
        }
    }

    // Redevelopment recycle
    if (existingProject) {
        state.public.developmentSupply.push(existingProject); // return to bottom of supply
    }


    const events: PublicEvent[] = [{
        type: "DEVELOPMENT_CONSTRUCTED",
        payload: {
            playerId: player.id,
            propertyId,
            projectId,
            slot,
            cost: finalCost
        },
        timestamp
    }];

    return { success: true, events };
}
