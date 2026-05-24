import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './Menu';
import MissingPage from "./Missing";

function MenuRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="*" element={<MissingPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default MenuRouter;
