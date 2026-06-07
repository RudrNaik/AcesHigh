import type { CharacterData } from "./characterTypes";

export const createDefaultCharacter = (): CharacterData => ({
  id: crypto.randomUUID(),

  metadata: {
    setupComplete: false,

    startingPilotStats: {
      temper: 0,
      nerve: 0,
      reflex: 0,
      gResist: 0,
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
    temper: 0,
    nerve: 0,
    reflex: 0,
    gResist: 0,
  },

  stress: {
    mental: 0,
    permMentalAdj: 0,
    physical: 0,
    permPhysicalAdj: 0
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
  },

  aircraft: {
    aircraftId: "",
    upgradePackage: "",
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
      m10:""
    },
  },

  backgroundPerk: "",
  masteredAircraft: [],
  aceperks: [],
  baseperks: [],
  licenses: [],
  loot: [],

  tours: []
});
