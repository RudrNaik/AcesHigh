import { useMemo, useState } from "react";
import type { CharacterData } from "../handlers/characterTypes";
import { buildSortieState } from "../handlers/buildSortie";

function SortieView({
  character,
}: {
  character: CharacterData;
}) {
  const sortie = useMemo(
    () => buildSortieState(character),
    [character]
  );

  const [selectedSection, setSelectedSection] =
    useState<"pilot" | "aircraft">("pilot");

  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  return (
    <div className="w-full min-h-screen text-white space-y-6">

      {/* HEADER */}
      <div className="border border-cyan-100 p-4">
        <h1 className="text-2xl font-bold">SORTIE STATUS</h1>

        <p className="text-cyan-300">
          {character.dossier.callsign || "UNKNOWN PILOT"}
        </p>

        {/* SECTION SWITCH */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setSelectedSection("pilot")}
            className={`px-3 py-1 border ${
              selectedSection === "pilot"
                ? "border-cyan-300 text-cyan-300"
                : "border-gray-600"
            }`}
          >
            Pilot
          </button>

          <button
            onClick={() => setSelectedSection("aircraft")}
            className={`px-3 py-1 border ${
              selectedSection === "aircraft"
                ? "border-cyan-300 text-cyan-300"
                : "border-gray-600"
            }`}
          >
            Aircraft
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: STATS */}
        <div className="border border-cyan-100 p-4 space-y-2">

          {selectedSection === "pilot" && (
            <>
              <h2 className="text-cyan-300 font-bold">Pilot Status</h2>

              <StatButton
                label="Temper"
                stat={sortie.pilot.temper}
                onClick={() => setSelectedStat("temper")}
              />

              <StatButton
                label="Nerve"
                stat={sortie.pilot.nerve}
                onClick={() => setSelectedStat("nerve")}
              />

              <StatButton
                label="Reflex"
                stat={sortie.pilot.reflex}
                onClick={() => setSelectedStat("reflex")}
              />

              <StatButton
                label="G-Resist"
                stat={sortie.pilot.gResist}
                onClick={() => setSelectedStat("gResist")}
              />
            </>
          )}

          {selectedSection === "aircraft" && (
            <>
              <h2 className="text-cyan-300 font-bold">Aircraft Status</h2>

              <StatButton
                label="A2A"
                stat={sortie.aircraft.a2a}
                onClick={() => setSelectedStat("a2a")}
              />

              <StatButton
                label="A2G"
                stat={sortie.aircraft.a2g}
                onClick={() => setSelectedStat("a2g")}
              />

              <StatButton
                label="Manu"
                stat={sortie.aircraft.manu}
                onClick={() => setSelectedStat("manu")}
              />

              <StatButton
                label="Speed"
                stat={sortie.aircraft.speed}
                onClick={() => setSelectedStat("speed")}
              />

              <StatButton
                label="Surv"
                stat={sortie.aircraft.surv}
                onClick={() => setSelectedStat("surv")}
              />

              <StatButton
                label="Cap"
                stat={sortie.aircraft.cap}
                onClick={() => setSelectedStat("cap")}
              />
            </>
          )}
        </div>

        {/* RIGHT: BREAKDOWN PANEL */}
        <div className="border border-cyan-100 p-4">
          <h2 className="text-cyan-300 font-bold mb-2">
            Breakdown
          </h2>

          {!selectedStat && (
            <p className="text-gray-400">
              Select a stat to view modifier breakdown
            </p>
          )}

          {selectedStat && renderBreakdown(sortie, selectedSection, selectedStat)}
        </div>
      </div>
    </div>
  );
}

function StatButton({
  label,
  stat,
  onClick,
}: {
  label: string;
  stat: {
    base: number;
    total: number;
  };
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-between border border-gray-700 p-2 hover:border-cyan-300"
    >
      <span>{label}</span>
      <span>
        {stat.base} → {stat.total}
      </span>
    </button>
  );
}

function renderBreakdown(
  sortie: any,
  section: "pilot" | "aircraft",
  statKey: string
) {
  const stat = sortie[section][statKey];

  if (!stat) return <div>No data</div>;

  return (
    <div className="space-y-2">
      <div className="text-white">
        Base: <span className="text-cyan-300">{stat.base}</span>
      </div>

      <div className="space-y-1">
        {stat.modifiers?.length > 0 ? (
          stat.modifiers.map((m: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-300">{m.sourceName}</span>
              <span className={m.value >= 0 ? "text-green-400" : "text-red-400"}>
                {m.value > 0 ? `+${m.value}` : m.value}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No modifiers</div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-700">
        Total: <span className="text-cyan-300">{stat.total}</span>
      </div>
    </div>
  );
}

export default SortieView;