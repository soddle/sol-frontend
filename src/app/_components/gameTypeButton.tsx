import { GameType } from "@/lib/constants";
import { useState } from "react";

interface GameButtonType {
  type: GameType;
  title: string;
  icon: string | React.ReactNode;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  buyIn?: string;
}

export const GameButton = ({
  title,
  onClick,
  icon,
  description,
  disabled = false,
  buyIn = "0.02 SOL",
}: GameButtonType) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-75 blur group-hover:opacity-100 transition duration-1000 animate-gradient-xy"></div>

      <button
        className={`
          relative 
          w-full
          bg-[#111411] 
          p-6
          text-white 
          transition-all 
          duration-300 
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          overflow-hidden
        `}
        onClick={() => !disabled && onClick()}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          clipPath:
            "polygon(3% 0, 97% 0, 100% 5%, 100% 95%, 97% 100%, 3% 100%, 0 95%, 0 5%)",
        }}
      >
        {/* Cyber grid background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-green-500 group-hover:animate-pulse" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-green-500 group-hover:animate-pulse" />

        {/* Animated hover effect */}
        <div
          className={`
            absolute inset-0 
            bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 
            transition-transform duration-1000
            ${isHovered ? "translate-x-full" : "-translate-x-full"}
          `}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex gap-2 items-center justify-center mb-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
              {title}
            </h1>
            <span className="transform transition-transform group-hover:scale-110">
              {icon}
            </span>
          </div>

          <p className="text-center text-white/70 mb-3 transition-colors group-hover:text-white">
            {description}
          </p>

          <div className="relative">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent my-3" />
            <p className="text-center text-sm">
              <span className="text-white/50 group-hover:text-white/70 transition-colors">
                Buy-in:
              </span>
              <span className="ml-2 text-green-400 group-hover:text-green-300 transition-colors font-mono">
                {buyIn}
              </span>
            </p>
          </div>
        </div>

        {/* Animated border glow */}
        <div className="absolute inset-0 border border-green-500/30">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent group-hover:animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent group-hover:animate-pulse" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-green-500 to-transparent group-hover:animate-pulse" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-green-500 to-transparent group-hover:animate-pulse" />
        </div>
      </button>
    </div>
  );
};

export default GameButton;
