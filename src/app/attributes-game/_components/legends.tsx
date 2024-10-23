import React from "react";

import { LEGEND_BOX_COLORS, LEGEND_BOX_TYPES } from "@/lib/constants";
import { useUiStore } from "@/stores/uiStore";

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
  const isLegendOpen = useUiStore((state) => state.isLegendOpen);
  const setIsLegendOpen = useUiStore((state) => state.setIsLegendOpen);

  const items: LegendItemProps[] = [
    { type: LEGEND_BOX_TYPES.correct, color: LEGEND_BOX_COLORS.correct },
    {
      type: LEGEND_BOX_TYPES.partially_correct,
      color: LEGEND_BOX_COLORS.partially_correct,
    },
    { type: LEGEND_BOX_TYPES.incorrect, color: LEGEND_BOX_COLORS.incorrect },
    {
      type: LEGEND_BOX_TYPES.higher,
      color: LEGEND_BOX_COLORS.higher,
      icon: "/images/legend-up.png",
    },
    {
      type: LEGEND_BOX_TYPES.lower,
      color: LEGEND_BOX_COLORS.lower,
      icon: "/images/legend-down.png",
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
