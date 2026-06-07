import type { CharacterData } from "./characterTypes";
//import aircraft from "../../../data/AircraftList.json"
import staticMods from "../../../data/StaticMods.json";
//import perks from "../../../data/PerkList.json"
import specializations from "../../../data/Specs.json";

export function getMentalStress(character: CharacterData) {
  let charStats = getPilotStatsModified(character)
  return (charStats.nerve + charStats.temper)
}

export function getPhysStress(character: CharacterData) {
  let charStats = getPilotStatsModified(character)
  return (charStats.reflex + charStats.gResist)
}

export function getStaticModifiersFromSpec(character: CharacterData) {
  let staticModifier: string | undefined = specializations.find(
    (spec) => spec.id === character.specialization.specId,
  )?.staticMods;

  if (staticModifier == undefined) {
    return;
  }

  let modifiers: any = staticMods.find(
    (mod) => mod.id === staticModifier,
  )?.mods;

  return {
    temper: modifiers?.temp || 0,
    nerve: modifiers?.nerve || 0,
    reflex: modifiers?.reflex || 0,
    gResist: modifiers?.gResist || 0,
  };
}

export function getPilotStatsModified(character: CharacterData) {
  let temp = character.metadata.startingPilotStats.temper;
  let nerv = character.metadata.startingPilotStats.nerve;
  let rflx = character.metadata.startingPilotStats.reflex;
  let gres = character.metadata.startingPilotStats.gResist;

  let modifiers = getStaticModifiersFromSpec(character);

  temp += modifiers?.temper || 0;
  nerv += modifiers?.nerve || 0;
  rflx += modifiers?.reflex || 0;
  gres += modifiers?.gResist || 0;

  return { temper: temp, nerve: nerv, reflex: rflx, gResist: gres };
}
