import { useState } from "react";
import MainCard from "../components/MainCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [clima, setClima] = useState("cold");
  const [dataSelected, setDataSelected] = useState({ city: "Lima", country: "PE", lat: -12.0464, lon: -77.0428 });

  console.log("Home - dataSelected:", dataSelected); // Debug log

  const backgrounds: Record<string, string> = {
    // Temperatura (para días despejados)
    hot: "bg-gradient-to-t from-[#E4CD80] from-60% to-[#EB776C] to-100%", // amarillo-naranja a rojo
    cold: "bg-gradient-to-t from-[#292747] from-60% to-[#09072A] to-100%", // azul muy oscuro
    sunny: "bg-gradient-to-t from-[#f7b733] from-60% to-[#4fc3f7] to-100%", // dorado a azul cielo (templado)
    clear: "bg-gradient-to-t from-[#2c3e50] from-60% to-[#3498db] to-100%", // noche despejada

    // Condiciones específicas (siempre tienen prioridad)
    cloudy: "bg-gradient-to-t from-[#bdc3c7] from-60% to-[#95a5a6] to-100%", // nublado
    rainy: "bg-gradient-to-t from-[#34495e] from-60% to-[#2c3e50] to-100%", // lluvia
    stormy: "bg-gradient-to-t from-[#2c3e50] from-60% to-[#8e44ad] to-100%", // tormenta
    snowy: "bg-gradient-to-t from-[#e8f4f8] from-60% to-[#d6eaf8] to-100%", // nieve
    foggy: "bg-gradient-to-t from-[#ecf0f1] from-60% to-[#bdc3c7] to-100%", // niebla
  };

  return (
    <>
      <div
        className={`${backgrounds[clima]} h-screen w-screen flex items-center justify-center relative`}
      >
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <SearchBar
            setDataSelected={setDataSelected}
          />
          <MainCard
            dataSelected={dataSelected}
          />
        </div>
      </div>
    </>
  );
}
