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
    <div className="bg-[#D9D9D9] flex flex-col items-start shadow-md rounded-lg p-2 sm:p-2.5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
        {icon && (
          <div className="text-[#7C7C7C] flex-shrink-0">
            <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        <span className="text-[#7C7C7C] font-bold text-xs sm:text-sm md:text-base leading-tight">
          {characteristic}
        </span>
      </div>
      <span className="text-black font-medium text-sm sm:text-base md:text-lg leading-tight">
        {value}
      </span>
    </div>
  );
};

export default DetailCard;
