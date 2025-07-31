// Detectar automáticamente el ambiente
const isProduction = import.meta.env.PROD;
const API_BASE = isProduction 
  ? 'https://clima-app-m1hv.onrender.com' 
  : `http://localhost:3000`;

export const getCities = async (query: string) => {
  const response = await fetch(`${API_BASE}/api/cities/search?q=${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch city data");
  }
  return response.json();
};

export const getTimezone = async (lat: number, lon: number) => {
  const response = await fetch(
    `${API_BASE}/api/timezone?lat=${lat}&lon=${lon}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch timezone data");
  }
  return response.json();
};

export const getForecast = async (query: string) => {
  const response = await fetch(`${API_BASE}/api/forecast?q=${query}`);
  if (!response.ok) {
    throw new Error("Failed to fetch forecast data");
  }
  const data = await response.json();
  return data.list;
}