interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ["Overview", "Roster", "Sorties", "Logs", "Settings"];

function CampaignTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex gap-2 border-b pb-2">
      {tabs.map((tab) => (
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

export default CampaignTabs;
