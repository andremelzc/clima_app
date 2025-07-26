import { useState, useEffect } from "react";
import DetailCard from "./DetailCard";
import {
  MapPin,
  Sunrise,
  Sunset,
  Droplets,
  Wind,
  Gauge,
  Eye,
} from "lucide-react";
import { getCurrentWeather, convertUnixToDate } from "../services/weatherApi";

interface MainCardProps {
  dataSelected: { city: string; country: string };
}

export default function MainCard({ dataSelected }: MainCardProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async () => {
    // No hacer fetch si no hay ciudad seleccionada
    if (!dataSelected.city || !dataSelected.country) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCurrentWeather(dataSelected.city, dataSelected.country);
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
  }, [dataSelected]);

  return (
    <div className="w-full max-w-5xl bg-gradient-to-br from-white/5 to-white/15 opacity-75 p-8 shadow-md rounded-xl backdrop-blur-md">
      {/* Location and Time */}
      <div className="absolute flex flex-col items-start">
        <div>
          <span>22:54</span>
        </div>
        <div className="flex items-center gap-2">
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
      {/* Main weather */}
      <div className="p-8 flex items-center justify-center gap-4">
        {/* Icon weather */}
        <div className="flex items-center">
          {loading ? (
            <span className="text-white">Loading...</span>
          ) : (
            <img
              src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@4x.png`}
              alt={weatherData?.weather[0]?.description}
              className="w-32 h-32 drop-shadow-lg filter brightness-110 contrast-110"
            />
          )}
        </div>
        {/* Temperature and description */}
        <div className="flex flex-col items-center">
          <div className="text-8xl font-thin text-white">
            {loading ? "..." : `${Math.round(weatherData?.main?.temp || 0)}°`}
          </div>
          <div className="capitalize text-white text-lg font-semibold">
            {loading
              ? "..."
              : weatherData?.weather[0]?.description || "Desconocido"}
          </div>
          <div className="text-white text-xs">
            {loading
              ? "..."
              : `Sensación térmica ${Math.round(
                  weatherData?.main?.feels_like || 0
                )}°`}
          </div>
        </div>
      </div>
      {/* Weather details */}
      <div className="grid grid-cols-3 gap-6">
        <DetailCard
          characteristic="Amanecer"
          value={convertUnixToDate(weatherData?.sys?.sunrise)}
          icon={<Sunrise size={16} />}
        />
        <DetailCard
          characteristic="Atardecer"
          value={convertUnixToDate(weatherData?.sys?.sunset)}
          icon={<Sunset size={16} />}
        />
        <DetailCard
          characteristic="Humedad"
          value={`${weatherData?.main?.humidity || 0}%`}
          icon={<Droplets size={16} />}
        />
        <DetailCard
          characteristic="Viento"
          value={`${weatherData?.wind?.speed || 0} m/s`}
          icon={<Wind size={16} />}
        />
        <DetailCard
          characteristic="Presión"
          value={`${weatherData?.main?.pressure || 0} hPa`}
          icon={<Gauge size={16} />}
        />
        <DetailCard
          characteristic="Visibilidad"
          value={`${weatherData?.visibility || 0} m`}
          icon={<Eye size={16} />}
        />
      </div>
    </div>
  );
}
