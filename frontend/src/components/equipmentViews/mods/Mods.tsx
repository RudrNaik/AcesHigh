import { useState } from "react";
import moduleList from "../../../data/ModList.json";
import ModCard from "./ModCard";
import ModSidebar from "./ModSidebar";

function Modules() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredModules = moduleList
    .filter((module) => {
      if (module.id === "modExample" || module.id === "modNone") return false;

      return true;
    })

    .filter((module) => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();

      return (
        module.name.toLowerCase().includes(query) ||
        module.desc?.toLowerCase().includes(query)
      );
    });

  return (
    <div className="w-full min-h-screen text-cyan-100 p-6">
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
        <ModSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModules.map((module) => (
              <ModCard
                key={module.id}
                id={module.id}
                name={module.name}
                desc={module.desc}
                mods={
                  module.mods
                    ? Object.fromEntries(
                        Object.entries(module.mods).filter(
                          (entry): entry is [string, number] => entry[1] !== undefined
                        )
                      )
                    : null
                }
                AddTags={module.AddTags}
                AddManuID={module.AddManuID}
                IntrinsicMod={module.IntrinsicMod}
                TypeMod={module.TypeMod}
                moduleTags={module.moduleTags}
                checkForChars={module.checkForChars}
                charChecked={module.charChecked}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Modules;