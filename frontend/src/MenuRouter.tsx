import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import MissingPage from "./Missing";
import InDev from "./InDev";
import Equipment from "./Equipment";
import Airframes from "./components/equipmentViews/airframes/Airframes";
import Ordnance from "./components/equipmentViews/munitions/Ordnance";
import Mods from "./components/equipmentViews/mods/Mods";
import Maneuvers from "./components/equipmentViews/manuevers/Manuevers";
import CharacterManager from "./CharacterManager";
import AWACS from "./AWACS";
import Background from "./components/common/Background";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";

const FONT_STORAGE_KEY = "acesHighFont";

function MenuRouter() {
  // Toggle between font-mono and the .hyperlegible utility (Atkinson Hyperlegible, see index.css).
  // Persisted to localStorage so the choice survives reloads.
  const [isHyperlegible, setIsHyperlegible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Read the saved preference once on mount.
  useEffect(() => {
    const saved = localStorage.getItem(FONT_STORAGE_KEY);
    if (saved === "hyperlegible") {
      setIsHyperlegible(true);
    }
    setHydrated(true);
  }, []);

  // Persist the choice whenever it changes (but only after we've read the saved value).
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      FONT_STORAGE_KEY,
      isHyperlegible ? "hyperlegible" : "mono"
    );
  }, [isHyperlegible, hydrated]);

  const handleToggleFont = () => setIsHyperlegible((v) => !v);

  return (
    <BrowserRouter>
      <div
        className={`relative text-cyan-100 ${
          isHyperlegible ? "hyperlegible" : "font-mono"
        }`}
      >
        <Background />
        <Navbar
          isHyperlegible={isHyperlegible}
          onToggleFont={handleToggleFont}
        />
        <div className="py-10"></div>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="*" element={<MissingPage />} />
          <Route path="/InDev" element={<InDev />} />
          <Route path="/about" element={<InDev />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/airframes" element={<Airframes />} />
          <Route path="/equipment/ordnance" element={<Ordnance />} />
          <Route path="/equipment/mods" element={<Mods />} />
          <Route path="/equipment/manuevers" element={<Maneuvers />} />
          <Route path="/charactermanager" element={<CharacterManager />} />
          <Route path="/AWACS" element={<AWACS />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default MenuRouter;
