import { useRootStore } from "@/stores/storeProvider";
import React from "react";

import { LEGEND_BOX_COLORS, LEGEND_BOX_TYPES } from "@/lib/constants";

interface LegendItemProps {
  type: LEGEND_BOX_TYPES;
  color: string;
  icon?: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ type, color, icon }) => (
  <div className="flex flex-col items-center">
    <span className="text-white text-sm font-medium mb-2">{type}</span>
    <div
      className={`w-20 h-20 shadow-md flex items-center justify-center overflow-hidden transition-transform hover:scale-105`}
      style={{ backgroundColor: color }}
    >
      {icon && (
        <img
          src={icon}
          alt={type}
          className="max-w-[80%] max-h-[80%] object-contain"
        />
      )}
    </div>
  </div>
);

interface LegendProps {}

const Legend: React.FC<LegendProps> = () => {
  const { ui } = useRootStore();
  const isLegendOpen = ui((state) => state.isLegendOpen);
  const setIsLegendOpen = ui((state) => state.setIsLegendOpen);

  const items: LegendItemProps[] = [
    { type: LEGEND_BOX_TYPES.Correct, color: LEGEND_BOX_COLORS.Correct },
    // {
    //   type: LEGEND_BOX_TYPES.PartiallyCorrect,
    //   color: LEGEND_BOX_COLORS.PartiallyCorrect,
    // },
    { type: LEGEND_BOX_TYPES.Incorrect, color: LEGEND_BOX_COLORS.Incorrect },
    {
      type: LEGEND_BOX_TYPES.Higher,
      color: LEGEND_BOX_COLORS.Higher,
      icon: "/legend-up.png",
    },
    {
      type: LEGEND_BOX_TYPES.Lower,
      color: LEGEND_BOX_COLORS.Lower,
      icon: "/legend-down.png",
    },
  ];

  return (
    <div className="relative border border-[#2FFF2B] bg-[#111411]  p-8">
      <button
        onClick={() => setIsLegendOpen(!isLegendOpen)}
        className="absolute -top-2 -right-2 text-white hover:text-gray-300 border border-[#2FFF2B] bg-[#111411] rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex justify-between">
        {items.map((item, index) => (
          <LegendItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Legend;