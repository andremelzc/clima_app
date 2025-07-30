import React from "react";

interface ForecastCardProps {
  time: string;
  icon: string;
  temperature: number;
  description: string;
}

export default function ForecastCard({time, icon, temperature, description}: ForecastCardProps) {
  return (
    <div className="bg-[#D9D9D9] flex flex-col items-center text-center shadow-md rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
      <div>
        <h2 className="text-lg font-bold text-black">{time}</h2>
        <img src={icon} alt={description} className="w-12 h-12" />
        <p className="text-xl text-black">{temperature}°</p>
        <p className="text-sm text-black">{description}</p>
      </div>
    </div>
  );
}
