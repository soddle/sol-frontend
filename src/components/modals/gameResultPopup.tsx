import Image from "next/image";
import * as React from "react";
import { useRouter } from "next/navigation";
import { KOL } from "@prisma/client";
import { useUiStore } from "@/stores/uiStore";
import { Share2, Trophy, Zap, Target, Crown, Swords } from "lucide-react";

// Glitch text effect component
const GlitchText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={`relative inline-block group ${className}`}>
    <span className="relative inline-block">
      {children}
      <span className="absolute left-[2px] top-0 w-full h-full text-[#ff0040] opacity-0 group-hover:animate-glitch-1">
        {children}
      </span>
      <span className="absolute left-[-2px] top-0 w-full h-full text-[#39FF14] opacity-0 group-hover:animate-glitch-2">
        {children}
      </span>
    </span>
  </span>
);

// Enhanced cyber button with particle effects
const CyberButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
    glowColor?: string;
  }
>(
  (
    {
      className,
      variant = "primary",
      glowColor = "#39FF14",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
        relative group overflow-hidden
        ${
          variant === "primary"
            ? "bg-gradient-to-r from-[#39FF14] to-[#32CD32] text-black hover:from-[#32CD32] hover:to-[#39FF14]"
            : "bg-[#000300] text-[#39FF14] border border-[#39FF14]/50 hover:border-[#39FF14]"
        }
        px-6 py-3 font-medium
        before:absolute before:inset-0
        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
        before:translate-x-[-200%] hover:before:translate-x-[200%]
        before:transition-transform before:duration-700
        after:absolute after:inset-0 after:bg-grid-white/[0.02]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]
        ${className}`}
        style={{
          clipPath:
            "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
        {...props}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:8px_8px]" />
        {children}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="particle absolute w-1 h-1 bg-[#39FF14] rounded-full opacity-0 group-hover:animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
                transform: `translateY(${Math.random() * 20}px)`,
              }}
            />
          ))}
        </div>
      </button>
    );
  }
);
CyberButton.displayName = "CyberButton";
export type PlayerStats = {
  rank: number;
  score: number;
  totalPlayers: number;
  attempts: number;
  duration: number;
};

export default function GameResultPopup({
  correctKOL,
  playerStats,
  playerAddress,
}: {
  correctKOL: KOL;
  playerStats: PlayerStats;
  playerAddress: string;
}) {
  const router = useRouter();
  const closeModal = useUiStore((state) => state.closeModal);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleShareOnX = () => {
    setIsLoading(true);
    const tweetText = encodeURIComponent(
      `🎮 Level Complete! Solved the crypto riddle in ${playerStats.duration}s on Soddle! Can you beat my highscore of ${playerStats.score}? 🏆 #Soddle #CryptoGaming`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* <div className="absolute inset-0 bg-[#000300]/95 backdrop-blur-xl animate-in fade-in duration-500">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(57,255,20,0.1) 0%, transparent 70%)",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
      </div> */}

      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-500">
        <div
          className="relative bg-[#000300]/90 border border-[#39FF14]/30 shadow-2xl backdrop-blur-sm"
          style={{
            clipPath:
              "polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))",
          }}
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px] animate-grid-flow pointer-events-none" />

          {/* Scanner effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent absolute top-0 animate-scan" />
            <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-[#39FF14] to-transparent absolute left-0 animate-scan-vertical" />
          </div>

          <div className="p-8 flex flex-col gap-6">
            {/* Profile Header */}
            <div className="relative flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-[-4px] rounded-full bg-[#39FF14] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-[#39FF14] to-[#32CD32] animate-spin-slow" />
                <div className="absolute inset-[1px] rounded-full bg-black" />
                <Image
                  src={correctKOL.pfp}
                  width={90}
                  height={90}
                  alt={correctKOL.name}
                  className="rounded-full relative z-10 transition-transform group-hover:scale-105"
                />
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#39FF14] to-[#32CD32] rounded-full p-2 z-20 shadow-lg shadow-[#39FF14]/20 animate-bounce">
                  <Trophy size={16} className="text-black" />
                </div>
              </div>
              <div>
                <GlitchText className="text-2xl font-bold tracking-wider text-[#39FF14] mb-1">
                  {correctKOL.name}
                </GlitchText>
                <div className="flex items-center gap-2 text-[#39FF14]/70">
                  <Swords className="animate-pulse" size={14} />
                  <span className="text-sm">Mission Accomplished</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <GameStatsCard
                icon={<Target size={20} className="text-[#39FF14]" />}
                value={playerStats.score}
                label="POINTS"
                isHighlight
              />
              <GameStatsCard
                icon={<Crown size={20} className="text-[#39FF14]" />}
                value={`#${playerStats.rank}`}
                label="RANK"
                isHighlight
              />
              <GameStatsCard value={`${playerStats.duration}s`} label="TIME" />
              <GameStatsCard value={playerStats.attempts} label="ATTEMPTS" />
            </div>

            {/* Achievement Banner */}
            <div className="relative mt-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14]/5 via-[#39FF14]/10 to-[#39FF14]/5" />
              <div className="relative bg-black/50 p-6 border border-[#39FF14]/20">
                <div className="absolute top-[-30%] right-[-30%] w-[100px] h-[100px] bg-[#39FF14]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-30%] left-[-30%] w-[100px] h-[100px] bg-[#39FF14]/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <p className="text-lg text-center text-[#39FF14]/90 italic font-light">
                  "{correctKOL.descriptions[0]}"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <CyberButton
                onClick={handleShareOnX}
                disabled={isLoading}
                className="flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                ) : (
                  <>
                    <Share2 size={18} />
                    Share Victory
                  </>
                )}
              </CyberButton>
              <CyberButton
                variant="secondary"
                onClick={() => {
                  closeModal();
                  router.push("/");
                }}
                className="flex items-center justify-center gap-2 group"
              >
                <Zap size={18} className="group-hover:animate-bounce" />
                Continue
              </CyberButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GameStatsCard = ({
  icon,
  value,
  label,
  isHighlight = false,
}: {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
  isHighlight?: boolean;
}) => (
  <div
    className="relative group cursor-pointer overflow-hidden"
    style={{
      clipPath:
        "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/10 to-transparent" />
    <div
      className={`
      relative p-4 
      ${
        isHighlight
          ? "bg-gradient-to-br from-black/80 to-black/40"
          : "bg-black/50"
      } 
      group-hover:bg-black/30 transition-colors duration-300
    `}
    >
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-3xl font-bold text-[#39FF14] mb-1 group-hover:animate-pulse">
        {value}
      </div>
      <div className="text-sm text-[#39FF14]/70">{label}</div>
    </div>
    <div className="absolute inset-0 border border-[#39FF14]/20 group-hover:border-[#39FF14]/40 transition-colors" />

    {/* Hover effects */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
      <div className="absolute inset-0 bg-[#39FF14]/5" />
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#39FF14]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#39FF14]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#39FF14]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#39FF14]" />
    </div>
  </div>
);
