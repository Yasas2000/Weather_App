import React, { useState } from 'react';

const WeatherHistoryAndForecast = ({ weatherData, loading, locationName }) => {
  const [activeTab, setActiveTab] = useState('all');

  if (loading) {
    return (
      <div className="weather-history-forecast">
        <h2>📅 Weather Timeline - {locationName}</h2>
        <div className="history-loading">Loading weather data...</div>
      </div>
    );
  }

  if (!weatherData || weatherData.combined.length === 0) {
    return (
      <div className="weather-history-forecast">
        <h2>📅 Weather Timeline - {locationName}</h2>
        <p>No weather data available</p>
      </div>
    );
  }

  const { history, forecast, combined } = weatherData;

  const getDisplayData = () => {
    switch (activeTab) {
      case 'history':
        return history;
      case 'forecast':
        return forecast;
      default:
        return combined;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="weather-history-forecast">
      <h2>📅 Weather Timeline - {locationName}</h2>

      <div className="weather-tabs">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📊 All ({combined.length} days)
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📈 Past ({history.length} days)
        </button>
        <button
          className={`tab-button ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => setActiveTab('forecast')}
        >
          🔮 Future ({forecast.length} days)
        </button>
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>
        <div className="weather-timeline">
          {getDisplayData().map((day, index) => (
            <div key={`${day.date}-${index}`} className={`timeline-item ${day.type}`}>
              <div className="timeline-marker">
                {day.type === 'history' ? '📈' : '🔮'}
              </div>

              <div className="timeline-card">
                <div className="timeline-header">
                  <div className="timeline-date">
                    {formatDate(day.date)}
                  </div>
                  <div className="timeline-type">
                    {day.type === 'history' ? 'Past' : 'Forecast'}
                  </div>
                </div>

                <div className="timeline-weather">
                  <img
                    src={`https:${day.condition.icon}`}
                    alt={day.condition.text}
                    className="timeline-icon"
                  />
                  <div className="timeline-temps">
                    <span className="max-temp">{day.maxTemp}°</span>
                    <span className="temp-divider">/</span>
                    <span className="min-temp">{day.minTemp}°</span>
                  </div>
                </div>

                <div className="timeline-condition">
                  {day.condition.text}
                </div>

                <div className="timeline-details">
                  <div className="detail-item">
                    <span className="detail-icon">💧</span>
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💨</span>
                    <span>{day.windSpeed} km/h</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">☀️</span>
                    <span>UV {day.uvIndex}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherHistoryAndForecast;