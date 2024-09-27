"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { name: "PLAY", path: "/play" },
    { name: "LEADERBORED", path: "/leaderbored" },
    { name: "MY PROFILE", path: "/profile" },
  ];

  const [orderedItems, setOrderedItems] = useState(navItems);

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.path === pathname);
    let newOrder;

    if (activeIndex === 0) {
      newOrder = [navItems[2], navItems[0], navItems[1]];
    } else if (activeIndex === 1) {
      newOrder = [navItems[0], navItems[1], navItems[2]];
    } else {
      newOrder = [navItems[1], navItems[2], navItems[0]];
    }

    setOrderedItems(newOrder);
  }, [pathname]);

  const handleClick = (clickedItem: (typeof navItems)[0]) => {
    const clickedIndex = orderedItems.findIndex(
      (item) => item.name === clickedItem.name
    );
    if (clickedIndex !== 1) {
      // If not already active
      const newOrder = [...orderedItems];
      [newOrder[1], newOrder[clickedIndex]] = [
        newOrder[clickedIndex],
        newOrder[1],
      ];
      setOrderedItems(newOrder);
    }
  };

  return (
    <nav className="flex justify-center items-center border-gray-800 overflow-hidden w-full">
      <div className="flex justify-center items-center h-[60px] w-full max-w-4xl">
        {orderedItems.map((item, index) => (
          <div
            key={item.name}
            className={`flex-1 transition-all duration-300 ease-in-out
              ${index === 1 ? "order-2 z-20  scale-100" : "z-10 scale-75"}
              ${index === 0 ? "order-1" : index === 2 ? "order-3" : ""}
            `}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href={item.path}
              onClick={() => handleClick(item)}
              className={`px-4 py-2 bg-[#181716] text-white border-[#2A342A] border-2 text-lg font-bold block text-center mx-1
    ${
      pathname === item.path
        ? "text-[#30D212]"
        : "hover:bg-green-600 transition-colors"
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
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
