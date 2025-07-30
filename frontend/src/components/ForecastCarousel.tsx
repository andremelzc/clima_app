import { useState, useEffect } from "react";
import ForecastCard from "./ForecastCard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getForecast } from "../services/cityApi";
import { convertUnixToDate, convertUnixToDateString } from "../services/weatherApi";
import { convertTemperature } from "../lib/temperatureUtils";

// Componente para el botón de flecha personalizado
function CustomArrow({ className, style, onClick, direction }: any) {
  return (
    <button
      className={`${className} !flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      {direction === "prev" ? (
        <ArrowLeft className="w-5 h-5" />
      ) : (
        <ArrowRight className="w-5 h-5" />
      )}
    </button>
  );
}

interface ForecastCarouselProps {
  dataSelected: { city: string; country: string; lat: number; lon: number };
  isCelsius: boolean;
}

export default function ForecastCarousel({
  dataSelected,
  isCelsius,
}: ForecastCarouselProps) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    arrows: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ForecastCarousel - useEffect triggered with:", {
      city: dataSelected.city,
      country: dataSelected.country
    });
    
    const fetchForecast = async () => {
      // No hacer fetch si no hay ciudad seleccionada
      if (!dataSelected.city || !dataSelected.country) {
        console.log("ForecastCarousel - No city or country selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("ForecastCarousel - Fetching forecast for:", `${dataSelected.city},${dataSelected.country}`);
        const data = await getForecast(
          `${dataSelected.city},${dataSelected.country}`
        );
        setForecastData(data || []);
        console.log("ForecastCarousel - Forecast data fetched for:", dataSelected.city, data);
      } catch (error) {
        console.error("ForecastCarousel - Error fetching forecast data:", error);
        setForecastData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [dataSelected.city, dataSelected.country]); // Dependencias específicas en lugar del objeto completo

  return (
    <div className="group w-full max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto bg-gradient-to-br from-white/5 to-white/15 opacity-75 py-3 sm:py-4 md:py-6 lg:py-8  px-4 sm:px-6 md:px-8 lg:px-10 shadow-md rounded-xl backdrop-blur-md relative">
      {loading ? (
        <div className="text-center text-white py-8">Loading forecast...</div>
      ) : forecastData.length > 0 ? (
        <Slider {...settings}>
          {forecastData.map((forecastItem: any) => (
            <div className="px-1" key={forecastItem.dt}>
              <ForecastCard
                date={convertUnixToDateString(forecastItem.dt)}
                time={convertUnixToDate(forecastItem.dt)}
                icon={forecastItem.weather[0].icon}
                avgTemperature={convertTemperature(
                  forecastItem.main.temp,
                  isCelsius
                )}
                description={forecastItem.weather[0].description}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center text-white py-8">
          No forecast data available
        </div>
      )}
    </div>
  );
}
