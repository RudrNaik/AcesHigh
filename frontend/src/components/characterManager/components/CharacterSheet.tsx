import type { CharacterData } from "../handlers/characterTypes";
import { useEffect, useState } from "react";
import CharacterTabs from "./CharacterTabs";
import Dossier from "./Dossier";
import Sortie from "./Sortie";
import Setup from "./Setup";

import specializations from "../../../data/Specs.json";
import perks from "../../../data/PerkList.json";
import manus from "../../../data/ManueverList.json";
import staticMods from "../../../data/StaticMods.json";

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
    <div className="w-full min-h-screen px-1 space-y-6 lg:px-4 lg:py-2 lg:border-l-4 border-cyan-100 lg:border bg-black/20">
      <button onClick={onBack} className="border px-2 py-1 border-cyan-100">
        ← Back
      </button>

      <div className="border-b-2 border-cyan-100">
        <h1 className="text-2xl font-bold">
          {character.dossier.callsign || "Unnamed Pilot"} //  {character.metadata.userName}
        </h1>
      </div>

      <CharacterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setupCompleted={character.metadata.setupComplete}
        gameplay = {false}
      />

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

      {activeTab === "Sortie" && <Sortie character={character} updateCharacter={onUpdate}/>}
    </div>
  );
}

export default CharacterSheet;
