import React from "react";
import Image from "next/image";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { Twitter } from "lucide-react";
import { KOL } from "@prisma/client";

interface GameResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  correctKOL: KOL;
  playerData: {
    score: number;
    placement: number;
    totalPlayers: number;
  };
}

export const GameResultPopup: React.FC<GameResultPopupProps> = ({
  isOpen,
  onClose,
  correctKOL,
  playerData,
}) => {
  console.log(correctKOL, playerData);
  if (!isOpen) return null;

  const percentile = Math.round(
    (playerData.placement / playerData.totalPlayers) * 100
  );
  const isTopHalf = percentile <= 50;

  const shareOnTwitter = () => {
    const tweetText = `I just scored ${playerData.score} points in the Crypto Personality Guessing Game! Can you beat my score? #CryptoGame #FutureProof`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#111411] border border-[#03B500] p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Game Result</h2>
          <button onClick={onClose} className="text-white hover:text-[#03B500]">
            ×
          </button>
        </div>

        <div className="mb-6">
          <Image
            src={correctKOL.pfp}
            alt={correctKOL.name}
            width={100}
            height={100}
            className="rounded-full mx-auto mb-2"
          />
          <h3 className="text-xl font-semibold text-white text-center mb-2">
            {correctKOL.name}
          </h3>
          <p className="text-white/70 text-center">
            {correctKOL.descriptions[0]}
          </p>
        </div>

        <div className="bg-[#1a1e1a] p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Your Performance
          </h3>
          <p className="text-white/70 mb-1">Score: {playerData.score}</p>
          <p className="text-white/70 mb-1">
            Placement: {playerData.placement} out of {playerData.totalPlayers}
          </p>
          <div className="flex items-center">
            <TrophyIcon
              className={`mr-2 ${
                isTopHalf ? "text-yellow-400" : "text-gray-400"
              }`}
            />
            <p className="text-white/70">
              {isTopHalf ? `Top ${percentile}% (2x)` : "-"}
            </p>
          </div>
        </div>

        <button
          onClick={shareOnTwitter}
          className="w-full bg-[#1DA1F2] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#1a91da] transition-colors duration-300"
        >
          <Twitter className="mr-2" />
          Share on Twitter
        </button>
      </div>
    </div>
  );
};
