import type { CharacterData } from "../../../handlers/characterTypes";
import { useMemo, useState } from "react";

import downtimeData from "../../../../../data/Downtimes.json";

import * as resetEngine from "../../../handlers/Engines/downtimeEngine";

function ResetView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const totalBonusRP = useMemo(
    () => resetEngine.getTotalBonusRP(character),
    [character],
  );

  const [expandedResets, setExpandedResets] = useState<number[]>([
    Math.max(character.resets.length - 1, 0),
  ]);

  const toggleReset = (index: number) => {
    setExpandedResets((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const expandAll = () => {
    setExpandedResets(character.resets.map((_, index) => index));
  };

  const collapseAll = () => {
    setExpandedResets([]);
  };

  const addReset = () => {
    updateCharacter(resetEngine.addReset(character));

    setExpandedResets((prev) => [...prev, character.resets.length]);
  };

  return (
    <div className="space-y-4 tewt-xs">
      {/* Header */}
      <div className="border border-cyan-100 lg:p-4 p-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-100">RESETS</h2>

            <div className="text-xs text-cyan-400">
              Total Gained RP:{" "}
              <span className="text-cyan-100 font-bold">
                {totalBonusRP >= 0 ? "+" : "-"}
                {totalBonusRP}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={expandAll}
              className="border border-cyan-800 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
            >
              Expand All
            </button>

            <button
              onClick={collapseAll}
              className="border border-cyan-800 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
            >
              Collapse All
            </button>

            <button
              onClick={addReset}
              className="border border-cyan-100 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
            >
              Add Reset
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {character.resets.length === 0 && (
        <div className="border border-cyan-800 bg-black/20 p-2 text-center">
          <div className="text-md text-cyan-100">No Resets Recorded</div>
        </div>
      )}

      {/* Reset History */}
      <div className="space-y-4">
        {character.resets.map((reset, resetIndex) => (
          <div key={resetIndex} className="border border-cyan-800 bg-black/20">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-800 px-4 py-3">
              <button
                onClick={() => toggleReset(resetIndex)}
                className="flex items-center gap-2 text-left"
              >
                <span className="text-cyan-100">
                  {expandedResets.includes(resetIndex) ? "▼" : "▶"}
                </span>

                <span className="font-bold text-cyan-100">
                  Reset #{resetIndex + 1}
                </span>

                <span className="text-xs text-cyan-400">
                  ({reset.BonusRp >= 0 ? "+" : ""}
                  {reset.BonusRp} RP)
                </span>
              </button>

              <button
                onClick={() =>
                  updateCharacter(
                    resetEngine.removeReset(character, resetIndex),
                  )
                }
                className="border border-red-800 px-2 py-1 text-xs text-red-300 transition hover:bg-red-900/30"
              >
                Remove
              </button>
            </div>

            {expandedResets.includes(resetIndex) && (
              <div className="space-y-2 p-4">
                <div className="grid gap-2 xl:grid-cols-2">
                  {[0, 1].map((slot) => {
                    const dt = reset.DT[slot];

                    const selectedDowntime = downtimeData.find(
                      (d) => d.id === dt.id,
                    );

                    return (
                      <div
                        key={slot}
                        className="border border-cyan-800 bg-black/20 p-4 hover:border-cyan-100 transition-all"
                      >
                        <div className="mb-2 font-semibold text-cyan-100">
                          Downtime {slot + 1}
                        </div>

                        <label className="mb-1 block text-xs text-cyan-300">
                          Activity
                        </label>

                        <select
                          className="select-themed w-full"
                          value={dt.id}
                          onChange={(e) =>
                            updateCharacter(
                              resetEngine.setDowntime(
                                character,
                                resetIndex,
                                slot as 0 | 1,
                                e.target.value,
                              ),
                            )
                          }
                        >
                          <option value="">Select Downtime</option>

                          {downtimeData.map((downtime) => (
                            <option key={downtime.id} value={downtime.id}>
                              {downtime.name}
                            </option>
                          ))}
                        </select>

                        {selectedDowntime?.description && (
                          <div className="mt-2 border border-cyan-100 bg-black/20 p-2">
                            <div className="text-xs text-cyan-100">
                              {selectedDowntime.description}
                            </div>
                          </div>
                        )}

                        <div className="mt-2">
                          <label className="mb-1 block text-xs text-cyan-300">
                            Notes
                          </label>

                          <textarea
                            rows={2}
                            value={dt.notes}
                            onChange={(e) =>
                              updateCharacter(
                                resetEngine.setDowntimeNotes(
                                  character,
                                  resetIndex,
                                  slot as 0 | 1,
                                  e.target.value,
                                ),
                              )
                            }
                            className="w-full min-h-10 border border-cyan-800 bg-black/20 p-2 text-xs text-cyan-100 outline-none"
                            placeholder="Notes"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border border-cyan-800 bg-black/20 p-4 hover:border-cyan-100 transition-all">
                  <label className="mb-2 block font-semibold text-cyan-100">
                    Bonus RP Adjustment
                  </label>

                  <input
                    type="number"
                    value={reset.BonusRp}
                    onChange={(e) =>
                      updateCharacter(
                        resetEngine.setBonusRP(
                          character,
                          resetIndex,
                          Number(e.target.value),
                        ),
                      )
                    }
                    className="w-full border border-cyan-800 bg-black/20 p-2 text-xs text-cyan-100 outline-none"
                  />

                  <div className="mt-2 text-xs text-cyan-400">
                    Use positive values for RP gains and negative values for RP
                    losses.
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResetView;
