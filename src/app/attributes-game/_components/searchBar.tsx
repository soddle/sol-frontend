import React, { useState, useEffect, useRef } from "react";
import TrapezoidInput from "./trapezoidInput";
import { KOL } from "@prisma/client";
import { useDebounce } from "@/hooks/useDebounce";
import Dropdown from "./dropdown";

interface SearchBarProps {
  remainingGuessKOLs: KOL[];
  handleGuess: (kol: KOL) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  remainingGuessKOLs,
  handleGuess,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = React.useMemo(() => {
    if (debouncedSearchTerm.length === 0) return [];
    return remainingGuessKOLs.filter((kol) =>
      kol.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, remainingGuessKOLs]);

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
    setIsDropdownOpen(debouncedSearchTerm.length > 0);
    setFocusedIndex(-1);
  }, [debouncedSearchTerm]);

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

  return (
    <div ref={searchRef} className="relative">
      <label htmlFor="kol-search" className="sr-only">
        Search KOLs
      </label>
      <TrapezoidInput
        id="kol-search"
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search KOLs..."
        className="w-full focus:outline-none focus:ring-2 focus:ring-[#2FFF2B]"
        aria-expanded={isDropdownOpen}
        aria-autocomplete="list"
        aria-controls="kol-search-results"
        role="combobox"
      />
      <Dropdown
        isOpen={isDropdownOpen}
        suggestions={suggestions}
        focusedIndex={focusedIndex}
        handleSelect={handleSelectKOL}
      />
    </div>
  );
};

export default SearchBar;
