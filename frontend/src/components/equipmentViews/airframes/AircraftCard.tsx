import type { ReactNode } from "react";
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

function AircraftCard(aircraft: AircraftCardProps) {
  const stats = Object.entries(aircraft?.stats ?? {}) as [string, ReactNode][];

  const tags = Array.isArray(aircraft.tags)
    ? aircraft.tags
    : aircraft.tags
      ? [aircraft.tags]
      : [];

  const familyData = families.find((family) => family.id === aircraft.family);

  const intrinsicData = intrinsics.find(
    (intrinsic) => intrinsic.id === aircraft.intrinsic,
  );

  const tagData = tags.map((tagId) => tagsData.find((tag) => tag.id === tagId));

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
                  transition
                  cursor-pointer"
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
            {tagData.map((tagData, index) => (
              <div
                key={index}
                className="
                  text-xs
                  px-2 py-1
                  border border-cyan-100/90
                 text-cyan-100
                  transition
                  cursor-pointer
                "
              >
                {tagData?.name ?? "UNKNOWN TAG"}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default AircraftCard;
