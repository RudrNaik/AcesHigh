import { useState } from "react";
import {
  resolveTag,
  formatTagTooltip,
  getTagCountMap,
  getTagValue,
} from "../../../../common/tagResolver";
import Selector from "./Selector";

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
        p-6
        font-mono
      "
    >
      {/* Header */}
      <Selector
        selectedId={ordnance.id}
        selectedName={ordnance.name}
        options={
          ordnance.ordnanceOptions?.map((item) => ({
            id: item.id,
            name: item.name,
            subtitle: item.domain,
          })) ?? []
        }
        onSelect={(id) => ordnance.onSelectOrdnance?.(id)}
        placeholder="Select Ordnance"
      />

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
