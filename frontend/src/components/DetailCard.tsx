import React from "react";

const DetailCard = ({ 
  characteristic, 
  value, 
  icon 
}: { 
  characteristic: string; 
  value: string; 
  icon?: React.ReactNode;
}) => {
  return (
    <div className="bg-[#D9D9D9] flex flex-col items-start shadow-md rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon && <div className="text-[#7C7C7C]">{icon}</div>}
        <span className="text-[#7C7C7C] font-bold">{characteristic}</span>
      </div>
      <span className="text-black font-medium">{value}</span>
    </div>
  );
}

export default DetailCard;