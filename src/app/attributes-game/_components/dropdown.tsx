import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KOL } from "@prisma/client";
import DropdownItem from "./dropdownItem";

interface DropdownProps {
  isOpen: boolean;
  suggestions: KOL[];
  focusedIndex: number;
  handleSelect: (kol: KOL) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  suggestions,
  focusedIndex,
  handleSelect,
}) => {
  const listRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[
        focusedIndex
      ] as HTMLElement;
      focusedElement.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.ul
          id="kol-search-results"
          ref={listRef}
          className="absolute z-20 w-full mt-1 bg-[#111411] border border-[#2FFF2B] rounded-md shadow-lg max-h-[40vh] overflow-auto no-scrollbar"
          role="listbox"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((kol, index) => (
              <DropdownItem
                kol={kol}
                key={kol.id}
                handleSelect={handleSelect}
                isFocused={index === focusedIndex}
              />
            ))
          ) : (
            <li
              className="py-4 px-4 text-[#2FFF2B] text-center"
              role="option"
              aria-selected="false"
            >
              No matching KOLs found
            </li>
          )}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;
