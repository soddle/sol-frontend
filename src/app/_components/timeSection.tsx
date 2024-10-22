import React from "react";
import { Competition } from "@prisma/client";
import CompetitionCountdown from "@/components/competitionCountdown";

const CryptoCompetitionSection = ({
  latestCompetition,
}: {
  latestCompetition: Competition | null;
}) => {
  return (
    <div className="relative p-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 animate-pulse">
      <section
        className="relative bg-[#111411] p-8 overflow-hidden"
        style={{
          clipPath:
            "polygon(3% 0, 97% 0, 100% 5%, 100% 95%, 97% 100%, 3% 100%, 0 95%, 0 5%)",
        }}
      >
        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-green-500 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-green-500 animate-pulse" />

        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-[#03B500] opacity-5 blur-xl" />

        {/* Diagonal lines decoration */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #03B500 0, #03B500 1px, transparent 0, transparent 50%)",
              backgroundSize: "10px 10px",
            }}
          />
        </div>

        <div className="relative">
          <h2 className="text-white text-center text-3xl mb-6 font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
              Guess the correct crypto personality and win rewards!
            </span>
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <CompetitionCountdown competition={latestCompetition} />
          </div>
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-0 border border-green-500/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse" />
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse" />
        </div>
      </section>
    </div>
  );
};

export default CryptoCompetitionSection;
