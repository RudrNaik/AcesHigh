import aircraftTags from "../../data/AircraftTags.json";
import ordnanceTags from "../../data/OrdnanceTags.json";
import maneuverTags from "../../data/ManueverTags.json";
import manueverList from "../../data/ManueverList.json";

export type ResolvedTag =
  | (typeof aircraftTags)[number]
  | (typeof ordnanceTags)[number]
  | (typeof maneuverTags)[number];

export type ResolvedManeuver = (typeof manueverList)[number];

export function resolveTag(tagId: string) {
  return (
    aircraftTags.find((t) => t.id === tagId) ||
    ordnanceTags.find((t) => t.id === tagId) ||
    maneuverTags.find((t) => t.id === tagId) ||
    null
  );
}

export function formatTagTooltip(desc: string, value?: number) {
  if (value == null) return desc;

  return desc.replace(/\[x\]/g, String(value));
}

export function resolveManeuver(manuId: string) {
  return manueverList.find((m) => m.id === manuId) ?? null;
}
