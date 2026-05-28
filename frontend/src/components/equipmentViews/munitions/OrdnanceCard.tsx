import { useState } from "react";
import tagsData from "../../../data/OrdnanceTags.json";

interface OrdnanceCardProps {
  id: string;
  name: string;
  domain: string;
  desc?: string;
  tags?: string[];
}

interface OrdnanceTag {
  id: string;
  name: string;
  desc: string;
}

function getScaledTagValue(tagId: string, count: number) {
  switch (tagId) {
    case "ordMLTI":
      return count * 2;

    default:
      return count;
  }
}

function OrdnanceCard(ordnance: OrdnanceCardProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCounts = (ordnance.tags ?? []).reduce(
    (acc, tagId) => {
      acc[tagId] = (acc[tagId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tagEntries = Object.entries(tagCounts);

  return (
    <section
      id={ordnance.id}
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
        <h2 className="text-2xl font-bold text-cyan-100">{ordnance.name}</h2>

        <div className="text-xs text-cyan-100">{ordnance.domain}</div>
      </div>

      {/* Description */}
      {ordnance.desc && ordnance.desc !== "n/a" && (
        <p className="text-sm text-cyan-100 whitespace-pre-line">
          {ordnance.desc}
        </p>
      )}

      {/* Tags */}
      {tagEntries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tagEntries.map(([tagId, count]) => {
            const tag = (tagsData as OrdnanceTag[]).find((t) => t.id === tagId);

            if (!tag) return null;

            const isActive = activeTag === tag.id;

            const scaledValue = getScaledTagValue(tag.id, count);

            const showMultiplier = scaledValue > 1;

            const label = showMultiplier
              ? `${tag.name} x${scaledValue}`
              : tag.name;

            const tooltipDesc = tag.desc.includes("[x]")
              ? tag.desc.replace(/\[x\]/g, `${scaledValue}`)
              : showMultiplier
                ? `${tag.desc} x${scaledValue}`
                : tag.desc;

            return (
              <div
                key={`${ordnance.id}-${tag.id}`}
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
                {/* Tag Label */}
                <span>{label}</span>

                {/* Tooltip */}
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
                      shadow-lg
                      whitespace-pre-line
                    "
                  >
                    {tooltipDesc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OrdnanceCard;
