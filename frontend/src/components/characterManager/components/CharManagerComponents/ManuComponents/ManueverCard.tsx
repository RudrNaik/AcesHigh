import { useState } from "react";
import {resolveTag,formatTagTooltip,getTagCountMap,getTagValue,} from "../../../../common/tagResolver";
import manus from "../../../../../data/ManueverList.json"

interface ManeuverCardProps {
  id: string;
  name?: string;
  type?: string;
  desc?: string | "n/a";
  tags?: string | string[] | "n/a";
  engCost?: string;
  isCommon?: boolean;
  isAdvanced?: boolean;
  autofill?: boolean;
}

function ManeuverCard(props: ManeuverCardProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const autoFilled =
    props.autofill
      ? manus.find((m) => m.id === props.id)
      : null;

  const maneuver = {
    ...props,
    name: autoFilled?.name ?? props.name,
    desc: autoFilled?.desc ?? props.desc,
    type: autoFilled?.type ?? props.type,
    tags: autoFilled?.tags ?? props.tags,
    engCost: autoFilled?.engCost ?? props.engCost,
    isCommon: autoFilled?.isCommon ?? props.isCommon,
    isAdvanced: autoFilled?.isAdvanced ?? props.isAdvanced,
  };

  const rawTags =
    maneuver.tags && maneuver.tags !== "n/a"
      ? (maneuver.tags as string[])
      : [];

  const tagCounts = getTagCountMap(rawTags);
  const tagEntries = Object.entries(tagCounts);

  return (
    <section
      id={maneuver.id}
      className="
        bg-black/20
        border
        border-cyan-800
        p-4
        font-mono
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-xl lg:text-xl font-bold text-cyan-100">
          {maneuver.name}
        </h2>

        <div className="text-xs text-cyan-100 flex ">
            {maneuver.engCost && maneuver.engCost!=="n/a" && <span>EN:{maneuver.engCost}|</span>}
            {maneuver.type && <span>{maneuver.type}</span>}
            {maneuver.isAdvanced && (<span className="font-bold">|ADV</span>)}
            {maneuver.isCommon && (<span className="font-bold">|CMN</span>)}
        </div>
      </div>

      {/* Description */}
      {maneuver.desc && (
        <p className="text-xs text-cyan-100 whitespace-pre-line">
          {maneuver.desc}
        </p>
      )}

      {/* Tags */}
      {tagEntries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tagEntries.map(([tagId, count]) => {
            const tag = resolveTag(tagId);
            if (!tag) return null;

            const isActive = activeTag === tag.id;
            const scaledValue = getTagValue(tag.id, count);

            const label =
              scaledValue > 1 ? `${tag.name} x${scaledValue}` : tag.name;

            const tooltipDesc = formatTagTooltip(
              tag.desc,
              scaledValue
            );

            return (
              <div
                key={`${maneuver.id}-${tag.id}`}
                onMouseEnter={() => setActiveTag(tag.id)}
                onMouseLeave={() => setActiveTag(null)}
                onClick={() =>
                  setActiveTag(isActive ? null : tag.id)
                }
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

export default ManeuverCard;