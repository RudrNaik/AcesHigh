import type {
  CharacterData,
  CharacterStats,
  Coin,
} from "../../../handlers/characterTypes";
import { useEffect, useState, useRef } from "react";
import * as charEngine from "../../../handlers/Engines/characterEngine";
import * as tourEngine from "../../../handlers/Engines/tourEngine";

function PilotView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const pilotStats = charEngine.getTempPilotStats(character);
  const maxStats = charEngine.getPilotStatsModified(character);

  const [showOverrides, setShowOverrides] = useState(true);

  const statDefs = [
    { key: "temper", label: "Temper", modKey: "temperOverride" },
    { key: "nerve", label: "Nerve", modKey: "nerveOverride" },
    { key: "reflex", label: "Reflex", modKey: "reflexOverride" },
    { key: "gResist", label: "G-Resist", modKey: "gResistOverride" },
  ] as const;

  const overrideDefs = [
    { key: "temperOverride", label: "Temper" },
    { key: "nerveOverride", label: "Nerve" },
    { key: "reflexOverride", label: "Reflex" },
    { key: "gResistOverride", label: "G-Resist" },
  ] as const;

  const updateStat = (statKey: keyof CharacterStats, delta: number) => {
    const current = charEngine.getTempPilotStats(character);
    const max = charEngine.getPilotStatsModified(character);

    const updatedStats = {
      ...current,
      [statKey]: Math.max(
        0,
        Math.min(max[statKey] || 0, (current[statKey] || 0) + delta),
      ),
    };

    updateCharacter(charEngine.setTempPilotStats(character, updatedStats));
  };

  const updateOverrideStat = (statKey: keyof CharacterStats, delta: number) => {
    const overrides = charEngine.getPilotStatOverrides(character);

    const current = overrides[statKey] ?? 0;

    const updated = charEngine.setPilotStatOverride(
      character,
      statKey,
      current + delta,
    );

    updateCharacter(updated);
  };

  const stress = charEngine.getTempStress(character);

  useEffect(() => {
    //console.log("PilotView received character stress:", character.stress);
  }, [character]);

  const updateStress = (key: "mental" | "physical", delta: number) => {
    const current = charEngine.getTempStress(character);
    const max =
      key === "mental"
        ? charEngine.getMentalStress(character)
        : charEngine.getPhysStress(character);

    const updated = {
      ...current,
      [key]: Math.max(0, Math.min(max, current[key] + delta)),
    };

    updateCharacter(charEngine.setTempStress(character, updated));
  };

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
    <div className="border border-cyan-800 lg:p-4 p-2 space-y-2 bg-black/20">
      {/* Pilot Stats */}
      <h2 className="text-cyan-300 font-bold">Pilot Stats</h2>
      <div className="flex md:space-x-20 lg:flex-row flex-col">
        <div>
          <button
            onClick={() => setShowOverrides(!showOverrides)}
            className="text-xs border border-cyan-900 px-2 py-1 hover:bg-cyan-950"
          >
            {showOverrides ? "Modifiers" : "Actual"}
          </button>
          {showOverrides ? (
            <div>
              {statDefs.map((stat) => (
                <PilotStat
                  key={stat.key}
                  label={stat.label}
                  value={pilotStats[stat.key]}
                  maxValue={maxStats[stat.key]}
                  mod={character.stats[stat.modKey] ?? 0}
                  onChange={(delta) => updateStat(stat.key, delta)}
                />
              ))}
            </div>
          ) : (
            <div>
              {overrideDefs.map((stat) => {
                const baseKey = stat.key.replace(
                  "Override",
                  "",
                ) as keyof CharacterStats;

                const value =
                  charEngine.getPilotStatOverrides(character)[baseKey] ?? 0;

                return (
                  <PilotStat
                    key={stat.key}
                    label={stat.label}
                    value={value}
                    maxValue={null}
                    onChange={(delta) => updateOverrideStat(baseKey, delta)}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="p-4">
          <CoinStats
            coins={character.coins}
            canPhoenix={tourEngine.canUsePhoenix(character)}
            onUse={(i) => updateCharacter(charEngine.setUsedCoin(character, i))}
            onReset={(i) =>
              updateCharacter(charEngine.resetUsedCoin(character, i))
            }
            onBurn={(i) => updateCharacter(charEngine.burnCoin(character, i))}
            onPhoenix={(i) => {
              const tourIndex = character.tours.findIndex(
                (t) =>
                  tourEngine.isPhoenixTour(t) &&
                  tourEngine.isTourComplete(t) &&
                  !t.pheonix,
              );
              if (tourIndex === -1) return;
              let updated = tourEngine.markPhoenixUsed(character, tourIndex);
              updated = charEngine.pheonixCoin(updated, i);
              updateCharacter(updated);
            }}
          />
        </div>
      </div>
      {/* Stress */}
      <div>
        <h2 className="text-cyan-300 font-bold border-t-2 pt-2 border-cyan-100">
          Stress
        </h2>
        {/* Mental */}
        <div className="py-2">
          <div className="flex gap-2 items-center">
            <span className="w-24 border border-cyan-100 px-2 py-1 bg-black/20">
              Mental
            </span>

            <div className="w-8 text-center text-cyan-400">
              {stress.mental}/
              <span className="text-cyan-100">
                {charEngine.getMentalStress(character)}
              </span>
            </div>

            <button
              onClick={() => updateStress("mental", -1)}
              disabled={stress.mental <= 0}
              className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
            >
              -
            </button>

            <button
              onClick={() => updateStress("mental", 1)}
              disabled={stress.mental >= charEngine.getMentalStress(character)}
              className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
            >
              +
            </button>

            <button
              onClick={() => {
                const afterBreak = charEngine.mindBreak(character);
                const withStressReset = charEngine.setTempStress(afterBreak, {
                  ...charEngine.getTempStress(afterBreak),
                  mental: 0,
                });
                updateCharacter(withStressReset);
              }}
              disabled={stress.mental < charEngine.getMentalStress(character)}
              hidden={stress.mental < charEngine.getMentalStress(character) - 1}
              className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
            >
              BREAK
            </button>
          </div>
        </div>
        {/* Physical */}
        <div>
          <div className="flex gap-2 items-center">
            <span className="w-24 border border-cyan-100 px-2 py-1 bg-black/20">
              Physical
            </span>

            <div className="w-8 text-center text-cyan-400">
              {stress.physical}/
              <span className="text-cyan-100">
                {charEngine.getPhysStress(character)}
              </span>
            </div>

            <button
              onClick={() => updateStress("physical", -1)}
              disabled={stress.physical <= 0}
              className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
            >
              -
            </button>

            <button
              onClick={() => updateStress("physical", 1)}
              disabled={stress.physical >= charEngine.getPhysStress(character)}
              className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
            >
              +
            </button>
            <button
              onClick={() => {
                const afterDrained = charEngine.Drained(character);
                const withStressReset = charEngine.setTempStress(afterDrained, {
                  ...charEngine.getTempStress(afterDrained),
                  physical: 0,
                });
                updateCharacter(withStressReset);
              }}
              disabled={stress.physical < charEngine.getPhysStress(character)}
              hidden={stress.physical < charEngine.getPhysStress(character) - 1}
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
          <div className="border p-3 bg-black/20 text-sm opacity-80 space-y-2">
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
          <div className="flex flex-col bg-black/20 border border-l-4 border-cyan-100 px-2 py-1 space-y-2 mb-2">
            <div className="font-semibold">
              PFC-1 | {charEngine.getDowntimes(character)?.dt1.name}
            </div>
            <div className="text-xs">
              {charEngine.getDowntimes(character)?.dt1.description}
            </div>
          </div>
          <div className="flex flex-col bg-black/20 border border-l-4 border-cyan-100 px-2 py-1 space-y-2 mb-2">
            <div className="font-semibold">
              PFC-2 | {charEngine.getDowntimes(character)?.dt2.name}
            </div>
            <div className="text-xs">
              {charEngine.getDowntimes(character)?.dt2.description}
            </div>
          </div>
          <div className="flex flex-col bg-black/20 border border-l-4 border-cyan-100 px-2 py-1 space-y-2">
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
                    className={`border p-2 bg-black/20 ${
                      unlocked
                        ? "border-cyan-100 border-l-4"
                        : "border-cyan-900"
                    }
                        ${!unlocked && !canPick ? "opacity-50" : ""}
                        `}
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
                  className={`border p-2 bg-black/20 ${
                    item.converted
                      ? "border-yellow-400 border-l-4"
                      : item.completed
                        ? "border-cyan-100 border-l-4"
                        : "border-cyan-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 ">
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
                    className="text-xs px-2 py-1 mr-1 border border-cyan-400"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => {
                      let updated = charEngine.convertAdvancementToPerk(
                        character,
                        item.index,
                      );

                      updated = tourEngine.sanitizeTours(updated);

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
          <h3 className="font-bold border-t-2 py-2 border-cyan-100">Mastery</h3>

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

                  <p className="text-sm text-gray-300">{mastery.description}</p>
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
                    className="border border-cyan-100 p-2 bg-black/20"
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
            <div className="border border-cyan-900 p-2 opacity-60 bg-black/20">
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
  );
}

export default PilotView;

function PilotStat({
  label,
  value,
  maxValue,
  mod,
  onChange,
}: {
  label: string;
  value: number;
  maxValue: number | null;
  mod?: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex gap-2 items-center mt-2">
      <span className="w-25 border border-cyan-100 px-2 py-1 bg-black/20">
        {label}
      </span>

      <div className="w-8 text-center">{value}</div>

      <button
        onClick={() => onChange(-1)}
        disabled={value <= (!maxValue ? -100 : 0)}
        className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
      >
        -
      </button>

      <button
        onClick={() => onChange(1)}
        disabled={value >= (!maxValue ? 100 : maxValue)}
        className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
      >
        +
      </button>

      {!maxValue ? (
        <div className="text-xs text-cyan-300">Mod: {value}</div>
      ) : (
        <div className="text-xs text-cyan-300">
          Base:{maxValue} <br /> Mod:{mod}
        </div>
      )}
    </div>
  );
}

function CoinStats({
  coins,
  canPhoenix,
  onUse,
  onReset,
  onBurn,
  onPhoenix,
}: {
  coins: Coin[];
  canPhoenix: boolean;
  onUse: (index: number) => void;
  onReset: (index: number) => void;
  onBurn: (index: number) => void;
  onPhoenix: (index: number) => void;
}) {
  const [confirmBurn, setConfirmBurn] = useState<number | null>(null);
  const [confirmPhoenix, setConfirmPhoenix] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setConfirmBurn(null);
        setConfirmPhoenix(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-3 gap-4">
      {coins.map((coin, index) => {
        const classes = coin.burned
          ? "bg-red-900 border-red-500"
          : coin.used
            ? "border-cyan-800"
            : "bg-black/20 border-cyan-100";

        return (
          <div
            key={index}
            className="border max-w-sm border-cyan-800 bg-black/20 p-3 flex flex-col items-center"
          >
            <div
              className={`w-14 h-14 transition-all rounded-full border-2 flex items-center justify-center font-bold mb-2 ${classes}`}
            >
              {index + 1}
            </div>

            {!coin.burned && (
              <div className="flex flex-col gap-1 w-full">
                {coin.used ? (
                  <button
                    onClick={() => onReset(index)}
                    className="border border-cyan-100 px-2 py-1 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
                  >
                    Reset
                  </button>
                ) : (
                  <button
                    onClick={() => onUse(index)}
                    className="border border-cyan-100 px-2 py-1 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
                  >
                    Spend
                  </button>
                )}

                {confirmBurn === index ? (
                  <button
                    onClick={() => {
                      onBurn(index);
                      setConfirmBurn(null);
                    }}
                    className="border border-red-800 px-2 py-1 text-xs text-red-100 transition hover:bg-red-800"
                  >
                    CNFRM
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmBurn(index)}
                    className="border border-red-800 px-2 py-1 text-xs text-red-300 transition hover:bg-red-900/30"
                  >
                    Burn
                  </button>
                )}
              </div>
            )}

            {coin.burned && (
              <div className="flex flex-col gap-1 w-full items-center">
                <div className="text-xs text-red-400 font-bold px-2 py-1">
                  BURNED
                </div>

                {canPhoenix &&
                  (confirmPhoenix === index ? (
                    <button
                      onClick={() => {
                        onPhoenix(index);
                        setConfirmPhoenix(null);
                      }}
                      className="border text-cyan-100 border-cyan-400 bg-cyan-950 px-2 py-1 text-xs w-full"
                    >
                      CNFRM
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmPhoenix(index)}
                      className="border border-cyan-800 text-cyan-500 px-2 py-1 text-xs w-full"
                    >
                      PHNX
                    </button>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
