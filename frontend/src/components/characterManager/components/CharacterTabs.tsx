const tabs = ["Dossier", "Sortie", "Tour", "Licenses", "Logs"];
const setupTabs = ["Setup", "Dossier"];
const gameplayTabs = ["Pilot", "Plane"];

function CharacterTabs({
  activeTab,
  setActiveTab,
  setupCompleted,
  gameplay = false,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  setupCompleted: boolean;
  gameplay: boolean;
}) {
  let visibleTabs = setupCompleted ? tabs : setupTabs;
  visibleTabs = gameplay ? gameplayTabs : tabs;

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
