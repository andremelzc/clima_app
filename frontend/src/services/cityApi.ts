const PORT_BACKEND = import.meta.env.PORT_BACKEND || 3000;
const API_BASE =
  import.meta.env.VITE_API_BASE || `http://localhost:${PORT_BACKEND}`;

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
  console.log("Forecast data list fetched:", data.list);
  return data.list;
}