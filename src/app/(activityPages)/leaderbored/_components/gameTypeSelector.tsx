import React from "react";

interface GameTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const GameTypeSelector: React.FC<GameTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const gameTypes = ["Attributes", "Tweets", "Emojis"];

  return (
    <div className="flex justify-center space-x-2 my-4 px-2 overflow-x-auto">
      {gameTypes.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`
            relative px-2 py-2 sm:px-3 md:px-4 lg:px-6
            text-xs sm:text-sm md:text-base lg:text-lg font-bold 
            transition-all duration-300 ease-in-out
            flex-shrink-0
            ${
              type === selectedType
                ? "text-green-400"
                : "text-white hover:text-green-400"
            }
            focus:outline-none
          `}
        >
          <span className="relative z-10 whitespace-nowrap">{type}</span>
          <span
            className={`
              absolute inset-0 bg-[#181716] transform skew-x-[-10deg]
              ${
                type === selectedType
                  ? "border-2 border-green-600"
                  : "border border-[#2A342A]"
              }
            `}
          ></span>
          {type === selectedType && (
            <>
              <span className="absolute inset-0 bg-green-900 opacity-50 transform skew-x-[-10deg]"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-20 blur transform skew-x-[-10deg]"></span>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default GameTypeSelector;
