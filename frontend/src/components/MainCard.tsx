import { useState, useEffect, useMemo } from "react";
import DetailCard from "./DetailCard";
import { Sunrise, Sunset, Droplets, Wind, Gauge, Eye } from "lucide-react";
import { getCurrentWeather, convertUnixToDate } from "../services/weatherApi";
import { convertTemperature } from "../lib/temperatureUtils";
import { useCityTime } from "../hooks/useCityTime";
import { getBackgroundColor } from "../lib/backgroundUtils";

interface MainCardProps {
  dataSelected: { city: string; country: string; lat: number; lon: number };
  isCelsius: boolean;
  setBackgroundColor: (color: string) => void;
}

export default function MainCard({
  dataSelected,
  isCelsius,
  setBackgroundColor,
}: MainCardProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Hook para obtener la hora de la ciudad
  const { currentTime, currentDate } = useCityTime(dataSelected);

  // Memoización de datos calculados para optimizar renders
  const memoizedTemperatureData = useMemo(() => {
    if (!weatherData?.main) return null;

    return {
      currentTemp: Math.round(
        convertTemperature(weatherData.main.temp, isCelsius)
      ),
      feelsLike: Math.round(
        convertTemperature(weatherData.main.feels_like, isCelsius)
      ),
      description: weatherData.weather?.[0]?.description || "Desconocido",
    };
  }, [
    weatherData?.main?.temp,
    weatherData?.main?.feels_like,
    weatherData?.weather?.[0]?.description,
    isCelsius,
  ]);

  // Memoización del color de fondo
  const memoizedBackgroundColor = useMemo(() => {
    if (!weatherData?.main?.temp || !weatherData?.weather?.[0]?.description) {
      return getBackgroundColor({ temperature: 20, description: "clear" });
    }

    return getBackgroundColor({
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
    });
  }, [weatherData?.main?.temp, weatherData?.weather?.[0]?.description]);

  // Función para obtener el clima de una ciudad
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
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cada que se selecciona una nueva ciudad
  useEffect(() => {
    fetchWeatherData();
  }, [dataSelected]);

  // Actualizar background cuando weatherData cambie
  useEffect(() => {
    setBackgroundColor(memoizedBackgroundColor);
  }, [memoizedBackgroundColor, setBackgroundColor]);

  return (
    <div className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/25 opacity-90 p-4 sm:p-4 md:p-6 lg:p-8 shadow-xl rounded-xl backdrop-blur-lg border border-white/20">
      {/* Time */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-xs sm:text-sm font-medium">
        <div className="flex flex-col items-end text-right">
          <span className="text-white text-xs sm:text-sm font-semibold drop-shadow-lg">
            {loading ? (
              <div className="h-3 sm:h-4 bg-white/30 rounded w-12 animate-pulse"></div>
            ) : (
              currentTime || "..."
            )}
          </span>
          <span className="text-white/80 text-[10px] sm:text-xs drop-shadow-md">
            {loading ? (
              <div className="h-2 sm:h-3 bg-white/20 rounded w-16 animate-pulse mt-1"></div>
            ) : (
              currentDate || "..."
            )}
          </span>
        </div>
      </div>
      {/* Main weather */}
      <div className="pt-8 sm:pt-2 p-2 sm:p-4 lg:p-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-6">
        {/* Icon weather */}
        <div className="flex items-center order-1 sm:order-none">
          {loading ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-white/30 rounded-full animate-pulse"></div>
          ) : (
            <img
              src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@4x.png`}
              alt={weatherData?.weather[0]?.description}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 drop-shadow-lg filter brightness-110 contrast-110"
            />
          )}
        </div>
        {/* Temperature and description */}
        <div className="flex flex-col items-center text-center">
          <div className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-thin text-white leading-none drop-shadow-2xl">
            {loading ? (
              <div className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 bg-white/30 rounded w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 animate-pulse"></div>
            ) : (
              `${memoizedTemperatureData?.currentTemp || 0}°`
            )}
          </div>
          <div className="capitalize text-white text-sm sm:text-base md:text-lg font-semibold mt-1 drop-shadow-lg">
            {loading ? (
              <div className="h-4 sm:h-5 md:h-6 bg-white/20 rounded w-20 sm:w-24 md:w-28 animate-pulse"></div>
            ) : (
              memoizedTemperatureData?.description || "Desconocido"
            )}
          </div>
          <div className="text-white text-xs sm:text-sm mt-1 drop-shadow-md">
            {loading ? (
              <div className="h-3 sm:h-4 bg-white/20 rounded w-24 sm:w-28 animate-pulse"></div>
            ) : (
              `Sensación térmica ${memoizedTemperatureData?.feelsLike || 0}°`
            )}
          </div>
        </div>
      </div>
      {/* Weather details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3 md:gap-4 mt-4">
        {loading ? (
          <>
            {/* Skeleton for DetailCards */}
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-[#D9D9D9]/50 animate-pulse flex flex-col items-start shadow-md rounded-lg p-2 sm:p-2.5"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                  {/* Icon skeleton */}
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/30 rounded flex-shrink-0"></div>
                  {/* Characteristic name skeleton */}
                  <div className="h-3 sm:h-4 bg-white/30 rounded w-12 sm:w-16"></div>
                </div>
                {/* Value skeleton */}
                <div className="h-4 sm:h-5 bg-white/20 rounded w-16 sm:w-20"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <DetailCard
              characteristic="Amanecer"
              value={convertUnixToDate(weatherData?.sys?.sunrise)}
              icon={
                <Sunrise size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              }
            />
            <DetailCard
              characteristic="Atardecer"
              value={convertUnixToDate(weatherData?.sys?.sunset)}
              icon={
                <Sunset size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              }
            />
            <DetailCard
              characteristic="Humedad"
              value={`${weatherData?.main?.humidity || 0}%`}
              icon={
                <Droplets size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              }
            />
            <DetailCard
              characteristic="Viento"
              value={`${weatherData?.wind?.speed || 0} m/s`}
              icon={<Wind size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            />
            <DetailCard
              characteristic="Presión"
              value={`${weatherData?.main?.pressure || 0} hPa`}
              icon={<Gauge size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            />
            <DetailCard
              characteristic="Visibilidad"
              value={`${weatherData?.visibility || 0} m`}
              icon={<Eye size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            />
          </>
        )}
      </div>
    </div>
  );
}
