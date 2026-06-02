import Panel from "./components/menu/TerminalPanel";

function EquipmentMenu() {
  return (
    <div className="w-full h-fill min-h-screen text-cyan-100">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col space-y-3">
          <Panel
            title="Airframes"
            subtitle="Aircraft Repository"
            link="/equipment/airframes"
            icon=""
          />
          <Panel
            title="Munitions"
            subtitle="Ordnance repository"
            link="/equipment/ordnance"
            icon=""
          />
          <Panel
            title="Mods"
            subtitle="Modification repository"
            link="/equipment/mods"
            icon=""
          />
          <Panel
            title="Manuevers"
            subtitle="BFM/BVR"
            link="/equipment/manuevers"
            icon=""
          />
          <div className="py-20"></div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentMenu;
