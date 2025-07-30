const PORT_BACKEND = import.meta.env.PORT_BACKEND || 3000;
const API_BASE =
  import.meta.env.VITE_API_BASE || `http://localhost:${PORT_BACKEND}`;

export const getCurrentWeather = async (city: string, country: string) => {
  const response = await fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return response.json();
};

export const convertUnixToDate = (unixTimeStamp: number) => {
  const date = new Date(unixTimeStamp * 1000);
  return date.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const convertUnixToDateString = (unixTimeStamp: number) => {
  const date = new Date(unixTimeStamp * 1000);
  return date.toLocaleDateString("es-PE", {
    weekday: "short", // Lun, Mar, Mié
    day: "numeric",   // 1, 2, 3
    month: "short"    // Ene, Feb, Mar
  });
};
