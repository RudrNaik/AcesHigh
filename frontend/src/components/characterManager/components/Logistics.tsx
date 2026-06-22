import Tabs from "./CharacterTabs";
import { useState } from "react";
import type { CharacterData } from "../handlers/characterTypes";
import Licenses from "./CharManagerComponents/LogisticsComponents/Licenses"
import Loot from "./CharManagerComponents/LogisticsComponents/Loot"

function LogisticsView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const [activeTab, setActiveTab] = useState("Licenses");
  return (
    <div className="w-full min-h-screen text-cyan-100 space-y-4">
      {/* HEADER */}
      <div className="border border-cyan-100 lg:p-4 p-2 bg-black/20">
        <h1 className="text-2xl font-bold">LOGISTICS</h1>
      </div>

      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setupCompleted={true}
        gameplay={false}
        logi={true}
      />

      {activeTab === "Licenses" && <Licenses character={character} updateCharacter={updateCharacter}/>}

      {activeTab === "Loot" && <Loot character={character} updateCharacter={updateCharacter}/>}
    </div>
  );
}

export default LogisticsView;
