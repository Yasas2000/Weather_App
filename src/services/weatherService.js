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
      coordinates: {
        lat: data.location.lat,
        lon: data.location.lon
      },
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
      lastUpdated: data.current.last_updated
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

// Fetch past 7 days history
export const fetchWeatherHistory = async (location, days = 7) => {
  try {
    const promises = [];
    const today = new Date();

    // Start from yesterday (day 1) and go back
    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString().split('T')[0];

      promises.push(
        fetch(`${BASE_URL}/history.json?key=${API_KEY}&q=${location}&dt=${dateStr}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch data for ${dateStr}`);
            return res.json();
          })
          .catch(error => {
            console.warn(`Failed to fetch history for ${dateStr}:`, error);
            return null; // Return null for failed requests
          })
      );
    }

    const results = await Promise.all(promises);

    // Filter out null results and map the data
    return results
      .filter(data => data !== null)
      .map(data => ({
        date: data.forecast.forecastday[0].date,
        maxTemp: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
        minTemp: Math.round(data.forecast.forecastday[0].day.mintemp_c),
        condition: data.forecast.forecastday[0].day.condition,
        humidity: data.forecast.forecastday[0].day.avghumidity,
        windSpeed: Math.round(data.forecast.forecastday[0].day.maxwind_kph),
        uvIndex: data.forecast.forecastday[0].day.uv,
        type: 'history'
      }))
      .reverse(); // Most recent first
  } catch (error) {
    console.error('Failed to fetch weather history:', error);
    return [];
  }
};

// Fetch future 7 days forecast
export const fetchWeatherForecast = async (location, days = 7) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=${days + 1}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Skip today (index 0) and get next 7 days
    return data.forecast.forecastday.slice(1).map(day => ({
      date: day.date,
      maxTemp: Math.round(day.day.maxtemp_c),
      minTemp: Math.round(day.day.mintemp_c),
      condition: day.day.condition,
      humidity: day.day.avghumidity,
      windSpeed: Math.round(day.day.maxwind_kph),
      uvIndex: day.day.uv,
      type: 'forecast'
    }));
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error);
    return [];
  }
};

// Combined function to fetch both history and forecast
export const fetchCompleteWeatherData = async (location) => {
  try {
    const [history, forecast] = await Promise.all([
      fetchWeatherHistory(location, 7),
      fetchWeatherForecast(location, 7)
    ]);

    return {
      history,
      forecast,
      combined: [...history, ...forecast]
    };
  } catch (error) {
    console.error('Failed to fetch complete weather data:', error);
    return {
      history: [],
      forecast: [],
      combined: []
    };
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

export const getLocationName = async (lat, lng) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search.json?key=${API_KEY}&q=${lat},${lng}`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            return `${data[0].name}, ${data[0].country}`;
        }
        return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    } catch (error) {
        return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    }
 };