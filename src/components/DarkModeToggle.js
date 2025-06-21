import React from 'react';

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <div className="dark-mode-toggle">
      <input
        type="checkbox"
        id="dark-mode-checkbox"
        checked={darkMode}
        onChange={(e) => setDarkMode(e.target.checked)}
        className="toggle-checkbox"
      />
      <label htmlFor="dark-mode-checkbox" className="toggle-label">
        <div className="toggle-slider">
          <div className="toggle-icon sun">☀️</div>
          <div className="toggle-icon moon">🌙</div>
        </div>
      </label>
    </div>
  );
};

export default DarkModeToggle;