import React, { useState, useEffect, useRef } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchSection from './components/SearchSection';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { fetchWeatherData, fetchCitySuggestions } from './services/weatherService';
import './styles/Weather.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef();

  const loadWeatherData = async (location = 'Colombo') => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a city name');
      return;
    }
    await loadWeatherData(searchQuery);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      try {
        const citySuggestions = await fetchCitySuggestions(value);
        setSuggestions(citySuggestions);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    loadWeatherData(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadWeatherData(`${latitude},${longitude}`);
        },
        () => {
          alert('Location access denied. Please enable permissions to use this feature.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤️ Global Weather</h1>
        <p>Current weather conditions worldwide</p>
      </header>
      
      <main className="app-main">
        <SearchSection
          searchQuery={searchQuery}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
          onSuggestionClick={handleSuggestionClick}
          onLocationAccess={handleLocationAccess}
          searchInputRef={searchInputRef}
        />

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage error={error} onRetry={() => loadWeatherData()} />}
        {weatherData && !loading && !error && (
          <WeatherCard data={weatherData} onRefresh={() => loadWeatherData(weatherData.location)} />
        )}
      </main>
    </div>
  );
}

export default App;