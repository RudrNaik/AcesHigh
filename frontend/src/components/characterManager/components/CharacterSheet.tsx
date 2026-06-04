import type { CharacterData } from "../handlers/characterTypes";
import { useState } from "react";
import CharacterTabs from "./CharacterTabs";
import Dossier from "./Dossier";

function CharacterSheet({
  character,
  onUpdate,
  onBack,
}: {
  character: CharacterData;
  onUpdate: (c: CharacterData) => void;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Dossier");

  return (
    <div className="w-full min-h-screen space-y-6 px-4 py-2 border-l-4 border-cyan-100 border bg-black/20">
      <button onClick={onBack} className="border px-2 py-1 border-cyan-100">
        ← Back
      </button>

      <div className="border-b-2 border-cyan-100">
        <h1 className="text-2xl font-bold">
          {character.dossier.callsign || "Unnamed Pilot"}
        </h1>
      </div>

      <CharacterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Dossier" && (
        <Dossier character={character} updateCharacter={onUpdate} />
      )}

      {/* {activeTab === "pilot" && (
        <PilotStats character={character} updateCharacter={onUpdate} />
      )} */}
    </div>
  );
}

export default CharacterSheet;
