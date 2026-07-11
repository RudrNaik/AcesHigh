import type { CharacterData } from "../../../handlers/characterTypes";
import * as licenseEngine from "../../../handlers/Engines/licenseEngine";
import * as planeEngine from "../../../handlers/Engines/planeEngine";
import aircraftData from "../../../../../data/AircraftList.json";
import ordnanceData from "../../../../../data/OrdnanceList.json";
import moduleData from "../../../../../data/ModList.json";
import Licenses from "../../../../../data/Licenses.json";
import upgradeData from "../../../../../data/UpgradePackageList.json";

function LicenseView({
  character,
  updateCharacter,
}: {
  character: CharacterData;
  updateCharacter: (updated: CharacterData) => void;
}) {
  const unlocks = planeEngine.getAllUnlocks(character);

  const aircraft = unlocks.airframes
    .map((id) => aircraftData.find((a) => a.id === id))
    .filter(Boolean);

  const ordnance = unlocks.ordnance
    .map((id) => ordnanceData.find((o) => o.id === id))
    .filter(Boolean);

  const modules = unlocks.modules
    .map((id) => moduleData.find((m) => m.id === id))
    .filter(Boolean);

  const upgrades = unlocks.upgrades
    .map((id) => upgradeData.find((u) => u.id === id))
    .filter(Boolean);

  const licenses: { key: string; name: string }[] = [
    { key: "A1", name: "MacMillan Modern Warfare" },
    { key: "A2", name: "MacMillan Advanced Warfare" },
    { key: "B1", name: "GR Professional Resources" },
    { key: "B2", name: "GR Trading" },
    { key: "C1", name: "Gründer Süd" },
    { key: "C2", name: "Gründer Nord" },
    { key: "D1", name: "Hammer" },
    { key: "D2", name: "Arm" },
    { key: "E1", name: "Polar Star FTC" }
  ];

  return (
    <div className="space-y-6   text-xs">
      {/* RP */}
      <div className="border-l-4 border border-cyan-100 bg-black/20 p-4 flex flex-row gap-5">
        <div>
          <div className="text-[10px] text-gray-400">Total RP</div>
          <div className="text-lg text-cyan-300 font-bold">
            {licenseEngine.getRP(character)}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-gray-400">Remaining RP</div>
          <div className="text-lg text-green-400 font-bold">
            {licenseEngine.getRemainingRP(character)}
          </div>
        </div>
      </div>

      {/* Licenses */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {licenses.map((license) => {
          const tier = character.licenses[license.key] ?? 0;

          const setTier = (nextTier: number) => {
            const updated = licenseEngine.setLicenseTier(
              character,
              license.key as any,
              nextTier,
            );
            updateCharacter(updated);
          };

          return (
            <div
              key={license.key}
              className="group hover:border-l-4 border-cyan-800 border hover:border-cyan-100 transition-all bg-black/20 p-2"
            >
              <div className="text-cyan-300 font-bold text-xs">
                {license.key}
              </div>

              <div className="text-xs text-gray-400">{license.name}</div>

              <div className="text-xs text-gray-400 italic mb-2">
                {Licenses.find((l) => l.id == license.key)?.style}
              </div>

              {/* TIER CONTROLS */}
              <div className="flex items-center gap-2">
                <div className="text-cyan-300 font-bold text-lg">Tier: {tier}</div>

                <button
                  className="px-2 border border-cyan-800 text-cyan-300 disabled:opacity-30"
                  onClick={() => setTier(tier - 1)}
                  disabled={tier <= 0}
                >
                  −
                </button>

                <button
                  className="px-2 border border-cyan-800 text-cyan-300 disabled:opacity-30"
                  onClick={() => setTier(tier + 1)}
                  disabled={tier >= 7 || (licenseEngine.getRemainingRP(character) < 0)}
                >
                  +
                </button>
              </div>

              {/* <div className="text-xs text-gray-400 italic mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {Licenses.find((l)=> l.id == license.key)?.description}
              </div> */}
            </div>
          );
        })}
      </div>

      {/* Unlocks */}
      <h1 className="text-xl pr-3 py-2 border-b border-cyan-900 text-cyan-100 font-bold">
        Unlocks
      </h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="border-cyan-800 border hover:border-cyan-100 transition-all bg-black/20 flex-1">
          <h2 className="text-lg px-3 py-2 border-b border-cyan-900 text-cyan-300 font-bold">
            Aircraft
          </h2>
          <div className="max-h-80 overflow-y-auto">
            {aircraft.map((a) => (
              <div key={a!.id} className="px-3 py-2 border-b border-cyan-950">
                {a!.name}
              </div>
            ))}
          </div>
        </div>

        <div className=" border-cyan-800 border hover:border-cyan-100 transition-all bg-black/20 flex-1">
          <div className=" text-lg px-3 py-2 border-b border-cyan-900 text-cyan-300 font-bold">
            Ordnance
          </div>
          <div className="max-h-80 overflow-y-auto">
            {ordnance.map((o) => (
              <div key={o!.id} className="px-3 py-2 border-b border-cyan-950">
                {o!.name}
              </div>
            ))}
          </div>
        </div>

        <div className=" border-cyan-800 border hover:border-cyan-100 transition-all bg-black/20 flex-1">
          <div className="text-lg px-3 py-2 border-b border-cyan-900 text-cyan-300 font-bold">
            Modules
          </div>
          <div className="max-h-80 overflow-y-auto">
            {modules.map((m) => (
              <div key={m!.id} className="px-3 py-2 border-b border-cyan-950">
                {m!.name}
              </div>
            ))}
          </div>
        </div>

        <div className=" border-cyan-800 border hover:border-cyan-100 transition-all bg-black/20 flex-1">
          <div className=" text-lg px-3 py-2 border-b border-cyan-900 text-cyan-300 font-bold">
            Upgrade Packages
          </div>
          <div className="max-h-80 overflow-y-auto">
            {upgrades.map((u) => (
              <div key={u!.id} className="px-3 py-2 border-b border-cyan-950">
                {u!.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicenseView;
