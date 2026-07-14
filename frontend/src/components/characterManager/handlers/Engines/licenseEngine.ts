import type { CharacterData, LootItem, LootCategory } from "../characterTypes";
//import aircraft from "../../../data/AircraftList.json"
//import staticMods from "../../../data/StaticMods.json";
//import perks from "../../../data/PerkList.json";
//import specializations from "../../../data/Specs.json";
//import downtime from "../../../data/Downtimes.json";
import licenses from "../../../../data/Licenses.json";
import * as planeEngine from "./planeEngine";
import * as tourEngine from "./tourEngine";
//import * as charEngine from "./characterEngine";
import * as resetEngine from "./downtimeEngine";

export type { LootItem, LootCategory };

export type LicenseFormat = {
  A1: number;
  A2: number;
  B1: number;
  B2: number;
  C1: number;
  C2: number;
  D1: number;
  D2: number;
  E1: number;
  E2: number;
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
    E1: character.licenses.E1 || 0,
    E2: character.licenses.E2 || 0
  };
}

export function getRP(character: CharacterData): number {
  let bonus = Number(character.bonusMoola) || 0;
  let starting = Number(character.metadata.startingRP) || 0;
  let deps = Number(tourEngine.getCharacterRequisitionPoints(character)) || 0;
  let resets = Number(resetEngine.getTotalBonusRP(character)) || 0;

  //console.log(`Bonus ${bonus}, Starting ${starting}, Deps ${deps}, Resets ${resets}`,);

  return bonus + starting + deps + resets;
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
  const fromLicenses = collectUnlocks(character).airframes;
  const fromLoot = collectLootUnlocks(character).airframes;
  return [...new Set([...fromLicenses, ...fromLoot])];
}

export function getUnlockedOrdnance(character: CharacterData): string[] {
  const fromLicenses = collectUnlocks(character).ordnance;
  const fromLoot = collectLootUnlocks(character).ordnancee;
  return [...new Set([...fromLicenses, ...fromLoot])];
}

export function getUnlockedModules(character: CharacterData): string[] {
  const fromLicenses = collectUnlocks(character).modules;
  const fromLoot = collectLootUnlocks(character).modules;
  return [...new Set([...fromLicenses, ...fromLoot])];
}

export function getUnlockedUpgradePacks(character: CharacterData): string[] {
  const fromLicenses = collectUnlocks(character).upgrades;
  const fromLoot = collectLootUnlocks(character).upgrades;
  return [...new Set([...fromLicenses, ...fromLoot])];
}

export function collectLootUnlocks(character: CharacterData) {
  const result = {
    perks: [] as string[],
    airframes: [] as string[],
    modules: [] as string[],
    upgrades: [] as string[],
    ordnancee: [] as string[],
  };

  for (const item of character.loot ?? []) {
    switch (item.category) {
      case "perk":
        result.perks.push(item.id);
        break;
      case "aircraft":
        result.airframes.push(item.id);
        break;
      case "module":
        result.modules.push(item.id);
        break;
      case "upgrade":
        result.upgrades.push(item.id);
        break;
      case "ordnance":
        result.ordnancee.push(item.id);
        break;
    }
  }

  return result;
}

export function addLoot(
  character: CharacterData,
  item: LootItem,
): CharacterData {
  const alreadyOwned = (character.loot ?? []).some(
    (l) => l.category === item.category && l.id === item.id,
  );
  if (alreadyOwned) return character;

  const updated: CharacterData = {
    ...character,
    loot: [...(character.loot ?? []), item],
  };
  return planeEngine.sanitizeAircraft(updated);
}

export function removeLoot(
  character: CharacterData,
  index: number,
): CharacterData {
  const loot = [...(character.loot ?? [])];
  loot.splice(index, 1);

  let updated: CharacterData = { ...character, loot };

  updated = planeEngine.sanitizeAircraft(updated);

  const stillUnlockedPerks = new Set(getUnlockedPerks(updated));
  updated = {
    ...updated,
    baseperks: (updated.baseperks ?? []).filter((perkId) =>
      stillUnlockedPerks.has(perkId),
    ),
  };

  return updated;
}

export function getUnlockedPerks(character: CharacterData): string[] {
  return [...new Set(collectLootUnlocks(character).perks)];
}
