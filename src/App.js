import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "3ee32176fbc4070662893138e0e9dea6";

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // 1ª request: pegar lat e lon
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );

      if (geoResponse.data.length === 0) {
        throw new Error("Cidade não encontrada");
      }

      const { lat, lon } = geoResponse.data[0];

      // 2ª request: pegar o clima usando lat e lon
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      setWeather(weatherResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Definindo a classe com base na temperatura
  const weatherClass = weather
    ? weather.main.temp > 15
      ? "hot"
      : "cold"
    : "";

  // Montando URL do ícone
  const weatherIconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null;

  return (
    <div className="App">
      <header>
        <h1>Weather App</h1>
      </header>

      <div className="search-box">
        <input
          type="text"
          value={city}
          placeholder="Digite a cidade"
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}

      {weather && (
        <div className={`weather-box ${weatherClass}`}>
          <div className="location-box">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p>{new Date().toLocaleDateString()}</p>
          </div>

      
          {weatherIconUrl && (
            <img
              src={weatherIconUrl}
              alt={weather.weather[0].description}
              className="weather-icon"
            />
          )}

          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <div className="weather">{weather.weather[0].description}</div>
        </div>
      )}
    </div>
  );
}

export default App;
