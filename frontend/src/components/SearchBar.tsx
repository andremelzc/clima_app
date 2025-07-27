import React, { useState, useRef, useEffect } from "react";
import { Search, Globe, MapPin } from "lucide-react";
import { getCities } from "../services/cityApi";

interface SearchBarProps {
  setDataSelected: (data: { city: string; country: string; lat: number; lon: number }) => void;
}

export default function SearchBar({ setDataSelected }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleCitySelect = (city: { name: string; country: string; coord: { lat: number; lon: number } }) => {
    console.log("Selected city:", city);
    console.log("Setting dataSelected to:", { city: city.name, country: city.country });
    setIsOpen(false);
    setSearchQuery(city.name); // Actualizar el input con la ciudad seleccionada
    setDataSelected({
      city: city.name,
      country: city.country,
      lat: city.coord.lat,
      lon: city.coord.lon,
    });
    console.log("Data selected updated:", { 
      city: city.name, 
      country: city.country, 
      lat: city.coord.lat, 
      lon: city.coord.lon 
    });
  };

  const searchCities = async (query: string) => {
    if (query.trim().length < 2) {
      setCities([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getCities(query);
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCities(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim() === "") {
      setIsOpen(false);
      setCities([]);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    window.history.replaceState(
      {},
      "",
      `?q=${encodeURIComponent(searchQuery)}`
    );
  }, [searchQuery]);

  return (
    <>
      {/* Overlay de fondo oscuro */}
      {isOpen && <div className="fixed inset-0 backdrop-blur-sm z-40" />}

      <div className="flex-1 relative z-50" ref={dropdownRef}>
        <div className="w-full bg-gradient-to-br from-white/5 to-white/15 opacity-75 p-2 shadow-md rounded-xl backdrop-blur-lg">
          <form>
            <Search className="absolute left-4 text-white" />
            <input
              type="search"
              placeholder="Buscar la ciudad que desees!"
              className="w-full text-sm bg-transparent focus:outline-none pl-12"
              aria-label="Buscar ciudad"
              onChange={handleSearch}
              onFocus={handleInputFocus}
            />
          </form>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 w-full p-4">
            {searchQuery.trim() === "" ? (
              <div className="w-full flex flex-col items-center justify-center p-6 text-gray-500">
                <Globe className="w-6 h-6 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  Escribe el nombre de tu ciudad
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Busca cualquier ciudad del mundo
                </p>
              </div>
            ) : isLoading ? (
              <div className="w-full flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-600">
                  Buscando ciudades...
                </span>
              </div>
            ) : cities.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center p-6 text-gray-500">
                <MapPin className="w-6 h-6 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  No se encontraron ciudadades
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Intente con otro nombre
                </p>
              </div>
            ) : (
              <div className="w-full gap-4 p-2 text-gray-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {cities.map((city) => (
                    <div
                      key={city.id}
                      className="group relative flex items-center p-3 rounded-xl bg-white border border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 active:scale-95"
                      onClick={() => handleCitySelect(city)}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Icon */}
                      <div className="relative z-10 p-1.5 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
                        <MapPin className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>

                      {/* City name */}
                      <div className="relative z-10 flex-1 min-w-0 mx-3">
                        <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 truncate transition-colors duration-300">
                          {city.name}
                        </p>
                        <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 mt-1" />
                      </div>

                      {/* Flag */}
                      <div className="relative z-10 p-1 rounded-md bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                        <img
                          src={`https://flagsapi.com/${city.country}/flat/64.png`}
                          alt={`Bandera de ${city.name}`}
                          className="w-6 h-6 rounded-sm object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                    </div>
                  ))}
                </div>
                <div className="w-full flex flex-col items-center justify-center mt-4 text-gray-500">
                  <p className="text-sm font-medium text-gray-600">
                    Los resultados se limitan a 8 ciudades
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Escribe el nombre completo de la ciudad para más precisión
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
