export interface CharacterStats {
  temper: number;
  nerve: number;
  reflex: number;
  gResist: number;
}

export interface CharacterStress {
  mental: number;
  physical: number;

  permMentalAdj: number;
  permPhysicalAdj: number;
}

export interface MetaData {
  setupComplete: boolean;

  userName: string;

  startingPilotStats: {
    temper: number;
    nerve: number;
    reflex: number;
    gResist: number;
  };
  startingRP: number;
  generation: number;
}

export interface CharacterDossier {
  firstName: string;
  lastName: string;
  callsign: string;

  gender: string;
  pronouns: string;

  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;

  rank: string;
  squadron: string;

  faith: string;
  sexuality: string;

  height: string;
  weight: string;

  hairColor: string;
  eyeColor: string;

  biography: string;
  description: string;
  serviceRecord: string;
  psychologicalReport: string;

  languages: string;

  relationships: string;

  notes: string;
}

export interface Coin {
  used: boolean;
  burned: boolean;
}

export interface Coins {
  coin1: Coin;
  coin2: Coin;
  coin3: Coin;
}

export type LootCategory = "perk" | "aircraft" | "module" | "ordnance" | "upgrade";

export type LootItem = {
  id: string;
  category: LootCategory;
};

export interface CharacterQuirks {
  quirk1Name: string;
  quirk1Desc: string;

  quirk2Name: string;
  quirk2Desc: string;

  quirk3Name: string;
  quirk3Desc: string;
}

export interface Specialization {
  specId: string;
  tactics: string[];
  advancements: Advancement[];
  mastery: string;
}

export interface Advancement {
  index: number;
  perkConversion: boolean;
}

export interface Aircraft {
  aircraftId: string;
  ordnanceId: string;
  upgradePackage: string;
  modules: string[];
  currentCapacity: number;
  currentSurvivability: number;
  currentEnergy: number;
  sweep: boolean;
  vtol: boolean;
}

export type Licenses = Record<string, number>;

export interface Deployment {
  type: string;
  modifier: string;
  genesis?: string;
  mastery?: string;
  advancementComplete: boolean;
  actTourComplete: boolean;
  actYourselfComplete: boolean;
  actSpecComplete: boolean;
  defbriefComplete: boolean;
  maxStressComplete: boolean;
  survCritComplete: boolean;
}

export interface Tour {
  currTourID: string;
  acePerk: string;
  dep1: Deployment;
  dep2: Deployment;
  dep3: Deployment;
  dep4: Deployment;
  dep5: Deployment;
  pheonix: boolean;
}

export interface Reset {
  DT: [Downtime, Downtime];
  BonusRp: number;
}

export interface Receipt {
  
}

export interface Downtime {
  id: string;
  starter: boolean;
  notes: string;
}

export interface CharacterData {
  id: string;

  metadata: MetaData;

  coins: Coin[];

  dossier: CharacterDossier;

  stats: CharacterStats;

  stress: CharacterStress;

  aircraft: Aircraft;

  specialization: Specialization;

  aceperks: string[];
  baseperks: string[];

  backgroundPerk: string;

  quirks: CharacterQuirks;

  licenses: Licenses;

  loot: LootItem[];

  masteredAircraft: string[];

  tours: Tour[];

  resets: Reset[];

  bonusMoola: number;
}
