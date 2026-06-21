import { useState } from "react";
import { resolveTag, resolveManeuver } from "../../../../common/tagResolver";
import type { CharacterData } from "../../../handlers/characterTypes";
import * as planeEngine from "../../../handlers/Engines/planeEngine";

interface UpgradePackageSlotProps {
  character: CharacterData;
  onSelect: (id: string) => void;
}

function UpgradePackageSlot({ character, onSelect }: UpgradePackageSlotProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const availableUpgrades = planeEngine.getUnlockedUpgrades(character);
  const currentPackageId = planeEngine.getUpPackage(character);
  const equipped =
    availableUpgrades.find((u) => u.id === currentPackageId) ?? null;

  const statMods = Object.entries(equipped?.mods ?? {}) as [string, number][];
  const allTags = [
    ...(Array.isArray(equipped?.moduleTags)
      ? equipped.moduleTags
      : equipped?.moduleTags
        ? [equipped.moduleTags]
        : []),
    ...(Array.isArray(equipped?.AddTags)
      ? equipped.AddTags
      : equipped?.AddTags
        ? [equipped.AddTags]
        : []),
  ];

  function handleSelect(upId: string | null) {
    if (!upId) {
      onSelect("")
      return;
    }
    onSelect(upId)
  }

  return (
    <div
      className={`
        border p-4 font-mono space-y-3 transition-all bg-black/20
        ${
          equipped
            ? "border-cyan-100 border-l-4 border-l-cyan-100"
            : "border-cyan-800 border-l-cyan-800 opacity-60 hover:opacity-100"
        }
      `}
    >
      {/* Header + dropdown */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-cyan-100/60 uppercase tracking-widest">
          Upgrade Package
        </span>
        <select
          value={currentPackageId === "n/a" ? "" : currentPackageId}
          onChange={(e) => handleSelect(e.target.value || null)}
          className="select-themed text-xs"
        >
          <option value="">— none —</option>
          {availableUpgrades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Equipped upgrade details */}
      {equipped ? (
        <>
          {equipped.desc && equipped.desc !== "n/a" && (
            <p className="text-sm text-cyan-100 whitespace-pre-line">
              {equipped.desc}
            </p>
          )}

          {statMods.length > 0 && (
            <div>
              <div className="text-xs text-cyan-100/60 mb-1">MODIFIERS</div>
              <div className="flex flex-wrap gap-2">
                {statMods.map(([stat, value]) => (
                  <div
                    key={stat}
                    className="text-xs px-2 py-1 border border-cyan-100/90 text-cyan-100"
                  >
                    {stat} {value > 0 ? `+${value}` : value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {equipped.TypeMod && (
            <div className="text-xs text-cyan-100">
              <span className="font-bold">Restricted to type: </span>
              {equipped.TypeMod}
            </div>
          )}

          {equipped.checkForChars && equipped.charChecked && (
            <div className="text-xs text-cyan-100">
              <span className="font-bold">Checks aircraft designation for: </span>
              {equipped.charChecked} @ {equipped.checkForChars}
            </div>
          )}

          {equipped.AddManuID &&
            (() => {
              const manu = resolveManeuver(equipped.AddManuID);
              if (!manu) return null;
              const isActive = activeTag === manu.id;
              return (
                <div className="text-xs text-cyan-100">
                  <span className="font-bold">Adds Maneuver:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <div
                      onMouseEnter={() => setActiveTag(manu.id)}
                      onMouseLeave={() => setActiveTag(null)}
                      onClick={() => setActiveTag(isActive ? null : manu.id)}
                      className="
                        relative px-2 py-1
                        border border-cyan-100/90 text-cyan-100
                        cursor-pointer transition hover:bg-cyan-100/10
                      "
                    >
                      {manu.name}
                      {isActive && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-black/95 border border-cyan-100 p-3 text-xs text-cyan-100 whitespace-pre-line">
                          {manu.desc}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          {allTags.length > 0 && (
            <div>
              <div className="text-xs text-cyan-100/60 mb-1">TAGS</div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tagId, index) => {
                  const tag = resolveTag(tagId);
                  if (!tag) return null;
                  const isActive = activeTag === tag.id;
                  return (
                    <div
                      key={`${equipped.id}-${tag.id}-${index}`}
                      onMouseEnter={() => setActiveTag(tag.id)}
                      onMouseLeave={() => setActiveTag(null)}
                      onClick={() => setActiveTag(isActive ? null : tag.id)}
                      className="
                        relative text-xs px-2 py-1
                        border border-cyan-100/90 text-cyan-100
                        cursor-pointer transition hover:bg-cyan-100/10
                      "
                    >
                      {tag.name}
                      {isActive && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-black/95 border border-cyan-100 p-3 text-xs text-cyan-100 whitespace-pre-line">
                          {tag.desc}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-cyan-100/30 italic">No upgrade package equipped.</p>
      )}
    </div>
  );
}

export default UpgradePackageSlot;