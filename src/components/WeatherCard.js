import React, { useState } from 'react';

const WeatherCard = ({ data, onRefresh }) => {
  const [tempUnit, setTempUnit] = useState('celsius');

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleTempUnit = () => {
    setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const getAirQualityStatus = (pm2_5) => {
    if (!pm2_5) return 'N/A';
    if (pm2_5 <= 12) return 'Good';
    if (pm2_5 <= 35) return 'Moderate';
    if (pm2_5 <= 55) return 'Unhealthy for Sensitive';
    if (pm2_5 <= 150) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location-info">
          <h2>{data.location}</h2>
          <p>{data.region}, {data.country}</p>
          <p className="local-time">Local time: {formatTime(data.localTime)}</p>
        </div>
        <div className="weather-icon">
          <img src={`https:${data.icon}`} alt={data.condition} />
        </div>
      </div>

      <div className="temperature-section">
        <div className="temperature" onClick={toggleTempUnit}>
          {tempUnit === 'celsius' ? data.temperature.celsius : data.temperature.fahrenheit}°
          {tempUnit === 'celsius' ? 'C' : 'F'}
          <span className="temp-toggle">Click to toggle</span>
        </div>
        <div className="condition">{data.condition}</div>
        <div className="feels-like">
          Feels like {data.temperature.feelsLike}°C
        </div>
      </div>

      <div className="weather-details">
        <DetailCard icon="💧" label="Humidity" value={`${data.humidity}%`} />
        <DetailCard icon="💨" label="Wind" value={`${data.windSpeed} km/h ${data.windDirection}`} />
        <DetailCard icon="☀️" label="UV Index" value={data.uvIndex} />
        <DetailCard icon="👁️" label="Visibility" value={`${data.visibility} km`} />
        <DetailCard icon="🌫️" label="Cloud Cover" value={`${data.cloudCover}%`} />
        <DetailCard icon="🌡️" label="Pressure" value={`${data.pressure} mb`} />
      </div>

      {data.airQuality && (
        <div className="air-quality-section">
          <h3>Air Quality</h3>
          <div className="air-quality-grid">
            <div className="air-quality-item">
              <span>PM2.5:</span>
              <span>{data.airQuality.pm2_5} μg/m³</span>
            </div>
            <div className="air-quality-item">
              <span>Status:</span>
              <span className={`status-${getAirQualityStatus(data.airQuality.pm2_5).toLowerCase().replace(/\s+/g, '-')}`}>
                {getAirQualityStatus(data.airQuality.pm2_5)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="last-updated">
        Last updated: {formatTime(data.lastUpdated)}
      </div>

      <button className="refresh-btn" onClick={onRefresh}>
        🔄 Refresh
      </button>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="detail-card">
    <div className="detail-icon">{icon}</div>
    <div className="detail-info">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  </div>
);

export default WeatherCard;