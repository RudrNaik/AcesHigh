import { BrowserRouter as Routes, Route } from "react-router-dom";
import App from './App';
import './App.css'

function MenuRouter() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <Routes>
          <Route path="/" element={<App/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default MenuRouter
