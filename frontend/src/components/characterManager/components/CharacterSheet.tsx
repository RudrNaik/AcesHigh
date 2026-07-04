import type { CharacterData } from "../handlers/characterTypes";
import { useEffect, useState } from "react";
import CharacterTabs from "./CharacterTabs";
import Dossier from "./Dossier";
import Sortie from "./Sortie";
import Setup from "./Setup";
import Logistics from "./Logistics";
import Tours from "./Tours";
import Logs from "./Logs";
import Debug from "./Debug"
import Manus from "./Manus"

import specializations from "../../../data/Specs.json";
import perks from "../../../data/PerkList.json";
import manus from "../../../data/ManueverList.json";
import staticMods from "../../../data/StaticMods.json";

import { motion } from "framer-motion";

function CharacterSheet({
  character,
  onUpdate,
  onBack,
}: {
  character: CharacterData;
  onUpdate: (c: CharacterData) => void;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Setup");

  useEffect(() => {
    if (character.metadata.setupComplete) {
      setActiveTab("Dossier");
    }
  }, [character.metadata.setupComplete]);

  return (
    <div className="w-full min-h-screen px-1 space-y-6 lg:px-4 lg:py-2 border-cyan-800 lg:border bg-black/20">
      <button onClick={onBack} className="theme-btn">
        ← Back
      </button>

      <div className="border-b-2 border-cyan-100">
        <h1 className="text-2xl font-bold">
          {character.dossier.callsign || "Unnamed Pilot"} //{" "}
          {character.metadata.userName}
        </h1>
      </div>

      <CharacterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setupCompleted={character.metadata.setupComplete}
        gameplay={false}
        logi={false}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.1,
        }}
        className="flicker"
      >
        {activeTab === "Setup" && (
          <Setup
            character={character}
            updateCharacter={onUpdate}
            specs={specializations}
            backgroundPerks={perks}
            manuvers={manus}
            staticMods={staticMods}
          />
        )}

        {activeTab === "Dossier" && (
          <Dossier character={character} updateCharacter={onUpdate} />
        )}

        {activeTab === "Sortie" && (
          <Sortie character={character} updateCharacter={onUpdate} />
        )}

        {activeTab === "Manus" && (
          <Manus character={character} updateCharacter={onUpdate} />
        )}

        {activeTab === "Logi" && (
          <Logistics character={character} updateCharacter={onUpdate} />
        )}

        {activeTab === "Tour" && (
          <Tours character={character} updateCharacter={onUpdate} />
        )}

        {activeTab === "Logs" && (
          <Logs character={character} updateCharacter={onUpdate} />
        )}

        {activeTab === "Admin" && (
          <Debug character={character} updateCharacter={onUpdate} />
        )}
      </motion.div>
    </div>
  );
}

export default CharacterSheet;
