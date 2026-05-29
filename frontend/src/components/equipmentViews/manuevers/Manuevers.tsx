import { useState } from "react";
import maneuverList from "../../../data/ManueverList.json"
import ManeuverCard from "./ManueverCard";
import ManeuverSidebar from "./ManueversSidebar";

function Maneuvers() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredManeuvers = maneuverList
    .filter((m) => {
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();

      return (
        m.name.toLowerCase().includes(q) ||
        (m.type ?? "").toLowerCase().includes(q) ||
        (m.desc ?? "").toLowerCase().includes(q)
      );
    })
    .filter((manu) => {
      if (manu.id === "manuExampleTech") return false;
      if (manu.id === "exampleManu") return false;

      return true;
    })
    .filter((m) => {
      if (selectedCategory === "ALL") return true;

      return (m.type ?? "").toUpperCase() === selectedCategory;
    });

  return (
    <div className="w-full min-h-screen text-cyan-100 p-6">
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
          FILTERS
        </button>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <ManeuverSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Grid */}
        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredManeuvers.map((m) => (
              <ManeuverCard
                key={m.id}
                id={m.id}
                name={m.name}
                type={m.type}
                desc={m.desc}
                tags={m.tags as any}
                engCost={m.engCost}
                isCommon={m.isCommon}
                isAdvanced={m.isAdvanced}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Maneuvers;