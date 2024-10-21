import * as React from "react";
import { Loader2, Lock, Sparkles, ChevronRight, Star } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

// Cyberpunk button variants and sizes configuration
const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-medium transition-all duration-300 disabled:pointer-events-none overflow-hidden group",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#39FF14] to-[#32CD32] text-black hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]",
        secondary:
          "bg-[#000300] text-[#39FF14] border border-[#39FF14]/50 hover:border-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]",
        danger:
          "bg-gradient-to-r from-[#FF0040] to-[#FF4D4D] text-white hover:shadow-[0_0_20px_rgba(255,0,64,0.5)]",
        ghost: "bg-transparent text-[#39FF14] hover:bg-[#39FF14]/10",
        legendary:
          "bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-black hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
      glitch: {
        true: "hover:after:animate-glitch-skew",
        false: "",
      },
      neon: {
        true: "shadow-[0_0_10px_rgba(57,255,20,0.3)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      glitch: false,
      neon: false,
    },
  }
);

interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  particles?: boolean;
  scanline?: boolean;
  locked?: boolean;
  glowColor?: string;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      glitch = false,
      neon = false,
      isLoading = false,
      particles = false,
      scanline = false,
      locked = false,
      disabled,
      glowColor = "#39FF14",
      children,
      ...props
    },
    ref
  ) => {
    const [buttonHover, setButtonHover] = React.useState(false);

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled || locked}
        className={buttonVariants({ variant, size, glitch, neon, className })}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
        style={{
          clipPath:
            "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
        {...props}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:8px_8px]" />

        {/* Scanline effect */}
        {scanline && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent absolute animate-scan" />
          </div>
        )}

        {/* Particle effects */}
        {particles && buttonHover && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="particle absolute w-1 h-1 rounded-full opacity-0 animate-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor:
                    variant === "primary"
                      ? "#39FF14"
                      : variant === "danger"
                      ? "#FF0040"
                      : variant === "legendary"
                      ? "#FFD700"
                      : "#39FF14",
                  animationDelay: `${Math.random() * 1000}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Corner decorations */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute top-0 left-0 w-2 h-2 border-l border-t"
            style={{ borderColor: glowColor }}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 border-r border-t"
            style={{ borderColor: glowColor }}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 border-l border-b"
            style={{ borderColor: glowColor }}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 border-r border-b"
            style={{ borderColor: glowColor }}
          />
        </div>

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {locked && <Lock className="h-4 w-4" />}
          {children}
        </span>
      </button>
    );
  }
);

// Menu button with hover effects
const MenuButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <CyberButton
        ref={ref}
        variant="ghost"
        className={`
          group relative w-full text-left px-4 py-3 
          hover:translate-x-1 hover:pl-6
          transition-all duration-300 ease-out
          ${className}
        `}
        {...props}
      >
        <ChevronRight
          className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
          size={18}
        />
        {children}
      </CyberButton>
    );
  }
);

// Achievement button with special effects
const AchievementButton = React.forwardRef<
  HTMLButtonElement,
  CyberButtonProps & { achieved?: boolean }
>(({ className, achieved = false, children, ...props }, ref) => {
  return (
    <CyberButton
      ref={ref}
      variant={achieved ? "legendary" : "secondary"}
      className={`
          relative overflow-hidden
          ${achieved ? "hover:animate-pulse" : "opacity-70"}
          ${className}
        `}
      {...props}
    >
      {achieved && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full animate-shine" />
          <Star className="absolute top-1 right-1 w-4 h-4 text-yellow-300 animate-pulse" />
        </div>
      )}
      {children}
    </CyberButton>
  );
});

// Action button with energize effect
const ActionButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <CyberButton
        ref={ref}
        variant="primary"
        className={`
          group relative 
          before:absolute before:inset-0
          before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
          before:translate-x-[-200%] hover:before:translate-x-[200%]
          before:transition-transform before:duration-700
          hover:scale-105
          ${className}
        `}
        particles
        scanline
        {...props}
      >
        <Sparkles
          className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          size={16}
        />
        {children}
      </CyberButton>
    );
  }
);

// Premium button with rainbow effect
const PremiumButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <CyberButton
        ref={ref}
        className={`
          relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
          animate-gradient-x text-white font-bold
          before:absolute before:inset-0 before:bg-black/20
          hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]
          ${className}
        `}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-[#FF69B4]/10 to-[#FF1493]/10 animate-pulse" />
        {children}
      </CyberButton>
    );
  }
);

// Export all components
export {
  CyberButton,
  MenuButton,
  AchievementButton,
  ActionButton,
  PremiumButton,
  buttonVariants,
};
