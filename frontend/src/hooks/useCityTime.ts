import { useState, useEffect, useRef } from "react";
import { getTimezone } from "../services/cityApi";

interface TimezoneData {
  status: string;
  gmtOffset: number;
  zoneName: string;
  formatted: string;
  timestamp: number;
}

export function useCityTime(dataSelected: { city: string; country: string; lat: number; lon: number }) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const timeIntervalRef = useRef<number | null>(null);
  const timezoneDataRef = useRef<TimezoneData | null>(null);

  // Función para obtener la zona horaria de la ciudad seleccionada
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

  // Función para actualizar la hora actual de la ciudad
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

  // Limpiar interval al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Actualizar cada que se selecciona una nueva ciudad
  useEffect(() => {
    initializeTimezone();
  }, [dataSelected]);

  return { currentTime, currentDate };
}
