import type { CharacterData } from "./characterTypes";

export const createDefaultCharacter = (): CharacterData => ({
  id: crypto.randomUUID(),

  metadata: {
    setupComplete: false,

    startingPilotStats: {
      temper: 1,
      nerve: 1,
      reflex: 1,
      gResist: 1,
    },
    startingRP: 0,
    generation: 0,
  },

  dossier: {
    firstName: "",
    lastName: "",
    callsign: "",

    gender: "",
    pronouns: "",

    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "",

    rank: "",
    squadron: "",

    faith: "",
    sexuality: "",

    height: "",
    weight: "",

    hairColor: "",
    eyeColor: "",

    biography: "",
    description: "",
    serviceRecord: "",
    psychologicalReport: "",

    languages: "",

    relationships: "",

    notes: "",
  },

  stats: {
    temper: 1,
    nerve: 1,
    reflex: 1,
    gResist: 1,
  },

  stress: {
    mental: 0,
    permMentalAdj: 0,
    physical: 0,
    permPhysicalAdj: 0,
  },

  quirks: {
    quirk1Name: "",
    quirk1Desc: "",

    quirk2Name: "",
    quirk2Desc: "",

    quirk3Name: "",
    quirk3Desc: "",
  },

  specialization: {
    specId: "",
    tactics: [],
    advancements: [],
    mastery: "",
  },

  aircraft: {
    aircraftId: "",
    upgradePackage: "",
    ordnanceId: "",
    modules: {
      m1: "",
      m2: "",
      m3: "",
      m4: "",
      m5: "",
      m6: "",
      m7: "",
      m8: "",
      m9: "",
      m10: "",
    },
    currentCapacity: 0,
    currentSurvivability: 0,
    currentEnergy: 0,
  },

  backgroundPerk: "",
  masteredAircraft: [],
  aceperks: [],
  baseperks: [],
  licenses: {
    
  },
  loot: [],

  tours: [],
});
