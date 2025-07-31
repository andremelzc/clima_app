import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT_BACKEND = Number(process.env.PORT_BACKEND) || 3000;
const apiKey: string | undefined = process.env.OPENWEATHER_API_KEY;

app.use(cors());

app.listen(PORT_BACKEND, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT_BACKEND}`);
  console.log(`Network access: http://0.0.0.0:${PORT_BACKEND}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Clima App API!");
});

app.get("/api/weather", async (req: Request, res: Response) => {
  // 1. Check if apiKey is defined
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not defined" });
  }

  // 2. Check if the parameters are provided
  const city = req.query.city;
  const country = req.query.country;

  if (!city || !country) {
    return res.status(400).json({ error: "City and country are required" });
  }

  try {
    // 3. Fetch the weather data
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: `${city},${country}`,
          appid: apiKey,
          lang: "es",
          units: "metric",
        },
      }
    );

    // 4. Return the weather data
    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/forecast", async (req: Request, res: Response) => {
  // 1. Check if apiKey is defined
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not defined" });
  }
  
  // 2. Check if the parameters are provided
  const q = req.query.q as string;
  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required (format: 'City,Country')" });
  }

  try {
    console.log("Fetching forecast for:", q);
    // 3. Fetch the forecast data
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: q,
          appid: apiKey,
          lang: "es",
          units: "metric",
        },
      }
    );
    
    console.log("Forecast response received for:", q);
    // 4. Return the forecast data
    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching forecast data:", error.message);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

app.get("/api/cities/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const cities = require("./data/city.list.json");

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const filteredCities = cities
    .filter((city: { name: string }) =>
      city.name.toLowerCase().startsWith(query.toLowerCase())
    )
    .sort((a: any, b: any) => {
      // Priorizar coincidencias exactas
      const aExact = a.name.toLowerCase() === query.toLowerCase();
      const bExact = b.name.toLowerCase() === query.toLowerCase();

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Luego por longitud (más corto = más relevante)
      return a.name.length - b.name.length;
    })
    // Eliminar duplicados basado en nombre + país
    .filter(
      (city: any, index: number, array: any[]) =>
        array.findIndex(
          (c) =>
            c.name.toLowerCase() === city.name.toLowerCase() &&
            c.country === city.country
        ) === index
    )
    .slice(0, 8);

  res.json(filteredCities);
});

app.get("/api/timezone", async (req: Request, res: Response) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const response = await axios.get(`http://api.timezonedb.com/v2.1/get-time-zone`, {
      params: {
        key: process.env.TIMEZONE_API_KEY,
        format: "json",
        by: "position",
        lat: lat,
        lng: lon,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching timezone data:", error.message);
    res.status(500).json({ error: "Failed to fetch timezone data" });
  }
});
