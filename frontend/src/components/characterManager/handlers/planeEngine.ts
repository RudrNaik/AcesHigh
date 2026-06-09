import type { CharacterData } from "./characterTypes";
//import aircraft from "../../../data/AircraftList.json"
//import staticMods from "../../../data/StaticMods.json";
//import perks from "../../../data/PerkList.json";
//import specializations from "../../../data/Specs.json";
//import downtime from "../../../data/Downtimes.json";
import licenses from "../../../data/Licenses.json";

export type LicenseRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type RankKey = `rank${LicenseRank}`;

export function getPlane(character: CharacterData){
    return character.aircraft.aircraftId
}

export function getPlaneMods(character :CharacterData){
    return character.aircraft.modules
}

export function getUpPackage(character :CharacterData){
    return character.aircraft.upgradePackage || "n/a"
}

export function getLicenseUnlocks(licenseId: string, rank: number) {
  const license = licenses.find((l) => l.id === licenseId);
  if (!license) return null;

  const result = {
    ordnance: [] as string[],
    airframes: [] as string[],
    modules: [] as string[],
    upgrades: [] as string[],
  };

  const applyTier = (key: RankKey) => {
    const tier = license.unlocks[key];
    if (!tier) return;

    result.ordnance.push(...tier.ordnance);
    result.airframes.push(...tier.airframes);
    result.modules.push(...tier.modules);
    result.upgrades.push(...tier.upgrades);
  };

  applyTier("rank0");

  for (let r = 1; r <= rank; r++) {
    applyTier(`rank${r}` as RankKey);
  }

  return result;
}