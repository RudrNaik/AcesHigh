import type { CharacterData } from "./characterTypes";
import { applyModifiers } from "./modifierHandler";
import type {
  PilotState,
  AircraftState,
  StatKey,
  Modifier,
} from "./sortieTypes";

import modules from "../../../data/ModList.json"

/* =========================================================
   PILOT STATE
   ========================================================= */

export function buildPilotState(character: CharacterData): PilotState {
  const base: Record<StatKey, number> = {
    temper: character.metadata.startingPilotStats.temper ?? 0,
    nerve: character.metadata.startingPilotStats.nerve ?? 0,
    reflex: character.metadata.startingPilotStats.reflex ?? 0,
    gResist: character.metadata.startingPilotStats.gResist ?? 0,

    a2a: 0,
    a2g: 0,
    manu: 0,
    speed: 0,
    surv: 0,
    cap: 0,
  };

  const modifiers: Modifier[] = buildPilotModifiers(character);

  const stats = applyModifiers(base, modifiers);

  return {
    temper: stats.temper,
    nerve: stats.nerve,
    reflex: stats.reflex,
    gResist: stats.gResist,

    mentalStressMax: 0,
    physicalStressMax: 0,
    currentMentalStress: 0,
    currentPhysicalStress: 0,
  };
}

/* =========================================================
   AIRCRAFT STATE
   ========================================================= */

type AircraftDefinition = {
  id: string;
  name: string;

  stats: {
    a2a: number;
    a2g: number;
    manu: number;
    speed: number;
    surv: number;
    cap: number;
  };

  tags?: string[];
  intrinsic?: string;
};

function getAircraftDefinition(aircraftId: string): AircraftDefinition {
  return null;
}

function getAircraftModules(character: CharacterData) {
  const slots = character.aircraft.modules;

  const moduleIds = Object.values(slots).filter(
    (id): id is string => Boolean(id)
  );

  return moduleIds
    .map((id) => modules.get(id))
    .filter(Boolean);
}

function getUpgradePack(character: CharacterData): any | undefined {
  return undefined;
}

/* =========================================================
   AIRCRAFT BUILDER
   ========================================================= */

export function buildAircraftState(character: CharacterData): AircraftState {
  const aircraft = getAircraftDefinition(character.aircraft.aircraftId);

  const base: Record<StatKey, number> = {
    a2a: aircraft.stats.a2a,
    a2g: aircraft.stats.a2g,
    manu: aircraft.stats.manu,
    speed: aircraft.stats.speed,
    surv: aircraft.stats.surv,
    cap: aircraft.stats.cap,

    // pilot-only stats (kept for schema consistency)
    temper: 0,
    nerve: 0,
    reflex: 0,
    gResist: 0,
  };

  const modifiers: Modifier[] = buildAircraftModifiers(character, aircraft);

  const stats = applyModifiers(base, modifiers);

  const modules = getAircraftModules(character);
  const upgradePack = getUpgradePack(character);

  return {
    aircraftId: aircraft.id,
    aircraftName: aircraft.name,

    a2a: stats.a2a,
    a2g: stats.a2g,
    manu: stats.manu,
    speed: stats.speed,
    surv: stats.surv,
    cap: stats.cap,

    tags: aircraft.tags ?? [],

    intrinsic: aircraft.intrinsic,

    upgradePack: upgradePack
      ? {
          id: upgradePack.id,
          name: upgradePack.name,
        }
      : undefined,

    modules: modules.map((m) => ({
      id: m.id,
      name: m.name,
    })),

    energy: 0,
  };
}

/* =========================================================
   SHARED MODIFIER BUILDERS
   ========================================================= */

/**
 * PILOT MODIFIERS (future: perks, skills, injuries, etc)
 */
function buildPilotModifiers(character: CharacterData): Modifier[] {
  return [
    // TODO: skills
    // TODO: ace perks
    // TODO: base perks
    // TODO: injuries / stress effects
  ];
}

/**
 * AIRCRAFT MODIFIERS
 */
function buildAircraftModifiers(
  character: CharacterData,
  aircraft: AircraftDefinition,
): Modifier[] {
  const baseModifiers = buildAircraftBaseModifiers(aircraft);

  const tagModifiers: Modifier[] = (aircraft.tags ?? []).map((tag) => ({
    sourceId: tag,
    sourceName: `Tag: ${tag}`,
    sourceType: "aircraft",
    stats: {},
  }));

  const upgradePack = getUpgradePack(character);

  const upgradeModifiers: Modifier[] = upgradePack
    ? [
        {
          sourceId: upgradePack.id,
          sourceName: upgradePack.name,
          sourceType: "upgrade",
          stats: {},
        },
      ]
    : [];

  const modules = getAircraftModules(character);

  const moduleModifiers: Modifier[] = modules.map((mod) => ({
    sourceId: mod.id,
    sourceName: mod.name,
    sourceType: "module",
    stats: {},
  }));

  return [
    ...baseModifiers,
    ...tagModifiers,
    ...upgradeModifiers,
    ...moduleModifiers,
  ];
}

/**
 * BASE AIRCRAFT MODIFIERS (intrinsic etc)
 */
function buildAircraftBaseModifiers(aircraft: AircraftDefinition): Modifier[] {
  const mods: Modifier[] = [];

  if (aircraft.intrinsic) {
    mods.push({
      sourceId: aircraft.intrinsic,
      sourceName: "Intrinsic",
      sourceType: "intrinsic",
      stats: {},
    });
  }

  return mods;
}
