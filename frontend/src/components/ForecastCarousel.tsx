import ForecastCard from "./ForecastCard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

export default function ForecastCarousel() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
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

  return (
    <div className="group w-full max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto bg-gradient-to-br from-white/5 to-white/15 opacity-75 py-3 sm:py-4 md:py-6 lg:py-8  px-4 sm:px-6 md:px-8 lg:px-10 lg:px-12 shadow-md rounded-xl backdrop-blur-md relative">
      <Slider {...settings}>
        <div className="px-2">
          <ForecastCard
            time="12:00 PM"
            icon="/path/to/icon.png"
            temperature={25}
            description="Sunny"
          />
        </div>
        <div className="px-2">
          <ForecastCard
            time="1:00 PM"
            icon="/path/to/icon.png"
            temperature={27}
            description="Partly Cloudy"
          />
        </div>
        <div className="px-2">
          <ForecastCard
            time="2:00 PM"
            icon="/path/to/icon.png"
            temperature={28}
            description="Cloudy"
          />
        </div>
        <div className="px-2">
          <ForecastCard
            time="3:00 PM"
            icon="/path/to/icon.png"
            temperature={26}
            description="Rain"
          />
        </div>
        <div className="px-2">
          <ForecastCard
            time="4:00 PM"
            icon="/path/to/icon.png"
            temperature={24}
            description="Stormy"
          />
        </div>
      </Slider>
    </div>
  );
}
