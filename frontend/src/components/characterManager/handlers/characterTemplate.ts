import type { CharacterData } from "./characterTypes";

export const createDefaultCharacter = (): CharacterData => ({
  id: crypto.randomUUID(),

  metadata: {
    setupComplete: false,
    userName: "",
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

  coins: [
    {
      used: false,
      burned: false,
    },
    {
      used: false,
      burned: false,
    },
    {
      used: false,
      burned: false,
    },
  ],

  quirks: {
    quirk1Desc: "",

    quirk2Desc: "",

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
    sweep: "neutral",
    vtol: false
  },

  backgroundPerk: "",
  masteredAircraft: [],
  aceperks: [],
  baseperks: [],
  licenses: {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    B3: 0,
    C1: 0,
    C2: 0,
    D1: 0,
    D2: 0,
  },
  loot: [],

  tours: [],

  resets: [],

  bonusMoola: 0,
});
