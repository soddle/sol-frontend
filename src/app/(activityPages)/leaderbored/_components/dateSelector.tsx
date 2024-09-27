import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dateOptions = [
    { label: "Today", value: new Date() },
    { label: "Yesterday", value: new Date(Date.now() - 86400000) },
    { label: "This Week", value: new Date(Date.now() - 7 * 86400000) },
    { label: "This Month", value: new Date(new Date().setDate(1)) },
  ];

  const handleDateChange = (date: Date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-left bg-[#181716] text-white border border-[#2A342A]  focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 ease-in-out hover:bg-[#2A342A] hover:border-green-500"
      >
        <span className="truncate">{formatDate(selectedDate)}</span>
        <ChevronDownIcon
          className={`w-5 h-5 ml-2 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-[#181716] border border-[#2A342A]  shadow-lg overflow-hidden">
          {dateOptions.map((option, index) => (
            <button
              key={option.label}
              onClick={() => handleDateChange(option.value)}
              className={`block w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-left text-white hover:bg-green-600 hover:text-white transition-all duration-300 ease-in-out ${
                index === 0
                  ? "rounded-t-lg"
                  : index === dateOptions.length - 1
                  ? "rounded-b-lg"
                  : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateSelector;
