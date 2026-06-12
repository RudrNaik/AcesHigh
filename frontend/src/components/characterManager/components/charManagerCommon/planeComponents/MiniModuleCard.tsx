import { useState } from "react";
import { resolveTag, resolveManeuver } from "../../../../common/tagResolver";

interface Module {
  id: string;
  name: string;
  desc: string;

  IntrinsicMod: string | null;
  TypeMod: string | null;
  AddManuID: string | null;

  moduleTags: string[] | null;
  AddTags: string[] | null;

  mods: Record<string, number> | null;

  checkForChars: string | null;
  charChecked: string | null;
}

function ModuleCard(module: Module) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const statMods = Object.entries(module.mods ?? {}) as [string, number][];
  const allTags = [...(module.moduleTags ?? []), ...(module.AddTags ?? [])];

  return (
    <section
      id={module.id}
      className="
        bg-black/20
        border
        border-cyan-100
        border-l-4
        p-6
        font-mono
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-2xl font-bold text-cyan-100">{module.name}</h2>
      </div>

      {/* Description */}
      {module.desc && module.desc !== "n/a" && (
        <p className="text-sm text-cyan-100 whitespace-pre-line">
          {module.desc}
        </p>
      )}

      {/* Stat Mods */}
      {statMods.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-cyan-100 mb-2">MODIFIERS</div>

          <div className="flex flex-wrap gap-2">
            {statMods.map(([stat, value]) => (
              <div
                key={stat}
                className="
                  text-xs
                  px-2 py-1
                  border border-cyan-100/90
                  text-cyan-100
                "
              >
                {stat} {value > 0 ? `+${value}` : value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chars, Type, Tags, and AddManu */}
      <div className="mt-4 space-y-2 text-xs text-cyan-100">

        {module.checkForChars && module.charChecked && (
            <div>
            <span className="font-bold">Checks aircraft name for: </span>{module.charChecked}  @ {module.checkForChars}
          </div>
        )}

        {module.TypeMod && (
          <div>
            <span className="font-bold">Type Modification:</span>{" "}
            {module.TypeMod}
          </div>
        )}

        {module.AddManuID &&
          (() => {
            const manu = resolveManeuver(module.AddManuID);
            if (!manu) return null;
            const isActive = activeTag === manu.id;

            return (
              <div>
                <span className="font-bold">Adds Maneuver:</span>{" "}
                <div className="flex flex-wrap gap-2 mt-2">
                  <div
                    onMouseEnter={() => setActiveTag(manu.id)}
                    onMouseLeave={() => setActiveTag(null)}
                    onClick={() => setActiveTag(isActive ? null : manu.id)}
                    className="
                    relative
                    text-xs
                    px-2 py-1
                    border border-cyan-100/90
                    text-cyan-100
                    cursor-pointer
                    transition
                    hover:bg-cyan-100/10
                  "
                  >
                    {manu.name}

                    {isActive && (
                      <div
                        className="
                        absolute
                        top-full left-0
                        mt-2
                        z-50
                        w-64
                        bg-black/95
                        border border-cyan-100
                        p-3
                        text-xs text-cyan-100
                        whitespace-pre-line
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
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="mt-4">
          <div className="font-bold mb-2 text-xs text-cyan-100">Tags</div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tagId, index) => {
              const tag = resolveTag(tagId);
              if (!tag) return null;

              const isActive = activeTag === tag.id;

              return (
                <div
                  key={`${module.id}-${tag.id}-${index}`}
                  onMouseEnter={() => setActiveTag(tag.id)}
                  onMouseLeave={() => setActiveTag(null)}
                  onClick={() => setActiveTag(isActive ? null : tag.id)}
                  className="
                    relative
                    text-xs
                    px-2 py-1
                    border border-cyan-100/90
                    text-cyan-100
                    cursor-pointer
                    transition
                    hover:bg-cyan-100/10
                  "
                >
                  {tag.name}

                  {isActive && (
                    <div
                      className="
                        absolute
                        top-full left-0
                        mt-2
                        z-50
                        w-64
                        bg-black/95
                        border border-cyan-100
                        p-3
                        text-xs text-cyan-100
                        whitespace-pre-line
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
    </section>
  );
}

export default ModuleCard;
