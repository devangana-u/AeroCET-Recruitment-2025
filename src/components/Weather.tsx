import React, { useState } from 'react';
import cloud1 from '../assets/cloud1.svg';
import cloud2 from '../assets/cloud2.svg';

interface ForecastDay {
  date: string;
  min: number;
  max: number;
}

const Weather: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [minMax, setMinMax] = useState<{ min: number; max: number } | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [showForecast, setShowForecast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickCities = ['Trivandrum', 'Kochi', 'Kozhikode', 'Kannur', 'Thrissur'];

  const fetchWeather = async (selectedCity?: string) => {
    const targetCity = selectedCity || city;
    if (!targetCity) return;

    setLoading(true);
    setError('');
    setWeather(null);
    setMinMax(null);
    setForecast([]);
    setShowForecast(false);

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${targetCity}&units=metric&appid=3d6fab0d9c413d8c8ca6d9d2622d065e`);
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();

      // current
      const current = data.list[0];
      setWeather({
        name: data.city.name,
        temp: current.main.temp,
        description: current.weather[0].description,
        main: current.weather[0].main
      });

      // next 24h min/max
      const next24Hours = data.list.slice(0, 8);
      const temps = next24Hours.map((entry: any) => entry.main.temp);
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      setMinMax({ min, max });

      // process to create daily forecast
      const dayMap: Record<string, number[]> = {};
      data.list.forEach((entry: any) => {
        const date = entry.dt_txt.split(' ')[0];
        if (!dayMap[date]) dayMap[date] = [];
        dayMap[date].push(entry.main.temp);
      });

      const days: ForecastDay[] = Object.entries(dayMap).slice(0, 7).map(([date, temps]) => ({
        date,
        min: Math.min(...temps),
        max: Math.max(...temps)
      }));
      setForecast(days);

      setLoading(false);
    } catch {
      setError("Could not find city.");
      setLoading(false);
    }
  };

  // 🌈 emoji
  let weatherSymbol = '🌈';
  if (weather) {
    const main = weather.main.toLowerCase();
    if (main.includes('clear')) weatherSymbol = '☀';
    else if (main.includes('cloud')) weatherSymbol = '☁';
    else if (main.includes('rain') || main.includes('drizzle')) weatherSymbol = '🌧';
    else if (main.includes('thunder')) weatherSymbol = '⛈';
    else if (main.includes('snow')) weatherSymbol = '❄';
    else if (main.includes('mist') || main.includes('fog') || main.includes('haze')) weatherSymbol = '🌫';
  }

  return (
    <div className="weather-container">
      <img src={cloud1} className="cloud cloud1" alt="cloud" />
      <img src={cloud2} className="cloud cloud2" alt="cloud" />

      <h1 style={{ marginBottom: '20px', color: '#8c3f0d' }}>Weather</h1>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {quickCities.map(qcity => (
          <button
            key={qcity}
            onClick={() => fetchWeather(qcity)}
            style={{
              padding: '8px 16px',
              background: '#f5d5a3',
              border: 'none',
              borderRadius: '6px',
              color: '#8c3f0d',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 3px 8px rgba(240, 170, 100, 0.4)'
            }}
          >
            {qcity}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '8px',
          border: '2px solid #a5d8eb',
          marginBottom: '15px',
          outline: 'none',
          color: '#8c3f0d'
        }}
      />

      <button
        onClick={() => fetchWeather()}
        style={{
          padding: '12px 28px',
          background: '#f5d5a3',
          border: 'none',
          borderRadius: '8px',
          color: '#8c3f0d',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(240, 170, 100, 0.4)',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
      >
        Get Weather
      </button>

      {loading && <p style={{ color: '#a3561a', marginTop: '20px' }}>Loading...</p>}
      {error && <p style={{ color: '#d9534f', marginTop: '20px' }}>{error}</p>}

      {weather && (
        <div style={{
          marginTop: '25px',
          padding: '20px',
          borderRadius: '12px',
          background: '#e3f5fa',
          border: '2px solid #a5d8eb',
          boxShadow: '0 4px 12px rgba(165, 216, 235, 0.4)',
          textAlign: 'center',
          minWidth: '250px'
        }}>
          <h2 style={{ color: '#8c3f0d' }}>{weather.name}</h2>
          <p style={{ color: '#b05e27', fontSize: '2rem', fontWeight: 600 }}>
            {weatherSymbol} {weather.temp} °C
          </p>
          <p style={{ color: '#8c3f0d' }}>{weather.description}</p>
          {minMax && (
            <p style={{ color: '#a3561a' }}>
              Next 24h: Min {minMax.min.toFixed(1)}°C / Max {minMax.max.toFixed(1)}°C
            </p>
          )}

          {/* Show forecast button */}
          {forecast.length > 0 && !showForecast && (
            <button
              onClick={() => setShowForecast(true)}
              style={{
                marginTop: '15px',
                padding: '8px 20px',
                background: '#f5d5a3',
                border: 'none',
                borderRadius: '6px',
                color: '#8c3f0d',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(240, 170, 100, 0.4)'
              }}
            >
              Show 7-Day Forecast
            </button>
          )}

          {/* 7-day forecast list */}
          {showForecast && (
            <div style={{ marginTop: '15px', color: '#8c3f0d' }}>
              {forecast.map(day => (
                <p key={day.date}>
                  {day.date}: Min {day.min.toFixed(1)}°C / Max {day.max.toFixed(1)}°C
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
