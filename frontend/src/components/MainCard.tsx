import { useState, useEffect } from "react";
import DetailCard from "./DetailCard";
import { MapPin } from "lucide-react";
import { getCurrentWeather, convertUnixToDate } from "../services/weatherApi";

export default function MainCard() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const data = await getCurrentWeather("Lima", "PE");
      setWeatherData(data);
      console.log("Weather data:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/20 opacity-75 p-8 shadow-md rounded-lg backdrop-blur-md">
      {/* Main weather */}
      <div className="p-8 flex items-center justify-center gap-4">
        {/* Icon weather */}
        <div className="flex items-center">
          {loading ? (
            <span className="text-white">Loading...</span>
          ) : (
            <img
              src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`}
              alt={weatherData?.weather[0]?.description}
              className="w-20 h-20"
            />
          )}
        </div>
        {/* Temperature and description */}
        <div className="flex flex-col items-center">
          <div className="text-8xl font-thin text-white">
            {loading ? "..." : `${Math.round(weatherData?.main?.temp || 0)}°`}
          </div>
          <div>
            {loading ? "..." : weatherData?.weather[0]?.main || "Desconocido"}
          </div>
          <div>
            {loading
              ? "..."
              : `Sensación térmica ${Math.round(
                  weatherData?.main?.feels_like || 0
                )}°`}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} color="white" />
            <span className="text-white text-sm">
              {loading
                ? "Loading..."
                : `${weatherData?.name || "Lima"}, ${
                    weatherData?.sys?.country || "PE"
                  }`}
            </span>
          </div>
        </div>
      </div>
      {/* Weather details */}
      <div className="grid grid-cols-3 gap-4">
        <DetailCard
          characteristic="Amanecer"
          value={convertUnixToDate(weatherData?.sys?.sunrise)}
        />
        <DetailCard
          characteristic="Atardecer"
          value={convertUnixToDate(weatherData?.sys?.sunset)}
        />
        <DetailCard
          characteristic="Humedad"
          value={`${weatherData?.main?.humidity || 0}%`}
        />
        <DetailCard
          characteristic="Viento"
          value={`${weatherData?.wind?.speed || 0} m/s`}
        />
        <DetailCard
          characteristic="Presión"
          value={`${weatherData?.main?.pressure || 0} hPa`}
        />
        <DetailCard
          characteristic="Visibilidad"
          value={`${weatherData?.visibility || 0} m`}
        />
      </div>
    </div>
  );
}
