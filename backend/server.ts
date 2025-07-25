import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT_BACKEND = process.env.PORT_BACKEND ?? 3000;
const apiKey = process.env.OPENWEATHER_API_KEY;

app.use(cors());

app.listen(PORT_BACKEND, () => {
  console.log(`Server is running at http://localhost:${PORT_BACKEND}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Clima App API!");
});

app.get("/api/weather", async (req, res) => {
  // 1. Check if apiKey is defined
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not defined" });
  }

  // 2. Check if the parameters are provided
  const city = req.query.city ?? "Lima";
  const country = req.query.country ?? "PE";

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

app.get("/api/forecast", async (req, res) => {
  // 1. Check if apiKey is defined
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not defined" });
  }
  // 2. Check if the parameters are provided
  const city = req.query.city ?? "Lima";
  const country = req.query.country ?? "PE";
  if (!city || !country) {
    return res.status(400).json({ error: "City and country are required" });
  }

  try {
    // 3. Fetch the forecast data
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: `${city},${country}`,
          appid: apiKey,
          lang: "es",
          units: "metric",
        },
      }
    );
    // 4. Return the forecast data
    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching forecast data:", error.message);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

app.get("/api/cities/search", async (req, res) => {
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
    .filter((city: any, index: number, array: any[]) => 
      array.findIndex(c => 
        c.name.toLowerCase() === city.name.toLowerCase() && 
        c.country === city.country
      ) === index
    )
    .slice(0, 8);

  res.json(filteredCities);
});
