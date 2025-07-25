import React, { useState, useRef, useEffect } from "react";
import { Search, Globe } from "lucide-react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      {/* Overlay de fondo oscuro */}
      {isOpen && <div className="fixed inset-0 backdrop-blur-sm z-40" />}

      <div className="w-full max-w-4xl relative z-50" ref={dropdownRef}>
        <div className="w-full max-w-4xl bg-gradient-to-br from-white/5 to-white/15 opacity-75 p-2 shadow-md rounded-xl backdrop-blur-lg">
          <form>
            <Search className="absolute left-4 text-white" />
            <input
              type="text"
              placeholder="Buscar la ciudad que desees!"
              className="w-full text-sm bg-transparent focus:outline-none pl-12"
              aria-label="Buscar ciudad"
              onFocus={handleInputFocus}
            />
          </form>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 w-full max-w-4xl p-4">
            {searchQuery.trim() === "" ? (
              <div className="w-full flex items-center justify-center p-4 text-gray-600 gap-2">
                <Globe className="w-5 h-5 text-gray-600" />
                <p className="text-center font-bold">Escribe el nombre de tu ciudad</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
