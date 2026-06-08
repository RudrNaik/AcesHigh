export interface CharacterStats {
  temper: number;
  nerve: number;
  reflex: number;
  gResist: number;
}

export interface CharacterStress {
  mental: number;
  permMentalAdj: number;
  physical: number;
  permPhysicalAdj: number;
}

export interface MetaData {
  setupComplete: boolean;

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
  advancements: number[];
}

export interface Aircraft {
  aircraftId: string;
  upgradePackage: string;
  modules: {
    m1: string;
    m2: string;
    m3: string;
    m4: string;
    m5: string;
    m6: string;
    m7: string;
    m8: string;
    m9: string;
    m10: string;
  };
}

export interface Deployment {
  type: string;
  modifier: string;
  override: string;
  advancement: boolean;
  actTour: boolean;
  actYourself: boolean;
  actSpec: boolean;
  defbrief: boolean;
  maxStress: boolean;
  survCrit: boolean;
}

export interface Tour {
  currTour: string
  acePerk: string
  dep1: Deployment;
  dep2: Deployment;
  dep3: Deployment;
  dep4: Deployment;
  dep5: Deployment;
}

export interface CharacterData {
  id: string;

  metadata: MetaData;

  dossier: CharacterDossier;

  stats: CharacterStats;

  stress: CharacterStress;

  aircraft: Aircraft;

  specialization: Specialization;

  aceperks: string[];
  baseperks: string[];

  backgroundPerk: string;

  quirks: CharacterQuirks;

  licenses: string[];

  loot: string[];

  masteredAircraft: string[];

  tours: Tour[];
}
