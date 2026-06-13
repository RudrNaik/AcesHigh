import type {
  CharacterData,
  //CharacterStats,
  //Coin
} from "./characterTypes";
//import aircraft from "../../../data/AircraftList.json"
//import staticMods from "../../../data/StaticMods.json";
//import perks from "../../../data/PerkList.json";
//import specializations from "../../../data/Specs.json";
//import downtime from "../../../data/Downtimes.json";
//import licenses from "../../../data/Licenses.json";
//import * as planeEngine from "./planeEngine";
//import * as charEngine from "./characterEngine";

export type licenseFormat = {
  A1: number;
  A2: number;
  B1: number;
  B2: number;
  C1: number;
  C2: number;
  D1: number;
  D2: number;
};

export function getLicenses(character: CharacterData): licenseFormat {
  return {
    A1: character.licenses.A1 || 0,
    A2: character.licenses.A2 || 0,
    B1: character.licenses.B1 || 0,
    B2: character.licenses.B2 || 0,
    C1: character.licenses.C1 || 0,
    C2: character.licenses.C2 || 0,
    D1: character.licenses.D1 || 0,
    D2: character.licenses.D2 || 0,
  };
}

export function getRP(character: CharacterData): number {
  let bonus = character.bonusMoola;
  let starting = character.metadata.startingRP;

  return bonus + starting;
}
