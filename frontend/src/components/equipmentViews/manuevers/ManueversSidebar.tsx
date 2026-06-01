import { useMemo, useState } from "react";
import rawManeuvers from "../../../data/ManueverList.json";

import {
  normalizeManeuvers,
  calculateTurn,
  formatManeuver,
  getManeuverById,
  getPositioningManeuvers,
  getSelectableManeuvers,
  type Maneuver,
} from "../../common/manueverHelper";

interface ManeuverSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type Tab = "FILTER" | "PLANNER";

function ManeuverSidebar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
}: ManeuverSidebarProps) {
  const [tab, setTab] = useState<Tab>("FILTER");

  const all: Maneuver[] = useMemo(() => normalizeManeuvers(rawManeuvers), []);
  const positionOptions = useMemo(() => getPositioningManeuvers(all), [all]);
  const maneuverOptions = useMemo(() => getSelectableManeuvers(all), [all]);

  const [temper, setTemper] = useState(0);
  const [nerve, setNerve] = useState(0);
  const [reflex, setReflex] = useState(0);
  const [gRes, setGRes] = useState(0);

  const [energyStart, setEnergyStart] = useState(0);
  const [capacityStart, setCapacityStart] = useState(0);
  const [survival, setSurv] = useState(0);

  const [pos, setPos] = useState("");
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [m3, setM3] = useState("");
  const [m4, setM4] = useState("");

  const selectedManeuvers = useMemo(
    () => ({
      pos: getManeuverById(all, pos),
      m1: getManeuverById(all, m1),
      m2: getManeuverById(all, m2),
      m3: getManeuverById(all, m3),
      m4: getManeuverById(all, m4),
    }),
    [all, pos, m1, m2, m3, m4],
  );

  const result = useMemo(
    () =>
      calculateTurn({
        maneuvers: [
          selectedManeuvers.pos,
          selectedManeuvers.m1,
          selectedManeuvers.m2,
          selectedManeuvers.m3,
          selectedManeuvers.m4,
        ],
        energyStart,
        capacityStart,
      }),
    [selectedManeuvers, energyStart, capacityStart],
  );

  const output = useMemo(() => {
    const seq = result.rows;

    return `T${temper}/N${nerve}/R${reflex}/G${gRes}
ENG-- ${energyStart} / CAP -- ${capacityStart} / SRV -- ${survival}

-[START]-
${formatManeuver("POS", selectedManeuvers.pos, seq[0]?.after, seq[0]?.capAfter)}
${formatManeuver("M1", selectedManeuvers.m1, seq[1]?.after, seq[1]?.capAfter)}
${formatManeuver("M2", selectedManeuvers.m2, seq[2]?.after, seq[2]?.capAfter)}
${formatManeuver("M3", selectedManeuvers.m3, seq[3]?.after, seq[3]?.capAfter)}
${formatManeuver("M4", selectedManeuvers.m4, seq[4]?.after, seq[4]?.capAfter)}
-[END]-

ENG -- ${result.finalEnergy} / CAP -- ${result.finalCapacity} / SRV -- ${survival}
T${temper}/N${nerve}/R${reflex}/G${gRes}`;
  }, [
    temper,
    nerve,
    reflex,
    gRes,
    energyStart,
    capacityStart,
    survival,
    pos,
    m1,
    m2,
    m3,
    m4,
    result,
  ]);

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-75 z-50
          transform transition-transform duration-300
         bg-[#071018]/95
          border border-l-4 border-cyan-100
          overflow-y-auto
          lg:sticky lg:top-25 lg:h-170
           lg:translate-x-0 lg:bg-transparent lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col p-5 font-mono">
          {/* Header */}
          <div className="flex justify-between mb-3">
            <h2 className="text-xl font-bold">MANEUVER</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              CLOSE
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-cyan-100/20">
            {["FILTER", "PLANNER"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as Tab)}
                className={`text-xs px-2 ${
                  tab === t ? "text-cyan-300" : "text-cyan-100/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {tab === "FILTER" ? (
              <>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/30 border border-cyan-100/40 px-2 py-1 mb-4"
                  placeholder="Search..."
                />

                {[
                  "ALL",
                  "COMMON",
                  "EXHAUST",
                  "POSITIONING",
                  "NORMAL",
                  "REACTION",
                  "ADVANCED",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`block text-sm ${
                      selectedCategory === c
                        ? "text-cyan-400"
                        : "text-cyan-100/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-4 gap-1">
                  <Input label="T" value={temper} set={setTemper} />
                  <Input label="N" value={nerve} set={setNerve} />
                  <Input label="R" value={reflex} set={setReflex} />
                  <Input label="G" value={gRes} set={setGRes} />
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <Input label="NRG" value={energyStart} set={setEnergyStart} />
                  <Input
                    label="CAP"
                    value={capacityStart}
                    set={setCapacityStart}
                  />
                  <Input label="SRV" value={survival} set={setSurv} />
                </div>

                <Select
                  label="POS"
                  value={pos}
                  setValue={setPos}
                  options={positionOptions}
                />
                <Select
                  label="M1"
                  value={m1}
                  setValue={setM1}
                  options={maneuverOptions}
                />
                <Select
                  label="M2"
                  value={m2}
                  setValue={setM2}
                  options={maneuverOptions}
                />
                <Select
                  label="M3"
                  value={m3}
                  setValue={setM3}
                  options={maneuverOptions}
                />
                <Select
                  label="M4"
                  value={m4}
                  setValue={setM4}
                  options={maneuverOptions}
                />

                <pre className="text-xs bg-black/30 p-2 border border-cyan-100/20 whitespace-pre-wrap">
                  {output}
                </pre>

                <button
                  onClick={() => {
                    setEnergyStart(result.finalEnergy);
                    setCapacityStart(result.finalCapacity);
                    setPos("");
                    setM1("");
                    setM2("");
                    setM3("");
                    setM4("");
                  }}
                  className="w-full mt-2 px-3 py-2 bg-cyan-900/40 border border-cyan-100/60 text-cyan-100 text-xs hover:bg-cyan-900/60 transition"
                >
                  APPLY TURN
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

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
    <div className="flex items-center gap-2">
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

export default ManeuverSidebar;
