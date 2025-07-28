
/**
 * Convierte temperatura de Celsius a Fahrenheit
 * @param celsius - Temperatura en grados Celsius
 * @returns Temperatura en grados Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

/**
 * Convierte temperatura de Fahrenheit a Celsius
 * @param fahrenheit - Temperatura en grados Fahrenheit
 * @returns Temperatura en grados Celsius
 */
export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

/**
 * Formatea la temperatura con la unidad correspondiente
 * @param temp - Temperatura numérica
 * @param isCelsius - Si es true muestra °C, si es false muestra °F
 * @returns String formateado con la temperatura y unidad
 */
export const formatTemperature = (temp: number, isCelsius: boolean): string => {
  const roundedTemp = Math.round(temp);
  return `${roundedTemp}°${isCelsius ? 'C' : 'F'}`;
};

/**
 * Convierte temperatura según la unidad deseada
 * @param temp - Temperatura base en Celsius
 * @param isCelsius - Si es true devuelve Celsius, si es false convierte a Fahrenheit
 * @returns Temperatura en la unidad solicitada
 */
export const convertTemperature = (temp: number, isCelsius: boolean): number => {
  return isCelsius ? temp : celsiusToFahrenheit(temp);
};
