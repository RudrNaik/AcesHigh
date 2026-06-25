import type { CharacterData, Aircraft } from "../characterTypes";
import type { AircraftCardProps } from "../../components/CharManagerComponents/planeComponents/MiniAircraftCard";
import type { OrdnanceSelectOption } from "../../components/CharManagerComponents/planeComponents/MiniOrdnanceCard";
import * as tourEngine from "./tourEngine";
import * as licenseEngine from "./licenseEngine";
import aircraft from "../../../../data/AircraftList.json";
import licenses from "../../../../data/Licenses.json";
import ordnance from "../../../../data/OrdnanceList.json";
import modules from "../../../../data/ModList.json";
import masteries from "../../../../data/AircraftFamilies.json";
import techniques from "../../../../data/TechniqueList.json";
import upgrades from "../../../../data/UpgradePackageList.json";

export type AirplaneStats = {
  A2A: string | number;
  A2G: string | number;
  MANU: string | number;
  SPEED: string | number;
  SURV: string | number;
  CAP: string | number;
};

export type OrdnanceDeets = {
  id: string;
  name: string;
  domain: string;
  desc: string;
  tags: string[];
};

export type ModuleDeets = {
  id: string;
  name: string;
  desc: string;

  IntrinsicMod: string | null;
  TypeMod: string | null;
  AddManuID: string | null;

  moduleTags: string[] | null;
  AddTags: string[] | null;

  mods: Record<string, number> | null;

  checkForChars: string | null;
  charChecked: string | null;
};

export type MasteryDeets = {
  tech1: string;
  tech2: string;
  tech3: string;
};

export type TechniqueDeets = {};

type AppliedModEffects = {
  acTags: string[];
  ordTags: string[];
  statDeltas: Record<string, number>;
  newIntrinsic: string;
  typeMod: string;
};

type Airplane = {
  id: string;
  name: string;
  family: string;
  intrinsic: string;
  type: string;
  gen: number;
  tier: number;
  stats: {
    A2A: number;
    A2G: number;
    MANU: number;
    SPEED: number;
    SURV: number;
    CAP: number;
  };
  moduleSlots: number;
  mSMod: number;
  baseOrdID: string;
  desc: string;
  tags: string[];
  startingChars: string;
  endingChars: string;
};

export type LicenseRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RankKey = `rank${LicenseRank}`;

function getAircraftData(character: CharacterData) {
  const plane = aircraft.find(
    (p) => p.id === character.aircraft.aircraftId,
  ) as Airplane;
  if (!plane) return plane;

  const planeOver: AirplaneStats = {
    A2A: character.aircraft.a2aOverride || 0,
    A2G: character.aircraft.a2gOverride || 0,
    MANU: character.aircraft.manuOverride || 0,
    SPEED: character.aircraft.speedOverride || 0,
    CAP: character.aircraft.capOverride || 0,
    SURV: character.aircraft.survOverride || 0,
  };

  const { acTags, statDeltas } = applyModules(character);
  const upgradeEffects = applyUpgradePackage(character, plane);

  const baseTags: string[] = Array.isArray(plane.tags)
    ? [...plane.tags]
    : (plane.tags as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  const mergedTags = [...baseTags, ...acTags, ...(upgradeEffects.acTags ?? [])];

  const mergedStatDeltas = { ...statDeltas };
  for (const [stat, delta] of Object.entries(upgradeEffects.statDeltas ?? {})) {
    mergedStatDeltas[stat] = (mergedStatDeltas[stat] ?? 0) + delta;
  }

  const statKeyMap: Record<string, keyof AirplaneStats> = {
    Manu: "MANU",
    manu: "MANU",
    MANU: "MANU",
    Cap: "CAP",
    cap: "CAP",
    CAP: "CAP",
    A2a: "A2A",
    a2a: "A2A",
    A2A: "A2A",
    A2g: "A2G",
    a2g: "A2G",
    A2G: "A2G",
    Speed: "SPEED",
    speed: "SPEED",
    SPEED: "SPEED",
    Surv: "SURV",
    surv: "SURV",
    SURV: "SURV",
  };

  const mergedStats: Record<string, number> = { ...plane.stats };
  for (const [stat, delta] of Object.entries(mergedStatDeltas)) {
    const normalizedKey = statKeyMap[stat];
    if (normalizedKey && normalizedKey in mergedStats) {
      mergedStats[normalizedKey] = Number(mergedStats[normalizedKey]) + delta;
    }
  }

  const newIntrinsic = upgradeEffects.newIntrinsic || plane.intrinsic;
  const newType =
    upgradeEffects.typeMod === "" ? plane.type : upgradeEffects.typeMod;

  return {
    ...plane,
    type: newType,
    tags: mergedTags,
    stats: mergedStats as AirplaneStats,
    intrinsic: newIntrinsic,
    overrides: planeOver as AirplaneStats,
  };
}

export function getAircraftList() {
  return aircraft.filter(
    (p) =>
      p.id !== "acExample" &&
      !(
        p.stats.A2A === 0 &&
        p.stats.A2G === 0 &&
        p.stats.CAP === 0 &&
        p.stats.MANU === 0 &&
        p.stats.SPEED === 0 &&
        p.stats.SURV === 0
      ),
  );
}

export function getUnlockedAircraft(character: CharacterData) {
  const { airframes } = getAllUnlocks(character);
  return aircraft.filter(
    (p) => airframes.includes(p.id) && p.id !== "acExample",
  );
}

export function getOrdnanceList(): OrdnanceSelectOption[] {
  return ordnance.map((o) => ({
    id: o.id,
    name: o.name,
    domain: o.domain,
  }));
}

export function getUnlockedOrdnance(
  character: CharacterData,
): OrdnanceSelectOption[] {
  const { ordnance: ordnanceIds } = getAllUnlocks(character);
  return ordnance
    .filter((o) => ordnanceIds.includes(o.id))
    .map((o) => ({
      id: o.id,
      name: o.name,
      domain: o.domain,
    }));
}

export function getModList() {
  return modules.map((m) => ({
    id: m.id,
    name: m.name,
    desc: m.desc,
    IntrinsicMod: m.IntrinsicMod,
    TypeMod: m.TypeMod,
    AddManuID: m.AddManuID,
    moduleTags: m.moduleTags,
    mods: m.mods as Record<string, number> | null,
    AddTags: m.AddTags,
    checkForChars: m.checkForChars,
    charChecked: m.charChecked,
  }));
}

export function getUnlockedModules(character: CharacterData) {
  const { modules: moduleIds } = getAllUnlocks(character);
  return modules
    .filter((m) => moduleIds.includes(m.id))
    .map((m) => ({
      id: m.id,
      name: m.name,
      desc: m.desc,
      IntrinsicMod: m.IntrinsicMod,
      TypeMod: m.TypeMod,
      AddManuID: m.AddManuID,
      moduleTags: m.moduleTags,
      mods: m.mods as Record<string, number> | null,
      AddTags: m.AddTags,
      checkForChars: m.checkForChars,
      charChecked: m.charChecked,
    }));
}

export function getUnlockedUpgrades(character: CharacterData) {
  const { upgrades: upgradeIDs } = getAllUnlocks(character);
  return upgrades
    .filter((m) => upgradeIDs.includes(m.id))
    .map((m) => ({
      id: m.id,
      name: m.name || "",
      desc: m.desc || "",
      IntrinsicMod: m.IntrinsicMod || "",
      TypeMod: m.TypeMod || "",
      AddManuID: m.AddManuID || "",
      moduleTags: m.moduleTags || "",
      mods: m.mods || "",
      AddTags: m.AddTags || "",
      checkForChars: m.checkForChars || "",
      charChecked: m.charChecked || "",
    }));
}

export function getPlaneOrdnance(character: CharacterData): OrdnanceDeets {
  const ord = ordnance.find((o) => o.id === character.aircraft.ordnanceId);
  const { ordTags } = applyModules(character);

  const plane = aircraft.find((p) => p.id === character.aircraft.aircraftId) as
    | Airplane
    | undefined;
  const upgradeEffects = plane ? applyUpgradePackage(character, plane) : {};

  return {
    id: ord?.id ?? "ordERROR",
    name: ord?.name ?? "None",
    domain: ord?.domain ?? "None",
    desc: ord?.desc ?? "None",
    tags: [
      ...new Set([
        ...(ord?.tags ?? ["error"]),
        ...ordTags,
        ...(upgradeEffects.ordTags ?? []),
      ]),
    ],
  };
}

export function getPlaneId(character: CharacterData) {
  return character.aircraft.aircraftId;
}

export function getPlaneMods(character: CharacterData) {
  return character.aircraft.modules;
}

export function getModuleSlotCount(character: CharacterData): number {
  const plane = aircraft.find((p) => p.id === character.aircraft.aircraftId);
  if (!plane) return 0;
  return Number(plane.moduleSlots) || 0;
}

export function getUpPackage(character: CharacterData) {
  return character.aircraft.upgradePackage || "n/a";
}

export function getPlaneStats(character: CharacterData): AirplaneStats {
  const plane = getAircraftData(character);

  const output: AirplaneStats = {
    A2A: Number(plane?.stats.A2A ?? 0) + Number(plane?.overrides?.A2A || 0),
    A2G: Number(plane?.stats.A2G ?? 0) + Number(plane?.overrides?.A2G || 0),
    MANU: Number(plane?.stats.MANU ?? 0) + Number(plane?.overrides?.MANU || 0),
    SPEED:
      Number(plane?.stats.SPEED ?? 0) + Number(plane?.overrides?.SPEED || 0),
    SURV: Number(plane?.stats.SURV ?? 0) + Number(plane?.overrides?.SURV || 0),
    CAP: Number(plane?.stats.CAP ?? 0) + Number(plane?.overrides?.CAP || 0),
  };

  return output;
}

export function getAircraftState(character: CharacterData) {
  const stats = getPlaneStats(character);

  return {
    capacity: character.aircraft.currentCapacity ?? Number(stats.CAP),

    survivability:
      character.aircraft.currentSurvivability ?? Number(stats.SURV),

    energy: character.aircraft.currentEnergy ?? Number(stats.SPEED) + 5,
  };
}

export function getAircraftCardStats(character: CharacterData) {
  const base = getPlaneStats(character);
  const current = getAircraftState(character);

  return {
    A2A: base.A2A,
    A2G: base.A2G,
    MANU: base.MANU,
    SPEED: base.SPEED,

    SURV: `${current.survivability}/${base.SURV}`,
    CAP: `${current.capacity}/${base.CAP}`,
    ENRG: `${current.energy}/${Number(base.SPEED) + 1}`,
  };
}

export function getAircraftMasteries(character: CharacterData): MasteryDeets {
  const family =
    aircraft.find((p) => p.id === character.aircraft.aircraftId)?.family ||
    "none";

  const masteredFamilies = new Set(
    tourEngine.getDeploymentMasteries(character),
  );

  if (!masteredFamilies.has(family)) {
    return {
      tech1: "none",
      tech2: "none",
      tech3: "none",
    };
  }

  const techs = masteries.find((fam) => fam.id === family);

  return {
    tech1: techs?.tech1 || "none",
    tech2: techs?.tech2 || "none",
    tech3: techs?.tech3 || "none",
  };
}

export function getTechnique(id: string) {
  if (id === "none") {
    return;
  }
  let technique = techniques.find((tech) => tech.id === id);
  return technique;
}

export function getAirplaneStatsForCard(
  character: CharacterData,
): AircraftCardProps {
  const plane = getAircraftData(character);

  return {
    id: plane?.id ?? "",
    name: plane?.name ?? "",
    type: plane?.type ?? "",
    family: plane?.family ?? "",
    gen: plane?.gen ?? "",
    tier: plane?.tier ?? "",
    stats: getAircraftCardStats(character),
    tags: plane?.tags ?? "",
    moduleSlots: plane?.moduleSlots ?? "",
    desc: plane?.desc ?? "",
    intrinsic: plane?.intrinsic ?? "",
  };
}

export function initializeAircraftState(
  character: CharacterData,
): CharacterData {
  const stats = getPlaneStats(character);

  return {
    ...character,
    aircraft: {
      ...character.aircraft,

      currentCapacity: character.aircraft.currentCapacity ?? Number(stats.CAP),

      currentSurvivability:
        character.aircraft.currentSurvivability ?? Number(stats.SURV),

      currentEnergy:
        character.aircraft.currentEnergy ?? Number(stats.SPEED) + 1,
    },
  };
}

export function spendCapacity(
  character: CharacterData,
  amount = 1,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentCapacity: Math.max(0, character.aircraft.currentCapacity - amount),
    },
  };
}

export function recoverCapacity(
  character: CharacterData,
  amount = 1,
): CharacterData {
  const max = Number(getPlaneStats(character).CAP);

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentCapacity: Math.min(
        max,
        character.aircraft.currentCapacity + amount,
      ),
    },
  };
}

export function spendSurvivability(
  character: CharacterData,
  amount = 1,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentSurvivability: Math.max(
        0,
        character.aircraft.currentSurvivability - amount,
      ),
    },
  };
}

export function recoverSurvivability(
  character: CharacterData,
  amount = 1,
): CharacterData {
  const max = Number(getPlaneStats(character).SURV);

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentSurvivability: Math.min(
        max,
        character.aircraft.currentSurvivability + amount,
      ),
    },
  };
}

export function spendEnergy(
  character: CharacterData,
  amount = 1,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentEnergy: Math.max(0, character.aircraft.currentEnergy - amount),
    },
  };
}

export function recoverEnergy(
  character: CharacterData,
  amount = 1,
): CharacterData {
  const max = 22;

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentEnergy: Math.min(max, character.aircraft.currentEnergy + amount),
    },
  };
}

export function setAircraft(
  character: CharacterData,
  id: string,
): CharacterData {
  if (!id) id = "acF4E";

  const plane = aircraft.find((p) => p.id === id);
  if (!plane) return character;

  const newTier = Number(plane.tier) || 0;
  const newBase = Number(plane.moduleSlots) || 0;
  const newSlotCount = Math.max(0, newBase - newTier);

  const trimmedModules = (character.aircraft.modules ?? []).slice(
    0,
    newSlotCount,
  );

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      aircraftId: id,
      modules: trimmedModules,
      currentCapacity: Number(plane.stats.CAP),
      currentSurvivability: Number(plane.stats.SURV),
      currentEnergy: Number(plane.stats.SPEED) + 5,
    },
  };
}

export function setOrdnance(
  character: CharacterData,
  id: string,
): CharacterData {
  if (!id) {
    id = "ordNone";
  }

  const ord = ordnance.find((ord) => ord.id === id);

  if (!ord) {
    return character;
  }

  return {
    ...character,
    aircraft: {
      ...character.aircraft,

      ordnanceId: id,
    },
  };
}

export function setModule(
  character: CharacterData,
  modId: string,
): CharacterData {
  const current = character.aircraft.modules ?? [];
  const slotCount = getModuleSlotCount(character);

  if (current.includes(modId)) return character;
  if (current.length >= slotCount) return character;

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      modules: [...current, modId],
    },
  };
}

export function setUpgrade(
  character: CharacterData,
  upID: string,
): CharacterData {
  const newUp = getUnlockedUpgrades(character).find((u) => u.id == upID);

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      upgradePackage: newUp?.id || "",
    },
  };
}

export function setAircraftStatOverride(
  character: CharacterData,
  stat: keyof Aircraft,
  amount: number,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      [stat]: amount,
    },
  };
}

export function removeModule(
  character: CharacterData,
  modId: string,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      modules: (character.aircraft.modules ?? []).filter((id) => id !== modId),
    },
  };
}

export function applyModules(character: CharacterData): AppliedModEffects {
  const effects: AppliedModEffects = {
    acTags: [],
    ordTags: [],
    statDeltas: {},
    newIntrinsic: "",
    typeMod: "",
  };

  const equippedIds: string[] = character.aircraft.modules ?? [];

  for (const modId of equippedIds) {
    const mod = modules.find((m) => m.id === modId);
    if (!mod) continue;

    for (const tag of mod.AddTags ?? []) {
      if (tag.startsWith("ord")) {
        effects.ordTags.push(tag);
      } else if (tag.startsWith("ac")) {
        effects.acTags.push(tag);
      }
    }

    for (const [stat, delta] of Object.entries(mod.mods ?? {})) {
      effects.statDeltas[stat] = (effects.statDeltas[stat] ?? 0) + delta;
    }
  }

  return effects;
}

export function applyUpgradePackage(
  character: CharacterData,
  plane: Airplane,
): Partial<AppliedModEffects> {
  const effects: Partial<AppliedModEffects> = {
    acTags: [],
    ordTags: [],
    statDeltas: {},
    newIntrinsic: "",
    typeMod: "",
  };

  const packageId = getUpPackage(character);
  if (!packageId || packageId === "n/a") return effects;

  const upgrade = upgrades.find((u) => u.id === packageId);
  if (!upgrade) return effects;

  if (upgrade.TypeMod) {
    effects.typeMod = upgrade.TypeMod;
  }

  if (upgrade.checkForChars) {
    const charToCheck = upgrade.charChecked;
    const passes =
      upgrade.checkForChars === "End"
        ? plane.endingChars === charToCheck
        : upgrade.checkForChars === "Start"
          ? plane.startingChars === charToCheck
          : true;

    if (!passes) {
      return effects;
    }
  }

  if (upgrade.mods && typeof upgrade.mods === "object") {
    for (const [stat, delta] of Object.entries(upgrade.mods)) {
      effects.statDeltas![stat] =
        (effects.statDeltas![stat] ?? 0) + Number(delta);
    }
  }

  if (upgrade.AddTags) {
    const tags: string[] = Array.isArray(upgrade.AddTags)
      ? upgrade.AddTags
      : [upgrade.AddTags];

    for (const tag of tags) {
      if (tag.startsWith("ord")) effects.ordTags!.push(tag);
      else if (tag.startsWith("ac")) effects.acTags!.push(tag);
    }
  }

  if (upgrade.IntrinsicMod) {
    effects.newIntrinsic = upgrade.IntrinsicMod;
  }

  return effects;
}

export function getLicenseProgressionUnlocks(licenseId: string, rank: number) {
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

  for (let r = 0; r <= rank; r++) {
    applyTier(`rank${r}` as RankKey);
  }

  return result;
}

export function getAllUnlocks(character: CharacterData) {
  const result = {
    ordnance: [] as string[],
    airframes: [] as string[],
    modules: [] as string[],
    upgrades: [] as string[],
  };

  for (const [licenseId, rank] of Object.entries(character.licenses ?? {})) {
    const unlocks = getLicenseProgressionUnlocks(licenseId, rank);
    if (!unlocks) continue;
    const loot = licenseEngine.collectLootUnlocks(character);
    if (!loot) continue;

    let baseOrd = getAircraftData(character)?.baseOrdID || "";
    result.ordnance.push(
      ...unlocks.ordnance,
      ...loot.ordnancee,
      baseOrd,
      "ordNone",
    );
    result.airframes.push(...unlocks.airframes, ...loot.airframes);
    result.modules.push(...unlocks.modules, ...loot.modules);
    result.upgrades.push(...unlocks.upgrades, ...loot.upgrades);
  }

  return {
    ordnance: [...new Set(result.ordnance)],
    airframes: [...new Set(result.airframes)],
    modules: [...new Set(result.modules)],
    upgrades: [...new Set(result.upgrades)],
  };
}

export function sanitizeAircraft(character: CharacterData): CharacterData {
  const { ordnance, airframes, modules, upgrades } = getAllUnlocks(character);

  const currentAircraftId = character.aircraft.aircraftId;
  const validAircraftId = airframes.includes(currentAircraftId)
    ? currentAircraftId
    : "acF4E";

  const needsAircraftReset = validAircraftId !== currentAircraftId;

  const validModules = (character.aircraft.modules ?? []).filter((id) =>
    modules.includes(id),
  );

  const currentOrdnanceId = character.aircraft.ordnanceId;
  const validOrdnanceId = ordnance.includes(currentOrdnanceId)
    ? currentOrdnanceId
    : "ordNone";

  const currentUpgrade = character.aircraft.upgradePackage;
  const validUpgrade =
    !currentUpgrade ||
    currentUpgrade === "n/a" ||
    upgrades.includes(currentUpgrade)
      ? currentUpgrade
      : "";

  const sanitized: CharacterData = {
    ...character,
    aircraft: {
      ...character.aircraft,
      aircraftId: validAircraftId,
      ordnanceId: validOrdnanceId,
      modules: validModules,
      upgradePackage: validUpgrade,
    },
  };

  if (needsAircraftReset) {
    return setAircraft(sanitized, validAircraftId);
  }

  return sanitized;
}

export function addPlaneMastery(
  character: CharacterData,
  id: string,
): CharacterData {
  if (character.masteredAircraft.includes(id)) {
    return character;
  }

  return {
    ...character,
    masteredAircraft: [...character.masteredAircraft, id],
  };
}

export function removePlaneMastery(
  character: CharacterData,
  id: string,
): CharacterData {
  if (!character.masteredAircraft.includes(id)) {
    return character;
  }

  return {
    ...character,
    masteredAircraft: character.masteredAircraft.filter((x) => x !== id),
  };
}
