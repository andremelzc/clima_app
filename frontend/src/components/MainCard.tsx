import { useState, useEffect, useRef } from "react";
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
import { getTimezone } from "../services/cityApi";
import { convertTemperature } from "../lib/temperatureUtils";

interface MainCardProps {
  dataSelected: { city: string; country: string; lat: number; lon: number };
  isCelsius: boolean;
}

interface TimezoneData {
  status: string;
  gmtOffset: number;
  zoneName: string;
  formatted: string;
  timestamp: number;
}

export default function MainCard({ dataSelected, isCelsius }: MainCardProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const timeIntervalRef = useRef<number | null>(null);
  const timezoneDataRef = useRef<TimezoneData | null>(null);


  // 1. Función para obtener el clima de una ciudad
  const fetchWeatherData = async () => {
    // No hacer fetch si no hay ciudad seleccionada
    if (!dataSelected.city || !dataSelected.country) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCurrentWeather(
        dataSelected.city,
        dataSelected.country
      );
      setWeatherData(data);
      console.log("Weather data:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para obtener la zona horaria de la ciudad seleccionada
  const initializeTimezone = async () => {
    if (!dataSelected) return;

    try {
      const timezoneData = await getTimezone(
        dataSelected.lat,
        dataSelected.lon
      );

      if (timezoneData.status === "OK") {
        timezoneDataRef.current = timezoneData;
        updateCurrentTime(); // Actualizar inmediatamente
        
        // Limpiar intervalo anterior si existe
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
        
        // Configurar nuevo intervalo para actualizar cada segundo
        timeIntervalRef.current = setInterval(updateCurrentTime, 1000);
      }
    } catch (error) {
      console.error("Error getting timezone:", error);
    }
  };

  // 3. Función para actualizar la hora actual de la ciudad
  const updateCurrentTime = () => {
    if (!timezoneDataRef.current) return;
    
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utc + (timezoneDataRef.current.gmtOffset * 1000));
    
    // Formatear hora (HH:MM)
    const timeString = cityTime.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });
    
    // Formatear fecha (DD/MM/YY)
    const dateString = cityTime.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    });
    
    setCurrentTime(timeString);
    setCurrentDate(dateString);
  };

  // 4. Limpiar interval al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // 5. Actualizar cada que se selecciona una nueva ciudad
  useEffect(() => {
    fetchWeatherData();
    initializeTimezone();
  }, [dataSelected]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-white/5 to-white/15 opacity-75 p-4 sm:p-6 lg:p-8 shadow-md rounded-xl backdrop-blur-md">
      {/* Location and Time */}
      <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg font-semibold">
            {loading
              ? "Loading..."
              : `${weatherData?.name || "Lima"}, ${
                  weatherData?.sys?.country || "PE"
                }`}
          </span>
        </div>
        <div className="flex items-center gap-2 ">
          <span className="text-white text-lg font-semibold">
            {currentTime || "..."}
          </span>
          <span className="text-white/80 text-sm">
            {currentDate || "..."}
          </span>
        </div>
      </div>
      {/* Main weather */}
      <div className="p-8 flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        {/* Icon weather */}
        <div className="flex items-center">
          {loading ? (
            <span className="text-white">Loading...</span>
          ) : (
            <img
              src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@4x.png`}
              alt={weatherData?.weather[0]?.description}
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 drop-shadow-lg filter brightness-110 contrast-110"
            />
          )}
        </div>
        {/* Temperature and description */}
        <div className="flex flex-col items-center">
          <div className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-thin text-white">
            {loading ? "..." : `${Math.round(convertTemperature(weatherData?.main?.temp || 0, isCelsius))}°`}
          </div>
          <div className="capitalize text-white text-lg font-semibold">
            {loading
              ? "..."
              : weatherData?.weather[0]?.description || "Desconocido"}
          </div>
          <div className="text-white text-xs">
            {loading
              ? "..."
              : `Sensación térmica ${Math.round(convertTemperature(weatherData?.main?.feels_like || 0, isCelsius))}°`}
          </div>
        </div>
      </div>
      {/* Weather details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-4">
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
