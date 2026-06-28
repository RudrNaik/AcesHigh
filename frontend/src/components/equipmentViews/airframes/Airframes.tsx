import { useState } from "react";
import AircraftCard from "./AircraftCard";
import * as planeEngine from "../../characterManager/handlers/Engines/planeEngine";
import AirframeSidebar from "./AirframeSidebar";

function Airframes() {
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredAircraft = planeEngine
    .getAircraftList()
    .filter((aircraft) => {
      if (selectedRole === "ALL") return true;

      return aircraft.type === selectedRole;
    })
    .filter((aircraft) => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();

      return (
        aircraft.name.toLowerCase().includes(query) ||
        aircraft.type.toLowerCase().includes(query)
      );
    });

  return (
    <div className="w-full min-h-screen text-cyan-100 p-6">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4.5 right-30 z-50 bg-black/20 border border-cyan-100 px-4 py-3 text-sm  "
        >
          FILTER
        </button>
      )}

      <div className="flex gap-6">
        <AirframeSidebar
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Aircraft List */}
        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-1 gap-6 lg:px-5">
            {filteredAircraft.map((aircraft) => (
              <AircraftCard
                key={aircraft.id}
                id={aircraft.id}
                name={aircraft.name}
                type={aircraft.type}
                family={aircraft.family}
                gen={aircraft.gen}
                tier={aircraft.tier}
                stats={aircraft.stats}
                tags={aircraft.tags}
                moduleSlots={aircraft.moduleSlots}
                desc={aircraft.desc}
                intrinsic={aircraft.intrinsic}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Airframes;
