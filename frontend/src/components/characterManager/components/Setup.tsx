import { useEffect, useState } from "react";
import type { CharacterData } from "../handlers/characterTypes";
import ManuCard from "./charManagerCommon/SetupComponents/MiniManueverCard";
import * as charEngine from "../handlers/Engines/characterEngine";

type Props = {
  character: CharacterData;
  updateCharacter: (c: CharacterData) => void;
  specs: any[];
  backgroundPerks: any[];
  staticMods: any[];
  manuvers: any[];
};

function Setup({
  character,
  updateCharacter,
  specs,
  backgroundPerks,
  staticMods,
  manuvers,
}: Props) {
  const [local, setLocal] = useState<CharacterData>(character);

  useEffect(() => {
    if (!character.metadata.setupComplete) {
      setLocal(character);
    }
  }, [character.metadata.setupComplete]);

  const selectedSpec = specs.find((s) => s.id === local.specialization.specId);

  const availableTactics = selectedSpec?.tactics ?? [];

  const selectedTacticCount = local.specialization.tactics.filter((id) =>
    availableTactics.some((t: any) => t.id === id),
  ).length;

  const isTacticSelected = (id: string) =>
    availableTactics.some((t: any) => t.id === id) &&
    local.specialization.tactics.includes(id);

  const toggleTactic = (id: string) => {
    const exists = isTacticSelected(id);

    let updated: string[];

    if (exists) {
      updated = local.specialization.tactics.filter((t) => t !== id);
    } else {
      if (selectedTacticCount >= 3) return;
      updated = [...local.specialization.tactics, id];
    }

    const next = {
      ...local,
      specialization: {
        ...local.specialization,
        tactics: updated,
      },
    };

    setLocal(next);
    updateCharacter(next);
  };

  const setSpec = (id: string) => {
    const next = {
      ...local,
      specialization: {
        specId: id,
        tactics: [],
        advancements: [],
        mastery: "",
      },
    };

    setLocal(next);
    updateCharacter(next);
  };

  const updateMeta = (key: keyof CharacterData["metadata"], value: any) => {
    const next = {
      ...local,
      metadata: {
        ...local.metadata,
        [key]: value,
      },
    };

    setLocal(next);
    updateCharacter(next);
  };

  const updateDossier = (
    key: keyof CharacterData["dossier"],
    value: string,
  ) => {
    const next = {
      ...local,
      dossier: {
        ...local.dossier,
        [key]: value,
      },
    };

    setLocal(next);
    updateCharacter(next);
  };

  const updateQuirk = (key: keyof CharacterData["quirks"], value: string) => {
    const next = {
      ...local,
      quirks: {
        ...local.quirks,
        [key]: value,
      },
    };

    setLocal(next);
    updateCharacter(next);
  };

  const setBackgroundPerk = (id: string) => {
    const next = {
      ...local,
      backgroundPerk: id,
    };

    setLocal(next);
    updateCharacter(next);
  };

  const stats = local.metadata.startingPilotStats;

  const totalStats = stats.temper + stats.nerve + stats.reflex + stats.gResist;

  const updateStat = (key: keyof typeof stats, value: number) => {
    if (value > 5) return;

    const nextStats = {
      ...stats,
      [key]: value,
    };

    const newTotal =
      nextStats.temper + nextStats.nerve + nextStats.reflex + nextStats.gResist;

    if (newTotal > 8) return;

    updateMeta("startingPilotStats", nextStats);
  };

  const statsValid = totalStats === 8;

  const canComplete =
    statsValid &&
    local.dossier.firstName !== "" &&
    local.dossier.lastName !== "" &&
    local.dossier.callsign !== "" &&
    local.specialization.specId !== "" &&
    selectedTacticCount === 2 &&
    local.backgroundPerk !== "";

  const completeSetup = () => {
  if (!canComplete) return;

  const updated = {
    ...charEngine.initializeTempStats(local),
    metadata: {
      ...local.metadata,
      setupComplete: true,
    },
  };

  updateCharacter(updated);
};

  return (
    <div className="space-y-8 text-cyan-100 py-1">
      {/*Identity*/}
      <section className="border lg:p-4 p-2 space-y-3">
        <h2 className="text-cyan-100 font-bold">Identity</h2>

        <div className="grid gap-2">
          <label className="text-cyan-100 text-sm">Player Username</label>
          <input
            value={local.metadata.userName}
            className="border-b border-cyan-100 max-w-sm"
            onChange={(e) => updateMeta("userName", e.target.value)}
          />

          <label className="text-cyan-100 text-sm">First Name</label>
          <input
            value={local.dossier.firstName}
            className="border-b border-cyan-100 max-w-sm"
            onChange={(e) => updateDossier("firstName", e.target.value)}
          />

          <label className="text-cyan-100 text-sm">Last Name</label>
          <input
            value={local.dossier.lastName}
            className="border-b border-cyan-100 max-w-sm"
            onChange={(e) => updateDossier("lastName", e.target.value)}
          />

          <label className="text-cyan-100 text-sm">Callsign</label>
          <input
            value={local.dossier.callsign}
            className="border-b border-cyan-100 max-w-sm"
            onChange={(e) => updateDossier("callsign", e.target.value)}
          />

          <label className="text-cyan-100 text-sm">Gender</label>
          <input
            value={local.dossier.gender}
            className="border-b border-cyan-100 max-w-sm"
            onChange={(e) => updateDossier("gender", e.target.value)}
          />

          <label className="text-cyan-100 text-sm">Rank</label>
          <input
            value={local.dossier.rank}
            className="border-b border-cyan-100 max-w-sm"
            onChange={(e) => updateDossier("rank", e.target.value)}
          />
        </div>
      </section>

      {/* metadata */}
      <section className="border lg:p-4 p-2 space-y-3">
        <h2 className="text-cyan-100 font-bold">Generation</h2>
        <div className="flex flex-col gap-2">
          <label className="text-cyan-100 text-sm">Generation</label>
          <input
            type="number"
            className="num-themed px-2 py-1 max-w-2xs"
            value={local.metadata.generation}
            onChange={(e) => updateMeta("generation", Number(e.target.value))}
          />

          <label className="text-cyan-100 text-sm">Starting RP</label>
          <input
            type="number"
            className="num-themed px-2 py-1 max-w-2xs"
            value={local.metadata.startingRP}
            onChange={(e) => updateMeta("startingRP", Number(e.target.value))}
          />
        </div>
      </section>

      {/* Quirks */}
      <section className="border lg:p-4 p-2 space-y-3">
        <h2 className="text-cyan-100 font-bold">Quirks</h2>

        <div className="flex flex-col gap-4">
          <div className="border p-2 space-y-2 flex flex-col">
            <h3 className="">Quirk 1</h3>

            <label className="text-cyan-100 text-sm">Name</label>
            <input
              value={local.quirks.quirk1Name}
              className="border-b border-cyan-100 max-w-sm"
              onChange={(e) => updateQuirk("quirk1Name", e.target.value)}
            />

            <label className="text-cyan-100 text-sm">Description</label>
            <input
              value={local.quirks.quirk1Desc}
              className="border-b border-cyan-100 max-w-sm"
              onChange={(e) => updateQuirk("quirk1Desc", e.target.value)}
            />
          </div>

          <div className="border p-2 space-y-2 flex flex-col">
            <h3 className="">Quirk 2</h3>

            <label className="text-cyan-100 text-sm">Name</label>
            <input
              value={local.quirks.quirk2Name}
              className="border-b border-cyan-100 max-w-sm"
              onChange={(e) => updateQuirk("quirk2Name", e.target.value)}
            />

            <label className="text-cyan-100 text-sm">Description</label>
            <input
              value={local.quirks.quirk2Desc}
              className="border-b border-cyan-100 max-w-sm"
              onChange={(e) => updateQuirk("quirk2Desc", e.target.value)}
            />
          </div>

          <div className="border p-2 space-y-2 flex flex-col">
            <h3 className="">Quirk 3</h3>

            <label className="text-cyan-100 text-sm">Name</label>
            <input
              value={local.quirks.quirk3Name}
              className="border-b border-cyan-100 max-w-sm"
              onChange={(e) => updateQuirk("quirk3Name", e.target.value)}
            />

            <label className="text-cyan-100 text-sm">Description</label>
            <input
              value={local.quirks.quirk3Desc}
              className="border-b border-cyan-100 max-w-sm"
              onChange={(e) => updateQuirk("quirk3Desc", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/*stats*/}
      <section className="border lg:p-4 p-2 space-y-3">
        <h2 className="text-cyan-100 font-bold">
          Pilot Stats (Total {totalStats}/8)
        </h2>

        {(["temper", "nerve", "reflex", "gResist"] as const).map((key) => (
          <div key={key} className="flex gap-2 items-center">
            <span className="w-24">{key.toUpperCase()}</span>

            <input
              type="number"
              className="num-themed px-2 py-1 max-w-40"
              value={stats[key]}
              onChange={(e) => updateStat(key, Number(e.target.value))}
            />

            <button
              onClick={() => updateStat(key, stats[key] - 1)}
              disabled={stats[key] <= 1}
              className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
            >
              -
            </button>

            <button
              onClick={() => updateStat(key, stats[key] + 1)}
              disabled={stats[key] >= 5}
              className="px-2 py-1 border border-cyan-400 disabled:opacity-30"
            >
              +
            </button>
          </div>
        ))}
      </section>

      {/*Specs*/}
      <section className="border lg:p-4 p-2 space-y-4">
        <h2 className="text-cyan-100 font-bold">Specialization</h2>

        <select
          value={local.specialization.specId}
          onChange={(e) => setSpec(e.target.value)}
          className="select-themed"
        >
          <option value="">Select Spec</option>
          {specs
            .filter((p) => p.id != "exampleSpec")
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        {selectedSpec && (
          <div className="space-y-4">
            <div className="border p-3 text-sm opacity-80 space-y-4">
              <div className="">{selectedSpec.flavor}</div>
              <div>{selectedSpec.info}</div>
              {selectedSpec.staticMods != "n/a" &&
                selectedSpec.staticMods != "" && (
                  <div>
                    Modifiers:{" "}
                    <span className="border px-2 py-1 text-xs border-cyan-100">
                      {
                        staticMods.find((m) => m.id === selectedSpec.staticMods)
                          .name
                      }
                    </span>
                  </div>
                )}
              {selectedSpec.addManu != "n/a" && selectedSpec.addManu != "" && (
                <div>
                  Extra Manuevers:{" "}
                  {manuvers
                    .filter((m) => m.id === selectedSpec.addManu)
                    .map((m) => (
                      <ManuCard id={m.id} name={m.name} autofill={true} />
                    ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {availableTactics.map((t: any, idx: number) => {
                const selected = isTacticSelected(t.id);

                const locked = !selected && selectedTacticCount >= 2;

                return (
                  <button
                    key={`${local.specialization.specId}-${t.id || idx}`}
                    disabled={locked}
                    onClick={() => toggleTactic(t.id)}
                    className={`
                      border p-3 text-left space-y-1
                      ${selected ? "border-cyan-400" : ""}
                      ${locked ? "opacity-30" : ""}
                    `}
                  >
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs opacity-70">{t.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* backghround perk*/}
      <section className="border lg:p-4 p-2 space-y-3">
        <h2 className="text-cyan-100 font-bold">Background Perk</h2>

        <select
          value={local.backgroundPerk}
          onChange={(e) => setBackgroundPerk(e.target.value)}
          className="select-themed"
        >
          <option value="">Select Perk</option>
          {backgroundPerks
            .filter((p) => p.type === "bgPerk")
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
        <div className="border p-3 text-sm opacity-80">
          {backgroundPerks
            .filter((p) => p.id === local.backgroundPerk)
            .map((p) => (
              <div>
                <div>{p.description}</div>
              </div>
            ))}
        </div>
      </section>

      {/* submit*/}
      <section className="border lg:p-4 p-2 space-y-3">
        <h2 className="text-cyan-100 font-bold">Final Check</h2>

        <div className={canComplete ? "text-green-400" : "text-red-400"}>
          {canComplete ? "Ready" : "Incomplete Setup"}
        </div>

        <button
          disabled={!canComplete}
          onClick={completeSetup}
          className="border px-4 py-2 disabled:opacity-50"
        >
          Complete Setup
        </button>
      </section>
    </div>
  );
}

export default Setup;
