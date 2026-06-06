const tabs = ["Dossier", "Sortie", "Tour", "Licenses", "Logs"];
const setupTabs = ["Setup", "Dossier"];

function CharacterTabs({
  activeTab,
  setActiveTab,
  setupCompleted,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  setupCompleted: boolean;
}) {
  const visibleTabs = setupCompleted ? tabs : setupTabs;

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
