import { useMemo, useState } from "react";
import type { CharacterData } from "../handlers/characterTypes";

type Props = {
  character: CharacterData;
  updateCharacter: (c: CharacterData) => void;
  specs: any[];
  backgroundPerks: any[];
};

function Setup({ character, updateCharacter, specs, backgroundPerks }: Props) {
  const [local, setLocal] = useState<CharacterData>(character);

  // ================= SPECIALIZATION =================

  const selectedSpec = useMemo(() => {
    return specs.find((s) => s.id === local.specialization.specId);
  }, [local.specialization.specId, specs]);

  const availableTactics = selectedSpec?.tactics ?? [];

  const isTacticSelected = (id: string) =>
    local.specialization.tactics.includes(id);

  const toggleTactic = (id: string) => {
    const exists = isTacticSelected(id);

    let updated: string[];

    if (exists) {
      updated = local.specialization.tactics.filter((t) => t !== id);
    } else {
      if (local.specialization.tactics.length >= 3) return;
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
      },
    };

    setLocal(next);
    updateCharacter(next);
  };

  // ================= META =================

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

  // ================= DOSSIER =================

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

  // ================= QUIRKS =================

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

  // ================= BACKGROUND =================

  const setBackgroundPerk = (id: string) => {
    const next = {
      ...local,
      backgroundPerk: id,
    };

    setLocal(next);
    updateCharacter(next);
  };

  // ================= STATS (HARD CAP 8) =================

  const stats = local.metadata.startingPilotStats;

  const totalStats = stats.temper + stats.nerve + stats.reflex + stats.gResist;

  const updateStat = (key: keyof typeof stats, value: number) => {
    const nextStats = {
      ...stats,
      [key]: value,
    };

    const newTotal =
      nextStats.temper + nextStats.nerve + nextStats.reflex + nextStats.gResist;

    // HARD CAP
    if (newTotal > 8) return;

    updateMeta("startingPilotStats", nextStats);
  };

  const statsValid = totalStats === 8;

  // ================= VALIDATION =================

  const canComplete =
    statsValid &&
    local.dossier.firstName !== "" &&
    local.dossier.lastName !== "" &&
    local.dossier.callsign !== "" &&
    local.specialization.specId !== "" &&
    local.specialization.tactics.length === 3 &&
    local.backgroundPerk !== "";

  const completeSetup = () => {
    if (!canComplete) return;

    updateCharacter({
      ...local,
      metadata: {
        ...local.metadata,
        setupComplete: true,
      },
    });
  };

  // ================= RENDER =================

  return (
    <div className="space-y-8 text-white">
      <section className="border p-4 space-y-3">
        <h2 className="text-cyan-300 font-bold">Identity</h2>

        <div className="grid gap-2">
          <label className="text-cyan-400 text-sm">First Name</label>
          <input
            value={local.dossier.firstName}
            onChange={(e) => updateDossier("firstName", e.target.value)}
          />

          <label className="text-cyan-400 text-sm">Last Name</label>
          <input
            value={local.dossier.lastName}
            onChange={(e) => updateDossier("lastName", e.target.value)}
          />

          <label className="text-cyan-400 text-sm">Callsign</label>
          <input
            value={local.dossier.callsign}
            onChange={(e) => updateDossier("callsign", e.target.value)}
          />

          <label className="text-cyan-400 text-sm">Gender</label>
          <input
            value={local.dossier.gender}
            onChange={(e) => updateDossier("gender", e.target.value)}
          />

          <label className="text-cyan-400 text-sm">Rank</label>
          <input
            value={local.dossier.rank}
            onChange={(e) => updateDossier("rank", e.target.value)}
          />
        </div>
      </section>

      <section className="border p-4 space-y-3">
        <h2 className="text-cyan-300 font-bold">Generation</h2>
        <div className="flex flex-col gap-2">
          <label className="text-cyan-400 text-sm">Generation</label>
          <input
            type="number"
            className="num-themed px-2 py-1 max-w-2xs"
            value={local.metadata.generation}
            onChange={(e) => updateMeta("generation", Number(e.target.value))}
          />

          <label className="text-cyan-400 text-sm">Starting RP</label>
          <input
            type="number"
            className="num-themed px-2 py-1 max-w-2xs"
            value={local.metadata.startingRP}
            onChange={(e) => updateMeta("startingRP", Number(e.target.value))}
          />
        </div>
      </section>

      <section className="border p-4 space-y-3">
        <h2 className="text-cyan-300 font-bold">Quirks</h2>

        <div className="grid grid-cols-3 gap-4">
          {/* POSITIVE */}
          <div className="border p-2 space-y-2">
            <h3 className="text-green-300">Positive</h3>

            <label className="text-cyan-400 text-sm">Name</label>
            <input
              value={local.quirks.quirk1Name}
              onChange={(e) => updateQuirk("quirk1Name", e.target.value)}
            />

            <label className="text-cyan-400 text-sm">Description</label>
            <input
              value={local.quirks.quirk1Desc}
              onChange={(e) => updateQuirk("quirk1Desc", e.target.value)}
            />
          </div>

          {/* NEUTRAL */}
          <div className="border p-2 space-y-2">
            <h3 className="text-yellow-300">Neutral</h3>

            <label className="text-cyan-400 text-sm">Name</label>
            <input
              value={local.quirks.quirk2Name}
              onChange={(e) => updateQuirk("quirk2Name", e.target.value)}
            />

            <label className="text-cyan-400 text-sm">Description</label>
            <input
              value={local.quirks.quirk2Desc}
              onChange={(e) => updateQuirk("quirk2Desc", e.target.value)}
            />
          </div>

          {/* NEGATIVE */}
          <div className="border p-2 space-y-2">
            <h3 className="text-red-300">Negative</h3>

            <label className="text-cyan-400 text-sm">Name</label>
            <input
              value={local.quirks.quirk3Name}
              onChange={(e) => updateQuirk("quirk3Name", e.target.value)}
            />

            <label className="text-cyan-400 text-sm">Description</label>
            <input
              value={local.quirks.quirk3Desc}
              onChange={(e) => updateQuirk("quirk3Desc", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border p-4 space-y-3">
        <h2 className="text-cyan-300 font-bold">
          Pilot Stats (Total {totalStats}/8)
        </h2>

        {(["temper", "nerve", "reflex", "gResist"] as const).map((key) => (
          <div key={key} className="flex gap-4 items-center">
            <span className="w-24">{key.toUpperCase()}</span>

            <input
              type="number"
              className="num-themed px-2 py-1 max-w-3xs"
              value={stats[key]}
              onChange={(e) => updateStat(key, Number(e.target.value))}
            />
          </div>
        ))}
      </section>

      {/* ================= SPECIALIZATION (UPGRADED) ================= */}
      <section className="border p-4 space-y-4">
        <h2 className="text-cyan-300 font-bold">Specialization</h2>

        <select
          value={local.specialization.specId}
          onChange={(e) => setSpec(e.target.value)}
          className="select-themed"
        >
          <option value="">Select Spec</option>
          {specs.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {selectedSpec && (
          <div className="space-y-4">
            {/* FLAVOR */}
            <div className="border p-3 text-sm opacity-80">
              {selectedSpec.flavor}
            </div>

            {/* TACTICS AS CARDS */}
            <div className="grid md:grid-cols-2 gap-3">
              {availableTactics.map((t: any) => {
                const selected = isTacticSelected(t.id);

                const locked =
                  !selected && local.specialization.tactics.length >= 3;

                return (
                  <button
                    key={t.id}
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

      {/* ================= BACKGROUND ================= */}
      <section className="border p-4 space-y-3">
        <h2 className="text-cyan-300 font-bold">Background Perk</h2>

        <select
          value={local.backgroundPerk}
          onChange={(e) => setBackgroundPerk(e.target.value)}
          className="select-themed"
        >
          <option value="">Select Perk</option>
          {backgroundPerks.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </section>

      {/* ================= FINAL ================= */}
      <section className="border p-4 space-y-3">
        <h2 className="text-cyan-300 font-bold">Final Check</h2>

        <div className={canComplete ? "text-green-400" : "text-red-400"}>
          {canComplete ? "Ready to launch" : "Incomplete setup"}
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
