import { useState } from "react";
import type { CharacterData } from "../../../handlers/characterTypes";
import * as licenseEngine from "../../../handlers/Engines/licenseEngine";

import aircraftData from "../../../../../data/AircraftList.json";
import ordnanceData from "../../../../../data/OrdnanceList.json";
import moduleData from "../../../../../data/ModList.json";
import perkData from "../../../../../data/PerkList.json";
import upgradeData from "../../../../../data/UpgradePackageList.json";

type DataEntry = {
  id: string;
  name: string;
};

const LOOT_CATEGORY_OPTIONS: {
  value: licenseEngine.LootCategory;
  label: string;
  data: DataEntry[];
}[] = [
  { value: "perk", label: "Perk", data: perkData as DataEntry[] },
  { value: "aircraft", label: "Aircraft", data: aircraftData as DataEntry[] },
  { value: "module", label: "Module", data: moduleData as DataEntry[] },
  {
    value: "upgrade",
    label: "Upgrade Package",
    data: upgradeData as DataEntry[],
  },
  { value: "ordnance", label: "Ordnance", data: ordnanceData as DataEntry[] },
];

function nameFor(category: licenseEngine.LootCategory, id: string): string {
  const bucket = LOOT_CATEGORY_OPTIONS.find((c) => c.value === category);
  return bucket?.data.find((d) => d.id === id)?.name ?? id;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-cyan-800 bg-black/20">
      <h2 className="px-3 py-2 border-b border-cyan-900 text-cyan-300 font-bold">
        {title}
      </h2>

      <div className="p-3">{children}</div>
    </div>
  );
}

function LicenseView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const [pendingCategory, setPendingCategory] =
    useState<licenseEngine.LootCategory>("aircraft");
  const [pendingId, setPendingId] = useState("");

  const loot = character.loot ?? [];

  const optionsForCategory =
    LOOT_CATEGORY_OPTIONS.find((c) => c.value === pendingCategory)?.data ?? [];

  function handleAddLoot() {
    if (!pendingId) return;

    updateCharacter(
      licenseEngine.addLoot(character, {
        category: pendingCategory,
        id: pendingId,
      }),
    );

    setPendingId("");
  }

  function handleRemoveLoot(index: number) {
    updateCharacter(licenseEngine.removeLoot(character, index));
  }

  return (
    <div className="space-y-4 text-xs">
      <SectionCard title="Loot Management">
        <div className="flex flex-col lg:flex-row gap-2">
          <select
            value={pendingCategory}
            onChange={(e) => {
              setPendingCategory(e.target.value as licenseEngine.LootCategory);
              setPendingId("");
            }}
            className="flex-1 theme-select"
          >
            {LOOT_CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={pendingId}
            onChange={(e) => setPendingId(e.target.value)}
            className="flex-2 theme-select"
          >
            <option value="">
              Select{" "}
              {
                LOOT_CATEGORY_OPTIONS.find((c) => c.value === pendingCategory)
                  ?.label
              }
            </option>

            {optionsForCategory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddLoot}
            disabled={!pendingId}
            className="
              px-4 py-2
              border border-cyan-400
              bg-black/20
              hover:border-cyan-100
              hover:bg-cyan-800/20
              disabled:opacity-50
              transition-all
            "
          >
            Add Loot
          </button>
        </div>
      </SectionCard>

      <SectionCard title={`Acquired Loot (${loot.length})`}>
        <div className="max-h-80 overflow-y-auto">
          {loot.length === 0 ? (
            <div className="text-cyan-700">No loot acquired yet.</div>
          ) : (
            loot.map((item, index) => (
              <div
                key={`${item.category}-${item.id}-${index}`}
                className="
                  flex items-center justify-between
                  px-3 py-2
                  border-b border-cyan-900/40
                  hover:bg-cyan-950/20
                "
              >
                <div>
                  <div>{nameFor(item.category, item.id)}</div>

                  <div className="text-xs uppercase text-cyan-500">
                    {item.category}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveLoot(index)}
                  className="
                    text-red-400
                    hover:text-red-200
                    transition-colors
                  "
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}

export default LicenseView;
