import React, { useState, useEffect, useRef } from "react";
import TrapezoidInput from "./trapezoidInput";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { KOL } from "@prisma/client";

interface KOLSearchProps {
  kols: KOL[];
  handleGuess: (kol: KOL) => void;
}

const KolSearch: React.FC<KOLSearchProps> = ({ kols, handleGuess }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<KOL[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
      const filteredKOLs = kols.filter((kol) =>
        kol.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredKOLs);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm, kols]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelectKOL = (kol: KOL) => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    handleGuess(kol);
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
          {suggestions.length > 0 ? (
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
  kol: KOL;
  handleSelect: (kol: KOL) => void;
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
