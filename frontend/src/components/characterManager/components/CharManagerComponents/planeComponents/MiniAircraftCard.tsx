import type { ReactNode } from "react";
import { useState } from "react";
import intrinsics from "../../../../../data/IntrinsicList.json";
import families from "../../../../../data/AircraftFamilies.json";
import {
  resolveTag,
  getTagValue,
  formatTagTooltip,
} from "../../../../common/tagResolver";

export interface AircraftStateProps {
  survivability: number;
  maxSurvivability: number;
  capacity: number;
  maxCapacity: number;
  energy: number;
  onSpendSurv: () => void;
  onRecoverSurv: () => void;
  onSpendCap: () => void;
  onRecoverCap: () => void;
  onSpendEnergy: () => void;
  onRecoverEnergy: () => void;
  onUpdateAircraftStat?: (
    stat:
      | "a2aOverride"
      | "a2gOverride"
      | "manuOverride"
      | "speedOverride"
      | "capOverride"
      | "survOverride",
    delta: number,
  ) => void;
}

export interface AircraftSelectOption {
  id: string;
  name: string;
  type: string;
  tier: string | number;
  gen: string | number;
}

export interface AircraftCardProps {
  id: string;
  name: string;
  type: string;
  family: string;
  gen: string | number;
  tier: string | number;
  stats: Record<string, ReactNode>;
  tags?: string | string[];
  moduleSlots?: string | number;
  desc?: string;
  intrinsic?: string;
  aircraftState?: AircraftStateProps;
  aircraftOptions?: AircraftSelectOption[];
  onSelectAircraft?: (id: string) => void;
  aircraftOverrides?: {
    a2aOverride?: number;
    a2gOverride?: number;
    manuOverride?: number;
    speedOverride?: number;
    capOverride?: number;
    survOverride?: number;
  };
}

function AircraftCard(aircraft: AircraftCardProps) {
  const stats = Object.entries(aircraft?.stats ?? {}) as [string, ReactNode][];
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showOverrides, setShowOverrides] = useState(true);

  const overrideMap: Record<
    string,
    | "a2aOverride"
    | "a2gOverride"
    | "manuOverride"
    | "speedOverride"
    | "capOverride"
    | "survOverride"
  > = {
    A2A: "a2aOverride",
    A2G: "a2gOverride",
    MANU: "manuOverride",
    SPEED: "speedOverride",
    CAP: "capOverride",
    SURV: "survOverride",
  };

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
        bg-black/20 border border-cyan-100 p-4 border-l-4
        transition-all duration-100  
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex">
          {aircraft.aircraftOptions ? (
            <select
              value={aircraft.id}
              onChange={(e) => aircraft.onSelectAircraft?.(e.target.value)}
              className="select-themed text-lg font-bold w-full"
            >
              {aircraft.aircraftOptions.map((plane) => (
                <option key={plane.id} value={plane.id}>
                  {plane.name}
                </option>
              ))}
            </select>
          ) : (
            <h2 className="text-2xl font-bold text-cyan-100">
              {aircraft.name}
            </h2>
          )}
        </div>

        <div className="text-xs text-cyan-100 px-1">
          {aircraft.type} // {familyData?.name ?? aircraft.family} // GEN{" "}
          {aircraft.gen} // Tier {aircraft.tier}
        </div>
      </div>

      <button
        onClick={() => setShowOverrides(!showOverrides)}
        className="text-xs border border-cyan-900 px-2 py-1 mb-2 hover:bg-cyan-950"
      >
        {showOverrides ? "Modifiers" : "Actual"}
      </button>

      {/* Stats */}
      {showOverrides ? (
        <div className="flex flex-wrap gap-3 mb-4">
          {stats.map(([stat, value]) => {
            const overrideKey = overrideMap[stat];

            const overrideValue = overrideKey
              ? (aircraft.aircraftOverrides?.[overrideKey] ?? 0)
              : 0;

            return (
              <div
                key={stat}
                className="text-sm border border-cyan-100/90 px-3 py-2"
              >
                <span className="text-cyan-100">{stat}</span>

                <span className="ml-2 text-cyan-100">
                  {value}

                  {overrideValue !== 0 && (
                    <span className="text-cyan-400 ml-1">
                      ({overrideValue > 0 ? "+" : ""}
                      {overrideValue})
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 mb-4">
          {stats.map(([stat]) => {
            const overrideKey = overrideMap[stat];

            const overrideValue = overrideKey
              ? (aircraft.aircraftOverrides?.[overrideKey] ?? 0)
              : 0;

            return (
              <div
                key={stat}
                className="text-xs border border-cyan-100/90 px-3 py-2"
              >
                <div className="flex items-center gap-1">
                  <span className="text-cyan-100">{stat}</span>

                  <span className="text-cyan-400 ml-1">
                    {overrideValue > 0 ? "+" : ""}
                    {overrideValue}
                  </span>

                  {overrideKey && (
                    <button
                      onClick={() =>
                        aircraft.aircraftState?.onUpdateAircraftStat?.(
                          overrideKey,
                          -1,
                        )
                      }
                      className="px-1 py-0 ml-1 border border-cyan-400 text-xs"
                    >
                      -
                    </button>
                  )}

                  {overrideKey && (
                    <button
                      onClick={() =>
                        aircraft.aircraftState?.onUpdateAircraftStat?.(
                          overrideKey,
                          1,
                        )
                      }
                      className="px-1 py-0 border border-cyan-400 text-xs"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Aircraft State */}
      {aircraft.aircraftState && (
        <div className="mb-4 space-y-2 border-t border-cyan-100/30 pt-3">
          <div className="text-xs text-cyan-300 font-bold mb-1">Current:</div>
          <AircraftStatControl
            label="SURV"
            value={aircraft.aircraftState.survivability}
            maxValue={aircraft.aircraftState.maxSurvivability}
            onDecrement={aircraft.aircraftState.onSpendSurv}
            onIncrement={aircraft.aircraftState.onRecoverSurv}
          />
          <AircraftStatControl
            label="CAP"
            value={aircraft.aircraftState.capacity}
            maxValue={aircraft.aircraftState.maxCapacity}
            onDecrement={aircraft.aircraftState.onSpendCap}
            onIncrement={aircraft.aircraftState.onRecoverCap}
          />
          <AircraftStatControlEnergy
            label="ENRG"
            value={aircraft.aircraftState.energy}
            onDecrement={aircraft.aircraftState.onSpendEnergy}
            onIncrement={aircraft.aircraftState.onRecoverEnergy}
            stats={aircraft.stats}
          />
          <div className="flex text-center text-xs text-cyan-400">
            STLL: {5 - Number(aircraft.stats.MANU)} | OVRSTR:{" "}
            {13 + Number(aircraft.stats.SPEED) + Number(aircraft.stats.MANU)}
            <span className="text-cyan-100"></span>
          </div>
        </div>
      )}

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
        <div className="text-xs px-2 py-1 border border-cyan-100/90 text-cyan-100 transition cursor-pointer">
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
                    relative text-xs px-2 py-1
                    border border-cyan-100/90 text-cyan-100
                    cursor-pointer transition hover:bg-cyan-100/10
                  "
                >
                  <span>{label}</span>

                  {isActive && (
                    <div className="absolute z-50 left-0 top-full mt-2 w-64 bg-black/90 border border-cyan-100 p-3 text-xs text-cyan-100 shadow-lg whitespace-pre-line">
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

function AircraftStatControl({
  label,
  value,
  maxValue,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  maxValue: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <span className="w-12 text-xs border border-cyan-100 px-2 py-1">
        {label}
      </span>

      <div className="w-12 text-center text-sm text-cyan-400">
        {value}/<span className="text-cyan-100">{maxValue}</span>
      </div>

      <button
        onClick={onDecrement}
        disabled={value <= 0}
        className="px-2 py-1 border border-cyan-400 text-xs disabled:opacity-30"
      >
        -
      </button>

      <button
        onClick={onIncrement}
        disabled={value >= maxValue}
        className="px-2 py-1 border border-cyan-400 text-xs disabled:opacity-30"
      >
        +
      </button>

      <div className="flex gap-1">
        {Array.from({ length: maxValue }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-4 border border-cyan-400 ${
              i < value ? "bg-cyan-400" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function AircraftStatControlEnergy({
  label,
  value,
  onDecrement,
  onIncrement,
  stats,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  stats: Record<string, ReactNode>;
}) {
  const overstress = 13 + Number(stats.MANU) + Number(stats.SPEED);
  const stall = 5 - Number(stats.MANU);
  const getWarn = (val: number): string => {
    return val <= stall + 1 || val >= overstress - 2 ? "text-red-300" : "";
  };
  return (
    <div className="flex gap-2 items-center">
      <span className={"w-12 text-xs border border-cyan-100 px-2 py-1"}>
        {label}
      </span>

      <div
        className={`w-12 text-center text-sm text-cyan-400 ${getWarn(value)}`}
      >
        {value}{" "}
      </div>

      <button
        onClick={onDecrement}
        disabled={value <= 0}
        className="px-2 py-1 border border-cyan-400 text-xs disabled:opacity-30"
      >
        -
      </button>

      <button
        onClick={onIncrement}
        disabled={value >= 22}
        className="px-2 py-1 border border-cyan-400 text-xs disabled:opacity-30"
      >
        +
      </button>

      <div className="flex gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-4 border border-cyan-400 ${
              i < value ? "bg-cyan-400" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
