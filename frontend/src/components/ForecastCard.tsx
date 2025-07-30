import React from "react";

interface ForecastCardProps {
  time: string;
  date: string;
  icon: string;
  avgTemperature: number;
  description?: string;
}

export default function ForecastCard({
  time,
  date,
  icon,
  avgTemperature,
  description,
}: ForecastCardProps) {
  return (
    <div className="bg-[#D9D9D9] flex flex-col items-center text-center shadow-md rounded-lg p-2 sm:p-3 hover:shadow-lg transition-shadow duration-200">
      <div className="w-full flex flex-col items-center justify-center">
        <h3 className="text-xs font-semibold text-gray-600 mb-1">{date}</h3>
        <h2 className="text-sm sm:text-base font-bold text-black mb-1">{time}</h2>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={description}
          className="w-12 sm:w-16 h-auto object-contain drop-shadow-lg filter brightness-110 contrast-110 mb-1"
        />
        <p className="text-sm sm:text-md text-black font-semibold">
          {avgTemperature}° 
        </p>
      </div>
    </div>
  );
}
