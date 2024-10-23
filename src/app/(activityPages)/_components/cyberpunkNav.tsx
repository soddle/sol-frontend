"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Trophy, User } from "lucide-react";

const CyberpunkNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "PLAY", path: "/", icon: Gamepad2 },
    { name: "LEADERBOARD", path: "/leaderboard", icon: Trophy },
    { name: "PROFILE", path: "/profile", icon: User },
  ];

  const [orderedItems, setOrderedItems] = useState(navItems);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const activeIndex = orderedItems.findIndex(
      (item) => item.path === pathname
    );
    if (activeIndex !== 1) {
      const newOrder = [...orderedItems];
      [newOrder[1], newOrder[activeIndex]] = [
        newOrder[activeIndex],
        newOrder[1],
      ];
      setOrderedItems(newOrder);
    }
  }, [pathname]);

  const handleClick = (clickedItem: (typeof navItems)[0]) => {
    const clickedIndex = orderedItems.findIndex(
      (item) => item.name === clickedItem.name
    );
    if (clickedIndex !== 1) {
      const newOrder = [...orderedItems];
      [newOrder[1], newOrder[clickedIndex]] = [
        newOrder[clickedIndex],
        newOrder[1],
      ];
      setOrderedItems(newOrder);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:relative sm:mb-5 z-20">
      <div className="relative h-20 sm:h-16 w-full max-w-4xl mx-auto">
        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-400/20 to-green-500/20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

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

        <AnimatePresence initial={false}>
          {orderedItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={false}
              animate={{
                x: `${(index - 1) * 100}%`,
                scale: index === 1 ? 1 : 0.85,
                zIndex: index === 1 ? 2 : 1,
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                scale: { duration: 0.2 },
              }}
              className="absolute top-0 left-1/3 w-1/3 h-full"
            >
              <Link
                href={item.path}
                onClick={() => handleClick(item)}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative flex flex-col items-center justify-center h-full w-full"
              >
                {/* Button background with clip-path */}
                <div
                  className={`absolute inset-0 transition-all duration-300
                    ${
                      pathname === item.path
                        ? "bg-[#111411] border-green-500/50"
                        : "bg-[#0A0A0A] border-green-500/30 group-hover:border-green-500/50"
                    }
                  `}
                  style={{
                    clipPath:
                      "polygon(0.5rem 0, calc(100% - 0.5rem) 0, 100% 0.5rem, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0.5rem 100%, 0 calc(100% - 0.5rem), 0 0.5rem)",
                  }}
                />

                {/* Glowing active/hover effects */}
                {(pathname === item.path || hoveredItem === item.name) && (
                  <motion.div
                    className="absolute inset-0 bg-green-500/20 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500/50 group-hover:border-green-400" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-green-500/50 group-hover:border-green-400" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-green-500/50 group-hover:border-green-400" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500/50 group-hover:border-green-400" />

                {/* Content */}
                <div className="relative flex flex-col items-center justify-center">
                  <item.icon
                    className={`w-6 h-6 mb-1 transition-all duration-300
                      ${
                        pathname === item.path
                          ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                          : "text-green-500/70 group-hover:text-green-400"
                      }
                    `}
                  />
                  <span
                    className={`text-xs sm:text-sm font-bold tracking-wider transition-all duration-300
                      ${
                        pathname === item.path
                          ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                          : "text-green-500/70 group-hover:text-green-400"
                      }
                    `}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Animated border scan effect */}
                {(pathname === item.path || hoveredItem === item.name) && (
                  <>
                    <motion.div
                      className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                  </>
                )}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default CyberpunkNav;
