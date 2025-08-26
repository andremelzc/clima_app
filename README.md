# Clima App

Clima App is a modern web application that provides real-time weather updates, forecasts, and additional weather-related data for cities around the world. Built with React, TypeScript, and Node.js, it offers a seamless and responsive user experience.

## Features

- **Current Weather**: Displays the current temperature, weather conditions, and additional details like humidity and wind speed.
- **City Search**: Allows users to search and select any city worldwide.
- **Temperature Units**: Toggle between Celsius and Fahrenheit.
- **Hourly Forecast**: View the hourly weather forecast in a carousel format.
- **Dynamic UI**: Adapts the background and theme based on weather conditions.
- **Additional Data**: Includes sunrise/sunset times, wind speed, and humidity levels.
- **Persistent Search**: Remembers the last searched city.
- **Error Handling**: Gracefully handles errors like city not found or no internet connection.

## Preview

![Clima App Preview](https://i.imgur.com/Cs7pWAi.png)

## APIs Used

This project leverages the following APIs from **OpenWeather**:

1. **[Current Weather Data API](https://docs.openweather.co.uk/current)**  
   Fetches real-time weather information such as temperature, humidity, wind speed, and weather conditions for a specific location.

2. **[5 Day / 3 Hour Forecast API](https://openweathermap.org/forecast5)**  
   Provides forecast data in 3-hour intervals, covering up to 5 days ahead.

3. **[Timezone API](https://timezonedb.com/)**  
   Retrieves timezone information for accurate local time display.

## Installation and Usage

### Prerequisites
- Node.js (v16 or higher)
- pnpm (v7 or higher)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm run dev
   ```

### Fullstack Development
To run both the backend and frontend simultaneously:
```bash
pnpm dev
```

## Deployment

### Backend
The backend is deployed on **Render**. You can access it at:
```
https://clima-app-m1hv.onrender.com
```

### Frontend
The frontend is deployed on **Vercel**. You can access it at:
```
https://clima-app-opal.vercel.app/
```

## License
This project is licensed under the MIT License.

