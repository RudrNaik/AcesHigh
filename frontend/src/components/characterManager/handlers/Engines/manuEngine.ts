import type { CharacterData } from "../characterTypes";
import manuList from "../../../../data/ManueverList.json";
import techList from "../../../../data/TechniqueList.json";

import * as planeEngine from "./planeEngine";

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
