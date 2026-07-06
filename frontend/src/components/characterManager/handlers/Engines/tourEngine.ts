import type {
  CharacterData,
  Tour,
  Deployment,
  CharacterStats,
} from "../characterTypes";

import * as licenseEngine from "./licenseEngine";

import Deployments from "../../../../data/Deployments.json";
import Tours from "../../../../data/Tours.json";
import Families from "../../../../data/AircraftFamilies.json";
import Perks from "../../../../data/PerkList.json";
import Specializations from "../../../../data/Specs.json";
import Downtimes from "../../../../data/Downtimes.json";

const DEPLOYMENT_REWARD_RULES: Record<
  string,
  { genesis: boolean; mastery: boolean }
> = {
  default: { genesis: false, mastery: false },

  baseDepGen: { genesis: true, mastery: false },
  baseDepMastery: { genesis: false, mastery: true },
};

const PHOENIX_TOUR_ID = "tourPhoenix";

export const PILOT_STAT_OPTIONS: { id: keyof CharacterStats; label: string }[] =
  [
    { id: "temper", label: "Temper" },
    { id: "nerve", label: "Nerve" },
    { id: "reflex", label: "Reflex" },
    { id: "gResist", label: "G-Resist" },
  ];

const ACE_CHOICE_DELIMITER = "::";

export type TourData = {
  tourID: string;
  tourName: string;
  tourDesc: string[];
  tourPerkIDs: string[];
};

export type DeploymentData = {
  id: string;
  name: string;
  description: string;
  advancement: string;
  reqMod: number | null;
  perkID: string | null;
  pilotMods: {
    temp: number;
    nerve: number;
    reflex: number;
    gResist: number;
  };

  genesisPerkID?: string;
  masteryFamily?: string;
};

export type AcePerkChoiceType = "pilotStat" | "specTactic" | "specDT" | "none";

export type ParsedAceSelection = {
  perkID: string;
  choice: string;
};

export type ModifierCounts = {
  fury: number;
  acuity: number;
  patience: number;
  endurance: number;
};

export function getDepById(id: string): DeploymentData {
  const deployment = Deployments.find((d) => d.id === id);

  return {
    id: deployment?.id ?? "missing",
    name: deployment?.name ?? "missing",
    description: deployment?.description ?? "missing",
    advancement: deployment?.advancement ?? "missing",
    reqMod: deployment?.reqMod ?? 0,
    perkID: deployment?.perkID ?? null,
    pilotMods: {
      temp: deployment?.pilotMods.temp ?? 0,
      nerve: deployment?.pilotMods.nerve ?? 0,
      reflex: deployment?.pilotMods.reflex ?? 0,
      gResist: deployment?.pilotMods.gResist ?? 0,
    },
  };
}

export function getTourById(id: string): TourData {
  const tour = Tours.find((t) => t.tourID === id);

  return {
    tourID: tour?.tourID ?? "missing",
    tourName: tour?.tourName ?? "missing",
    tourDesc: tour?.tourDesc ?? [],
    tourPerkIDs: tour?.tourPerkIDs ?? [],
  };
}

export function getAllTours(): TourData[] {
  return Tours.map((tour) => getTourById(tour.tourID));
}

export function getAllDeps(): DeploymentData[] {
  return Deployments.map((dep) => getDepById(dep.id));
}

export function getAllPerks() {
  return Perks;
}

export function getAllFamilies() {
  return Families;
}

export function getDeployments(tour: Tour): Deployment[] {
  return [tour.dep1, tour.dep2, tour.dep3, tour.dep4, tour.dep5];
}

export function getDeploymentProgress(dep: Deployment): number {
  return [
    dep.advancementComplete,
    dep.actTourComplete,
    dep.actYourselfComplete,
    dep.actSpecComplete,
    dep.defbriefComplete,
    dep.maxStressComplete,
    dep.survCritComplete,
  ].filter(Boolean).length;
}

export function getDeploymentAtIndex(
  tour: Tour,
  index: number,
): Deployment | null {
  switch (index) {
    case 0:
      return tour.dep1;
    case 1:
      return tour.dep2;
    case 2:
      return tour.dep3;
    case 3:
      return tour.dep4;
    case 4:
      return tour.dep5;
    default:
      return null;
  }
}

export function isDeploymentComplete(dep: Deployment): boolean {
  return getDeploymentProgress(dep) >= 5;
}

export function getCompletedDeployments(tour: Tour): Deployment[] {
  return getDeployments(tour).filter(isDeploymentComplete);
}

export function getCompletedDeploymentCount(tour: Tour): number {
  return getCompletedDeployments(tour).length;
}

export function getCompletedDeploymentData(tour: Tour): DeploymentData[] {
  return getCompletedDeployments(tour).map((dep) => getDepById(dep.type));
}

export function getDeploymentRewardRules(type: string) {
  return DEPLOYMENT_REWARD_RULES[type] ?? DEPLOYMENT_REWARD_RULES.default;
}

export function isTourComplete(tour: Tour): boolean {
  return getCompletedDeploymentCount(tour) >= 5;
}

export function getCurrentTour(character: CharacterData): Tour | null {
  if (character.tours.length === 0) {
    return null;
  }

  return character.tours[character.tours.length - 1];
}

export function getDeploymentPerks(tour: Tour): string[] {
  return getCompletedDeploymentData(tour)
    .map((dep) => dep.perkID)
    .filter(
      (perk): perk is string =>
        perk !== null && perk !== "" && perk !== "missing",
    );
}

export function getDeploymentReqBonus(tour: Tour): number {
  return getCompletedDeploymentData(tour).reduce(
    (total, dep) => total + (dep.reqMod ?? 0),
    0,
  );
}

export function getDeploymentPilotBonuses(tour: Tour) {
  return getCompletedDeploymentData(tour).reduce(
    (acc, dep) => {
      acc.temp += dep.pilotMods.temp;
      acc.nerve += dep.pilotMods.nerve;
      acc.reflex += dep.pilotMods.reflex;
      acc.gResist += dep.pilotMods.gResist;
      return acc;
    },
    {
      temp: 0,
      nerve: 0,
      reflex: 0,
      gResist: 0,
    },
  );
}

export function getTourCompletionPerks(tour: Tour): string[] {
  if (!isTourComplete(tour)) {
    return [];
  }

  return getTourById(tour.currTourID).tourPerkIDs;
}

export function getTourPerks(tour: Tour): string[] {
  return [...getDeploymentPerks(tour), ...getTourCompletionPerks(tour)];
}

export function getCharacterTourPerks(character: CharacterData): string[] {
  return character.tours.flatMap((tour) => getTourPerks(tour));
}

export function getCharacterTourReqBonus(character: CharacterData): number {
  return character.tours.reduce(
    (total, tour) => total + getDeploymentReqBonus(tour),
    0,
  );
}

export function getCharacterTourPilotBonuses(character: CharacterData) {
  return character.tours.reduce(
    (acc, tour) => {
      const bonus = getDeploymentPilotBonuses(tour);

      acc.temp += bonus.temp;
      acc.nerve += bonus.nerve;
      acc.reflex += bonus.reflex;
      acc.gResist += bonus.gResist;

      return acc;
    },
    {
      temp: 0,
      nerve: 0,
      reflex: 0,
      gResist: 0,
    },
  );
}

export function getDeploymentGenesisPerks(tour: Tour): string[] {
  return getCompletedDeployments(tour)
    .map((d) => d.genesis)
    .filter((v): v is string => !!v);
}

export function getAvailableGenesisOptions(
  character: CharacterData,
  tourIndex: number,
  deploymentIndex: number,
) {
  const tour = character.tours[tourIndex];

  const used = new Set(getUsedGenesis(tour));

  const current = getDeploymentAtIndex(tour, deploymentIndex)?.genesis ?? "";

  return getAllPerks()
    .filter((p) => p.type === "basePerk")
    .filter((perk) => {
      if (perk.id === current) return true;
      return !used.has(perk.id);
    });
}

export function getUsedGenesis(tour: Tour): string[] {
  return getDeployments(tour)
    .map((d) => d.genesis)
    .filter((v): v is string => !!v);
}

export function getAvailableMasteryOptions(
  character: CharacterData,
  tourIndex: number,
  deploymentIndex: number,
) {
  const tour = character.tours[tourIndex];

  const used = new Set(getUsedMastery(tour));

  const current = getDeploymentAtIndex(tour, deploymentIndex)?.mastery;

  return getAllFamilies().filter((fam) => {
    if (fam.id === current) return true;
    return !used.has(fam.id);
  });
}

export function getUsedMastery(tour: Tour): string[] {
  return getDeployments(tour)
    .map((d) => d.mastery)
    .filter((v): v is string => !!v);
}

export function setDeployment(
  character: CharacterData,
  tourIndex: number,
  deploymentIndex: number,
  deployment: Deployment,
): CharacterData {
  const updated = structuredClone(character);

  const tour = updated.tours[tourIndex];

  switch (deploymentIndex) {
    case 0:
      tour.dep1 = deployment;
      break;
    case 1:
      tour.dep2 = deployment;
      break;
    case 2:
      tour.dep3 = deployment;
      break;
    case 3:
      tour.dep4 = deployment;
      break;
    case 4:
      tour.dep5 = deployment;
      break;
  }

  return sanitizeTours(updated);
}

export function setDeploymentField<K extends keyof Deployment>(
  character: CharacterData,
  tourIndex: number,
  deploymentIndex: number,
  field: K,
  value: Deployment[K],
): CharacterData {
  const deployment = structuredClone(
    getDeploymentAtIndex(character.tours[tourIndex], deploymentIndex),
  );

  if (!deployment) {
    return character;
  }

  deployment[field] = value;

  return setDeployment(character, tourIndex, deploymentIndex, deployment);
}

export function createDeployment(): Deployment {
  return {
    type: "",
    modifier: "",
    genesis: "",
    mastery: "",

    advancementComplete: false,
    actTourComplete: false,
    actYourselfComplete: false,
    actSpecComplete: false,
    defbriefComplete: false,
    maxStressComplete: false,
    survCritComplete: false,
  };
}

export function createTour(tourID: string = ""): Tour {
  return {
    currTourID: tourID,
    acePerk: "",
    dep1: createDeployment(),
    dep2: createDeployment(),
    dep3: createDeployment(),
    dep4: createDeployment(),
    dep5: createDeployment(),
    pheonix: false,
  };
}

export function addTour(
  character: CharacterData,
  tourID: string,
): CharacterData {
  return {
    ...character,
    tours: [...character.tours, createTour(tourID)],
  };
}

export function removeTour(
  character: CharacterData,
  tourIndex: number,
): CharacterData {
  const updated = structuredClone(character);

  updated.tours.splice(tourIndex, 1);

  return sanitizeTours(updated);
}

export function setTourID(
  character: CharacterData,
  tourIndex: number,
  tourID: string,
): CharacterData {
  const updated = structuredClone(character);

  updated.tours[tourIndex] = tourID ? createTour(tourID) : createTour("");

  return updated;
}

export function hasActiveTour(character: CharacterData): boolean {
  const current = getCurrentTour(character);

  if (!current) {
    return false;
  }

  return !isTourComplete(current);
}

export function canStartNewTour(character: CharacterData): boolean {
  return !hasActiveTour(character);
}

export function getDeploymentMasteries(character: CharacterData): string[] {
  return character.tours.flatMap((tour) =>
    getDeployments(tour)
      .filter((dep) => getDeploymentProgress(dep) >= 5)
      .map((dep) => dep.mastery)
      .filter((m): m is string => !!m && m !== ""),
  );
}

export function getUnlockedGenesisPerks(character: CharacterData): string[] {
  let updated = character.tours.flatMap((tour) =>
    getDeployments(tour)
      .filter((dep) => getDeploymentProgress(dep) >= 5)
      .map((dep) => dep.genesis)
      .filter((g): g is string => !!g && g !== ""),
  );
  let loot = getUnlockedLootPerks(character);
  return [...updated, ...loot];
}

export function getUnlockedLootPerks(character: CharacterData): string[] {
  return licenseEngine.collectLootUnlocks(character).perks;
}

export function getTourRequisitionPoints(tour: Tour): number {
  return getCompletedDeploymentData(tour).reduce((total, dep) => {
    total += 20;

    if (dep.reqMod !== null) {
      total += dep.reqMod;
    }

    return total;
  }, 0);
}

export function getCharacterRequisitionPoints(
  character: CharacterData,
): number {
  return character.tours.reduce(
    (total, tour) => total + getTourRequisitionPoints(tour),
    0,
  );
}

export function sanitizeGenesis(character: CharacterData): CharacterData {
  const validBasePerkIDs = new Set(
    getAllPerks()
      .filter((p) => p.type === "basePerk")
      .map((p) => p.id),
  );

  const stackablePerks = new Set(
    getAllPerks()
      .filter((p) => p.type === "basePerk" && p.tags && p.tags.includes("perkStack"))
      .map((p) => p.id),
  );

  const cleaned = (character.baseperks ?? []).filter((id) => {
    if (!id) return false;
    return validBasePerkIDs.has(id);
  });

  // Remove duplicates only for non-stackable perks
  const deduplicated: string[] = [];
  const seen = new Set<string>();

  for (const id of cleaned) {
    const isStackable = stackablePerks.has(id);
    if (isStackable || !seen.has(id)) {
      deduplicated.push(id);
      seen.add(id);
    }
  }

  return {
    ...character,
    baseperks: deduplicated,
  };
}

export function sanitizeMastery(character: CharacterData): CharacterData {
  return {
    ...character,
    masteredAircraft: Array.from(new Set(getDeploymentMasteries(character))),
  };
}

export function sanitizeAcePerks(character: CharacterData): CharacterData {
  return {
    ...character,
    aceperks: Array.from(new Set(getCharacterTourPerks(character))),
  };
}

export function sanitizeTours(character: CharacterData): CharacterData {
  let updated = character;

  updated = sanitizeGenesis(updated);
  updated = sanitizeMastery(updated);
  updated = sanitizeAcePerks(updated);

  return updated;
}

export function parseAceSelection(raw: string): ParsedAceSelection {
  if (!raw) {
    return { perkID: "", choice: "" };
  }

  const [perkID, choice = ""] = raw.split(ACE_CHOICE_DELIMITER);

  return { perkID, choice };
}

export function formatAceSelection(
  perkID: string,
  choice: string = "",
): string {
  if (!perkID) return "";

  return choice ? `${perkID}${ACE_CHOICE_DELIMITER}${choice}` : perkID;
}

export function getNormalAcePerks() {
  return getAllPerks().filter((p) => p.type === "acePerk");
}

export function getUnlockedTourAcePerkIDs(character: CharacterData): string[] {
  return character.tours.flatMap(getTourCompletionPerks);
}

export function getUsedAcePerkBaseIDs(character: CharacterData): string[] {
  const chosen = character.tours
    .map((tour) => parseAceSelection(tour.acePerk).perkID)
    .filter((id): id is string => !!id);

  const autoGranted = character.tours.flatMap(getDeploymentPerks);

  return [...chosen, ...autoGranted];
}

export function canSelectAcePerk(tour: Tour): boolean {
  return isTourComplete(tour);
}

export function getTourAcePerkSelection(tour: Tour): ParsedAceSelection {
  return parseAceSelection(tour.acePerk);
}

export function getAvailableAcePerkOptions(
  character: CharacterData,
  tourIndex: number,
) {
  const tour = character.tours[tourIndex];

  if (!tour) return [];

  const used = new Set(getUsedAcePerkBaseIDs(character));
  const current = parseAceSelection(tour.acePerk).perkID;
  const unlockedTourPerkIDs = new Set(getUnlockedTourAcePerkIDs(character));

  const pool = [
    ...getNormalAcePerks(),
    ...getAllPerks().filter((p) => unlockedTourPerkIDs.has(p.id)),
  ];

  const deduped = Array.from(new Map(pool.map((p) => [p.id, p])).values());

  return deduped.filter((perk) => perk.id === current || !used.has(perk.id));
}

export function setTourAcePerk(
  character: CharacterData,
  tourIndex: number,
  perkID: string,
  choice: string = "",
): CharacterData {
  const updated = structuredClone(character);
  const tour = updated.tours[tourIndex];

  if (!tour) return character;

  tour.acePerk = formatAceSelection(perkID, choice);

  return sanitizeTours(updated);
}

export function getCharacterAcePerkSelections(
  character: CharacterData,
): string[] {
  return character.tours
    .filter((tour) => !isTourAcePerkConverted(tour))
    .map((tour) => tour.acePerk)
    .filter((v): v is string => !!v && v !== "");
}
export function getCharacterDeploymentPerks(
  character: CharacterData,
): string[] {
  return character.tours.flatMap(getDeploymentPerks);
}

export function isTourAcePerkConverted(tour: Tour): boolean {
  return isTourComplete(tour) && tour.acePerk === "basePerk";
}

export function convertTourAcePerk(
  character: CharacterData,
  tourIndex: number,
  toBase: boolean,
): CharacterData {
  const updated = structuredClone(character);
  updated.tours[tourIndex].acePerk = toBase ? "basePerk" : "";
  return sanitizeTours(updated);
}

export function getAcePerkConversionCount(character: CharacterData): number {
  return character.tours.filter(isTourAcePerkConverted).length;
}

export function getAdvancementConversionCount(
  character: CharacterData,
): number {
  return character.specialization.advancements.filter((a) => a.perkConversion)
    .length;
}

export function getTotalBasePerkConversionCount(
  character: CharacterData,
): number {
  return (
    getAcePerkConversionCount(character) +
    getAdvancementConversionCount(character)
  );
}

export function getAllSpecTacticsNotChar(excludeSpecId?: string) {
  return Specializations.filter(
    (spec) => !excludeSpecId || spec.id !== excludeSpecId,
  ).flatMap((spec) =>
    spec.tactics.map((tactic) => ({
      ...tactic,
      specName: spec.name,
      specId: spec.id,
    })),
  );
}

export function getAllSpecDowntimesNotChar(excludeSpecId?: string) {
  const preFlightIds = new Set(
    Specializations.filter(
      (spec) => !excludeSpecId || spec.id !== excludeSpecId,
    ).flatMap((spec) => spec.preFlights),
  );

  return Downtimes.filter((dt) => preFlightIds.has(dt.id));
}

export function getCompletedDeploymentModifiers(
  character: CharacterData,
): string[] {
  return character.tours.flatMap((tour) =>
    getCompletedDeployments(tour)
      .map((dep) => dep.type)
      .filter((m): m is string => !!m && m !== ""),
  );
}

export function getModifierCounts(character: CharacterData): ModifierCounts {
  const modifiers = getCompletedDeploymentModifiers(character);
  return {
    fury: modifiers.filter((m) => m === "baseDepFury").length,
    acuity: modifiers.filter((m) => m === "baseDepAcuity").length,
    patience: modifiers.filter((m) => m === "baseDepPat").length,
    endurance: modifiers.filter((m) => m === "baseDepEnd").length,
  };
}

export function getModifierPilotBonuses(character: CharacterData) {
  const counts = getModifierCounts(character);
  //console.log(counts.fury);
  return {
    temp: counts.fury,
    nerve: counts.patience,
    reflex: counts.acuity,
    gResist: counts.endurance,
  };
}

export function isPhoenixTour(tour: Tour): boolean {
  return tour.currTourID === PHOENIX_TOUR_ID;
}

export function getAvailablePhoenixCharges(character: CharacterData): number {
  return character.tours.filter(
    (tour) => isPhoenixTour(tour) && isTourComplete(tour) && !tour.pheonix,
  ).length;
}

export function hasBurnedCoin(character: CharacterData): boolean {
  return character.coins.some((c) => c.burned);
}

export function canUsePhoenix(character: CharacterData): boolean {
  return getAvailablePhoenixCharges(character) > 0 && hasBurnedCoin(character);
}

export function markPhoenixUsed(
  character: CharacterData,
  tourIndex: number,
): CharacterData {
  const updated = structuredClone(character);
  updated.tours[tourIndex].pheonix = true;
  return updated;
}
