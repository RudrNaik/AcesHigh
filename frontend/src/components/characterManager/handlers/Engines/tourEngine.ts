import type { CharacterData, Tour, Deployment } from "../characterTypes";

import Deployments from "../../../../data/Deployments.json";
import Tours from "../../../../data/Tours.json";

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
