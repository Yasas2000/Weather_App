import React from 'react';

const WeatherHistory = ({ history, loading, locationName }) => {
    if (loading) {
        return (
            <div className="weather-history">
                <h2>📅 Recent Weather History - {locationName}</h2>
                <div className="history-loading">Loading weather history...</div>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="weather-history">
                <h2>📅 Recent Weather History - {locationName}</h2>
                <p>No historical data available</p>
            </div>
        );
    }

    return (
        <div className="weather-history">
            <h2>📅 Recent Weather History - {locationName}</h2>
            <div className="history-grid">
                {history.slice().reverse().map((day, index) => (
                    <div key={index} className="history-card">
                        <div className="history-date">
                            {new Date(day.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="history-weather">
                            <img
                                src={`https:${day.condition.icon}`}
                                alt={day.condition.text}
                                className="history-icon"
                            />
                            <div className="history-temps">
                                <span className="max-temp">{day.maxTemp}°</span>
                                <span className="min-temp">{day.minTemp}°</span>
                            </div>
                        </div>
                        <div className="history-details">
                            <div className="history-detail">
                                <span>💧 {day.humidity}%</span>
                            </div>
                            <div className="history-detail">
                                <span>💨 {day.windSpeed} km/h</span>
                            </div>
                            <div className="history-detail">
                                <span>☀️ UV {day.uvIndex}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherHistory;