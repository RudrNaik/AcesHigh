import { useMemo, useState, useEffect } from "react";
import rawManeuvers from "../../../../../data/ManueverList.json";
import {
  normalizeManeuvers,
  calculateTurn,
  formatManeuver,
  getManeuverById,
  getPositioningManeuvers,
  getSelectableManeuvers,
  organizeManeuversForDisplay,
  type Maneuver,
} from "../../../handlers/Engines/manuEngine";
// import * as planeEngine from "../../../handlers/Engines/planeEngine";
// import * as charEngine from "../../../handlers/Engines/characterEngine";
import type { CharacterData } from "../../../handlers/characterTypes";

const MIN_SLOTS = 4;

function ManuBuilder({
  availableManus,
  character,
  onUpdate,
}: {
  availableManus: string[];
  character: CharacterData;
  onUpdate: (character: CharacterData) => void;
}) {
  const Manus = rawManeuvers.filter((m) => availableManus.includes(m.id));
  const all: Maneuver[] = useMemo(() => normalizeManeuvers(Manus), []);
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

  const [pos, setPos] = useState("");
  // Dynamic slot array instead of m1–m8
  const [slots, setSlots] = useState<string[]>(Array(MIN_SLOTS).fill(""));

  const setSlot = (idx: number, value: string) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  useEffect(() => {
    setTemper(character.stats.temper);
    setNerve(character.stats.nerve);
    setReflex(character.stats.reflex);
    setGRes(character.stats.gResist);

    setCapacityStart(character.aircraft.currentCapacity);
    setEnergyStart(character.aircraft.currentEnergy);
    setSurv(character.aircraft.currentSurvivability);
  }, [character]);

  const addSlot = () => setSlots((prev) => [...prev, ""]);

  const removeSlot = (idx: number) => {
    setSlots((prev) => {
      if (prev.length <= MIN_SLOTS) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  };

  const selectedManeuversArray = useMemo(
    () => slots.map((id) => getManeuverById(all, id)),
    [all, slots],
  );

  const organizedManeuvers = useMemo(
    () => organizeManeuversForDisplay(selectedManeuversArray),
    [selectedManeuversArray],
  );

  const result = useMemo(
    () =>
      calculateTurn({
        maneuvers: [getManeuverById(all, pos), ...selectedManeuversArray],
        energyStart,
        capacityStart,
      }),
    [all, pos, selectedManeuversArray, energyStart, capacityStart],
  );

  const output = useMemo(() => {
    const [posRow, ...maneuverRows] = result.rows;

    const maneuverLines = maneuverRows.map((row, idx) =>
      formatManeuver(
        organizedManeuvers.slots[idx]?.label || `M${idx + 1}`,
        row.m,
        row.after,
        row.capAfter,
      ),
    );

    return `T${temp}/N${nrv}/R${rflx}/G${gRes}
ENG-- ${energyStart} / CAP -- ${capacityStart} / SRV -- ${survival}

-[START]-
${formatManeuver("POS", posRow?.m, posRow?.after, posRow?.capAfter)}
${maneuverLines.join("\n")}
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
    pos,
    result,
    organizedManeuvers,
  ]);

  return (
    <div className="space-y-3 text-xs">
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

      <Select
        label="POS"
        value={pos}
        setValue={setPos}
        options={positionOptions}
      />

      {organizedManeuvers.slots.map((slot, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <Select
            label={slot.label}
            value={slots[idx] ?? ""}
            setValue={(v: string) => setSlot(idx, v)}
            options={maneuverOptions}
          />
          {slots.length > MIN_SLOTS && (
            <button
              onClick={() => removeSlot(idx)}
              className="px-1.5 py-1 text-red-400 border border-red-400/40 hover:bg-red-900/30 transition shrink-0"
              title="Remove slot"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        onClick={() => {
          setPos("");
          setSlots(Array(MIN_SLOTS).fill(""));
        }}
        className="w-full px-3 py-1.5 bg-cyan-900/20 border border-cyan-100/30 text-cyan-400 text-xs hover:bg-cyan-900/40 transition"
      >
        RESET
      </button>

      <button
        onClick={() => {
          addSlot();
        }}
        className="w-full px-3 py-1.5 bg-cyan-900/20 border border-cyan-100/30 text-cyan-400 text-xs hover:bg-cyan-900/40 transition"
      >
        ADD SLOT
      </button>

      <pre className="text-xs bg-black/30 p-2 border border-cyan-100/20 whitespace-pre-wrap">
        {output}
      </pre>

      <button
        onClick={() => {
          const updatedCharacter = {
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
          };

          onUpdate(updatedCharacter);
          setPos("");
          setSlots(Array(MIN_SLOTS).fill(""));
        }}
        className="w-full mt-2 px-3 py-2 bg-cyan-900/40 border border-cyan-100/60 text-cyan-100 text-xs hover:bg-cyan-900/60 transition"
      >
        APPLY TURN
      </button>
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
        className="w-full bg-black/30 border border-cyan-100/40 px-2 py-1"
      />
    </div>
  );
}

function Select({ label, value, setValue, options }: any) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="text-xs text-cyan-400 whitespace-nowrap">{label}</div>
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
