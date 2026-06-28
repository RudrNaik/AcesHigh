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

function MenuRouter() {
  return (
    <BrowserRouter>
      <div className="relative text-cyan-100 font-mono">
        <Background />
        <Navbar />
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
