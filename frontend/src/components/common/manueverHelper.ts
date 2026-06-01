import { getTagCountMap, getTagValue } from "./tagResolver";

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

export interface TurnRow {
  m?: Maneuver;
  e: number;
  c: number;
  after: number;
  capAfter: number;
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
      (m.isCommon || m.isAdvanced) &&
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

  const rows = maneuvers.map((m) => {
    let e = m?.energyMod ?? 0;
    let c = m?.capacityMod ?? 0;

    if (m?.type === "POSITIONING") {
      e = -e;
    }

    const capCost = getManeuverCapacityCost(m);

    energy += e;
    capacity += c - capCost;

    return {
      m,
      e,
      c: c - capCost,
      after: energy,
      capAfter: capacity,
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

  if (m.type === "POSITIONING") {
    e = -e;
  }

  c -= getManeuverCapacityCost(m);

  const desc = m.desc ? `: ${m.desc}` : "";

  return `[${slot}] - ${m.name}${desc} // ${
    e >= 0 ? "E+" : "E"
  }${e}=${energyAfter}, CAP${c > 0 ? "+" : ""}${c}=${capacityAfter}`;
};

/**
 * Calculate how many maneuver slots should be displayed.
 * Always shows at least 4 slots (for 4 non-exhaust maneuvers).
 * Adds additional slots for each exhaust maneuver selected.
 * Max 8 slots total.
 */
export const calculateSlotsNeeded = (maneuvers: (Maneuver | undefined)[]): number => {
  const selectedCount = maneuvers.filter(m => m).length;
  if (selectedCount === 0) return 4; // Show 4 empty slots initially

  const nonExhaustCount = maneuvers.filter(m => m && m.type !== "EXHAUST").length;
  const exhaustCount = maneuvers.filter(m => m?.type === "EXHAUST").length;

  // Always ensure at least 4 non-exhaust slots, plus any exhausts selected
  return Math.min(8, Math.max(4, nonExhaustCount) + exhaustCount);
};

/**
 * Get the display label for a maneuver slot (M1, M2, M3, M4, or XHST).
 * XHST is used for exhaust maneuvers.
 * Regular maneuvers are labeled M1-M4 in order (skipping exhaust slots).
 */
export const getManeuverSlotLabel = (
  slotIndex: number,
  maneuvers: (Maneuver | undefined)[],
): string => {
  const m = maneuvers[slotIndex];
  if (m?.type === "EXHAUST") {
    return "XHST";
  }

  // Count non-exhaust maneuvers up to this point
  const nonExhaustBefore = maneuvers
    .slice(0, slotIndex)
    .filter(ma => !ma || ma.type !== "EXHAUST").length;

  return `M${nonExhaustBefore + 1}`;
};

/**
 * Organize maneuvers into labeled slots for display.
 * Returns the total slots needed and an array of labeled slots with their maneuvers.
 */
export const organizeManeuversForDisplay = (
  maneuvers: (Maneuver | undefined)[],
): OrganizedManeuvers => {
  const totalSlots = calculateSlotsNeeded(maneuvers);

  const slots: ManeuverSlot[] = Array.from({ length: totalSlots }).map((_, idx) => {
    const label = getManeuverSlotLabel(idx, maneuvers);
    const maneuver = maneuvers[idx];

    return { label, maneuver };
  });

  return { totalSlots, slots };
};
