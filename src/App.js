import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchSection from './components/SearchSection';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WeatherHistoryAndForecast from './components/WeatherHistoryAndForecast';
import RealGlobe from './components/RealGlobe';
import DarkModeToggle from './components/DarkModeToggle';
import { fetchWeatherData, fetchCitySuggestions, fetchCompleteWeatherData, getLocationName } from './services/weatherService';
import './styles/Weather.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [completeWeatherData, setCompleteWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherHistoryLoading, setWeatherHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved !== null ? JSON.parse(saved) : prefersDark;
  });
  const [selectedCoordinates, setSelectedCoordinates] = useState([6.9271, 79.8612]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const loadWeatherData = async (location = 'Colombo') => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current weather
      const currentData = await fetchWeatherData(location);
      setWeatherData(currentData);

      if (currentData.coordinates) {
        setSelectedCoordinates([currentData.coordinates.lat, currentData.coordinates.lon]);
      }

      // Fetch complete weather data (history + forecast)
      setWeatherHistoryLoading(true);
      const completeData = await fetchCompleteWeatherData(location);
      setCompleteWeatherData(completeData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setWeatherHistoryLoading(false);
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

  const handleGlobeLocationSelect = async (lat, lng) => {
    try {
        console.log('Location selected from globe:', lat, lng);
        
        setLoading(true);
        setError(null);
        
        // Get location name first
        const locationName = await getLocationName(lat, lng);
        console.log('Location name:', locationName);
        
        // Fetch weather data using coordinates
        await loadWeatherData(`${lat},${lng}`);
        
    } catch (error) {
        console.error('Failed to load weather for selected location:', error);
        setError('Failed to load weather for selected location');
        setLoading(false);
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
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadWeatherData(`${latitude},${longitude}`);
        },
        (error) => {
          setLoading(false);
          let errorMessage = 'Location access denied.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location.';
              break;
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
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
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🌤️ Global Weather</h1>
            <p>14-day weather timeline worldwide</p>
          </div>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
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
        />

        <div className="content-grid">
          <div className="weather-section">
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage error={error} onRetry={() => loadWeatherData()} />}
            {weatherData && !loading && !error && (
              <WeatherCard
                data={weatherData}
                onRefresh={() => loadWeatherData(weatherData.location)}
              />
            )}
          </div>

          <div className="globe-section">
            <RealGlobe
              coordinates={selectedCoordinates}
              locationName={weatherData?.location}
              darkMode={darkMode}
              onLocationSelect={handleGlobeLocationSelect}
            />
          </div>
        </div>

        {weatherData && (
          <WeatherHistoryAndForecast
            weatherData={completeWeatherData}
            loading={weatherHistoryLoading}
            locationName={weatherData.location}
          />
        )}
      </main>
    </div>
  );
}

export default App;
