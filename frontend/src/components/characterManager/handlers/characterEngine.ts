import type { CharacterData } from "./characterTypes";
//import aircraft from "../../../data/AircraftList.json"
import staticMods from "../../../data/StaticMods.json";
import perks from "../../../data/PerkList.json";
import specializations from "../../../data/Specs.json";
import downtime from "../../../data/Downtimes.json";

export function getMentalStress(character: CharacterData) {
  let charStats = getPilotStatsModified(character);
  return charStats.nerve + charStats.temper;
}

export function getPhysStress(character: CharacterData) {
  let charStats = getPilotStatsModified(character);
  return charStats.reflex + charStats.gResist;
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

  let mindBreak = character.stress.permMentalAdj;
  let succedDry = character.stress.permPhysicalAdj;

  console.log(mindBreak);
  console.log(succedDry);

  temp += (modifiers?.temper || 0) - mindBreak;
  nerv += (modifiers?.nerve || 0) - mindBreak;
  rflx += (modifiers?.reflex || 0) - succedDry;
  gres += (modifiers?.gResist || 0) - succedDry;

  return { temper: temp, nerve: nerv, reflex: rflx, gResist: gres };
}

export function getBackGroundPerk(character: CharacterData) {
  let bgPerk = perks.find((p) => p.id === character.backgroundPerk);
  return {
    id: bgPerk?.id,
    name: bgPerk?.name,
    type: bgPerk?.type,
    tags: bgPerk?.tags,
    addManuID: bgPerk?.addManuID,
    advancement: bgPerk?.advancement,
    description: bgPerk?.description,
  };
}

export function getSpecialization(character: CharacterData) {
  const spec = specializations.find(
    (spec) => spec.id === character.specialization.specId,
  );

  if (!spec) {
    throw new Error(
      `Specialization '${character.specialization.specId}' not found`,
    );
  }

  return spec;
}

export function getDowntimes(character: CharacterData) {
  const spec = getSpecialization(character);

  if (!spec.preFlights?.length) {
    return undefined;
  }

  const downtime1 = downtime.find((dt) => dt.id === spec.preFlights[0]);
  const downtime2 = downtime.find((dt) => dt.id === spec.preFlights[1]);
  const downtime3 = downtime.find((dt) => dt.id === spec.preFlights[2]);

  console.log(downtime1);
  console.log(downtime2);
  console.log(downtime3);

  if (!downtime1 || !downtime2 || !downtime3) {
    throw new Error("downtimes not found");
  }

  return { dt1: downtime1, dt2: downtime2, dt3: downtime3 };
}

export function getCurrentTactics(character: CharacterData){
  let currTactics = character.specialization.tactics
  return currTactics
}

export function getAdvancements(character: CharacterData){
  const spec = getSpecialization(character);
  let specAdvancements = spec.advancements;
  let charAdvancements = character.specialization.advancements;
  return {fromSpec: specAdvancements, fromChar: charAdvancements}
}

//Reduces mental stats by 1 when mentally stressed out
export function mindBreak(
  character: CharacterData,
  updateCharacter?: (c: CharacterData) => void,
) {
  const newPerm = (character.stress?.permMentalAdj ?? 0) + 1;
  const updated: CharacterData = {
    ...character,
    stress: {
      ...character.stress,
      permMentalAdj: newPerm,
    },
  };

  if (updateCharacter) updateCharacter(updated);

  return updated;
}

//Reduces physical stats by 1 when sucked dry (physical stressout)
export function Drained(
  character: CharacterData,
  updateCharacter?: (c: CharacterData) => void,
) {
  const newPerm = (character.stress?.permPhysicalAdj ?? 0) + 1;
  const updated: CharacterData = {
    ...character,
    stress: {
      ...character.stress,
      permPhysicalAdj: newPerm,
    },
  };

  if (updateCharacter) updateCharacter(updated);

  return updated;
}
