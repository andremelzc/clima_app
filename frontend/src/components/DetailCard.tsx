import React from "react";

const DetailCard = ({ characteristic, value }: { characteristic: string; value: string }) => {
  return (
    <div className="bg-[#D9D9D9] flex flex-col items-start shadow-md rounded-lg p-4">
      <span className="text-[#7C7C7C] font-bold">{characteristic}</span>
      <span className="text-black">{value}</span>
    </div>
  );
}

export default DetailCard;