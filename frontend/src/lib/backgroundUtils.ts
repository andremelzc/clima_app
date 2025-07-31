const backgrounds: Record<string, string> = {
    // Temperatura (para días despejados)
    hot: "bg-gradient-to-t from-[#E4CD80] from-60% to-[#EB776C] to-100%", // amarillo-naranja a rojo
    cold: "bg-gradient-to-t from-[#292747] from-60% to-[#09072A] to-100%", // azul muy oscuro
    sunny: "bg-gradient-to-t from-[#f7b733] from-60% to-[#4fc3f7] to-100%", // dorado a azul cielo (templado)
    clear: "bg-gradient-to-t from-[#2c3e50] from-60% to-[#3498db] to-100%", // noche despejada

    // Condiciones específicas (siempre tienen prioridad) - Mejorados para mejor contraste
    cloudy: "bg-gradient-to-t from-[#7f8c8d] from-60% to-[#95a5a6] to-100%", // nublado más oscuro
    rainy: "bg-gradient-to-t from-[#34495e] from-60% to-[#2c3e50] to-100%", // lluvia
    stormy: "bg-gradient-to-t from-[#2c3e50] from-60% to-[#8e44ad] to-100%", // tormenta
    snowy: "bg-gradient-to-t from-[#a8c8d8] from-60% to-[#c8d6e5] to-100%", // nieve con más contraste
    foggy: "bg-gradient-to-t from-[#95a5a6] from-60% to-[#bdc3c7] to-100%", // niebla más oscura
  };

export function getBackgroundColor({temperature, description}: {temperature: number; description: string}): string {
  const condition = description.toLowerCase();
  
  // Condiciones específicas (prioridad alta)
  if (condition === "clouds") return backgrounds.cloudy;
  if (condition === "rain" || condition === "drizzle") return backgrounds.rainy;
  if (condition === "thunderstorm") return backgrounds.stormy;
  if (condition === "snow") return backgrounds.snowy;
  if (["mist", "fog", "haze", "smoke", "dust", "sand"].includes(condition)) return backgrounds.foggy;

  // Para "Clear" - decidir por temperatura
  if (condition === "clear") {
    if (temperature > 30) return backgrounds.hot;
    if (temperature < 10) return backgrounds.cold;
    return backgrounds.sunny; // Templado y despejado
  }

  // Fallback por temperatura si es una condición no reconocida
  if (temperature > 30) return backgrounds.hot;
  if (temperature < 10) return backgrounds.cold;
  
  return backgrounds.clear; // Default
}