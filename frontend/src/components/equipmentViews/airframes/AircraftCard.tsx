import type { ReactNode } from "react";
import { useState } from "react";
import intrinsics from "../../../data/IntrinsicList.json";
import tagsData from "../../../data/AircraftTags.json";
import families from "../../../data/AircraftFamilies.json";

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

function getAircraftTagValue(tagId: string, count: number) {
  switch (tagId) {
    case "acMCREW":
      return count * 2;

    default:
      return count;
  }
}

function AircraftCard(aircraft: AircraftCardProps) {
  const stats = Object.entries(aircraft?.stats ?? {}) as [string, ReactNode][];
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const tags = Array.isArray(aircraft.tags)
    ? aircraft.tags
    : aircraft.tags
      ? [aircraft.tags]
      : [];

  const familyData = families.find((family) => family.id === aircraft.family);

  const intrinsicData = intrinsics.find(
    (intrinsic) => intrinsic.id === aircraft.intrinsic,
  );

  const tagCounts = (tags ?? []).reduce(
    (acc, tagId) => {
      acc[tagId] = (acc[tagId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tagEntries = Object.entries(tagCounts);

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
        font-mono
      "
    >
      {/* Title and Misc Info */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">{aircraft.name}</h2>
        </div>

        <div
          className="
            text-xs text-cyan-100
          "
        >
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

      {/* Module Slots */}
      <div className="text-xs text-cyan-100">
        <div>
          <span className="">Module Slots:</span> {aircraft.moduleSlots}
        </div>
      </div>

      {/* Intrinsic */}
      <div className="text-xs text-cyan-100 space-y-1 mt-1">
        <div>Intrinsic:</div>
        <div
          className="text-xs
                  px-2 py-1
                  border border-cyan-100/90
                  text-cyan-100
                  transition"
        >
          <span className="font-bold text-sm">
            {intrinsicData?.name ?? aircraft.intrinsic}:
          </span>{" "}
          <br></br> {intrinsicData?.desc ?? aircraft.intrinsic}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-2">
          <div className="text-xs tracking-wide text-cyan-100 mb-1">Tags:</div>
          <div className="flex flex-wrap gap-2">
            {tagEntries.length > 0 && (
              <div className="mt-2">
                <div className="text-xs tracking-wide text-cyan-100 mb-1">
                  Tags:
                </div>

                <div className="flex flex-wrap gap-2">
                  {tagEntries.map(([tagId, count]) => {
                    const tag = tagsData.find((t) => t.id === tagId);
                    if (!tag) return null;

                    const isActive = activeTag === tag.id;

                    const scaledValue = getAircraftTagValue(tag.id, count);

                    const label =
                      scaledValue > 1
                        ? `${tag.name} x${scaledValue}`
                        : tag.name;

                    const tooltip = tag.desc.includes("[x]")
                      ? tag.desc.replace(/\[x\]/g, `${scaledValue}`)
                      : scaledValue > 1
                        ? `${tag.desc} x${scaledValue}`
                        : tag.desc;

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
                            absolute
                            z-50
                            left-0
                            top-full
                            mt-2
                            w-64
                          bg-black/90
                            border border-cyan-100
                            p-3
                            text-xs text-cyan-100
                            shadow-lg
                            whitespace-pre-line
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
          </div>
        </div>
      )}
    </section>
  );
}

export default AircraftCard;
