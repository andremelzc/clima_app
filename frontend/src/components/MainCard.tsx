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
    <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto bg-gradient-to-br from-white/5 to-white/15 opacity-75 p-3 sm:p-4 md:p-6 lg:p-8 shadow-md rounded-xl backdrop-blur-md">
      {/* Location and Time */}
      <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0 mb-2 sm:mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="sm:hidden" color="white" />
          <span className="text-white text-sm sm:text-lg font-semibold truncate">
            {loading
              ? "Loading..."
              : `${weatherData?.name || "Lima"}, ${
                  weatherData?.sys?.country || "PE"
                }`}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-white text-sm sm:text-lg font-semibold">
            {currentTime || "..."}
          </span>
          <span className="text-white/80 text-xs sm:text-sm">
            {currentDate || "..."}
          </span>
        </div>
      </div>
      {/* Main weather */}
      <div className="py-4 px-2 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
        {/* Icon weather */}
        <div className="flex items-center order-1 sm:order-none">
          {loading ? (
            <span className="text-white text-sm">Cargando...</span>
          ) : (
            <img
              src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@4x.png`}
              alt={weatherData?.weather[0]?.description}
              className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-lg filter brightness-110 contrast-110"
            />
          )}
        </div>
        {/* Temperature and description */}
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-thin text-white leading-none">
            {loading ? "..." : `${Math.round(convertTemperature(weatherData?.main?.temp || 0, isCelsius))}°`}
          </div>
          <div className="capitalize text-white text-sm sm:text-base md:text-lg font-semibold mt-1">
            {loading
              ? "..."
              : weatherData?.weather[0]?.description || "Desconocido"}
          </div>
          <div className="text-white text-xs sm:text-sm mt-1">
            {loading
              ? "..."
              : `Sensación térmica ${Math.round(convertTemperature(weatherData?.main?.feels_like || 0, isCelsius))}°`}
          </div>
        </div>
      </div>
      {/* Weather details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <DetailCard
          characteristic="Amanecer"
          value={convertUnixToDate(weatherData?.sys?.sunrise)}
          icon={<Sunrise size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
        />
        <DetailCard
          characteristic="Atardecer"
          value={convertUnixToDate(weatherData?.sys?.sunset)}
          icon={<Sunset size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
        />
        <DetailCard
          characteristic="Humedad"
          value={`${weatherData?.main?.humidity || 0}%`}
          icon={<Droplets size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
        />
        <DetailCard
          characteristic="Viento"
          value={`${weatherData?.wind?.speed || 0} m/s`}
          icon={<Wind size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
        />
        <DetailCard
          characteristic="Presión"
          value={`${weatherData?.main?.pressure || 0} hPa`}
          icon={<Gauge size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
        />
        <DetailCard
          characteristic="Visibilidad"
          value={`${weatherData?.visibility || 0} m`}
          icon={<Eye size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
        />
      </div>
    </div>
  );
}
