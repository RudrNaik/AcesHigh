interface OrdnanceSidebarProps {
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

function OrdnanceSidebar({
  selectedDomain,
  setSelectedDomain,
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
}: OrdnanceSidebarProps) {
  const domains = ["ALL", "Agnostic", "A2A", "A2G", "Naval", "Satellites"];

  return (
    <>
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            bg-black/60
            z-40
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-75
          z-50
          transform
          transition-transform
          duration-300
          bg-[#071018]/95
          lg:sticky
          lg:top-25
          lg:h-fit
          lg:translate-x-0
          lg:bg-transparent
          lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div
          className="
            h-full
            bg-black/20
            border-r
            lg:border
            border-cyan-100
            lg:border-l-4
            p-5
             
          "
        >
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="text-xl font-bold">
              FIL<span className="italic">TER</span>
            </h2>

            <button onClick={() => setSidebarOpen(false)} className="text-sm">
              CLOSE
            </button>
          </div>

          {/* Main Header */}
          <h2 className="hidden lg:block text-xl font-bold mb-4">FIL<span className="italic">TER</span></h2>

          {/* Search */}
          <div className="mb-6">
            <div className="text-xs mb-2 text-cyan-400">SEARCH</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ordnance..."
              className="
                w-full
                bg-black/30
                border
                border-cyan-100/40
                px-3
                py-2
                text-sm
                outline-none
                placeholder:text-cyan-100/40
              "
            />
          </div>

          {/* Domains */}
          <div>
            <div className="text-xs mb-2 text-cyan-400">DOMAIN</div>

            <div className="flex flex-col gap-2 text-sm">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => {
                    setSelectedDomain(domain);
                    setSidebarOpen(false);
                  }}
                  className={`
                    text-left
                    transition

                    ${
                      selectedDomain === domain
                        ? "text-cyan-300"
                        : "text-cyan-100"
                    }
                  `}
                >
                  {domain.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default OrdnanceSidebar;
