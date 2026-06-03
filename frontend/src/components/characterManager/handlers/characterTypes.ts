export interface CharacterStats {
  temper: number;
  nerve: number;
  reflex: number;
  gResist: number;
}

export interface CharacterStress {
  mental: number;
  physical: number;
}

export interface CharacterDossier {
  firstName: string;
  lastName: string;
  callsign: string;

  age: number | null;

  gender: string;
  pronouns: string;

  quirk1: string;
  quirk2: string;
  quirk3: string;

  notes: string;
}

export interface CharacterData {
  id: string;

  dossier: CharacterDossier;

  stats: CharacterStats;

  stress: CharacterStress;

  aircraftId: string | null;

  perks: string[];

  licenses: string[];

  loot: string[];

  tourId: string | null;
}