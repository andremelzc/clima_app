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
    <div className="group bg-[#D9D9D9] flex flex-col items-center text-center shadow-md rounded-lg p-2 sm:p-3 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-gray-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
      
      <div className="w-full flex flex-col items-center justify-center relative z-10">
        <h3 className="text-xs font-semibold text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-300">{date}</h3>
        <h2 className="text-sm sm:text-base font-bold text-black mb-1 group-hover:text-gray-900 transition-colors duration-300">{time}</h2>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={description}
          className="w-12 sm:w-16 h-auto object-contain drop-shadow-lg filter brightness-110 contrast-110 mb-1 group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-300"
        />
        <p className="text-sm sm:text-md text-black font-semibold group-hover:text-gray-900 transition-colors duration-300">
          {avgTemperature}° 
        </p>
      </div>
    </div>
  );
}
