import { GameType } from "@/lib/constants";

interface GameButtonType {
  type: GameType;
  title: string;
  icon: string | React.ReactNode;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  buyIn?: string; // New prop for buy-in amount
}

export const GameButton = ({
  title,
  onClick,
  icon,
  description,
  disabled = false,
  buyIn = "0.02 SOL", // Default buy-in amount
}: GameButtonType) => {
  const linkStyle =
    "bg-[#111411] border border-[#03B500] border-opacity-50 p-4 text-white text-lg transition-all duration-300 ease-in-out";
  const enabledStyle =
    "hover:drop-shadow-[0_0_10px_rgba(47,255,43,1)] hover:shadow-[0_0_20px_rgba(47,255,43,0.5)]";
  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      className={`${linkStyle} ${
        disabled ? disabledStyle : enabledStyle
      } relative overflow-hidden`}
      onClick={() => !disabled && onClick()}
      disabled={disabled}
    >
      <div className="flex gap-2 items-center justify-center mb-3">
        <h1>{title}</h1>
        <span>{icon}</span>
      </div>
      <p className="text-center text-white/70">{description}</p>
      <p className="text-center text-white/50 text-sm mt-2">Buy-in: {buyIn}</p>
    </button>
  );
};
