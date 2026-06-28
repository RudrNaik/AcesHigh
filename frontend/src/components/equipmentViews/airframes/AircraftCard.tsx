import type { ReactNode } from "react";
import { useState } from "react";
import intrinsics from "../../../data/IntrinsicList.json";
import families from "../../../data/AircraftFamilies.json";
import {
  resolveTag,
  getTagValue,
  formatTagTooltip,
} from "../../common/tagResolver";

interface AircraftCardProps {
  id: string;
  name: string;
  type: string;
  family: string;
  gen: string | number;
  tier: string | number;
  stats?: Record<string, ReactNode>;
  tags?: string | string[];
  moduleSlots?: string | number;
  desc?: string;
  intrinsic?: string;
}

function AircraftCard(aircraft: AircraftCardProps) {
  const stats = Object.entries(aircraft?.stats ?? {}) as [string, ReactNode][];

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = Array.isArray(aircraft.tags)
    ? aircraft.tags
    : aircraft.tags
      ? [aircraft.tags]
      : [];

  const tagCounts = tags.reduce(
    (acc, tagId) => {
      acc[tagId] = (acc[tagId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tagEntries = Object.entries(tagCounts);
  const familyData = families.find((family) => family.id === aircraft.family);
  const intrinsicData = intrinsics.find(
    (intrinsic) => intrinsic.id === aircraft.intrinsic,
  );

  return (
    <section
      id={aircraft.id}
      className="
        bg-black/20
        border
        border-cyan-100
        p-6
        border-l-4
        transition-all
        duration-100
         
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-bold text-cyan-100">{aircraft.name}</h2>

        <div className="text-xs text-cyan-100">
          {aircraft.type} // {familyData?.name ?? aircraft.family} // GEN{" "}
          {aircraft.gen} // Tier {aircraft.tier}
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-4">
        {stats.map(([stat, value]) => (
          <div
            key={stat}
            className="
              text-xs
              border border-cyan-100/90
              px-3 py-2
            "
          >
            <span className="text-cyan-100">{stat}</span>
            <span className="ml-2 text-cyan-100 font-semibold">{value}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      {aircraft.desc && aircraft.desc !== "n/a" && (
        <p className="text-sm text-cyan-100 whitespace-pre-line mb-2">
          {aircraft.desc}
        </p>
      )}

      {/* Mod Slots */}
      <div className="text-xs text-cyan-100">
        <div>
          <span>Module Slots:</span> {aircraft.moduleSlots}
        </div>
      </div>

      {/* Intrinsic */}
      <div className="text-xs text-cyan-100 space-y-1 mt-1">
        <div>Intrinsic:</div>
        <div
          className="
            text-xs
            px-2 py-1
            border border-cyan-100/90
            text-cyan-100
            transition
            cursor-pointer
          "
        >
          <span className="font-bold text-sm">
            {intrinsicData?.name ?? aircraft.intrinsic}:
          </span>
          <br />
          {intrinsicData?.desc ?? aircraft.intrinsic}
        </div>
      </div>

      {/* Tags */}
      {tagEntries.length > 0 && (
        <div className="mt-2">
          <div className="text-xs tracking-wide text-cyan-100 mb-1">Tags:</div>

          <div className="flex flex-wrap gap-2">
            {tagEntries.map(([tagId, count]) => {
              const tag = resolveTag(tagId);
              if (!tag) return null;

              const isActive = activeTag === tag.id;
              const value = getTagValue(tag.id, count);
              const showValue = value > 1;
              const label = showValue ? `${tag.name} x${value}` : tag.name;
              const tooltip = formatTagTooltip(tag.desc, value);

              return (
                <div
                  key={`${aircraft.id}-${tag.id}`}
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
                  {/* Label */}
                  <span>{label}</span>

                  {/* Tooltip */}
                  {isActive && (
                    <div
                      className="
                        absolute z-50 left-0 top-full mt-2 w-64
                        bg-black/90 border border-cyan-100
                        p-3 text-xs text-cyan-100
                        shadow-lg whitespace-pre-line
                      "
                    >
                      {tooltip}
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

export default AircraftCard;
