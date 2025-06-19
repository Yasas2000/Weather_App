const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export const fetchWeatherData = async (location = 'Colombo') => {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${location}&aqi=yes`
    );
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('City not found. Please check the spelling and try again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      location: data.location.name,
      country: data.location.country,
      region: data.location.region,
      localTime: data.location.localtime,
      temperature: {
        celsius: data.current.temp_c,
        fahrenheit: data.current.temp_f,
        feelsLike: data.current.feelslike_c
      },
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      windDirection: data.current.wind_dir,
      pressure: data.current.pressure_mb,
      uvIndex: data.current.uv,
      visibility: data.current.vis_km,
      cloudCover: data.current.cloud,
      airQuality: data.current.air_quality ? {
        co: data.current.air_quality.co,
        no2: data.current.air_quality.no2,
        o3: data.current.air_quality.o3,
        pm2_5: data.current.air_quality.pm2_5,
        pm10: data.current.air_quality.pm10
      } : null,
      lastUpdated: data.current.last_updated
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

export const fetchCitySuggestions = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch city suggestions');
    }
    
    const data = await response.json();
    return data.map(city => ({
      id: city.id,
      name: city.name,
      region: city.region,
      country: city.country,
      displayName: `${city.name}, ${city.region}, ${city.country}`
    }));
  } catch (error) {
    throw new Error(`Failed to fetch suggestions: ${error.message}`);
  }
};