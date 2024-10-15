import React, { useState, useEffect, useRef } from "react";
import TrapezoidInput from "./trapezoidInput";
import Image from "next/image";
import { KolWithTweets } from "@/types";
import { fetchGameSessionFromApi } from "@/lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";

interface KOLSearchProps {
  kols: KolWithTweets[];
  handleGuess: (kol: KolWithTweets) => void;
}

const KolSearch: React.FC<KOLSearchProps> = ({ kols, handleGuess }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableKols, setAvailableKols] = useState<KolWithTweets[]>([]);
  const [suggestions, setSuggestions] = useState<KolWithTweets[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const wallet = useWallet();

  useEffect(() => {
    async function initializeAvailableKols() {
      setIsLoading(true);
      setError(null);
      if (wallet.publicKey) {
        try {
          const gameSession = await fetchGameSessionFromApi({
            publicKey: wallet.publicKey.toString(),
          });
          const guessedKolIds = new Set(
            gameSession.game1Guesses.map((guess) => guess.guess.id)
          );
          const filteredKols = kols.filter((kol) => !guessedKolIds.has(kol.id));
          setAvailableKols(filteredKols);
          if (filteredKols.length === 0) {
            setError("You've guessed all available KOLs!");
          }
        } catch (error) {
          console.error("Error fetching game session:", error);
          setError("Unable to fetch game session. Using all KOLs.");
          setAvailableKols(kols);
        }
      } else {
        setAvailableKols(kols);
      }
      setIsLoading(false);
    }

    initializeAvailableKols();
  }, [kols, wallet.publicKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredKOLs = availableKols.filter((kol) =>
        kol.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredKOLs);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm, availableKols]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelectKOL = async (kol: KolWithTweets) => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    handleGuess(kol);

    if (wallet.publicKey) {
      setIsLoading(true);
      try {
        const gameSess = await fetchGameSessionFromApi({
          publicKey: wallet.publicKey.toString(),
        });
        const guessedKolIds = new Set(
          gameSess.game1Guesses.map((guess) => guess.guess.id)
        );
        const updatedKols = availableKols.filter(
          (k) => !guessedKolIds.has(k.id)
        );
        setAvailableKols(updatedKols);
        if (updatedKols.length === 0) {
          setError("You've guessed all available KOLs!");
        }
      } catch (error) {
        console.error("Error updating available KOLs:", error);
        setError("Unable to update KOL list. Some KOLs may not be available.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <TrapezoidInput
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search KOLs..."
        className="w-full focus:outline-none focus:ring-2 focus:ring-[#2FFF2B]"
      />
      {isDropdownOpen && (
        <ul className="absolute z-20 w-full mt-1 bg-[#111411] border border-[#2FFF2B] rounded-md shadow-lg max-h-[40vh] overflow-auto no-scrollbar">
          {isLoading ? (
            <li className="flex justify-center items-center h-20">
              <motion.div
                className="w-8 h-8 border-2 border-[#2FFF2B] rounded-full"
                animate={{
                  rotate: 360,
                  borderTopColor: "#2FFF2B",
                  borderRightColor: "#2FFF2B80",
                  borderBottomColor: "#2FFF2B40",
                  borderLeftColor: "#2FFF2B20",
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </li>
          ) : error ? (
            <li className="py-4 px-4 text-[#2FFF2B] text-center">{error}</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((kol) => (
              <ListItem kol={kol} key={kol.id} handleSelect={handleSelectKOL} />
            ))
          ) : (
            <li className="py-4 px-4 text-[#2FFF2B] text-center">
              No matching KOLs found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

function ListItem({
  kol,
  handleSelect,
}: {
  kol: KolWithTweets;
  handleSelect: (kol: KolWithTweets) => void;
}) {
  return (
    <li
      onClick={() => handleSelect(kol)}
      className="hover:bg-[#2d3537] py-4 cursor-pointer flex items-center px-4 border-b border-[#2FFF2B30] last:border-b-0"
    >
      <div className="w-12 h-12 relative mr-3 flex-shrink-0 border border-[#2FFF2B80] rounded-full overflow-hidden">
        <Image
          src={kol.pfp || "/user-icon.svg"}
          unoptimized
          alt="user"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-[#2FFF2B]">{kol.name}</div>
        <div className="text-xs text-[#2FFF2B80]">@{kol.twitterHandle}</div>
      </div>
    </li>
  );
}

export default KolSearch;
