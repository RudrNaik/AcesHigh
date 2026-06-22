import type { CharacterData } from "../handlers/characterTypes";
import { useState } from "react";
import * as manuEngine from "../handlers/Engines/manuEngine";
import manuList from "../../../data/ManueverList.json";

import ManeuverSidebar from "./CharManagerComponents/ManuComponents/ManueversSidebar";
import ManeuverCard from "./CharManagerComponents/ManuComponents/ManueverCard";

type Props = {
  character: CharacterData;
  updateCharacter?: (updated: CharacterData) => void;
};

export default function ManuView({ character }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const charManuIDs = manuEngine.getAllCharManus(character);
  const ManueverList = manuList.filter((m) => charManuIDs.includes(m.id));

  const filteredManeuvers = ManueverList.filter((m) => {
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();

    return (
      m.name.toLowerCase().includes(q) ||
      (m.type ?? "").toLowerCase().includes(q) ||
      (m.desc ?? "").toLowerCase().includes(q)
    );
  })
    .filter((m) => {
      if (m.id === "manuExampleTech") return false;
      if (m.id === "exampleManu") return false;
      if (!m.desc || m.desc === "n/a") return false;
      return true;
    })
    .filter((m) => {
      if (selectedCategory === "ALL") return true;
      if (selectedCategory === "COMMON" && m.isCommon) return true;
      if (selectedCategory === "ADVANCED" && m.isAdvanced) return true;

      return (m.type ?? "").toUpperCase() === selectedCategory;
    });

  return (
    <div className="w-full min-h-screen text-cyan-100 space-y-4">
      <div className="border border-cyan-100 lg:p-4 p-2 bg-black/20">
        <h1 className="text-2xl font-bold">MANUS</h1>
      </div>

      {/* Mobile Filter Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            lg:hidden
            fixed
            top-4.5
            right-30
            z-50
            bg-black/20
            border border-cyan-100
            px-4 py-3
            text-sm font-mono
          "
        >
          FILTER
        </button>
      )}

      <div className="flex gap-4">
        {/* Sidebar */}
        <div>
          <ManeuverSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            availableManu={manuEngine.getAllCharManus(character)}
          />
        </div>

        {/* Main Grid */}
        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredManeuvers.map((m) => (
              <ManeuverCard key={m.id} id={m.id} autofill={true} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
