import type { CharacterData } from "./characterTypes";
import type {
  //AircraftSelectOption,
  AircraftCardProps,
} from "../components/charManagerCommon/planeComponents/MiniAircraftCard";
import type { OrdnanceSelectOption } from "../components/charManagerCommon/planeComponents/MiniOrdnanceCard";
import aircraft from "../../../data/AircraftList.json";
import licenses from "../../../data/Licenses.json";
import ordnance from "../../../data/OrdnanceList.json";
import modules from "../../../data/ModList.json";

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

type AppliedModEffects = {
  acTags: string[];
  ordTags: string[];
  statDeltas: Record<string, number>;
};

export type LicenseRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RankKey = `rank${LicenseRank}`;

function getAircraftData(character: CharacterData) {
  const plane = aircraft.find((p) => p.id === character.aircraft.aircraftId);
  if (!plane) return plane;

  const { acTags, statDeltas } = applyModules(character);

  const baseTags: string[] =
    typeof plane.tags === "string"
      ? plane.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [...(plane.tags as string[])];

  const mergedTags = [...new Set([...baseTags, ...acTags])];

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

  const mergedStats = { ...plane.stats };
  for (const [stat, delta] of Object.entries(statDeltas)) {
    const normalizedKey = statKeyMap[stat];
    if (normalizedKey && normalizedKey in mergedStats) {
      mergedStats[normalizedKey] = String(
        Number(mergedStats[normalizedKey]) + delta,
      );
    }
  }

  return { ...plane, tags: mergedTags, stats: mergedStats };
}

export function getAircraftList() {
  return aircraft.filter(
    (p) =>
      p.id !== "acExample" &&
      p.gen !== "n/a" &&
      p.tier !== "n/a" &&
      p.tier !== "n/a",
  );
}

export function getUnlockedAircraft(character: CharacterData) {
  const { airframes } = getAllUnlocks(character);
  return aircraft.filter(
    (p) =>
      airframes.includes(p.id) &&
      p.id !== "acExample" &&
      p.gen !== "n/a" &&
      p.tier !== "n/a",
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

export function getPlaneOrdnance(character: CharacterData): OrdnanceDeets {
  const ord = ordnance.find((o) => o.id === character.aircraft.ordnanceId);
  const { ordTags } = applyModules(character);

  return {
    id: ord?.id ?? "ordERROR",
    name: ord?.name ?? "None",
    domain: ord?.domain ?? "None",
    desc: ord?.desc ?? "None",
    tags: [...new Set([...(ord?.tags ?? ["error"]), ...ordTags])],
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

  return {
    A2A: plane?.stats.A2A ?? 0,
    A2G: plane?.stats.A2G ?? 0,
    MANU: plane?.stats.MANU ?? 0,
    SPEED: plane?.stats.SPEED ?? 0,
    SURV: plane?.stats.SURV ?? 0,
    CAP: plane?.stats.CAP ?? 0,
  };
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

  // Trim modules from the end if the new plane has fewer slots
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
      currentEnergy: Number(plane.stats.SPEED) + 1,
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

  // No duplicates
  if (current.includes(modId)) return character;
  // No overflow
  if (current.length >= slotCount) return character;

  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      modules: [...current, modId],
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
  };

  const equippedIds: string[] = character.aircraft.modules ?? [];

  for (const modId of equippedIds) {
    const mod = modules.find((m) => m.id === modId);
    if (!mod) continue;

    // Split AddTags by prefix
    for (const tag of mod.AddTags ?? []) {
      if (tag.startsWith("ord")) {
        effects.ordTags.push(tag);
      } else if (tag.startsWith("ac")) {
        effects.acTags.push(tag);
      }
      // unknown prefix: ignore for now
    }

    // Accumulate stat deltas
    for (const [stat, delta] of Object.entries(mod.mods ?? {})) {
      effects.statDeltas[stat] = (effects.statDeltas[stat] ?? 0) + delta;
    }
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
    // start at 0
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

    let baseOrd = getAircraftData(character)?.baseOrdID || "";
    result.ordnance.push(...unlocks.ordnance, baseOrd, "ordNone");
    result.airframes.push(...unlocks.airframes);
    result.modules.push(...unlocks.modules);
    result.upgrades.push(...unlocks.upgrades);
  }

  // Deduplicate across licenses
  return {
    ordnance: [...new Set(result.ordnance)],
    airframes: [...new Set(result.airframes)],
    modules: [...new Set(result.modules)],
    upgrades: [...new Set(result.upgrades)],
  };
}
