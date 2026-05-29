import { useState } from "react";
import ordnanceList from "../../../data/OrdnanceList.json";
import OrdnanceCard from "./OrdnanceCard";
import OrdnanceSidebar from "./OrdnanceSidebar";

function Ordnance() {
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredOrdnance = ordnanceList
    .filter((ordnance) => {
      if (ordnance.id === "ordExample") return false;
      if (ordnance.id === "ordNone") return false;

      return true;
    })

    .filter((ordnance) => {
      if (selectedDomain === "ALL") return true;

      return ordnance.domain === selectedDomain;
    })

    .filter((ordnance) => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();

      return (
        ordnance.name.toLowerCase().includes(query) ||
        ordnance.domain.toLowerCase().includes(query)
      );
    });

  return (
    <div className="w-full min-h-screen text-cyan-100 p-6">
      {/* Filter Button */}
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
            border
            border-cyan-100
            px-4
            py-3
            text-sm
            font-mono
          "
        >
          FILTERS
        </button>
      )}
        
      <div className="flex gap-6">
        <OrdnanceSidebar
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Card List */}
        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-1 gap-6 lg:px-5">
            {filteredOrdnance.map((ordnance) => (
              <OrdnanceCard
                key={ordnance.id}
                id={ordnance.id}
                name={ordnance.name}
                domain={ordnance.domain}
                desc={ordnance.desc}
                tags={ordnance.tags}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Ordnance;
