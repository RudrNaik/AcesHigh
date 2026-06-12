import { useState } from "react";
import { resolveTag, resolveManeuver } from "../../../../common/tagResolver";
import {
  getUnlockedModules,
  getModuleSlotCount,
  setModule,
  removeModule,
} from "../../../handlers/planeEngine";
import type { CharacterData } from "../../../handlers/characterTypes";
import type { ModuleDeets as Module } from "../../../handlers/planeEngine";

interface ModuleManagerProps {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}

interface ModuleSlotProps {
  slotIndex: number;
  equippedId: string | null;
  availableModules: Module[];
  onSelect: (modId: string | null) => void;
}

function ModuleSlot({
  slotIndex,
  equippedId,
  availableModules,
  onSelect,
}: ModuleSlotProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const equipped = availableModules.find((m) => m.id === equippedId) ?? null;
  const statMods = Object.entries(equipped?.mods ?? {}) as [string, number][];
  const allTags = [
    ...(equipped?.moduleTags ?? []),
    ...(equipped?.AddTags ?? []),
  ];

  return (
    <div className="border border-cyan-100 border-l-4 border-l-cyan-100 p-4 font-mono space-y-3">
      {/* Slot header + dropdown */}
      <div className="flex justify-between items-center">
        <select
          value={equippedId ?? ""}
          onChange={(e) => onSelect(e.target.value || null)}
          className="
            select-themed text-xs
          "
        >
          <option value="">— empty —</option>
          {availableModules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-cyan-100/60">SLOT {slotIndex + 1}</span>
      </div>

      {/* Equipped module details */}
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
              <span className="font-bold">Type Modification:</span>{" "}
              {equipped.TypeMod}
            </div>
          )}

          {equipped.checkForChars && equipped.charChecked && (
            <div className="text-xs text-cyan-100">
              <span className="font-bold">Checks aircraft name for: </span>
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
                        <div
                          className="
                          absolute top-full left-0 mt-2 z-50 w-64
                          bg-black/95 border border-cyan-100 p-3
                          text-xs text-cyan-100 whitespace-pre-line
                        "
                        >
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
                        <div
                          className="
                          absolute top-full left-0 mt-2 z-50 w-64
                          bg-black/95 border border-cyan-100 p-3
                          text-xs text-cyan-100 whitespace-pre-line
                        "
                        >
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
        <p className="text-xs text-cyan-100/30 italic">No module equipped.</p>
      )}
    </div>
  );
}

function ModuleManager({ character, updateCharacter }: ModuleManagerProps) {
  const unlockedModules = getUnlockedModules(character);
  const equippedModules = character.aircraft.modules ?? [];
  const slotCount = getModuleSlotCount(character);

  const handleSelect = (slotIndex: number, modId: string | null) => {
    // Remove whatever was in this slot before
    const previousId = equippedModules[slotIndex] ?? null;
    let updated = character;

    if (previousId) {
      updated = removeModule(updated, previousId);
    }
    if (modId) {
      updated = setModule(updated, modId);
    }

    updateCharacter(updated);
  };

  // Modules already equipped in OTHER slots are unavailable for this slot
  const getAvailableForSlot = (slotIndex: number) => {
    const otherEquipped = equippedModules.filter((_, i) => i !== slotIndex);
    return unlockedModules.filter((m) => !otherEquipped.includes(m.id));
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-cyan-100/60 font-mono">
        MODULES — {equippedModules.length}/{slotCount} SLOTS USED
      </div>

      {slotCount === 0 ? (
        <p className="text-xs text-cyan-100/30 font-mono italic">
          No module slots available for this aircraft.
        </p>
      ) : (
        Array.from({ length: slotCount }).map((_, i) => (
          <ModuleSlot
            key={i}
            slotIndex={i}
            equippedId={equippedModules[i] ?? null}
            availableModules={getAvailableForSlot(i)}
            onSelect={(modId) => handleSelect(i, modId)}
          />
        ))
      )}
    </div>
  );
}

export default ModuleManager;
