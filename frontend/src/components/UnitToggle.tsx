import React, { useState } from "react";

export default function UnitToggle() {
  const [isCelsius, setIsCelsius] = useState(true);

  return (
    <div className="relative">
      <button
        className="relative w-20 h-10 rounded-xl shadow-md border-0 outline-none transition-all duration-300 cursor-pointer"
        onClick={() => setIsCelsius(!isCelsius)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background:
            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.15))",
          outline: "none",
          border: "none",
          borderRadius: "0.75rem",
        }}
      >
        {/* Círculo que se mueve */}
        <div
          className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-gray-800 text-sm font-bold ${
            isCelsius ? "left-2" : "left-10"
          }`}
        >
          {isCelsius ? "°C" : "°F"}
        </div>
      </button>
    </div>
  );
}
