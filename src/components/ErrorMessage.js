import React from 'react';

const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-container">
    <div className="error-message">
      <h3>⚠️ Unable to fetch weather data</h3>
      <p>{error}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorMessage;