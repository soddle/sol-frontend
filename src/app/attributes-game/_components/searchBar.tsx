import React, { useState, useEffect, useRef } from "react";
import { Camera, Scan } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CyberpunkInput from "@/components/cyberInput";
import Dropdown from "./dropdown";
import { KOL } from "@prisma/client";

interface SearchBarProps {
  remainingGuessKOLs: KOL[];
  handleGuess: (kol: KOL) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  remainingGuessKOLs,
  handleGuess,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = React.useMemo(() => {
    if (searchTerm.length === 0) return [];
    return remainingGuessKOLs.filter((kol) =>
      kol.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, remainingGuessKOLs]);

  useEffect(() => {
    if (searchTerm) {
      setIsScanning(true);
      const timeout = setTimeout(() => setIsScanning(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [searchTerm]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(searchTerm.length > 0);
    setFocusedIndex(-1);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectKOL = (kol: KOL) => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    handleGuess(kol);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectKOL(suggestions[focusedIndex]);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  // Scanning icon animation
  const iconAnimation = isScanning
    ? {
        opacity: [1, 0.5, 1],
        scale: [1, 1.2, 1],
        rotateY: [0, 180, 360],
      }
    : {};

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <motion.div
        className="relative"
        initial={false}
        animate={isScanning ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* Search icon with scanning animation */}
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 z-20"
            animate={iconAnimation}
            transition={{ duration: 1, repeat: isScanning ? Infinity : 0 }}
          >
            {isScanning ? <Scan size={20} /> : <Camera size={20} />}
          </motion.div>

          {/* Scanning line effect */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                className="absolute top-0 left-0 w-1 h-full bg-green-500/50 z-20 pointer-events-none"
                initial={{ x: 0 }}
                animate={{ x: "100%" }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            )}
          </AnimatePresence>

          <CyberpunkInput
            id="kol-search"
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search KOLs..."
            className="w-full"
            style={{ paddingLeft: "2.75rem" }}
            aria-expanded={isDropdownOpen}
            aria-autocomplete="list"
            aria-controls="kol-search-results"
            role="combobox"
          />
        </div>
      </motion.div>

      {/* Enhanced dropdown with cyberpunk styling */}
      <AnimatePresence>
        {isDropdownOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 z-50"
          >
            <div className="relative">
              {/* Dropdown gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-75 blur" />

              <div className="relative bg-[#111411] border border-green-500/30">
                {/* Cyber grid background for dropdown */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>

                {/* Corner decorations for dropdown */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-green-500/50" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-green-500/50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-green-500/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-green-500/50" />

                <Dropdown
                  isOpen={isDropdownOpen}
                  suggestions={suggestions}
                  focusedIndex={focusedIndex}
                  handleSelect={handleSelectKOL}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
