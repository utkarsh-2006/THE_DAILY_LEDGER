import { GameState } from "../state/index.js";
import { getPropertyById, getDevelopmentProjectById } from "game-data";
import { getDistrictControlState } from "./district.js";

export function calculateCurrentYield(state: GameState, propertyId: string): number {
    const propState = state.public.properties[propertyId];
    if (!propState) return 0;
    
    const propData = getPropertyById(propertyId);
    if (!propData) return 0;

    let baseYield = propData.baseYield;
    let devModifier = 1.0;
    const compat = propData.developmentCompatibility;

    const applyDev = (projectId: string | null) => {
        if (!projectId) return;
        const project = getDevelopmentProjectById(projectId);
        if (!project || project.category !== "Cashflow") return; 
        
        if (compat.primary.includes(project.familyId)) {
            devModifier += 0.50;
        } else if (compat.secondary.includes(project.familyId)) {
            devModifier += 0.35;
        }
    };
    
    applyDev(propState.slot1);
    applyDev(propState.slot2);

    let marketModifier = 1.0; // MARKET_SYSTEM integration explicitly deferred until Exposure Index exists.

    let districtModifier = 1.0;
    let networkModifier = 1.0;

    if (propState.ownerId) {
        const districtState = getDistrictControlState(state, propData.districtId);
        if (districtState.controlPlayerId === propState.ownerId) {
            districtModifier = 1.05; 
            
            if (districtState.isNetworkActive && districtState.participatingPropertyIds.includes(propertyId)) {
                networkModifier = 1.05;
            }
        }
    }

    return Math.round(baseYield * devModifier * marketModifier * districtModifier * networkModifier);
}
