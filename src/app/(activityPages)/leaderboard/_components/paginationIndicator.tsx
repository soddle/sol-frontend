import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationIndicatorProps {
  currentPage: number;
  totalEntries: number;
  onPageChange: (page: number) => void;
}

const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  currentPage,
  totalEntries,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalEntries / 10);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center bg-green-900 bg-opacity-50 text-green-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-75 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-2" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center bg-green-900 bg-opacity-50 text-green-400 rounded-lg hover:bg-opacity-75 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
        >
          1
        </button>
        {currentPage > 3 && <span className="text-green-400">...</span>}
        {currentPage > 2 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center bg-green-900 bg-opacity-50 text-green-400 rounded-lg hover:bg-opacity-75 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          >
            {currentPage - 1}
          </button>
        )}
        <div
          className="
            relative w-8 h-8 flex items-center justify-center
            bg-green-600 
            text-white 
            font-bold text-lg
            rounded-lg
            overflow-hidden
          "
        >
          <span className="relative z-10">{currentPage}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-50 blur"></div>
        </div>
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center bg-green-900 bg-opacity-50 text-green-400 rounded-lg hover:bg-opacity-75 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          >
            {currentPage + 1}
          </button>
        )}
        {currentPage < totalPages - 2 && (
          <span className="text-green-400">...</span>
        )}
        {totalPages > 1 && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center bg-green-900 bg-opacity-50 text-green-400 rounded-lg hover:bg-opacity-75 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          >
            {totalPages}
          </button>
        )}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center bg-green-900 bg-opacity-50 text-green-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-75 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

export default PaginationIndicator;
