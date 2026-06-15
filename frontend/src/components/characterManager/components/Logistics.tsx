import Tabs from "./CharacterTabs";
import { useState } from "react";

function SortieView({}: {}) {
  const [activeTab, setActiveTab] = useState("Pilot");
  return (
    <div className="w-full min-h-screen text-cyan-100 space-y-6">
      {/* HEADER */}
      <div className="border border-cyan-100 lg:p-4 p-2">
        <h1 className="text-2xl font-bold">LOGISTICS</h1>
      </div>

      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setupCompleted={true}
        gameplay={false}
        logi={true}
      />

      {activeTab === "Licenses" && <div>Licenses and unlocks here.</div>}

      {activeTab === "Loot" && <div>Loot and other items here.</div>}
    </div>
  );
}

export default SortieView;
