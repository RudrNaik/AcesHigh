import aircraftList from "../../../data/AircraftList.json";
import AircraftCard from "./AircraftCard";

function Airframes() {
  const filteredAircraft = aircraftList.filter((aircraft) => {
    if (aircraft.id === "acExample") return false;
    if (aircraft.id === "acNone") return false;

    if (
      !aircraft.stats ||aircraft.stats.A2A === "n/a"
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="w-full min-h-screen text-cyan-100 p-6">

      <div className="grid grid-cols-1 gap-6 px-10">
        {filteredAircraft.map((aircraft) => (
          <AircraftCard
            key={aircraft.id}
            id={aircraft.id}
            name={aircraft.name}
            type={aircraft.type}
            family={aircraft.family}
            gen={aircraft.gen}
            tier={aircraft.tier}
            stats={aircraft.stats}
            tags={aircraft.tags}
            moduleSlots={aircraft.moduleSlots}
            desc={aircraft.desc}
            intrinsic={aircraft.intrinsic}
          />
        ))}
      </div>
    </div>
  );
}

export default Airframes;