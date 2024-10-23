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

  // Scanning line animation
  const ScanningLine = () => (
    <motion.div
      className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent"
      animate={{
        y: ["0%", "100%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Outer container with gradient border effect */}
          <div className="relative">
            {/* Animated background gradient */}
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 via-emerald-300/30 to-green-500/30 opacity-75 blur-sm"
              animate={{
                background: [
                  "linear-gradient(0deg, rgba(34,197,94,0.3), rgba(16,185,129,0.3))",
                  "linear-gradient(90deg, rgba(34,197,94,0.3), rgba(16,185,129,0.3))",
                  "linear-gradient(180deg, rgba(34,197,94,0.3), rgba(16,185,129,0.3))",
                  "linear-gradient(270deg, rgba(34,197,94,0.3), rgba(16,185,129,0.3))",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Main dropdown container */}
            <div className="relative bg-[#111411] rounded-sm">
              {/* Cyber grid background */}
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

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500/50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500/50" />

              {/* Scanning line effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ScanningLine />
              </div>

              {/* Actual dropdown list */}
              <motion.ul
                id="kol-search-results"
                ref={listRef}
                className="relative z-10 w-full max-h-[40vh] overflow-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-green-500/30 hover:scrollbar-thumb-green-500/50"
                role="listbox"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {suggestions.length > 0 ? (
                  suggestions.map((kol, index) => (
                    <motion.li
                      key={kol.id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <DropdownItem
                        kol={kol}
                        handleSelect={handleSelect}
                        isFocused={index === focusedIndex}
                      />
                    </motion.li>
                  ))
                ) : (
                  <motion.li
                    className="relative py-4 px-4 text-green-500/70 text-center"
                    role="option"
                    aria-selected="false"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <span className="relative z-10">
                      No matching KOLs found
                    </span>
                    {/* Pulsing background effect for empty state */}
                    <motion.div
                      className="absolute inset-0 bg-green-500/5"
                      animate={{
                        opacity: [0.05, 0.1, 0.05],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.li>
                )}
              </motion.ul>
            </div>

            {/* Border glow effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;
