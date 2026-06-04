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
    quirk1Name: string
    quirk1Desc: string

    quirk2Name: string
    quirk2Desc: string

    quirk3Name: string
    quirk3Desc: string
}

export interface CharacterData {
  id: string;

  dossier: CharacterDossier;

  stats: CharacterStats;

  stress: CharacterStress;

  aircraftId: string | null;

  perks: string[];

  quirks: CharacterQuirks;

  licenses: string[];

  loot: string[];

  tourId: string | null;
}
