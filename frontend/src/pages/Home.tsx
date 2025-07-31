import {useState } from "react";
import Navbar from "../components/Navbar";
import MainCard from "../components/MainCard";
import SearchBar from "../components/SearchBar";
import UnitToggle from "../components/UnitToggle";
import ForecastCarousel from "../components/ForecastCarousel";
import { getBackgroundColor } from "../lib/backgroundUtils";

export default function Home() {
  const [isCelsius, setIsCelsius] = useState(true);
  const [dataSelected, setDataSelected] = useState({
    city: "Lima",
    country: "PE",
    lat: -12.0464,
    lon: -77.0428,
  });
  const [backgroundColor, setBackgroundColor] = useState(
    getBackgroundColor({ temperature: 20, description: "clear" })
  );

  return (
    <>
      <div
        className={`${backgroundColor} h-screen w-screen flex items-center justify-center relative`}
      >
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <Navbar />
          <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl flex items-center justify-center gap-4">
            <SearchBar
              dataSelected={dataSelected}
              setDataSelected={setDataSelected}
            />
            <UnitToggle
              isCelsius={isCelsius}
              onToggle={() => setIsCelsius(!isCelsius)}
            />
          </div>

          <MainCard
            dataSelected={dataSelected}
            isCelsius={isCelsius}
            setBackgroundColor={setBackgroundColor}
          />
          <ForecastCarousel dataSelected={dataSelected} isCelsius={isCelsius} />
        </div>
      </div>
    </>
  );
}
