"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayIcon, ChartBarIcon, UserIcon } from "@heroicons/react/24/solid";

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "PLAY", path: "/", icon: PlayIcon },
    { name: "LEADERBOARD", path: "/leaderboard", icon: ChartBarIcon },
    { name: "PROFILE", path: "/profile", icon: UserIcon },
  ];
  const [orderedItems, setOrderedItems] = useState(navItems);

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
      <div className="relative h-16 sm:h-[60px] w-full max-w-4xl mx-auto overflow-hidden">
        <AnimatePresence initial={false}>
          {orderedItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={false}
              animate={{
                x: `${(index - 1) * 100}%`,
                scale: index === 1 ? 1 : 0.7,
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                scale: { duration: 0.2 },
              }}
              className={`absolute top-0 left-1/3 w-1/3 h-full flex items-center justify-center bg-[#181716]
                ${index === 1 ? "z-20" : "z-10"}
              `}
            >
              <Link
                href={item.path}
                onClick={() => handleClick(item)}
                className={`flex flex-col items-center justify-center h-full w-full px-2 sm:px-4 py-2 text-white border-[#2A342A] border-r sm:border-2 text-[10px] sm:text-lg font-bold text-center
                  ${
                    pathname === item.path
                      ? "text-[#30D212]"
                      : "hover:bg-green-600 hover:bg-opacity-20 transition-colors"
                  }
                `}
                style={
                  pathname === item.path
                    ? {
                        textShadow:
                          "0 0 8px rgba(48,210,18,0.8), 0 0 12px rgba(48,210,18,0.8), 0 0 16px rgba(48,210,18,0.8)",
                      }
                    : {}
                }
              >
                <item.icon className="w-6 h-6 mb-1 sm:hidden" />
                <span className="sm:hidden">{item.name.split(" ")[0]}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
