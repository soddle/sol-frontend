import React, { useEffect, useState } from "react";

const CyberpunkLoader = ({ className = "" }) => {
  const [loadingText, setLoadingText] = useState("Initializing");

  // Cycle through different loading messages
  useEffect(() => {
    const messages = [
      "Initializing",
      "Connecting",
      "Processing",
      "Syncing",
      "Loading",
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${className}`}
    >
      {/* Outer rotating hexagon */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50 5, 85 20, 85 80, 50 95, 15 80, 15 20"
              className="fill-none stroke-green-500 stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Inner rotating hexagon */}
        <div className="absolute inset-0 animate-spin-reverse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50 15, 75 25, 75 75, 50 85, 25 75, 25 25"
              className="fill-none stroke-emerald-400 stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Center pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 animate-pulse blur-sm" />
          <div className="absolute w-12 h-12 rounded-full bg-[#111411] animate-ping" />
          <div className="absolute w-8 h-8 rounded-full bg-green-500/50 animate-pulse" />
        </div>

        {/* Scanning line effect */}
        <div className="absolute inset-0">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan" />
        </div>

        {/* Corner decorative elements */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-500 animate-pulse" />
      </div>

      {/* Loading text with glitch effect */}
      <div className="mt-6 relative">
        <div className="text-green-500 font-mono text-lg relative">
          <span className="relative inline-block">
            {loadingText}
            <span
              className="absolute top-0 left-0 w-full animate-glitch-1 
                           bg-[#111411] mix-blend-difference"
            >
              {loadingText}
            </span>
            <span
              className="absolute top-0 left-0 w-full animate-glitch-2 
                           bg-[#111411] mix-blend-difference"
            >
              {loadingText}
            </span>
          </span>
          <span className="inline-block ml-1 animate-blink">_</span>
        </div>
      </div>

      {/* Circular progress indicators */}
      <div className="absolute -top-4 -left-4 w-full h-full">
        <div className="relative w-full h-full animate-spin-slow">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-green-500/50"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 45}deg) translate(60px, 0)`,
                animationDelay: `${i * 0.125}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background grid effect */}
      <div className="absolute inset-0 -z-10">
        <div
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(#03B500 1px, transparent 1px),
              linear-gradient(90deg, #03B500 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    </div>
  );
};

// Add required keyframes to your global CSS or tailwind.config.js
const styles = `
@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(128px); opacity: 0; }
}

@keyframes glitch-1 {
  0% { clip-path: inset(40% 0 61% 0); }
  20% { clip-path: inset(92% 0 1% 0); }
  40% { clip-path: inset(43% 0 1% 0); }
  60% { clip-path: inset(25% 0 58% 0); }
  80% { clip-path: inset(54% 0 7% 0); }
  100% { clip-path: inset(58% 0 43% 0); }
}

@keyframes glitch-2 {
  0% { clip-path: inset(24% 0 29% 0); }
  20% { clip-path: inset(54% 0 21% 0); }
  40% { clip-path: inset(73% 0 86% 0); }
  60% { clip-path: inset(46% 0 3% 0); }
  80% { clip-path: inset(49% 0 35% 0); }
  100% { clip-path: inset(66% 0 13% 0); }
}

.animate-scan {
  animation: scan 2s linear infinite;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.animate-spin-reverse-slow {
  animation: spin 6s linear infinite reverse;
}

.animate-glitch-1 {
  animation: glitch-1 3s infinite linear alternate-reverse;
}

.animate-glitch-2 {
  animation: glitch-2 3s infinite linear alternate-reverse;
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
`;

export default CyberpunkLoader;
