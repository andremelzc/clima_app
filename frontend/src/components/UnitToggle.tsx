
interface UnitToggleProps {
  isCelsius: boolean;
  onToggle: () => void;
}

export default function UnitToggle({ isCelsius, onToggle }: UnitToggleProps) {

  return (
    <div className="relative">
      <button
        className="relative w-20 h-12 rounded-xl shadow-xl border border-white/20 outline-none transition-all duration-300 cursor-pointer backdrop-blur-lg"
        onClick={() => onToggle()}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background:
            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.25))",
          outline: "none",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "0.75rem",
        }}
      >
        {/* Círculo que se mueve */}
        <div
          className={`absolute top-1 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-xl transition-all duration-300 flex items-center justify-center text-gray-800 text-sm font-bold border border-white/30 ${
            isCelsius ? "left-2" : "left-8"
          }`}
        >
          {isCelsius ? "°C" : "°F"}
        </div>
      </button>
    </div>
  );
}
