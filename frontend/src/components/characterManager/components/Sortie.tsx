import type { CharacterData } from "../handlers/characterTypes";
import Pilot from "../components/charManagerCommon/pilotComponents/Pilot";
import Aircraft from "../components/charManagerCommon/planeComponents/Aircraft";
import Perks from "../components/charManagerCommon/pilotComponents/Perks";
import Tabs from "./CharacterTabs";
import { useState } from "react";

function SortieView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const [activeTab, setActiveTab] = useState("Pilot");
  return (
    <div className="w-full min-h-screen text-cyan-100 space-y-6">
      {/* HEADER */}
      <div className="border border-cyan-100 lg:p-4 p-2">
        <h1 className="text-2xl font-bold">SORTIE</h1>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setupCompleted={true}
          gameplay={true}
          logi={false}
        />

        {activeTab === "Pilot" && (
          <Pilot character={character} updateCharacter={updateCharacter} />
        )}

        {activeTab === "Plane" && (
          <Aircraft character={character} updateCharacter={updateCharacter} />
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pilot */}
          <Pilot character={character} updateCharacter={updateCharacter} />

          {/* AIRCRAFT STATE */}
          <Aircraft character={character} updateCharacter={updateCharacter} />
        </div>
        <Perks character={character} updateCharacter={updateCharacter} />
      </div>
    </div>
  );
}

export default SortieView;
