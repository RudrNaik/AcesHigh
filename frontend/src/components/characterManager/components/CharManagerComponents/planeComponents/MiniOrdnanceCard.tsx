import { useState } from "react";
import {
  resolveTag,
  formatTagTooltip,
  getTagCountMap,
  getTagValue,
} from "../../../../common/tagResolver";

export interface OrdnanceSelectOption {
  id: string;
  name: string;
  domain: string;
}

interface OrdnanceCardProps {
  id: string;
  name: string;
  domain: string;
  desc?: string;
  tags?: string[];

  ordnanceOptions?: OrdnanceSelectOption[];
  onSelectOrdnance?: (id: string) => void;
}

function OrdnanceCard(ordnance: OrdnanceCardProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCounts = getTagCountMap(ordnance.tags ?? []);
  const tagEntries = Object.entries(tagCounts);

  return (
    <section
      id={ordnance.id}
      className="
        bg-black/20
        border
        border-cyan-100
        p-4 border-l-4
        font-mono
      "
    >
      {/* Header */}
      <div className="flex justify-between">
        <select
          value={ordnance.id}
          onChange={(e) => ordnance.onSelectOrdnance?.(e.target.value)}
          className="select-themed"
        >
          <option value="">Select Ordnance</option>

          {ordnance.ordnanceOptions?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-cyan-400 whitespace-pre-line">
          {ordnance.domain}
        </p>
      </div>

      {/* Description */}
      {ordnance.desc && ordnance.desc !== "n/a" && (
        <p className="text-sm mt-2 text-cyan-100 whitespace-pre-line">
          {ordnance.desc}
        </p>
      )}

      {/* Tags */}
      {tagEntries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tagEntries.map(([tagId, count]) => {
            const tag = resolveTag(tagId);
            if (!tag) return null;

            const isActive = activeTag === tag.id;
            const scaledValue = getTagValue(tag.id, count);
            const label =
              scaledValue > 1 ? `${tag.name} x${scaledValue}` : tag.name;
            const tooltipDesc = formatTagTooltip(tag.desc, scaledValue);

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
                <span>{label}</span>

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
