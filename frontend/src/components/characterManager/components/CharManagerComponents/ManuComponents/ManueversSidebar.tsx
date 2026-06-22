import { useState } from "react";
import type { CharacterData } from "../../../handlers/characterTypes";
import ManuBuilder from "./ManueverBuilder";

interface ManeuverSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  availableManu: string[];

  char: CharacterData;
  onUpdate: (updated: CharacterData) => void;
}

type Tab = "FILTER" | "PLANNER";

function ManeuverSidebar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
  availableManu,
  char,
  onUpdate,
}: ManeuverSidebarProps) {
  const [tab, setTab] = useState<Tab>("FILTER");

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-75 z-50
          transform transition-transform duration-300
         bg-[#071018]/95
          border border-l-4 border-cyan-100
          overflow-y-auto
          lg:sticky lg:top-25 lg:h-170
           lg:translate-x-0 lg:bg-transparent lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col p-5 font-mono">
          {/* Header */}
          <div className="flex justify-between mb-3">
            <h2 className="text-xl font-bold"></h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              CLOSE
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-2 border-b border-cyan-100 text-xl">
            {["FILTER", "PLANNER"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as Tab)}
                className={`text-xs px-2 ${
                  tab === t ? "text-cyan-300" : "text-cyan-100/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {tab === "FILTER" ? (
              <>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/30 border border-cyan-100/40 px-2 py-1 mb-4"
                  placeholder="Search..."
                />

                {[
                  "ALL",
                  "COMMON",
                  "EXHAUST",
                  "POSITIONING",
                  "NORMAL",
                  "REACTION",
                  "ADVANCED",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`block text-sm ${
                      selectedCategory === c
                        ? "text-cyan-400"
                        : "text-cyan-100/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </>
            ) : (
              <ManuBuilder
                availableManus={availableManu}
                character={char}
                onUpdate={onUpdate}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default ManeuverSidebar;
