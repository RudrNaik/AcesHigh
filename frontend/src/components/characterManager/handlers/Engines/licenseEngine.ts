import type {
  CharacterData,
  //CharacterStats,
  //Coin
} from "../characterTypes";
//import aircraft from "../../../data/AircraftList.json"
//import staticMods from "../../../data/StaticMods.json";
//import perks from "../../../data/PerkList.json";
//import specializations from "../../../data/Specs.json";
//import downtime from "../../../data/Downtimes.json";
import licenses from "../../../../data/Licenses.json";
import * as planeEngine from "./planeEngine";
//import * as charEngine from "./characterEngine";

export type LicenseFormat = {
  A1: number;
  A2: number;
  B1: number;
  B2: number;
  C1: number;
  C2: number;
  D1: number;
  D2: number;
};

export type LicenseKey = keyof LicenseFormat;

type UnlockBucket = {
  ordnance: string[];
  airframes: string[];
  modules: string[];
  upgrades: string[];
};

const TIER_COSTS: Record<number, number> = {
  0: 0,
  1: 20, // 20
  2: 70, // 20+50
  3: 150, // 20+50+80
  4: 250, // ...+100
  5: 370, // ...+120
  6: 500, // ...+130
  7: 641, // ...+141
};

export function getLicenses(character: CharacterData): LicenseFormat {
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

export function getSpentRP(character: CharacterData): number {
  const licenses = getLicenses(character);
  return (Object.values(licenses) as number[]).reduce(
    (sum, tier) => sum + TIER_COSTS[tier],
    0,
  );
}

export function getRemainingRP(character: CharacterData): number {
  return getRP(character) - getSpentRP(character);
}

export function getUpgradeCost(
  character: CharacterData,
  license: LicenseKey,
  targetTier: number,
): number {
  const currentTier = character.licenses[license] ?? 0;
  if (targetTier <= currentTier) return 0;
  return TIER_COSTS[targetTier] - TIER_COSTS[currentTier];
}

export function getDowngradeRefund(
  character: CharacterData,
  license: LicenseKey,
  targetTier: number,
): number {
  const currentTier = character.licenses[license] ?? 0;
  if (targetTier >= currentTier) return 0;
  return TIER_COSTS[currentTier] - TIER_COSTS[targetTier];
}

export function canAffordUpgrade(
  character: CharacterData,
  license: LicenseKey,
  targetTier: number,
): boolean {
  return (
    getRemainingRP(character) >= getUpgradeCost(character, license, targetTier)
  );
}

export function setLicenseTier(
  character: CharacterData,
  license: LicenseKey,
  targetTier: number,
): CharacterData {
  if (targetTier < 0 || targetTier > 7) {
    return character;
  }

  const currentTier = character.licenses[license] ?? 0;

  if (
    targetTier > currentTier &&
    !canAffordUpgrade(character, license, targetTier)
  ) {
    return character;
  }

  const updated: CharacterData = {
    ...character,
    licenses: {
      ...character.licenses,
      [license]: targetTier,
    },
  };

  return planeEngine.sanitizeAircraft(updated);
}

function collectUnlocks(character: CharacterData): UnlockBucket {
  const result: UnlockBucket = {
    ordnance: [],
    airframes: [],
    modules: [],
    upgrades: [],
  };

  for (const license of licenses) {
    const tier =
      character.licenses[license.id as keyof typeof character.licenses] ?? 0;

    for (let rank = 0; rank <= tier; rank++) {
      const unlocks =
        license.unlocks[`rank${rank}` as keyof typeof license.unlocks];

      if (!unlocks) continue;

      result.ordnance.push(...unlocks.ordnance);
      result.airframes.push(...unlocks.airframes);
      result.modules.push(...unlocks.modules);
      result.upgrades.push(...unlocks.upgrades);
    }
  }

  return result;
}

export function getUnlockedAircraft(character: CharacterData): string[] {
  return [...new Set(collectUnlocks(character).airframes)];
}

export function getUnlockedOrdnance(character: CharacterData): string[] {
  return [...new Set(collectUnlocks(character).ordnance)];
}

export function getUnlockedModules(character: CharacterData): string[] {
  return [...new Set(collectUnlocks(character).modules)];
}

export function getUnlockedUpgradePacks(character: CharacterData): string[] {
  return [...new Set(collectUnlocks(character).upgrades)];
}
