import type { CharacterData } from "../characterTypes";
import manuList from "../../../../data/ManueverList.json";
import techList from "../../../../data/TechniqueList.json";

import * as planeEngine from "./planeEngine";

import { getTagCountMap, getTagValue } from "../../../common/tagResolver";

export interface Maneuver {
  id: string;
  name: string;
  type: string;
  isCommon: boolean;
  isAdvanced: boolean;
  energyMod: number;
  capacityMod: number;
  tags: string[];
  desc: string;
}

export interface ManeuverEffect {
  discountCost: number;
  forwardBonus: number;
}

export interface TurnRow {
  m?: Maneuver;
  e: number;
  c: number;
  after: number;
  capAfter: number;
  appliedEffects?: ManeuverEffect;
}

export interface TurnResult {
  rows: TurnRow[];
  finalEnergy: number;
  finalCapacity: number;
}

export interface ManeuverSlot {
  label: string;
  maneuver?: Maneuver;
}

export interface OrganizedManeuvers {
  totalSlots: number;
  slots: ManeuverSlot[];
}

export function getMasteryManus(character: CharacterData): string[] {
  let techs: planeEngine.MasteryDeets =
    planeEngine.getAircraftMasteries(character);

  const manu1 =
    techList.find((t) => t.id === techs.tech1 && t.maneuverId !== "n/a")
      ?.maneuverId ?? "";
  const manu2 =
    techList.find((t) => t.id === techs.tech2 && t.maneuverId !== "n/a")
      ?.maneuverId ?? "";
  const manu3 =
    techList.find((t) => t.id === techs.tech3 && t.maneuverId !== "n/a")
      ?.maneuverId ?? "";

  return [manu1, manu2, manu3];
}

export function getTechManus(character: CharacterData): string[] {
  let manus: string[] = character.specialization.tactics;
  return manus;
}

export function getRoleManus(character: CharacterData): string[] {
  let roleTag: string;
  if (planeEngine.getAirplaneStatsForCard(character).type == "EWO") {
    roleTag = "manuRoleE";
  } else if (planeEngine.getAirplaneStatsForCard(character).type == "Strike") {
    roleTag = "manuRoleS";
  } else if (
    planeEngine.getAirplaneStatsForCard(character).type == "Multirole"
  ) {
    roleTag = "manuRoleM";
  } else {
    roleTag = "manuRoleI";
  }

  let roleManus = manuList
    .filter((m) => m.tags.includes(roleTag))
    .map((m) => m.id);

  return roleManus;
}

export function getModManus(character: CharacterData): string[] {
  const mods = planeEngine.getPlaneMods(character);
  const allMods = planeEngine.getModList();

  return allMods
    .filter((mod) => mods.includes(mod.id))
    .map((mod) => mod.AddManuID)
    .filter((manu): manu is string => manu !== null);
}

export function getAllCharManus(character: CharacterData): string[] {
  let commonManu = manuList.filter((m) => m.isCommon === true).map((m) => m.id);
  let modManu = getModManus(character);
  let roleManu = getRoleManus(character);
  let techManu = getTechManus(character);
  let masterManu = getMasteryManus(character);

  return [
    ...commonManu,
    ...modManu,
    ...roleManu,
    ...techManu,
    ...masterManu,
    ...modManu,
  ];
}

export function applyTurn(
  character: CharacterData,
  result: TurnResult,
): CharacterData {
  return {
    ...character,
    aircraft: {
      ...character.aircraft,
      currentEnergy: result.finalEnergy,
      currentCapacity: result.finalCapacity,
    },
  };
}

export const safeNumber = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const normalizeTags = (tags: unknown): string[] => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags.filter(Boolean).map(String);
  }

  if (typeof tags === "string") {
    if (tags.toLowerCase() === "n/a") return [];
    return [tags];
  }

  return [];
};

export const mapCategory = (m: any) => {
  const type = (m.type ?? "").toUpperCase();

  return {
    type:
      type === "POSITIONING"
        ? "POSITIONING"
        : type === "EXHAUST"
          ? "EXHAUST"
          : type === "REACTION"
            ? "REACTION"
            : "NORMAL",
    isCommon: !!m.isCommon,
    isAdvanced: !!m.isAdvanced,
  };
};

export const getManeuverById = (maneuvers: Maneuver[], id: string) =>
  maneuvers.find((m) => m.id === id);

export const getPositioningManeuvers = (maneuvers: Maneuver[]) =>
  maneuvers.filter(
    (m) =>
      m.type === "POSITIONING" &&
      m.id !== "manuExampleTech" &&
      m.id !== "exampleManu",
  );

export const getSelectableManeuvers = (maneuvers: Maneuver[]) =>
  maneuvers.filter(
    (m) =>
      m.type !== "POSITIONING" &&
      m.id !== "manuExampleTech" &&
      m.id !== "exampleManu",
  );

export const normalizeManeuvers = (data: any[]): Maneuver[] => {
  return data.map((m) => {
    const mapped = mapCategory(m);

    return {
      id: m.id,
      name: m.name,
      type: mapped.type,
      isCommon: mapped.isCommon,
      isAdvanced: mapped.isAdvanced,
      energyMod: safeNumber(m.engCost),
      capacityMod: 0,
      tags: normalizeTags(m.tags),
      desc: m.desc ?? "",
    };
  });
};

export const getManeuverCapacityCost = (m?: Maneuver) => {
  if (!m?.tags?.length) return 0;

  const tagCounts = getTagCountMap(m.tags);
  const count = tagCounts["manuCap"] ?? 0;

  if (count <= 0) return 0;

  return getTagValue("manuCap", count);
};

export const getManeuverEffects = (m?: Maneuver): ManeuverEffect => {
  const effects: ManeuverEffect = {
    discountCost: 0,
    forwardBonus: 0,
  };

  if (!m?.tags?.length) return effects;

  const tagCounts = getTagCountMap(m.tags);

  // Check for discount tags
  if (tagCounts["manuDiscount"]) {
    effects.discountCost = getTagValue(
      "manuDiscount",
      tagCounts["manuDiscount"],
    );
  }

  // Check for forward bonus tags
  if (tagCounts["manuAddForward"]) {
    effects.forwardBonus = getTagValue(
      "manuAddForward",
      tagCounts["manuAddForward"],
    );
  }

  return effects;
};

export const calculateTurn = ({
  maneuvers,
  energyStart,
  capacityStart,
}: {
  maneuvers: (Maneuver | undefined)[];
  energyStart: number;
  capacityStart: number;
}): TurnResult => {
  let energy = energyStart;
  let capacity = capacityStart;
  let activeEffects: ManeuverEffect = { discountCost: 0, forwardBonus: 0 };

  const rows = maneuvers.map((m) => {
    let e = m?.energyMod ?? 0;
    let c = m?.capacityMod ?? 0;

    // Apply active effects from previous maneuver
    e = -e;
    e += activeEffects.discountCost;

    const capCost = getManeuverCapacityCost(m);

    energy += e;
    capacity += c - capCost;

    // Get effects from current maneuver for next iteration
    activeEffects = getManeuverEffects(m);

    return {
      m,
      e,
      c: c - capCost,
      after: energy,
      capAfter: capacity,
      appliedEffects: activeEffects,
    };
  });

  return {
    rows,
    finalEnergy: energy,
    finalCapacity: capacity,
  };
};

export const formatManeuver = (
  slot: string,
  m?: Maneuver,
  energyAfter?: number,
  capacityAfter?: number,
) => {
  if (!m) return `[${slot}] - RSV`;

  let e = m.energyMod;
  let c = m.capacityMod;

  e = -e;

  c -= getManeuverCapacityCost(m);

  const desc = m.desc ? `: ${m.desc}` : "";

  return `[${slot}] - ${m.name}${desc} // ${
    e >= 0 ? "E+" : "E"
  }${e}=${energyAfter}, CAP${c > 0 ? "+" : ""}${c}=${capacityAfter}`;
};

export const calculateSlotsNeeded = (
  maneuvers: (Maneuver | undefined)[],
): number => {
  const selectedCount = maneuvers.filter((m) => m).length;
  if (selectedCount === 0) return 4;

  const nonExhaustCount = maneuvers.filter(
    (m) => m && m.type !== "EXHAUST",
  ).length;
  const exhaustCount = maneuvers.filter((m) => m?.type === "EXHAUST").length;

  return Math.max(4, nonExhaustCount) + exhaustCount;
};

export const getManeuverSlotLabel = (
  slotIndex: number,
  maneuvers: (Maneuver | undefined)[],
): string => {
  const m = maneuvers[slotIndex];
  if (m?.type === "EXHAUST") {
    return "XHST";
  }

  const nonExhaustBefore = maneuvers
    .slice(0, slotIndex)
    .filter((ma) => !ma || ma.type !== "EXHAUST").length;

  return `M${nonExhaustBefore + 1}`;
};

export const organizeManeuversForDisplay = (
  maneuvers: (Maneuver | undefined)[],
): OrganizedManeuvers => {
  const totalSlots = calculateSlotsNeeded(maneuvers);

  const slots: ManeuverSlot[] = Array.from({ length: totalSlots }).map(
    (_, idx) => {
      const label = getManeuverSlotLabel(idx, maneuvers);
      const maneuver = maneuvers[idx];

      return { label, maneuver };
    },
  );

  return { totalSlots, slots };
};
