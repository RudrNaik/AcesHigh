import type { CharacterData } from "../characterTypes";
import manuList from "../../../../data/ManueverList.json";
import techList from "../../../../data/TechniqueList.json";
import specs from "../../../../data/Specs.json";
import intrinsics from "../../../../data/AircraftList.json";
import perks from "../../../../data/PerkList.json";

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
  variableCost?: number;
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
  variableCost?: number; // player input
}

export interface OrganizedManeuvers {
  totalSlots: number;
  slots: ManeuverSlot[];
}

export interface DraftSlot {
  maneuverId: string;
  variableCost: number;
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

  const intrinsic =
    intrinsics.find((p) => p.id === character.aircraft.aircraftId)?.intrinsic ||
    "";

  let masteryManuList: string[] = [manu1, manu2, manu3, intrinsic];

  if (techs.tech1 !== "none") {
    let advanced: string[] = manuList
      .filter((m) => m.isAdvanced === true)
      .map((m) => m.id);
    masteryManuList = [...masteryManuList, ...advanced];
  }

  return masteryManuList;
}

export function getPerkManus(character: CharacterData): string[] {
  const perkIds = [
    ...(character.baseperks ?? []),
    ...(character.aceperks ?? []),
  ];

  return perks
    .filter((perk) => perkIds.includes(perk.id))
    .map((perk) => perk.addManuID)
    .filter(
      (manu): manu is string =>
        manu !== undefined && manu !== null && manu !== "" && manu !== "n/a",
    );
}

export function getTechManus(character: CharacterData): string[] {
  let manus: string[] = character.specialization.tactics;
  let spec: string = character.specialization.specId;
  let specManu: string = specs.find((s) => s.id === spec)?.addManu || "";
  return [...manus, specManu];
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
  let perkManu = getPerkManus(character);

  return [
    ...commonManu,
    ...modManu,
    ...roleManu,
    ...techManu,
    ...masterManu,
    ...perkManu,
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
      (m.type === "POSITIONING" || m.tags.includes("manuPOSTag")) &&
      m.id !== "manuExampleTech" &&
      m.id !== "exampleManu",
  );

export const getSelectableManeuvers = (maneuvers: Maneuver[]) =>
  maneuvers.filter(
    (m) =>
      m.type !== "POSITIONING" &&
      !m.tags.includes("manuPOSTag") &&
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

export const getVariableCostType = (m?: Maneuver): "cap" | "energy" | null => {
  if (!m?.tags?.length) return null;

  if (m.tags.includes("manuCapX")) return "cap";
  if (m.tags.includes("manuX")) return "energy";

  return null;
};

export const calculateTurn = ({
  slots,
  energyStart,
  capacityStart,
}: {
  slots: ManeuverSlot[];
  energyStart: number;
  capacityStart: number;
}): TurnResult => {
  let energy = energyStart;
  let capacity = capacityStart;
  let activeEffects: ManeuverEffect = { discountCost: 0, forwardBonus: 0 };

  const rows = slots.map((slot) => {
    const m = slot.maneuver;
    let e = m?.energyMod ?? 0;
    let c = m?.capacityMod ?? 0;

    const variableType = getVariableCostType(m);
    const variableCost = slot.variableCost ?? 0;

    // Apply active effects from previous maneuver
    e = -e;
    e += activeEffects.discountCost;

    if (variableType === "energy") {
      e += variableCost; // signed delta: positive = gain, negative = lose
    }

    if (variableType === "cap") {
      c += variableCost;
    }

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
      variableCost,
      appliedEffects: activeEffects,
    };
  });

  return {
    rows,
    finalEnergy: energy,
    finalCapacity: capacity,
  };
};

export const formatManeuver = (slot: string, row: TurnRow) => {
  const m = row.m;
  const variableType = getVariableCostType(m);
  const variableCost = row.variableCost ?? 0;

  if (!m) return `[${slot}] - RSV`;

  let e = m.energyMod;
  let c = m.capacityMod;

  e = -e;

  c -= getManeuverCapacityCost(m);

  if (variableType === "energy") {
    e += variableCost;
  }

  if (variableType === "cap") {
    c += variableCost;
  }

  const desc = m.desc ? `: ${m.desc}` : "";

  return `[${slot}] - ${m.name}${desc} // ${
    e >= 0 ? "E+" : "E"
  }${e}=${row.after}, CAP${c > 0 ? "+" : ""}${c}=${row.capAfter}`;
};

export const calculateSlotsNeeded = (slots: ManeuverSlot[]): number => {
  const selectedCount = slots.filter((s) => s.maneuver).length;

  if (selectedCount === 0) return 4;

  const nonExhaustCount = slots.filter(
    (s) =>
      s.maneuver &&
      s.maneuver.type !== "Exhaust" &&
      !s.maneuver.tags.includes("manuTrick"),
  ).length;

  const exhaustCount = slots.filter(
    (s) =>
      s.maneuver?.type === "Exhaust" || s.maneuver?.tags.includes("manuTrick"),
  ).length;

  return Math.max(4, nonExhaustCount) + exhaustCount;
};

export const getManeuverSlotLabel = (
  slotIndex: number,
  slots: ManeuverSlot[],
): string => {
  const maneuver = slots[slotIndex]?.maneuver;

  if (!maneuver) {
    return `M${slotIndex + 1}`;
  }

  if (maneuver.type === "Exhaust") {
    return "XHST";
  }

  if (maneuver.tags.includes("manuTrick")) {
    return "TRCK";
  }

  const nonExhaustBefore = slots
    .slice(0, slotIndex)
    .filter(
      (s) =>
        !s.maneuver ||
        (s.maneuver.type !== "EXHAUST" &&
          !s.maneuver.tags.includes("manuTrick")),
    ).length;

  return `M${nonExhaustBefore + 1}`;
};

export const organizeManeuversForDisplay = (
  slots: ManeuverSlot[],
): OrganizedManeuvers => {
  let maneuverNumber = 1;

  const organized: ManeuverSlot[] = slots.map((slot) => {
    const maneuver = slot.maneuver;

    if (!maneuver) {
      return {
        ...slot,
        label: `M${maneuverNumber++}`,
      };
    }

    if (maneuver.type === "EXHAUST") {
      return {
        ...slot,
        label: "XHST",
      };
    }

    if (maneuver.tags.includes("manuTrick")) {
      return {
        ...slot,
        label: "TRCK",
      };
    }

    return {
      ...slot,
      label: `M${maneuverNumber++}`,
    };
  });

  while (
    organized.filter(
      (s) =>
        s.label.startsWith("M") ||
        !s.maneuver ||
        (s.maneuver.type !== "EXHAUST" &&
          !s.maneuver.tags.includes("manuTrick")),
    ).length < 4
  ) {
    organized.push({
      label: `M${maneuverNumber++}`,
      maneuver: undefined,
      variableCost: 0,
    });
  }

  return {
    totalSlots: organized.length,
    slots: organized,
  };
};
