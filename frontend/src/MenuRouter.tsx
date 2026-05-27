import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from './Menu';
import MissingPage from "./Missing";
import Equipment from "./Equipment"
import Background from "./components/common/Background";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";

function MenuRouter() {
  return (
    <BrowserRouter>
      <div className="relative text-cyan-100">
        <Background/>
        <Navbar/>
        <div className="py-10"></div>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="*" element={<MissingPage/>}/>
          <Route path="/Equipment" element={<Equipment/>}/>
        </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default MenuRouter;
