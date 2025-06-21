
# 🌤️ Global Weather App

A modern, responsive weather app built with React.js showing real-time weather for any location, featuring a 3D globe and 7-day weather history.

## ✨ Features

- 🌍 Global city search with autocomplete and geolocation
- 🎨 Modern purple-themed UI with dark/light mode toggle
- 🌐 3D globe (react-globe.gl) with location markers
- 📊 Weather data: temp, humidity, wind, UV, air quality
- 📅 7-day history-forecast of weather conditions
- ✅ Responsive on desktop, tablet, and mobile

## 🚀 Live Demo

[View Application-vercel](https://global-weather-app-five.vercel.app/) or [View Application-railway](global-weather-app.up.railway.app)

## 🛠️ Tech Stack

- React.js, Three.js, react-globe.gl
- WeatherAPI.com
- CSS3 (custom properties)
- React Hooks for state
- Vercel for deployment

## 📦 Setup

### Prerequisites

- Node.js (v14+)
- WeatherAPI key

### Instructions

```bash
git clone https://github.com/yourusername/weather-app-colombo.git
cd weather-app-colombo
npm install
```
### Get Your API Key
1. Visit [WeatherAPI.com](https://weatherapi.com)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Create `.env`:

```
REACT_APP_WEATHER_API_KEY=your_key_here
```

Run the app:

```bash
npm start
```

## 🌐 API

- `/current.json`: current weather
- `/search.json`: autocomplete
- `/history.json`: 7-day weather

## 🏗️ Structure

- `components/`: WeatherCard, RealGlobe, SearchSection, etc.
- `services/`: API functions
- `styles/`: CSS
- `App.js`, `index.js`: entry points

## 📱 Responsive Layout

- Desktop: two-column layout
- Tablet: globe above data
- Mobile: single column, optimized for touch

## ✨ Design

- Purple/Cyan theme, bold headings
- Dark mode with auto and toggle
- Globe rotation, markers, night sky background

## 📤 Deployment

```bash
npm run build
vercel --prod
```

Add env var in Vercel: `REACT_APP_WEATHER_API_KEY`

## 🤝 Contributing

Fork > Branch > Commit > Push > PR

## 🙏 Acknowledgments

- [WeatherAPI.com](https://weatherapi.com) for providing comprehensive weather data
- [react-globe.gl](https://github.com/vasturiano/react-globe.gl) for the amazing 3D globe component
- [Three.js](https://threejs.org/) for 3D graphics capabilities
- Design inspiration from modern weather applications
- Perplexity AI for helping through out the project.

## 🔮 Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Extended forecast (14-day)
- [ ] Weather maps integration
- [ ] Weather comparison between cities

## 📝 License

MIT License

## 👨‍💻 Author

Ekanayake YM — University of Moratuwa

---

Made with ❤️ and ☕
