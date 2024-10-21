"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { LEGEND_BOX_COLORS, LEGEND_BOX_TYPES } from "@/lib/constants";
import { GuessWithGuessedKol } from "@/lib/chains/types";
import { KOL } from "@/types";

interface AttributesGuessListProps {
  guesses: GuessWithGuessedKol[];
  loadingGuesses: boolean;
}

interface CellProps {
  children: React.ReactNode;
  feedback: string;
  className?: string;
  isPfp?: boolean;
}

const Cell: React.FC<CellProps> = ({
  children,
  feedback,
  className,
  isPfp = false,
}) => {
  const cellStyle = isPfp
    ? { background: "transparent" }
    : {
        background:
          LEGEND_BOX_COLORS[feedback as keyof typeof LEGEND_BOX_COLORS] || "",
      };
  const icon =
    feedback === LEGEND_BOX_TYPES.higher
      ? "/images/legend-up.png"
      : feedback === LEGEND_BOX_TYPES.lower
      ? "/images/legend-down.png"
      : null;

  return (
    <div style={cellStyle} className={`overflow-hidden ${className}`}>
      <div
        className={`w-full aspect-square flex items-center justify-center relative`}
      >
        {icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={icon}
              alt={feedback}
              className="max-w-full max-h-full object-contain opacity-"
            />
          </div>
        )}
        <div className="relative z-10 text-center break-words">{children}</div>
      </div>
    </div>
  );
};

const HeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={`overflow-hidden`}>
    <div
      className={`w-full h-full flex items-center justify-center aspect-[2/1]`}
    >
      <span
        className={
          "text-[0.7rem] sm:text-xs md:text-sm break-words text-center"
        }
      >
        {children}
      </span>
    </div>
  </div>
);

export const AttributesGuessListTable: React.FC<AttributesGuessListProps> = ({
  loadingGuesses,
  guesses,
}) => {
  if (loadingGuesses) {
    return <TableLoader />;
  }

  if (guesses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-green-500 p-4 bg-[#111411] rounded-md"
      >
        You have no guesses yet. Try making some guesses!
      </motion.div>
    );
  }

  const headers = [
    "KOL",
    "Age",
    "Country",
    "Pfp",
    "Account creation",
    "Followers",
    "Ecosystem",
  ];

  return (
    <div className="w-full max-w-[700px] mx-auto overflow-x-auto ">
      <div className="">
        <div className="grid grid-cols-7 gap-2 ">
          {headers.map((header) => (
            <HeaderCell key={header}>{header}</HeaderCell>
          ))}
          {guesses.map((guess, index) => (
            <TableRow key={guess.id} guess={guess} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
interface TableRowProps {
  guess: GuessWithGuessedKol;
  index: number;
}

function TableRow({ guess }: TableRowProps) {
  const attributes = guess.guessedKOL;
  const feedback = guess.feedback as {
    pfpType: string;
    age: string;
    country: string;
    twitterAccountCreationYear: string;
    followers: string;
    ecosystem: string;
  };

  return (
    <>
      <Cell
        feedback={feedback.pfpType}
        className="bg-transparent p-0 m-0"
        isPfp={true}
      >
        <Image
          unoptimized
          src={attributes.pfp || "/images/user-icon.svg"}
          className="rounded-full"
          alt="user"
          width={40}
          height={20}
          objectFit="cover"
        />
      </Cell>

      <Cell feedback={feedback.age}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {attributes.ageRange}
        </span>
      </Cell>
      <Cell feedback={feedback.country}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {attributes.country}
        </span>
      </Cell>
      <Cell feedback={feedback.pfpType}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {attributes.pfpType}
        </span>
      </Cell>
      <Cell feedback={feedback.twitterAccountCreationYear}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {attributes.twitterFollowersRange}
        </span>
      </Cell>
      <Cell feedback={feedback.followers}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {attributes.followers}
        </span>
      </Cell>
      <Cell feedback={feedback.ecosystem}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {attributes.ecosystem}
        </span>
      </Cell>
    </>
  );
}

function TableRowLoader() {
  return (
    <>
      {[...Array(7)].map((_, index) => (
        <div key={index} className="overflow-hidden bg-[#111411] rounded-md">
          <div className="w-full h-full flex items-center justify-center aspect-[2/1]">
            <motion.div
              className="w-3/4 h-3/4 bg-gradient-to-r from-[#1a1e1b] via-[#2FFF2B20] to-[#1a1e1b] rounded-md"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [0.97, 1, 0.97],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function TableLoader() {
  const headers = [
    "KOL",
    "Age",
    "Country",
    "Pfp",
    "Account creation",
    "Followers",
    "Ecosystem",
  ];

  return (
    <div className="w-full max-w-[700px] mx-auto overflow-x-auto">
      <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-7 gap-2">
          {headers.map((header) => (
            <HeaderCell key={header}>
              <motion.div
                className="w-full h-4 bg-[#2FFF2B20] rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </HeaderCell>
          ))}
          {[...Array(5)].map((_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {[...Array(7)].map((_, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className="overflow-hidden bg-[#111411] rounded-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: rowIndex * 0.1 + colIndex * 0.05,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center aspect-[2/1]">
                    <motion.div
                      className="w-3/4 h-3/4 bg-gradient-to-r from-[#1a1e1b] via-[#2FFF2B20] to-[#1a1e1b] rounded-md"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [0.97, 1, 0.97],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: rowIndex * 0.2 + colIndex * 0.1,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
