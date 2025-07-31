import React from "react";

const DetailCard = ({
  characteristic,
  value,
  icon,
}: {
  characteristic: string;
  value: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="group bg-[#D9D9D9] flex flex-col items-start shadow-md rounded-lg p-2 sm:p-2.5 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-gray-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
      
      <div className="flex flex-col items-start relative z-10 w-full">
        <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
          {icon && (
            <div className="text-[#7C7C7C] group-hover:text-gray-600 transition-colors duration-300 flex-shrink-0">
              <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
            </div>
          )}
          <span className="text-[#7C7C7C] group-hover:text-gray-600 font-bold text-xs sm:text-sm md:text-base leading-tight transition-colors duration-300">
            {characteristic}
          </span>
        </div>
        <span className="text-black group-hover:text-gray-900 font-medium text-sm sm:text-base md:text-lg leading-tight transition-colors duration-300">
          {value}
        </span>
      </div>
    </div>
  );
};

export default DetailCard;
