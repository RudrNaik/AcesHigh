import type { CharacterData } from "../handlers/characterTypes";
import { useEffect, useState } from "react";
import * as charEngine from "../handlers/characterEngine";

type PilotStatsType = {
  temper: number;
  nerve: number;
  reflex: number;
  gResist: number;
};

function SortieView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const [pilotStats, setPilotStats] = useState(
    charEngine.getPilotStatsModified(character),
  );

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
  }, [character]);

  const [stress, setStress] = useState({ mental: 0, physical: 0 });

  const statDefs = [
    { key: "temper", label: "Temper" },
    { key: "nerve", label: "Nerve" },
    { key: "reflex", label: "Reflex" },
    { key: "gResist", label: "G-Resist" },
  ] as const;

  const [showLockedTactics, setShowLockedTactics] = useState(true);
  const currentTactics = charEngine.getCurrentTactics(character);
  const unlockedIds = new Set(currentTactics);

  const [showCompletedAdvancements, setShowCompletedAdvancements] =
    useState(true);
  const advancements = charEngine.getAdvancements(character);
  const completedAdvancements = new Set(
    advancements.fromChar.map((a) => a.index),
  );
  const advancementState = new Map(
    advancements.fromChar.map((a) => [a.index, a]),
  );

  const applyCharacterUpdate = (updated: CharacterData) => {
    updateCharacter(updated);
  };

  return (
    <div className="w-full min-h-screen text-cyan-100 space-y-6">
      {/* HEADER */}
      <div className="border border-cyan-100 lg:p-4">
        <h1 className="text-2xl font-bold">SORTIE</h1>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PILOT */}
        <div className="border border-cyan-100 lg:p-4 px-2 space-y-2">
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
                    setStress({ mental: 0, physical: stress.physical });
                  }}
                  disabled={
                    stress.mental < charEngine.getMentalStress(character)
                  }
                  hidden={
                    stress.mental < charEngine.getMentalStress(character) - 1
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
                    setStress({ mental: stress.mental, physical: 0 });
                  }}
                  disabled={
                    stress.physical < charEngine.getPhysStress(character)
                  }
                  hidden={
                    stress.physical < charEngine.getPhysStress(character) - 1
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
              {charEngine.getSpecialization(character).name}
            </h1>

            {/* Preflights */}
            <div className="">
              <h3 className="font-bold py-2">Preflights</h3>
              <div className="flex flex-col border border-l-4 border-cyan-100 px-2 py-1 space-y-2 mb-2">
                <div className="font-semibold">
                  PFC-1 | {charEngine.getDowntimes(character)?.dt1.name}
                </div>
                <div className="text-xs">
                  {charEngine.getDowntimes(character)?.dt1.description}
                </div>
              </div>
              <div className="flex flex-col border border-l-4 border-cyan-100 px-2 py-1 space-y-2 mb-2">
                <div className="font-semibold">
                  PFC-2 | {charEngine.getDowntimes(character)?.dt2.name}
                </div>
                <div className="text-xs">
                  {charEngine.getDowntimes(character)?.dt2.description}
                </div>
              </div>
              <div className="flex flex-col border border-l-4 border-cyan-100 px-2 py-1 space-y-2">
                <div className="font-semibold">
                  PFC-3 | {charEngine.getDowntimes(character)?.dt3.name}
                </div>
                <div className="text-xs">
                  {charEngine.getDowntimes(character)?.dt3.description}
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
                  .getSpecialization(character)
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
                    const canPick = charEngine.canPickTactic(character);
                    const alreadyOwned = unlockedIds.has(tactic.id);

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
                            {unlocked ? "UNLK" : "LOCK"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-300">
                          {tactic.description}
                        </p>

                        {canPick && !alreadyOwned && (
                          <button
                            onClick={() =>
                              charEngine.addTacticToSpecialization(
                                character,
                                tactic.id,
                                updateCharacter,
                              )
                            }
                            className="text-xs px-2 py-1 border border-cyan-900 hover:border-cyan-100 hover:text-cyan-900 hover:bg-cyan-50"
                          >
                            SELECT
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Advancements */}
            <div>
              <div className="flex flex-row justify-between mb-2">
                <h3 className="font-bold">Advancements</h3>

                <button
                  onClick={() =>
                    setShowCompletedAdvancements(!showCompletedAdvancements)
                  }
                  className="text-xs border border-cyan-900 px-2 py-1 hover:bg-cyan-950"
                >
                  {showCompletedAdvancements
                    ? `Hide Completed`
                    : `Show Completed [${completedAdvancements.size}]`}
                </button>
              </div>

              <div className="space-y-2">
                {advancements.fromSpec
                  .map((text, index) => {
                    const state = advancementState.get(index);

                    return {
                      text,
                      index,
                      completed: !!state,
                      converted: state?.perkConversion ?? false,
                    };
                  })
                  .sort((a, b) => Number(b.completed) - Number(a.completed))
                  .filter((item) => {
                    if (showCompletedAdvancements) return true;
                    return !item.completed;
                  })
                  .map((item) => (
                    <div
                      key={item.index}
                      className={`border p-2 ${
                        item.converted
                          ? "border-yellow-400 border-l-4"
                          : item.completed
                            ? "border-cyan-100 border-l-4"
                            : "border-cyan-900 opacity-60"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span>{item.text}</span>

                        <span
                          className={`text-xs px-2 py-1 whitespace-nowrap ${
                            item.converted
                              ? "bg-yellow-400 text-black"
                              : item.completed
                                ? "bg-cyan-100 text-black"
                                : "border border-cyan-900 text-cyan-100"
                          }`}
                        >
                          {item.converted
                            ? "Perk"
                            : item.completed
                              ? "Complete"
                              : "Incomplete"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = charEngine.toggleAdvancement(
                            character,
                            item.index,
                          );

                          applyCharacterUpdate(updated);
                        }}
                        className="text-xs px-2 py-1 border border-cyan-400"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => {
                          const updated = charEngine.convertAdvancementToPerk(
                            character,
                            item.index,
                          );

                          applyCharacterUpdate(updated);
                        }}
                        className="text-xs px-2 py-1 border border-yellow-400"
                      >
                        Convert
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Masteries */}
            <div>
              <h3 className="font-bold border-t-2 py-2 border-cyan-100">
                Mastery
              </h3>

              {character.specialization.mastery ? (
                (() => {
                  const mastery = charEngine
                    .getSpecialization(character)
                    .masteries.find(
                      (m) => m.id === character.specialization.mastery,
                    );

                  if (!mastery) return null;

                  return (
                    <div className="border border-yellow-400 border-l-4 p-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{mastery.name}</span>

                        <span className="bg-yellow-400 text-black text-xs px-2 py-1">
                          MASTERY
                        </span>
                      </div>

                      <p className="text-sm text-gray-300">
                        {mastery.description}
                      </p>
                    </div>
                  );
                })()
              ) : charEngine.canSelectMastery(character) ? (
                <div className="space-y-2">
                  {charEngine
                    .getSpecialization(character)
                    .masteries.map((mastery) => (
                      <div
                        key={mastery.id}
                        className="border border-cyan-100 p-2"
                      >
                        <div className="font-semibold">{mastery.name}</div>

                        <p className="text-sm text-gray-300">
                          {mastery.description}
                        </p>

                        <button
                          onClick={() => {
                            const updated = charEngine.selectMastery(
                              character,
                              mastery.id,
                            );

                            applyCharacterUpdate(updated);
                          }}
                          className="mt-2 text-xs px-2 py-1 border border-cyan-400"
                        >
                          SELECT
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="border border-cyan-900 p-2 opacity-60">
                  Unlock all tactics in your specialization to gain access to
                  mastery.
                  <div className="text-xs mt-1">
                    Progress: {character.specialization.tactics.length}/
                    {charEngine.getSpecialization(character).tactics.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AIRCRAFT STATE */}
        <div className="border border-cyan-100 lg:p-4 px-2 space-y-2">
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
