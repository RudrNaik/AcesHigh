const tabs = ["Dossier", "Sortie", "Logistics", "Tour", "Logs","Debug"];
const setupTabs = ["Setup", "Dossier", "Debug"];
const gameplayTabs = ["Pilot", "Plane", "Perks"];
const logiTabs = ["Licenses", "Loot"];

function CharacterTabs({
  activeTab,
  setActiveTab,
  setupCompleted,
  gameplay = false,
  logi = false,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  setupCompleted: boolean;
  gameplay: boolean;
  logi: boolean;
}) {
  let visibleTabs: string[];

  if (gameplay) {
    visibleTabs = gameplayTabs;
  } else if (logi) {
    visibleTabs = logiTabs;
  } else {
    visibleTabs = setupCompleted ? tabs : setupTabs;
  }

  return (
    <div className="flex gap-2 border-b pb-2">
      {visibleTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={
            activeTab === tab
              ? "border-b-3 border-cyan-400 transition-all duration-100"
              : "opacity-60 border-b-3 border-cyan-100/0"
          }
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default CharacterTabs;
