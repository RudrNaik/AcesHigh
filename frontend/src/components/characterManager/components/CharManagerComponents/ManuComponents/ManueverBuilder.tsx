import { useMemo, useState, useEffect } from "react";
import rawManeuvers from "../../../../../data/ManueverList.json";
import type { CharacterData } from "../../../handlers/characterTypes";

import {
  normalizeManeuvers,
  calculateTurn,
  formatManeuver,
  getManeuverById,
  getPositioningManeuvers,
  getSelectableManeuvers,
  organizeManeuversForDisplay,
  getVariableCostType,
  type Maneuver,
  type ManeuverSlot,
  type DraftSlot,
} from "../../../handlers/Engines/manuEngine";

const MIN_SLOTS = 4;

const getDraftKey = (characterId: string) => `acesHighTurnDraft_${characterId}`;

const loadDraft = (characterId: string) => {
  try {
    const raw = localStorage.getItem(getDraftKey(characterId));

    if (!raw) {
      return {
        pos: "",
        posVariableCost: 0,
        slots: Array.from({ length: MIN_SLOTS }, () => ({
          maneuverId: "",
          variableCost: 0,
        })),
      };
    }

    const parsed = JSON.parse(raw);

    return {
      pos: parsed.pos ?? "",
      posVariableCost: parsed.posVariableCost ?? 0,
      slots: Array.isArray(parsed.slots)
        ? parsed.slots
        : Array.from({ length: MIN_SLOTS }, () => ({
            maneuverId: "",
            variableCost: 0,
          })),
    };
  } catch {
    return {
      pos: "",
      posVariableCost: 0,
      slots: Array.from({ length: MIN_SLOTS }, () => ({
        maneuverId: "",
        variableCost: 0,
      })),
    };
  }
};

const saveDraft = (
  characterId: string,
  pos: string,
  posVariableCost: number,
  slots: DraftSlot[],
) => {
  localStorage.setItem(
    getDraftKey(characterId),
    JSON.stringify({ pos, posVariableCost, slots }),
  );
};

const clearDraft = (characterId: string) => {
  localStorage.removeItem(getDraftKey(characterId));
};

function ManuBuilder({
  availableManus,
  character,
  onUpdate,
}: {
  availableManus: string[];
  character: CharacterData;
  onUpdate: (character: CharacterData) => void;
}) {
  const all: Maneuver[] = useMemo(
    () =>
      normalizeManeuvers(
        rawManeuvers.filter((m) => availableManus.includes(m.id)),
      ),
    [availableManus],
  );

  const positionOptions = useMemo(() => getPositioningManeuvers(all), [all]);
  const maneuverOptions = useMemo(() => getSelectableManeuvers(all), [all]);

  const [temp, setTemper] = useState(character.stats.temper);
  const [nrv, setNerve] = useState(character.stats.nerve);
  const [rflx, setReflex] = useState(character.stats.reflex);
  const [gRes, setGRes] = useState(character.stats.gResist);

  const [energyStart, setEnergyStart] = useState(
    character.aircraft.currentEnergy,
  );
  const [capacityStart, setCapacityStart] = useState(
    character.aircraft.currentCapacity,
  );
  const [survival, setSurv] = useState(character.aircraft.currentSurvivability);

  const initialDraft = loadDraft(character.id);

  const [pos, setPos] = useState(initialDraft.pos);
  const [posVariableCost, setPosVariableCost] = useState(
    initialDraft.posVariableCost,
  );
  const [slots, setSlots] = useState<DraftSlot[]>(initialDraft.slots);

  // persist draft
  useEffect(() => {
    saveDraft(character.id, pos, posVariableCost, slots);
  }, [character.id, pos, posVariableCost, slots]);

  // reload when character changes
  useEffect(() => {
    const draft = loadDraft(character.id);
    setPos(draft.pos);
    setPosVariableCost(draft.posVariableCost);
    setSlots(draft.slots);
  }, [character.id]);

  // sync character stats
  useEffect(() => {
    setTemper(character.stats.temper);
    setNerve(character.stats.nerve);
    setReflex(character.stats.reflex);
    setGRes(character.stats.gResist);
    setEnergyStart(character.aircraft.currentEnergy);
    setCapacityStart(character.aircraft.currentCapacity);
    setSurv(character.aircraft.currentSurvivability);
  }, [character]);

  const setSlotManeuver = (idx: number, maneuverId: string) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], maneuverId };
      return next;
    });
  };

  const setSlotVariableCost = (idx: number, value: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], variableCost: value };
      return next;
    });
  };

  const removeSlot = (idx: number) => {
    setSlots((prev) => {
      if (prev.length <= MIN_SLOTS) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, { maneuverId: "", variableCost: 0 }]);
  };

  const engineSlots: ManeuverSlot[] = useMemo(() => {
    return slots.map((s) => ({
      label: "",
      maneuver: getManeuverById(all, s.maneuverId),
      variableCost: s.variableCost,
    }));
  }, [slots, all]);

  const posManeuver = useMemo(() => getManeuverById(all, pos), [all, pos]);
  const posVariableType = useMemo(
    () => getVariableCostType(posManeuver),
    [posManeuver],
  );

  const positionSlot: ManeuverSlot = useMemo(() => {
    return {
      label: "POS",
      maneuver: posManeuver,
      variableCost: posVariableCost,
    };
  }, [posManeuver, posVariableCost]);

  const organized = useMemo(
    () => organizeManeuversForDisplay(engineSlots),
    [engineSlots],
  );

  const result = useMemo(
    () =>
      calculateTurn({
        slots: [positionSlot, ...engineSlots],
        energyStart,
        capacityStart,
      }),
    [engineSlots, positionSlot, energyStart, capacityStart],
  );

  const output = useMemo(() => {
    const [posRow, ...rows] = result.rows;

    const lines = rows.map((row, idx) =>
      formatManeuver(organized.slots[idx]?.label ?? `M${idx + 1}`, row),
    );

    return `T${temp}/N${nrv}/R${rflx}/G${gRes}
ENG-- ${energyStart} / CAP -- ${capacityStart} / SRV -- ${survival}

-[START]-
${formatManeuver("POS", posRow)}
${lines.join("\n")}
-[END]-

ENG -- ${result.finalEnergy} / CAP -- ${result.finalCapacity} / SRV -- ${survival}
T${temp}/N${nrv}/R${rflx}/G${gRes}`;
  }, [
    temp,
    nrv,
    rflx,
    gRes,
    energyStart,
    capacityStart,
    survival,
    result,
    organized,
  ]);

  const resetDraft = () => {
    setPos("");
    setPosVariableCost(0);
    setSlots(
      Array.from({ length: MIN_SLOTS }, () => ({
        maneuverId: "",
        variableCost: 0,
      })),
    );
    clearDraft(character.id);
  };

  return (
    <div className="space-y-3 text-xs">
      {/* stats */}
      <div className="grid grid-cols-4 gap-1">
        <Input label="T" value={temp} set={setTemper} />
        <Input label="N" value={nrv} set={setNerve} />
        <Input label="R" value={rflx} set={setReflex} />
        <Input label="G" value={gRes} set={setGRes} />
      </div>

      <div className="grid grid-cols-3 gap-1">
        <Input label="NRG" value={energyStart} set={setEnergyStart} />
        <Input label="CAP" value={capacityStart} set={setCapacityStart} />
        <Input label="SRV" value={survival} set={setSurv} />
      </div>

      {/* position — with optional variable cost input */}
      <div className="flex items-center gap-2">
        <Select
          label="POS"
          value={pos}
          setValue={(v: string) => {
            setPos(v);
            setPosVariableCost(0); // reset variable cost on maneuver change
          }}
          options={positionOptions}
        />
        {posVariableType && (
          <input
            type="number"
            min={-10}
            value={posVariableCost}
            onChange={(e) => setPosVariableCost(Number(e.target.value) || 0)}
            className="w-10 num-themed text-center"
          />
        )}
      </div>

      {/* slots */}
      {organized.slots.map((slot, idx) => {
        const draft = slots[idx];
        const variableType = getVariableCostType(engineSlots[idx]?.maneuver);

        return (
          <div key={idx} className="flex items-center gap-2">
            <Select
              label={slot.label}
              value={draft?.maneuverId ?? ""}
              setValue={(v: string) => setSlotManeuver(idx, v)}
              options={maneuverOptions}
            />
            {variableType && (
              <input
                type="number"
                value={draft?.variableCost ?? 0}
                onChange={(e) =>
                  setSlotVariableCost(idx, Number(e.target.value) || 0)
                }
                className="w-10 num-themed text-center"
              />
            )}
            {slots.length > MIN_SLOTS && (
              <button
                onClick={() => removeSlot(idx)}
                className="px-2 transition-all text-red-400 hover:bg-red-500 hover:text-white py-1 hover:animate-pulse"
              >
                X
              </button>
            )}
          </div>
        );
      })}

      {/* reset */}
      <div className="space-y-1">
        <button
          onClick={resetDraft}
          className="border w-full border-cyan-800 px-2 py-1 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:border-cyan-100 hover:text-black"
        >
          RESET
        </button>

        {/* add slot */}
        <button
          onClick={addSlot}
          className="border w-full border-cyan-800 px-2 py-1 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:border-cyan-100 hover:text-black"
        >
          ADD MANU
        </button>

        {/* apply */}
        <button
          onClick={() => {
            onUpdate({
              ...character,
              aircraft: {
                ...character.aircraft,
                currentEnergy: result.finalEnergy,
                currentCapacity: result.finalCapacity,
              },
              stats: {
                ...character.stats,
                temper: temp,
                nerve: nrv,
                reflex: rflx,
                gResist: gRes,
              },
            });
            resetDraft();
          }}
          className="border w-full border-cyan-100 px-2 py-1 text-xs text-cyan-100 transition hover:bg-cyan-100 hover:text-black"
        >
          APPLY TURN
        </button>
      </div>

      {/* output */}
      <pre className="bg-black/30 p-2 whitespace-pre-wrap">{output}</pre>
    </div>
  );
}

export default ManuBuilder;

function Input({ label, value, set }: any) {
  return (
    <div>
      <div className="text-xs text-cyan-400">{label}</div>
      <input
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full bg-black/30 border border-cyan-800 px-2 py-1"
      />
    </div>
  );
}

function Select({ label, value, setValue, options }: any) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <span className="text-cyan-400 text-xs">{label}</span>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full select-themed"
      >
        <option value="">---</option>
        {options.map((m: any) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}
