// AUTO-GENERATED from authoritative SRS, BOARD_ARCHITECTURE.md, and PROPERTY_CATALOGUE.md

export type SpaceType = string;

export interface BoardSpace {
    id: string;
    name: string;
    type: SpaceType;
    propertyId?: string;
}


export interface DevelopmentFamily {
    id: string;
    name: string;
    category: 'Cashflow' | 'Resilience';
}

export interface DevelopmentProject {
    id: string;
    familyId: string;
    familyName: string;
    category: 'Cashflow' | 'Resilience';
    tier: number;
}

export interface DevelopmentCompatibility {
    primary: string[];
    secondary: string[];
    restricted: string[];
}

export interface NetworkCombination {
    requiredFamilies: string[];
    name: string;
}

export interface PropertyData {
    id: string;
    name: string;
    districtId: string;
    basePrice: number;
    baseYield: number;
    tier: string;
    primarySector: string;
    secondarySector: string;
    boardPosition: number;
    developmentCompatibility: DevelopmentCompatibility;
}

export const BOARD_SPACES: BoardSpace[] = [
    {
        "id": "00",
        "name": "VELORA CENTRAL",
        "type": "Start"
    },
    {
        "id": "01",
        "name": "[P01] WEAVER'S MARKET",
        "type": "Property",
        "propertyId": "P01"
    },
    {
        "id": "02",
        "name": "[P02] FOUNDERS' SQUARE",
        "type": "Property",
        "propertyId": "P02"
    },
    {
        "id": "03",
        "name": "[P03] THE ROYAL ARCADE",
        "type": "Property",
        "propertyId": "P03"
    },
    {
        "id": "04",
        "name": "[P04] CROWN CUSTOMS HOUSE",
        "type": "Property",
        "propertyId": "P04"
    },
    {
        "id": "05",
        "name": "CITY DESK",
        "type": "News"
    },
    {
        "id": "06",
        "name": "[P05] BROKER'S ROW",
        "type": "Property",
        "propertyId": "P05"
    },
    {
        "id": "07",
        "name": "[P06] MERCANTILE EXCHANGE",
        "type": "Property",
        "propertyId": "P06"
    },
    {
        "id": "08",
        "name": "[P07] NOVA TOWER",
        "type": "Property",
        "propertyId": "P07"
    },
    {
        "id": "09",
        "name": "[P08] VELORA WORLD BANK",
        "type": "Property",
        "propertyId": "P08"
    },
    {
        "id": "10",
        "name": "CIVIC HOLD",
        "type": "Lock"
    },
    {
        "id": "11",
        "name": "[P09] BAYSIDE MARINA",
        "type": "Property",
        "propertyId": "P09"
    },
    {
        "id": "12",
        "name": "[P10] PIER 14 PAVILION",
        "type": "Property",
        "propertyId": "P10"
    },
    {
        "id": "13",
        "name": "[P11] GRAND PROMENADE",
        "type": "Property",
        "propertyId": "P11"
    },
    {
        "id": "14",
        "name": "[P12] AZURE RESORT",
        "type": "Property",
        "propertyId": "P12"
    },
    {
        "id": "15",
        "name": "VELORA PORT",
        "type": "Transport"
    },
    {
        "id": "16",
        "name": "[P13] SCRAP YARD DEPOT",
        "type": "Property",
        "propertyId": "P13"
    },
    {
        "id": "17",
        "name": "[P14] STEEL FOUNDRY",
        "type": "Property",
        "propertyId": "P14"
    },
    {
        "id": "18",
        "name": "[P15] RIVER PORT TERMINAL",
        "type": "Property",
        "propertyId": "P15"
    },
    {
        "id": "19",
        "name": "[P16] VELORA HEAVY INDUSTRIES",
        "type": "Property",
        "propertyId": "P16"
    },
    {
        "id": "20",
        "name": "CITY HALL",
        "type": "Civic"
    },
    {
        "id": "21",
        "name": "[P17] HIGHVIEW TERRACES",
        "type": "Property",
        "propertyId": "P17"
    },
    {
        "id": "22",
        "name": "[P18] NORTH UNIVERSITY",
        "type": "Property",
        "propertyId": "P18"
    },
    {
        "id": "23",
        "name": "[P19] CIVIC CENTER",
        "type": "Property",
        "propertyId": "P19"
    },
    {
        "id": "24",
        "name": "[P20] THE MAYOR'S ESTATE",
        "type": "Property",
        "propertyId": "P20"
    },
    {
        "id": "25",
        "name": "MUNICIPAL LEVY",
        "type": "Financial"
    },
    {
        "id": "26",
        "name": "[P21] ASSEMBLY HANGAR",
        "type": "Property",
        "propertyId": "P21"
    },
    {
        "id": "27",
        "name": "[P22] NEXUS TECH PARK",
        "type": "Property",
        "propertyId": "P22"
    },
    {
        "id": "28",
        "name": "[P23] ORBITAL LOGISTICS CENTER",
        "type": "Property",
        "propertyId": "P23"
    },
    {
        "id": "29",
        "name": "[P24] VELORA INTERNATIONAL",
        "type": "Property",
        "propertyId": "P24"
    },
    {
        "id": "30",
        "name": "VELORA BOURSE",
        "type": "Market"
    },
    {
        "id": "31",
        "name": "MARKET DESK",
        "type": "News"
    },
    {
        "id": "32",
        "name": "CENTRAL METRO",
        "type": "Transport"
    },
    {
        "id": "33",
        "name": "TREASURY WINDOW",
        "type": "Financial"
    },
    {
        "id": "34",
        "name": "FOREIGN DESK",
        "type": "News"
    },
    {
        "id": "35",
        "name": "AERODROME LINK",
        "type": "Transport"
    },
    {
        "id": "36",
        "name": "PROPERTY DESK",
        "type": "News"
    },
    {
        "id": "37",
        "name": "EASTERN RAIL TERMINAL",
        "type": "Transport"
    },
    {
        "id": "38",
        "name": "REGULATORY COURT",
        "type": "Action"
    },
    {
        "id": "39",
        "name": "CIVIC RESERVE",
        "type": "Financial"
    }
];

export const PROPERTIES: PropertyData[] = [
    {
        "id": "P01",
        "name": "Weaver's Market",
        "districtId": "D01",
        "basePrice": 240,
        "primarySector": "Heritage Commerce",
        "secondarySector": "Industry & Logistics",
        "tier": "Foundation",
        "baseYield": 43,
        "boardPosition": 1,
        "developmentCompatibility": { "primary": ["F_RETAIL","F_CIVIC"], "secondary": ["F_TRANSIT","F_HOSPITALITY"], "restricted": ["F_OFFICE","F_PRODUCTION","F_ENERGY","F_LOGISTICS"] }
    },
    {
        "id": "P02",
        "name": "Founders' Square",
        "districtId": "D01",
        "basePrice": 320,
        "primarySector": "Heritage Commerce",
        "secondarySector": "Residential & Civic",
        "tier": "Core",
        "baseYield": 54,
        "boardPosition": 2,
        "developmentCompatibility": { "primary": ["F_CIVIC","F_RETAIL"], "secondary": ["F_HOSPITALITY","F_TRANSIT"], "restricted": ["F_OFFICE","F_PRODUCTION","F_ENERGY","F_LOGISTICS"] }
    },
    {
        "id": "P03",
        "name": "The Royal Arcade",
        "districtId": "D01",
        "basePrice": 420,
        "primarySector": "Heritage Commerce",
        "secondarySector": "Leisure & Hospitality",
        "tier": "Growth",
        "baseYield": 67,
        "boardPosition": 3,
        "developmentCompatibility": { "primary": ["F_RETAIL","F_HOSPITALITY"], "secondary": ["F_CIVIC","F_TRANSIT"], "restricted": ["F_OFFICE","F_PRODUCTION","F_ENERGY","F_LOGISTICS"] }
    },
    {
        "id": "P04",
        "name": "Crown Customs House",
        "districtId": "D01",
        "basePrice": 540,
        "primarySector": "Heritage Commerce",
        "secondarySector": "Finance & Enterprise",
        "tier": "Landmark",
        "baseYield": 81,
        "boardPosition": 4,
        "developmentCompatibility": { "primary": ["F_OFFICE","F_CIVIC"], "secondary": ["F_RETAIL","F_TRANSIT"], "restricted": ["F_PRODUCTION","F_HOSPITALITY","F_ENERGY","F_LOGISTICS"] }
    },
    {
        "id": "P05",
        "name": "Broker's Row",
        "districtId": "D02",
        "basePrice": 280,
        "primarySector": "Finance & Enterprise",
        "secondarySector": "Heritage Commerce",
        "tier": "Foundation",
        "baseYield": 50,
        "boardPosition": 6,
        "developmentCompatibility": { "primary": ["F_OFFICE","F_CIVIC"], "secondary": ["F_TRANSIT","F_ENERGY"], "restricted": ["F_RETAIL","F_PRODUCTION","F_HOSPITALITY","F_LOGISTICS"] }
    },
    {
        "id": "P06",
        "name": "Mercantile Exchange",
        "districtId": "D02",
        "basePrice": 360,
        "primarySector": "Finance & Enterprise",
        "secondarySector": "Industry & Logistics",
        "tier": "Core",
        "baseYield": 61,
        "boardPosition": 7,
        "developmentCompatibility": { "primary": ["F_OFFICE","F_LOGISTICS"], "secondary": ["F_ENERGY","F_TRANSIT"], "restricted": ["F_RETAIL","F_PRODUCTION","F_HOSPITALITY","F_CIVIC"] }
    },
    {
        "id": "P07",
        "name": "Nova Tower",
        "districtId": "D02",
        "basePrice": 480,
        "primarySector": "Finance & Enterprise",
        "secondarySector": "Technology & Aviation",
        "tier": "Growth",
        "baseYield": 76,
        "boardPosition": 8,
        "developmentCompatibility": { "primary": ["F_OFFICE","F_ENERGY"], "secondary": ["F_LOGISTICS","F_CIVIC"], "restricted": ["F_RETAIL","F_PRODUCTION","F_HOSPITALITY","F_TRANSIT"] }
    },
    {
        "id": "P08",
        "name": "Velora World Bank",
        "districtId": "D02",
        "basePrice": 620,
        "primarySector": "Finance & Enterprise",
        "secondarySector": "None",
        "tier": "Landmark",
        "baseYield": 93,
        "boardPosition": 9,
        "developmentCompatibility": { "primary": ["F_OFFICE","F_CIVIC"], "secondary": ["F_ENERGY","F_LOGISTICS"], "restricted": ["F_RETAIL","F_PRODUCTION","F_HOSPITALITY","F_TRANSIT"] }
    },
    {
        "id": "P09",
        "name": "Bayside Marina",
        "districtId": "D03",
        "basePrice": 260,
        "primarySector": "Leisure & Hospitality",
        "secondarySector": "Residential & Civic",
        "tier": "Foundation",
        "baseYield": 46,
        "boardPosition": 11,
        "developmentCompatibility": { "primary": ["F_HOSPITALITY","F_TRANSIT"], "secondary": ["F_RETAIL","F_ENERGY"], "restricted": ["F_OFFICE","F_PRODUCTION","F_LOGISTICS","F_CIVIC"] }
    },
    {
        "id": "P10",
        "name": "Pier 14 Pavilion",
        "districtId": "D03",
        "basePrice": 340,
        "primarySector": "Leisure & Hospitality",
        "secondarySector": "Heritage Commerce",
        "tier": "Core",
        "baseYield": 57,
        "boardPosition": 12,
        "developmentCompatibility": { "primary": ["F_RETAIL","F_HOSPITALITY"], "secondary": ["F_TRANSIT","F_CIVIC"], "restricted": ["F_OFFICE","F_PRODUCTION","F_ENERGY","F_LOGISTICS"] }
    },
    {
        "id": "P11",
        "name": "Grand Promenade",
        "districtId": "D03",
        "basePrice": 460,
        "primarySector": "Leisure & Hospitality",
        "secondarySector": "Heritage Commerce",
        "tier": "Growth",
        "baseYield": 73,
        "boardPosition": 13,
        "developmentCompatibility": { "primary": ["F_RETAIL","F_HOSPITALITY"], "secondary": ["F_TRANSIT","F_CIVIC"], "restricted": ["F_OFFICE","F_PRODUCTION","F_ENERGY","F_LOGISTICS"] }
    },
    {
        "id": "P12",
        "name": "Azure Resort",
        "districtId": "D03",
        "basePrice": 580,
        "primarySector": "Leisure & Hospitality",
        "secondarySector": "Finance & Enterprise",
        "tier": "Landmark",
        "baseYield": 87,
        "boardPosition": 14,
        "developmentCompatibility": { "primary": ["F_HOSPITALITY","F_ENERGY"], "secondary": ["F_RETAIL","F_TRANSIT"], "restricted": ["F_OFFICE","F_PRODUCTION","F_LOGISTICS","F_CIVIC"] }
    },
    {
        "id": "P13",
        "name": "Scrap Yard Depot",
        "districtId": "D04",
        "basePrice": 220,
        "primarySector": "Industry & Logistics",
        "secondarySector": "Technology & Aviation",
        "tier": "Foundation",
        "baseYield": 39,
        "boardPosition": 16,
        "developmentCompatibility": { "primary": ["F_LOGISTICS","F_PRODUCTION"], "secondary": ["F_ENERGY","F_TRANSIT"], "restricted": ["F_OFFICE","F_RETAIL","F_HOSPITALITY","F_CIVIC"] }
    },
    {
        "id": "P14",
        "name": "Steel Foundry",
        "districtId": "D04",
        "basePrice": 300,
        "primarySector": "Industry & Logistics",
        "secondarySector": "None",
        "tier": "Core",
        "baseYield": 51,
        "boardPosition": 17,
        "developmentCompatibility": { "primary": ["F_PRODUCTION","F_ENERGY"], "secondary": ["F_LOGISTICS","F_CIVIC"], "restricted": ["F_OFFICE","F_RETAIL","F_HOSPITALITY","F_TRANSIT"] }
    },
    {
        "id": "P15",
        "name": "River Port Terminal",
        "districtId": "D04",
        "basePrice": 400,
        "primarySector": "Industry & Logistics",
        "secondarySector": "Leisure & Hospitality",
        "tier": "Growth",
        "baseYield": 64,
        "boardPosition": 18,
        "developmentCompatibility": { "primary": ["F_LOGISTICS","F_TRANSIT"], "secondary": ["F_PRODUCTION","F_ENERGY"], "restricted": ["F_OFFICE","F_RETAIL","F_HOSPITALITY","F_CIVIC"] }
    },
    {
        "id": "P16",
        "name": "Velora Heavy Industries",
        "districtId": "D04",
        "basePrice": 520,
        "primarySector": "Industry & Logistics",
        "secondarySector": "Technology & Aviation",
        "tier": "Landmark",
        "baseYield": 78,
        "boardPosition": 19,
        "developmentCompatibility": { "primary": ["F_PRODUCTION","F_LOGISTICS"], "secondary": ["F_ENERGY","F_TRANSIT"], "restricted": ["F_OFFICE","F_RETAIL","F_HOSPITALITY","F_CIVIC"] }
    },
    {
        "id": "P17",
        "name": "Highview Terraces",
        "districtId": "D05",
        "basePrice": 240,
        "primarySector": "Residential & Civic",
        "secondarySector": "Industry & Logistics",
        "tier": "Foundation",
        "baseYield": 43,
        "boardPosition": 21,
        "developmentCompatibility": { "primary": ["F_CIVIC","F_ENERGY"], "secondary": ["F_TRANSIT","F_HOSPITALITY"], "restricted": ["F_OFFICE","F_RETAIL","F_PRODUCTION","F_LOGISTICS"] }
    },
    {
        "id": "P18",
        "name": "North University",
        "districtId": "D05",
        "basePrice": 380,
        "primarySector": "Residential & Civic",
        "secondarySector": "Technology & Aviation",
        "tier": "Core",
        "baseYield": 64,
        "boardPosition": 22,
        "developmentCompatibility": { "primary": ["F_CIVIC","F_ENERGY"], "secondary": ["F_TRANSIT","F_OFFICE"], "restricted": ["F_RETAIL","F_PRODUCTION","F_HOSPITALITY","F_LOGISTICS"] }
    },
    {
        "id": "P19",
        "name": "Civic Center",
        "districtId": "D05",
        "basePrice": 440,
        "primarySector": "Residential & Civic",
        "secondarySector": "Finance & Enterprise",
        "tier": "Growth",
        "baseYield": 70,
        "boardPosition": 23,
        "developmentCompatibility": { "primary": ["F_CIVIC","F_OFFICE"], "secondary": ["F_ENERGY","F_TRANSIT"], "restricted": ["F_RETAIL","F_PRODUCTION","F_HOSPITALITY","F_LOGISTICS"] }
    },
    {
        "id": "P20",
        "name": "The Mayor's Estate",
        "districtId": "D05",
        "basePrice": 560,
        "primarySector": "Residential & Civic",
        "secondarySector": "Heritage Commerce",
        "tier": "Landmark",
        "baseYield": 84,
        "boardPosition": 24,
        "developmentCompatibility": { "primary": ["F_HOSPITALITY","F_CIVIC"], "secondary": ["F_ENERGY","F_TRANSIT"], "restricted": ["F_OFFICE","F_RETAIL","F_PRODUCTION","F_LOGISTICS"] }
    },
    {
        "id": "P21",
        "name": "Assembly Hangar",
        "districtId": "D06",
        "basePrice": 270,
        "primarySector": "Technology & Aviation",
        "secondarySector": "Industry & Logistics",
        "tier": "Foundation",
        "baseYield": 48,
        "boardPosition": 26,
        "developmentCompatibility": { "primary": ["F_PRODUCTION","F_LOGISTICS"], "secondary": ["F_ENERGY","F_TRANSIT"], "restricted": ["F_OFFICE","F_RETAIL","F_HOSPITALITY","F_CIVIC"] }
    },
    {
        "id": "P22",
        "name": "Nexus Tech Park",
        "districtId": "D06",
        "basePrice": 350,
        "primarySector": "Technology & Aviation",
        "secondarySector": "Finance & Enterprise",
        "tier": "Core",
        "baseYield": 59,
        "boardPosition": 27,
        "developmentCompatibility": { "primary": ["F_OFFICE","F_ENERGY"], "secondary": ["F_LOGISTICS","F_CIVIC"], "restricted": ["F_RETAIL","F_PRODUCTION","F_HOSPITALITY","F_TRANSIT"] }
    },
    {
        "id": "P23",
        "name": "Orbital Logistics Center",
        "districtId": "D06",
        "basePrice": 450,
        "primarySector": "Technology & Aviation",
        "secondarySector": "Industry & Logistics",
        "tier": "Growth",
        "baseYield": 72,
        "boardPosition": 28,
        "developmentCompatibility": { "primary": ["F_LOGISTICS","F_TRANSIT"], "secondary": ["F_ENERGY","F_CIVIC"], "restricted": ["F_OFFICE","F_RETAIL","F_PRODUCTION","F_HOSPITALITY"] }
    },
    {
        "id": "P24",
        "name": "Velora International",
        "districtId": "D06",
        "basePrice": 600,
        "primarySector": "Technology & Aviation",
        "secondarySector": "Leisure & Hospitality",
        "tier": "Landmark",
        "baseYield": 90,
        "boardPosition": 29,
        "developmentCompatibility": { "primary": ["F_TRANSIT","F_OFFICE"], "secondary": ["F_RETAIL","F_LOGISTICS"], "restricted": ["F_PRODUCTION","F_HOSPITALITY","F_ENERGY","F_CIVIC"] }
    }
];

export const PROPERTY_BY_ID: Record<string, PropertyData> = Object.fromEntries(
    PROPERTIES.map(p => [p.id, p])
);

export const PROPERTY_BY_SPACE_POSITION: Record<number, PropertyData> = Object.fromEntries(
    PROPERTIES.map(p => [p.boardPosition, p])
);

export function getPropertyBySpaceIndex(position: number): PropertyData | undefined {
    return PROPERTY_BY_SPACE_POSITION[position];
}

export function getPropertyById(id: string): PropertyData | undefined {
    return PROPERTY_BY_ID[id];
}


export const DEVELOPMENT_FAMILIES: DevelopmentFamily[] = [
    {
        "id": "F_OFFICE",
        "name": "Office Annex",
        "category": "Cashflow"
    },
    {
        "id": "F_RETAIL",
        "name": "Retail Arcade",
        "category": "Cashflow"
    },
    {
        "id": "F_PRODUCTION",
        "name": "Production Line",
        "category": "Cashflow"
    },
    {
        "id": "F_HOSPITALITY",
        "name": "Hospitality Wing",
        "category": "Cashflow"
    },
    {
        "id": "F_TRANSIT",
        "name": "Transit Access",
        "category": "Resilience"
    },
    {
        "id": "F_ENERGY",
        "name": "Energy Retrofit",
        "category": "Resilience"
    },
    {
        "id": "F_LOGISTICS",
        "name": "Logistics Hub",
        "category": "Resilience"
    },
    {
        "id": "F_CIVIC",
        "name": "Civic Infrastructure",
        "category": "Resilience"
    }
];

export const DEVELOPMENT_PROJECTS: DevelopmentProject[] = [
    {
        "id": "DEV_OFFICE_1",
        "familyId": "F_OFFICE",
        "familyName": "Office Annex",
        "category": "Cashflow",
        "tier": 1
    },
    {
        "id": "DEV_OFFICE_2",
        "familyId": "F_OFFICE",
        "familyName": "Office Annex",
        "category": "Cashflow",
        "tier": 2
    },
    {
        "id": "DEV_OFFICE_3",
        "familyId": "F_OFFICE",
        "familyName": "Office Annex",
        "category": "Cashflow",
        "tier": 3
    },
    {
        "id": "DEV_OFFICE_4",
        "familyId": "F_OFFICE",
        "familyName": "Office Annex",
        "category": "Cashflow",
        "tier": 4
    },
    {
        "id": "DEV_RETAIL_1",
        "familyId": "F_RETAIL",
        "familyName": "Retail Arcade",
        "category": "Cashflow",
        "tier": 1
    },
    {
        "id": "DEV_RETAIL_2",
        "familyId": "F_RETAIL",
        "familyName": "Retail Arcade",
        "category": "Cashflow",
        "tier": 2
    },
    {
        "id": "DEV_RETAIL_3",
        "familyId": "F_RETAIL",
        "familyName": "Retail Arcade",
        "category": "Cashflow",
        "tier": 3
    },
    {
        "id": "DEV_RETAIL_4",
        "familyId": "F_RETAIL",
        "familyName": "Retail Arcade",
        "category": "Cashflow",
        "tier": 4
    },
    {
        "id": "DEV_PRODUCTION_1",
        "familyId": "F_PRODUCTION",
        "familyName": "Production Line",
        "category": "Cashflow",
        "tier": 1
    },
    {
        "id": "DEV_PRODUCTION_2",
        "familyId": "F_PRODUCTION",
        "familyName": "Production Line",
        "category": "Cashflow",
        "tier": 2
    },
    {
        "id": "DEV_PRODUCTION_3",
        "familyId": "F_PRODUCTION",
        "familyName": "Production Line",
        "category": "Cashflow",
        "tier": 3
    },
    {
        "id": "DEV_PRODUCTION_4",
        "familyId": "F_PRODUCTION",
        "familyName": "Production Line",
        "category": "Cashflow",
        "tier": 4
    },
    {
        "id": "DEV_HOSPITALITY_1",
        "familyId": "F_HOSPITALITY",
        "familyName": "Hospitality Wing",
        "category": "Cashflow",
        "tier": 1
    },
    {
        "id": "DEV_HOSPITALITY_2",
        "familyId": "F_HOSPITALITY",
        "familyName": "Hospitality Wing",
        "category": "Cashflow",
        "tier": 2
    },
    {
        "id": "DEV_HOSPITALITY_3",
        "familyId": "F_HOSPITALITY",
        "familyName": "Hospitality Wing",
        "category": "Cashflow",
        "tier": 3
    },
    {
        "id": "DEV_HOSPITALITY_4",
        "familyId": "F_HOSPITALITY",
        "familyName": "Hospitality Wing",
        "category": "Cashflow",
        "tier": 4
    },
    {
        "id": "DEV_TRANSIT_1",
        "familyId": "F_TRANSIT",
        "familyName": "Transit Access",
        "category": "Resilience",
        "tier": 1
    },
    {
        "id": "DEV_TRANSIT_2",
        "familyId": "F_TRANSIT",
        "familyName": "Transit Access",
        "category": "Resilience",
        "tier": 2
    },
    {
        "id": "DEV_TRANSIT_3",
        "familyId": "F_TRANSIT",
        "familyName": "Transit Access",
        "category": "Resilience",
        "tier": 3
    },
    {
        "id": "DEV_TRANSIT_4",
        "familyId": "F_TRANSIT",
        "familyName": "Transit Access",
        "category": "Resilience",
        "tier": 4
    },
    {
        "id": "DEV_ENERGY_1",
        "familyId": "F_ENERGY",
        "familyName": "Energy Retrofit",
        "category": "Resilience",
        "tier": 1
    },
    {
        "id": "DEV_ENERGY_2",
        "familyId": "F_ENERGY",
        "familyName": "Energy Retrofit",
        "category": "Resilience",
        "tier": 2
    },
    {
        "id": "DEV_ENERGY_3",
        "familyId": "F_ENERGY",
        "familyName": "Energy Retrofit",
        "category": "Resilience",
        "tier": 3
    },
    {
        "id": "DEV_ENERGY_4",
        "familyId": "F_ENERGY",
        "familyName": "Energy Retrofit",
        "category": "Resilience",
        "tier": 4
    },
    {
        "id": "DEV_LOGISTICS_1",
        "familyId": "F_LOGISTICS",
        "familyName": "Logistics Hub",
        "category": "Resilience",
        "tier": 1
    },
    {
        "id": "DEV_LOGISTICS_2",
        "familyId": "F_LOGISTICS",
        "familyName": "Logistics Hub",
        "category": "Resilience",
        "tier": 2
    },
    {
        "id": "DEV_LOGISTICS_3",
        "familyId": "F_LOGISTICS",
        "familyName": "Logistics Hub",
        "category": "Resilience",
        "tier": 3
    },
    {
        "id": "DEV_LOGISTICS_4",
        "familyId": "F_LOGISTICS",
        "familyName": "Logistics Hub",
        "category": "Resilience",
        "tier": 4
    },
    {
        "id": "DEV_CIVIC_1",
        "familyId": "F_CIVIC",
        "familyName": "Civic Infrastructure",
        "category": "Resilience",
        "tier": 1
    },
    {
        "id": "DEV_CIVIC_2",
        "familyId": "F_CIVIC",
        "familyName": "Civic Infrastructure",
        "category": "Resilience",
        "tier": 2
    },
    {
        "id": "DEV_CIVIC_3",
        "familyId": "F_CIVIC",
        "familyName": "Civic Infrastructure",
        "category": "Resilience",
        "tier": 3
    },
    {
        "id": "DEV_CIVIC_4",
        "familyId": "F_CIVIC",
        "familyName": "Civic Infrastructure",
        "category": "Resilience",
        "tier": 4
    }
];

export const NETWORK_COMBINATIONS: NetworkCombination[] = [
    { requiredFamilies: ['F_OFFICE', 'F_TRANSIT'], name: 'Connected Commerce' },
    { requiredFamilies: ['F_HOSPITALITY', 'F_TRANSIT'], name: 'Leisure Transit' },
    { requiredFamilies: ['F_HOSPITALITY', 'F_ENERGY'], name: 'Resilient Hospitality' },
    { requiredFamilies: ['F_PRODUCTION', 'F_ENERGY'], name: 'Clean Production' },
    { requiredFamilies: ['F_PRODUCTION', 'F_LOGISTICS'], name: 'Industrial Flow' },
    { requiredFamilies: ['F_LOGISTICS', 'F_CIVIC'], name: 'Civic Supply' },
    { requiredFamilies: ['F_CIVIC', 'F_RETAIL'], name: 'Civic Commerce' },
    { requiredFamilies: ['F_RETAIL', 'F_OFFICE'], name: 'Commercial Exchange' }
];

export function getDevelopmentProjectById(id: string): DevelopmentProject | undefined {
    return DEVELOPMENT_PROJECTS.find(p => p.id === id);
}
