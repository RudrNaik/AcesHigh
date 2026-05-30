import { useMemo, useState } from "react";
import rawManeuvers from "../../../data/ManueverList.json";
import { getTagCountMap, getTagValue } from "../../common/tagResolver";

interface Maneuver {
  id: string;
  name: string;
  type: string;
  isCommon: boolean;
  isAdvanced: boolean;
  energyMod: number;
  capacityMod: number;
  tags: string[];
  desc: string;
}

const normalizeTags = (tags: any): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  if (typeof tags === "string") {
    if (tags.toLowerCase() === "n/a") return [];
    return [tags];
  }
  return [];
};

const normalizeManeuvers = (data: any[]): Maneuver[] => {
  return data.map((m) => {
    const mapped = mapCategory(m);
    return {
      id: m.id,
      name: m.name,
      type: mapped.type,
      isCommon: mapped.isCommon,
      isAdvanced: mapped.isAdvanced,
      energyMod: safeNumber(m.engCost),
      capacityMod: 0,
      tags: normalizeTags(m.tags),
      desc: m.desc ?? "",
    };
  });
};
const safeNumber = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const mapCategory = (m: any) => {
  const type = (m.type ?? "").toUpperCase();

  return {
    type:
      type === "POSITIONING"
        ? "POSITIONING"
        : type === "EXHAUST"
          ? "EXHAUST"
          : type === "REACTION"
            ? "REACTION"
            : "NORMAL",
    isCommon: !!m.isCommon,
    isAdvanced: !!m.isAdvanced,
  };
};

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

  const positionOptions = useMemo(
    () =>
      all.filter(
        (m) =>
          m.type === "POSITIONING" &&
          (m.isCommon || m.isAdvanced) &&
          m.id != "manuExampleTech" &&
          m.id != "exampleManu",
      ),
    [all],
  );

  const maneuverOptions = useMemo(
    () =>
      all.filter(
        (m) =>
          m.type !== "POSITIONING" &&
          m.id != "manuExampleTech" &&
          m.id != "exampleManu",
      ),
    [all],
  );

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

  const get = (id: string) => all.find((m) => m.id === id);

  const result = useMemo(() => {
    let energy = energyStart;
    let capacity = capacityStart;

    const sequence = [
      { m: get(pos) },
      { m: get(m1) },
      { m: get(m2) },
      { m: get(m3) },
      { m: get(m4) },
    ];

    const rows = sequence.map((s) => {
      const e = s.m?.energyMod ?? 0;
      const c = s.m?.capacityMod ?? 0;

      energy += e;
      capacity += c;

      if (s.m?.tags && s.m.tags.length > 0) {
        const tagCounts = getTagCountMap(s.m.tags);
        const manuCapCount = tagCounts["manuCap"] ?? 0;
        if (manuCapCount > 0) {
          const capCost = getTagValue("manuCap", manuCapCount);
          capacity -= capCost;
        }
      }

      return {
        m: s.m,
        e,
        c,
        after: energy,
        capAfter: capacity,
      };
    });

    return {
      rows,
      finalEnergy: energy,
      finalCapacity: capacity,
    };
  }, [pos, m1, m2, m3, m4, energyStart, capacityStart]);

  const formatManeuver = (
    slot: string,
    m?: Maneuver,
    energyAfter?: number,
    capacityAfter?: number,
  ) => {
    if (!m) return `[${slot}] - n/a`;

    const e = m.energyMod;
    let c = m.capacityMod;

    // Add capacity cost from manuCap tags
    if (m.tags && m.tags.length > 0) {
      const tagCounts = getTagCountMap(m.tags);
      const manuCapCount = tagCounts["manuCap"] ?? 0;
      if (manuCapCount > 0) {
        const capCost = getTagValue("manuCap", manuCapCount);
        c -= capCost;
      }
    }

    const desc = m.desc ? `: ${m.desc}` : "";

    const math = `${e >= 0 ? "E+" : "E"}${e}=${energyAfter}, CAP${
      c >= 0 ? "+" : ""
    }${c}=${capacityAfter}`;

    return `[${slot}] - ${m.name}${desc} // ${math}`;
  };

  const output = useMemo(() => {
    const seq = result.rows;

    const name = (id: string) => all.find((m) => m.id === id);

    return `T${temper}/N${nerve}/R${reflex}/G${gRes}
ENG-- ${energyStart} / CAP -- ${capacityStart} / SRV -- ${survival}

-[START]-
${formatManeuver("POS", name(pos), seq[0]?.after, seq[0]?.capAfter)}
${formatManeuver("M1", name(m1), seq[1]?.after, seq[1]?.capAfter)}
${formatManeuver("M2", name(m2), seq[2]?.after, seq[2]?.capAfter)}
${formatManeuver("M3", name(m3), seq[3]?.after, seq[3]?.capAfter)}
${formatManeuver("M4", name(m4), seq[4]?.after, seq[4]?.capAfter)}
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
