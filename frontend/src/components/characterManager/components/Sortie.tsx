import type { CharacterData } from "../handlers/characterTypes";
import { useEffect, useState } from "react";
import * as charEngine from "../handlers/characterEngine";
import { useCharacterStorage } from "../handlers/characterStorage";

type PilotStatsType = {
  temper: number;
  nerve: number;
  reflex: number;
  gResist: number;
};

function SortieView({ character }: { character: CharacterData }) {
  const [pilotStats, setPilotStats] = useState(
    charEngine.getPilotStatsModified(character),
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const { updateCharacter } = useCharacterStorage();

  const [sortieStats, setSortieStats] = useState({
    temper: pilotStats.temper,
    nerve: pilotStats.nerve,
    reflex: pilotStats.reflex,
    gResist: pilotStats.gResist,
  });

  useEffect(() => {
    const updated = charEngine.getPilotStatsModified(character);

    setPilotStats(updated);
    setSortieStats(updated);
  }, [character, refreshKey]);

  const [stress, setStress] = useState({
    mental: 0,
    physical: 0,
  });

  const statDefs = [
    { key: "temper", label: "Temper" },
    { key: "nerve", label: "Nerve" },
    { key: "reflex", label: "Reflex" },
    { key: "gResist", label: "G-Resist" },
  ] as const;

  //console.log(pilotStats.toString())

  return (
    <div className="w-full min-h-screen text-white space-y-6">
      {/* HEADER */}
      <div className="border border-cyan-100 p-4">
        <h1 className="text-2xl font-bold">SORTIE</h1>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PILOT STATS */}
        <div className="border border-cyan-100 p-4 space-y-2">
          <h2 className="text-cyan-300 font-bold">Pilot Stats</h2>

          {statDefs.map((stat) => (
            <PilotStat
              key={stat.key}
              label={stat.label}
              statKey={stat.key}
              baseStats={pilotStats}
              sortieStats={sortieStats}
              setSortieStats={setSortieStats}
            />
          ))}

          <h2 className="text-cyan-300 font-bold border-t-2 pt-2 border-cyan-100">
            Stress
          </h2>
          {/* Mental */}
          <div>
            <div className="flex gap-2 items-center">
              <span className="w-24 border border-cyan-100 px-2 py-1">
                Mental
              </span>

              <div className="w-8 text-center text-cyan-400">
                {stress.mental}/
                <span className="text-cyan-100">
                  {charEngine.getMentalStress(character)}
                </span>
              </div>

              <button
                onClick={() =>
                  setStress({
                    mental: stress.mental - 1,
                    physical: stress.physical,
                  })
                }
                disabled={stress.mental <= 0}
                className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
              >
                -
              </button>

              <button
                onClick={() =>
                  setStress({
                    mental: stress.mental + 1,
                    physical: stress.physical,
                  })
                }
                disabled={
                  stress.mental >= charEngine.getMentalStress(character)
                }
                className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
              >
                +
              </button>

              <button
                onClick={() => {
                  charEngine.mindBreak(character, updateCharacter);
                  setRefreshKey((k) => k + 1);
                  setStress({
                    mental: 0,
                    physical: 0,
                  });
                }}
                disabled={stress.mental < charEngine.getMentalStress(character)}
                className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
              >
                BREAK
              </button>
            </div>
          </div>
          {/* Physical */}
          <div>
            <div className="flex gap-2 items-center">
              <span className="w-24 border border-cyan-100 px-2 py-1">
                Physical
              </span>

              <div className="w-8 text-center text-cyan-400">
                {stress.physical}/
                <span className="text-cyan-100">
                  {charEngine.getPhysStress(character)}
                </span>
              </div>

              <button
                onClick={() =>
                  setStress({
                    mental: stress.mental,
                    physical: stress.physical - 1,
                  })
                }
                disabled={stress.physical <= 0}
                className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
              >
                -
              </button>

              <button
                onClick={() =>
                  setStress({
                    mental: stress.mental,
                    physical: stress.physical + 1,
                  })
                }
                disabled={
                  stress.physical >= charEngine.getPhysStress(character)
                }
                className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
              >
                +
              </button>
              <button
                onClick={() => {
                  charEngine.Drained(character, updateCharacter);
                  setRefreshKey((k) => k + 1);
                  setStress({
                    mental: 0,
                    physical: 0,
                  });
                }}
                disabled={stress.mental < charEngine.getMentalStress(character)}
                className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
              >
                BREAK
              </button>
            </div>
          </div>
        </div>

        {/* AIRCRAFT STATE */}
        <div className="border border-cyan-100 p-4 space-y-2">
          <h2 className="text-cyan-300 font-bold">Aircraft</h2>

          <div>Aircraft ID: {character.aircraft.aircraftId || "None"}</div>

          <div className="text-sm text-cyan-200">
            (Stats, loadout, mods will come here)
          </div>
        </div>
      </div>
    </div>
  );
}

function PilotStat({
  label,
  statKey,
  baseStats,
  sortieStats,
  setSortieStats,
}: {
  label: string;
  statKey: "temper" | "nerve" | "reflex" | "gResist";
  baseStats: PilotStatsType;
  sortieStats: PilotStatsType;
  setSortieStats: React.Dispatch<React.SetStateAction<PilotStatsType>>;
}) {
  const currentValue = sortieStats[statKey];
  const maxValue = baseStats[statKey];

  const changeStat = (delta: number) => {
    setSortieStats((prev) => ({
      ...prev,
      [statKey]: Math.max(0, Math.min(maxValue, prev[statKey] + delta)),
    }));
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="w-24 border border-cyan-100 px-2 py-1">{label}</span>

      <div className="w-8 text-center">{currentValue}</div>

      <button
        onClick={() => changeStat(-1)}
        disabled={currentValue <= 0}
        className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
      >
        -
      </button>

      <button
        onClick={() => changeStat(1)}
        disabled={currentValue >= maxValue}
        className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
      >
        +
      </button>

      <div className="text-sm text-cyan-300">Base: {maxValue}</div>
    </div>
  );
}

export default SortieView;
