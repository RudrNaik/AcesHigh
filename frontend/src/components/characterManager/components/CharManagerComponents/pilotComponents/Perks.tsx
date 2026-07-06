import { useMemo } from "react";
import type { CharacterData } from "../../../handlers/characterTypes";

import * as characterEngine from "../../../handlers/Engines/characterEngine";
import * as tourEngine from "../../../handlers/Engines/tourEngine";

function PerksView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const allPerks = useMemo(() => tourEngine.getAllPerks(), []);

  const unlockedGenesisPerks = useMemo(
    () => tourEngine.getUnlockedGenesisPerks(character),
    [character],
  );

  const allBasePerks = useMemo(
    () => allPerks.filter((p) => p.type === "basePerk"),
    [allPerks],
  );

  const totalConversions = useMemo(
    () => tourEngine.getTotalBasePerkConversionCount(character),
    [character],
  );

  function getPerkByID(id: string) {
    return allPerks.find((p) => p.id === id) ?? null;
  }

  function getGenesisOptions(slot: number) {
    const current = character.baseperks[slot] ?? "";

    const nonGenesisUsed = character.baseperks.filter((id, i) => {
      if (i === slot) return false;
      return id && !unlockedGenesisPerks.includes(id);
    }).length;

    const canPickNonGenesis = totalConversions - nonGenesisUsed > 0;

    return allBasePerks.filter((perk) => {
      if (perk.id === current) return true;
      
      // Check if perk has perkStack tag - these can be selected multiple times
      const isStackable = perk.tags && perk.tags.includes("perkStackable");
      
      // If already used and not stackable, don't allow it
      if (character.baseperks.includes(perk.id) && !isStackable) return false;
      
      if (unlockedGenesisPerks.includes(perk.id)) return true;
      return canPickNonGenesis;
    });
  }

  function updateGenesisSlot(slot: number, perkID: string) {
    updateCharacter(characterEngine.setBasePerk(character, slot, perkID));
  }

  function updateTourAcePerk(
    tourIndex: number,
    perkID: string,
    choice: string = "",
  ) {
    updateCharacter(
      tourEngine.setTourAcePerk(character, tourIndex, perkID, choice),
    );
  }

  function updateAceConversion(tourIndex: number, toBase: boolean) {
    updateCharacter(
      tourEngine.convertTourAcePerk(character, tourIndex, toBase),
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Ace */}
      <section>
        <div className="border border-cyan-800 lg:p-4 p-2 space-y-3 h-full bg-black/20">
          <h2 className="text-lg font-bold text-cyan-300 mb-2">Ace Perks</h2>

          {character.tours.length === 0 && (
            <div className="text-xs opacity-50">
              Complete a Tour to gain your first Ace Perk.
            </div>
          )}

          {character.tours.map((tour, tourIndex) => {
            const eligible = tourEngine.canSelectAcePerk(tour);
            const isConverted = tourEngine.isTourAcePerkConverted(tour);
            const isPheonixed = tourEngine.isPhoenixTour(tour) && tourEngine.isTourComplete(tour) && tour.pheonix
            const selection = tourEngine.getTourAcePerkSelection(tour);
            const tourData = tourEngine.getTourById(tour.currTourID);
            const options =
              eligible && !isConverted
                ? tourEngine.getAvailableAcePerkOptions(character, tourIndex)
                : [];
            const selectedPerk = getPerkByID(selection.perkID);

            return (
              <div
                key={tourIndex}
                className={`border transition-all p-2 hover:opacity-100 ${
                  isPheonixed
                  ? "hidden"
                  : !eligible 
                    ? "opacity-20 border-cyan-800"
                    : isConverted
                      ? "opacity-100 border-l-4 border-cyan-400"
                      : selection.perkID
                        ? "opacity-100 border-l-4 border-cyan-100"
                        : "opacity-60 border-cyan-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-cyan-400">
                    Tour {tourIndex + 1}
                    {tourData.tourName !== "missing"
                      ? `: ${tourData.tourName}`
                      : ""}
                  </div>

                  {/* Ace / Base toggle*/}
                  {eligible && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateAceConversion(tourIndex, false)}
                        className={`px-2 py-0.5 border text-xs transition-all ${
                          !isConverted
                            ? "border-cyan-300 text-cyan-100 bg-cyan-900"
                            : "border-cyan-800 text-cyan-600"
                        }`}
                      >
                        Ace
                      </button>
                      <button
                        onClick={() => updateAceConversion(tourIndex, true)}
                        className={`px-2 py-0.5 border text-xs transition-all ${
                          isConverted
                            ? "border-cyan-300 text-cyan-100 bg-cyan-900"
                            : "border-cyan-800 text-cyan-600"
                        }`}
                      >
                        Base
                      </button>
                    </div>
                  )}
                </div>

                {(!eligible ) ? (
                  <div className="text-xs opacity-60">
                    Finish this Tour to gain an Ace Perk.
                  </div>
                ) : isConverted ? (
                  <div className="text-xs text-cyan-500 opacity-80">
                    Converted to Base Perk
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={selection.perkID}
                      onChange={(e) =>
                        updateTourAcePerk(tourIndex, e.target.value, "")
                      }
                      className="select-themed text-xs mr-2"
                    >
                      <option value="">Empty Slot</option>
                      {options.map((perk) => (
                        <option key={perk.id} value={perk.id}>
                          {perk.name}
                        </option>
                      ))}
                    </select>

                    {selectedPerk?.choiceType === "pilotStat" && (
                      <select
                        value={selection.choice}
                        onChange={(e) =>
                          updateTourAcePerk(
                            tourIndex,
                            selection.perkID,
                            e.target.value,
                          )
                        }
                        className="select-themed text-xs"
                      >
                        <option value="">Choose a Pilot Stat...</option>
                        {tourEngine.PILOT_STAT_OPTIONS.map((stat) => (
                          <option key={stat.id} value={stat.id}>
                            {stat.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {selectedPerk?.choiceType === "specTactic" &&
                      (() => {
                        const tacticOptions =
                          tourEngine.getAllSpecTacticsNotChar(
                            character.specialization.specId,
                          );
                        const selectedTactic =
                          tacticOptions.find(
                            (t) => t.id === selection.choice,
                          ) ?? null;

                        return (
                          <div className="space-y-1">
                            <select
                              value={selection.choice}
                              onChange={(e) =>
                                updateTourAcePerk(
                                  tourIndex,
                                  selection.perkID,
                                  e.target.value,
                                )
                              }
                              className="select-themed text-xs"
                            >
                              <option value="">Choose a Tactic...</option>
                              {tacticOptions.map((tactic) => (
                                <option key={tactic.id} value={tactic.id}>
                                  [{tactic.specName}] {tactic.name}
                                </option>
                              ))}
                            </select>
                            {selectedTactic && (
                              <div className="text-xs opacity-70">
                                {selectedTactic.description}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    {selectedPerk?.choiceType === "specDT" &&
                      (() => {
                        const dtOptions = tourEngine.getAllSpecDowntimesNotChar(
                          character.specialization.specId,
                        );
                        const selectedDT =
                          dtOptions.find((dt) => dt.id === selection.choice) ??
                          null;

                        return (
                          <div className="space-y-1">
                            <select
                              value={selection.choice}
                              onChange={(e) =>
                                updateTourAcePerk(
                                  tourIndex,
                                  selection.perkID,
                                  e.target.value,
                                )
                              }
                              className="select-themed text-xs"
                            >
                              <option value="">Choose a Downtime...</option>
                              {dtOptions.map((dt) => (
                                <option key={dt.id} value={dt.id}>
                                  {dt.name}
                                </option>
                              ))}
                            </select>
                            {selectedDT && (
                              <div className="text-xs opacity-70">
                                {selectedDT.description}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    {selectedPerk && (
                      <div className="text-xs opacity-70">
                        {selectedPerk.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Base */}
      <section>
        <div className="border border-cyan-800 lg:p-4 p-2 space-y-3 h-full bg-black/20">
          <h2 className="text-lg font-bold text-cyan-300 mb-2">Base Perks</h2>
          {Array.from({ length: 10 }).map((_, slot) => {
            const selectedID = character.baseperks[slot] ?? "";
            const selectedPerk =
              allBasePerks.find((p) => p.id === selectedID) ?? null;
            const isConversionPick =
              selectedID !== "" && !unlockedGenesisPerks.includes(selectedID);
            const options = getGenesisOptions(slot);

            return (
              <div
                key={slot}
                className={`border transition-all p-2 hover:opacity-100 ${
                  selectedID !== ""
                    ? "opacity-100 border-l-4 border-cyan-100"
                    : options.length > 0
                      ? "opacity-100 border-cyan-800"
                      : "opacity-20 border-cyan-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-cyan-400">Slot {slot + 1}</div>
                  {isConversionPick && (
                    <div className="text-xs text-cyan-500 opacity-70">
                      Conversion
                    </div>
                  )}
                </div>

                <select
                  value={selectedID}
                  onChange={(e) => updateGenesisSlot(slot, e.target.value)}
                  className="select-themed text-xs"
                >
                  <option value="">Empty Slot</option>
                  {getGenesisOptions(slot).map((perk) => (
                    <option key={perk.id} value={perk.id}>
                      {perk.name}
                    </option>
                  ))}
                </select>

                {selectedPerk && (
                  <div className="text-xs opacity-70 mt-2">
                    {selectedPerk.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default PerksView;
