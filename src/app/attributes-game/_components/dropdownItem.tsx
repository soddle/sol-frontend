import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { KOL } from "@prisma/client";

interface DropdownItemProps {
  kol: KOL;
  handleSelect: (kol: KOL) => void;
  isFocused: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  kol,
  handleSelect,
  isFocused,
}) => {
  return (
    <motion.li
      onClick={() => handleSelect(kol)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect(kol);
        }
      }}
      className={`hover:bg-[#2d3537] py-4 cursor-pointer flex items-center px-4 border-b border-[#2FFF2B30] last:border-b-0 ${
        isFocused ? "bg-[#2d3537]" : ""
      }`}
      role="option"
      aria-selected={isFocused}
      tabIndex={0}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-12 h-12 relative mr-3 flex-shrink-0 border border-[#2FFF2B80] rounded-full overflow-hidden">
        <Image
          src={kol.pfp || "/user-icon.svg"}
          unoptimized
          alt={`Profile picture of ${kol.name}`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-[#2FFF2B]">{kol.name}</div>
        <div className="text-xs text-[#2FFF2B80]">@{kol.twitterHandle}</div>
      </div>
    </motion.li>
  );
};

export default DropdownItem;
