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

  coins: {
    coin1:{
      used: false,
      burned: false
    },
    coin2:{
      used: false,
      burned: false
    },
    coin3:{
      used: false,
      burned: false
    }
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
    modules: [],
    currentCapacity: 0,
    currentSurvivability: 0,
    currentEnergy: 0,
  },

  backgroundPerk: "",
  masteredAircraft: ["acFamPhantoms"],
  aceperks: [],
  baseperks: [],
  licenses: {
    A1: 7,
    A2: 7,
    B1: 7,
    B2: 7,
    B3: 7,
    C1: 7,
    C2: 7,
  },
  loot: [],

  tours: [],
});
