import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Gallery from './components/Gallery';
import Weather from './components/Weather';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Flying plane */}
      <div className="plane">✈</div>

      {/* Heading & subtext */}
      <h1>
        Welcome to <span className="highlight">AeroCET</span> Recruitment 2025
      </h1>
      <p>Official Aeromodelling Club of College of Engineering, Trivandrum</p>

      {/* Buttons */}
      <div className="button-group">
        <button onClick={() => navigate('/gallery')}>Gallery</button>
        <button onClick={() => navigate('/weather')}>Weather</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
