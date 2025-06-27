import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Predict from './pages/predict';
import LandingPage from './pages/landingPage';
import MapPage from './pages/DiseaseMap';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;