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
  const { updateCharacter } = useCharacterStorage();

  // Track a local copy so break mutations reflect immediately
  const [localCharacter, setLocalCharacter] = useState(character);

  // Sync if the parent passes a fresh character (e.g. on load)
  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  const [pilotStats, setPilotStats] = useState(
    charEngine.getPilotStatsModified(localCharacter),
  );

  const [sortieStats, setSortieStats] = useState({
    temper: pilotStats.temper,
    nerve: pilotStats.nerve,
    reflex: pilotStats.reflex,
    gResist: pilotStats.gResist,
  });

  useEffect(() => {
    const updated = charEngine.getPilotStatsModified(localCharacter);
    setPilotStats(updated);
    setSortieStats(updated);
  }, [localCharacter]); // <-- depend on localCharacter, not character + refreshKey

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

  const [showLockedTactics, setShowLockedTactics] = useState(true);

  const currentTactics = charEngine.getCurrentTactics(localCharacter);
  const unlockedIds = new Set(currentTactics);

  //console.log(pilotStats.toString())

  return (
    <div className="w-full min-h-screen text-cyan-100 space-y-6">
      {/* HEADER */}
      <div className="border border-cyan-100 p-4">
        <h1 className="text-2xl font-bold">SORTIE</h1>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PILOT STATS */}
        <div className="border border-cyan-100 p-4 space-y-2">
          {/* Pilot Stats */}
          <div>
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
          </div>

          {/* Stress */}
          <div>
            <h2 className="text-cyan-300 font-bold border-t-2 pt-2 border-cyan-100">
              Stress
            </h2>
            {/* Mental */}
            <div className="py-2">
              <div className="flex gap-2 items-center">
                <span className="w-24 border border-cyan-100 px-2 py-1">
                  Mental
                </span>

                <div className="w-8 text-center text-cyan-400">
                  {stress.mental}/
                  <span className="text-cyan-100">
                    {charEngine.getMentalStress(localCharacter)}
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
                    stress.mental >= charEngine.getMentalStress(localCharacter)
                  }
                  className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
                >
                  +
                </button>

                <button
                  onClick={() => {
                    const updated = charEngine.mindBreak(
                      localCharacter,
                      updateCharacter,
                    );
                    setLocalCharacter(updated);
                    setStress({ mental: 0, physical: stress.physical });
                  }}
                  disabled={
                    stress.mental < charEngine.getMentalStress(localCharacter)
                  }
                  hidden={
                    stress.mental <
                    charEngine.getMentalStress(localCharacter) - 1
                  }
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
                    {charEngine.getPhysStress(localCharacter)}
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
                    stress.physical >= charEngine.getPhysStress(localCharacter)
                  }
                  className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    const updated = charEngine.Drained(
                      localCharacter,
                      updateCharacter,
                    );
                    setLocalCharacter(updated);
                    setStress({ mental: stress.mental, physical: 0 });
                  }}
                  disabled={
                    stress.physical < charEngine.getPhysStress(localCharacter)
                  }
                  hidden={
                    stress.physical <
                    charEngine.getPhysStress(localCharacter) - 1
                  }
                  className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
                >
                  BREAK
                </button>
              </div>
            </div>
          </div>

          {/* Background Perk */}
          <div>
            <h2 className="text-cyan-300 font-bold border-t-2 py-2 border-cyan-100">
              Background Perk
            </h2>
            <div>
              <div className="border p-3 text-sm opacity-80 space-y-2">
                <span className="border-b border-cyan-100">
                  {charEngine.getBackGroundPerk(character).name}
                </span>
                <br />
                <span className="italic ">
                  {charEngine.getBackGroundPerk(character).description}
                </span>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-2">
            <h2 className="text-cyan-300 font-bold border-t-2 py-2 border-cyan-100">
              Specialization
            </h2>
            <h1 className="text-lg italic">
              {charEngine.getSpecialization(localCharacter).name}
            </h1>
            {/* Preflights */}
            <div className="">
              <h3 className="font-bold">Preflights</h3>
              <div className="flex flex-col border border-l-4 border-cyan-100 px-2 py-1 space-y-2 mb-2">
                <div>
                  PFC-1 | {charEngine.getDowntimes(localCharacter)?.dt1.name}
                </div>
                <div className="text-xs">
                  {charEngine.getDowntimes(localCharacter)?.dt1.description}
                </div>
              </div>
              <div className="flex flex-col border border-l-4 border-cyan-100 px-2 py-1 space-y-2 mb-2">
                <div>
                  PFC-2 | {charEngine.getDowntimes(localCharacter)?.dt2.name}
                </div>
                <div className="text-xs">
                  {charEngine.getDowntimes(localCharacter)?.dt2.description}
                </div>
              </div>
              <div className="flex flex-col border border-l-4 border-cyan-100 px-2 py-1 space-y-2">
                <div>
                  PFC-3 | {charEngine.getDowntimes(localCharacter)?.dt3.name}
                </div>
                <div className="text-xs">
                  {charEngine.getDowntimes(localCharacter)?.dt3.description}
                </div>
              </div>
            </div>
            {/* Tactics */}
            <div>
              <div className="flex flex-row justify-between mb-2">
                <h3 className="font-bold">Tactics</h3>{" "}
                <button
                  onClick={() => setShowLockedTactics(!showLockedTactics)}
                  className="text-xs border border-cyan-900 px-2 py-1 hover:bg-cyan-950"
                >
                  {showLockedTactics ? "Hide Locked" : "Show Locked"}
                </button>
              </div>
              <div className="space-y-2">
                {charEngine
                  .getSpecialization(localCharacter)
                  .tactics.slice()
                  .sort((a, b) => {
                    const unlockedA = unlockedIds.has(a.id);
                    const unlockedB = unlockedIds.has(b.id);

                    return Number(unlockedB) - Number(unlockedA);
                  })
                  .filter((tactic) => {
                    if (showLockedTactics) return true;

                    return unlockedIds.has(tactic.id);
                  })
                  .map((tactic) => {
                    const unlocked = unlockedIds.has(tactic.id);

                    return (
                      <div
                        key={tactic.id}
                        className={`border p-2 ${
                          unlocked
                            ? "border-cyan-100 border-l-4"
                            : "border-cyan-900 opacity-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{tactic.name}</span>

                          <span
                            className={`text-xs px-2 py-1 ${
                              unlocked
                                ? "bg-cyan-100 text-black"
                                : "border border-cyan-900 text-cyan-100"
                            }`}
                          >
                            {unlocked ? "Unlocked" : "Locked"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300">
                          {tactic.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>

        {/* AIRCRAFT STATE */}
        <div className="border border-cyan-100 p-4 space-y-2">
          <h2 className="text-cyan-300 font-bold">Aircraft</h2>

          <div>Aircraft ID: {localCharacter.aircraft.aircraftId || "None"}</div>

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
    <div className="flex gap-2 items-center mt-2">
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
