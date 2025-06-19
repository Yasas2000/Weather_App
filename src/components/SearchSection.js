import React from 'react';

const SearchSection = ({
  searchQuery,
  suggestions,
  showSuggestions,
  onInputChange,
  onSearch,
  onSuggestionClick,
  onLocationAccess,
  searchInputRef
}) => {
  return (
    <div className="search-section">
      <form onSubmit={onSearch} className="search-form">
        <div className="search-input-container">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={onInputChange}
            placeholder="Search for any city worldwide..."
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" className="search-btn">
            🔍 Search
          </button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion-item"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-location">
                  {suggestion.region}, {suggestion.country}
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
      
      <button onClick={onLocationAccess} className="location-btn">
        📍 Use My Location
      </button>
    </div>
  );
};

export default SearchSection;