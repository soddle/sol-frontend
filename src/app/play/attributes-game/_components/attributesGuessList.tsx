"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Game1Guess, GameSessionFromApi, KolWithTweets } from "@/types";
import { LEGEND_BOX_COLORS, LEGEND_BOX_TYPES } from "@/lib/constants";

interface AttributesGuessListProps {
  gameSessionFromApi: GameSessionFromApi | null;
  loadingApiGameSession: boolean;
  allKols: KolWithTweets[];
}

interface CellProps {
  children: React.ReactNode;
  attributeResult: string;
  className?: string;
  isPfp?: boolean;
}

const Cell: React.FC<CellProps> = ({
  children,
  attributeResult,
  className,
  isPfp = false,
}) => {
  const cellStyle = isPfp
    ? { background: "transparent" }
    : {
        background:
          attributeResult === LEGEND_BOX_TYPES.Correct
            ? LEGEND_BOX_COLORS.Correct
            : attributeResult === LEGEND_BOX_TYPES.Higher
            ? LEGEND_BOX_COLORS.Higher
            : attributeResult === LEGEND_BOX_TYPES.Incorrect
            ? LEGEND_BOX_COLORS.Incorrect
            : attributeResult === LEGEND_BOX_TYPES.Lower
            ? LEGEND_BOX_COLORS.Lower
            : "",
      };

  const icon =
    attributeResult === LEGEND_BOX_TYPES.Higher
      ? "/legend-up.png"
      : attributeResult === LEGEND_BOX_TYPES.Lower
      ? "/legend-down.png"
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
              alt={attributeResult}
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
  loadingApiGameSession,
  gameSessionFromApi,
  allKols,
}) => {
  if (loadingApiGameSession || !gameSessionFromApi) {
    return <TableLoader />;
  }

  const game1Guesses = [...gameSessionFromApi.game1Guesses].reverse();

  if (game1Guesses.length <= 0) {
    return (
      <div className="text-center text-green-500">
        You have no guesses here yet. Try making some guesses.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[700px] mx-auto overflow-x-auto ">
      <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-7 gap-2 ">
          {[
            "KOL",
            "Age",
            "Country",
            "Pfp",
            "Account creation",
            "Followers",
            "Ecosystem",
          ].map((header) => (
            <HeaderCell key={header}>{header}</HeaderCell>
          ))}
          {game1Guesses?.map((game1guess) => {
            const kolAndTweets = allKols.find(
              (kol) =>
                kol.id === game1guess.guess.id &&
                kol.age === game1guess.guess.age
            );

            if (kolAndTweets) {
              return (
                <TableRow
                  game1guess={{
                    result: game1guess.result,
                    guess: kolAndTweets,
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
interface TableRowProps {
  game1guess: {
    guess: KolWithTweets;
    result: Game1Guess["result"];
  };
}

function TableRow({ game1guess }: TableRowProps) {
  const { guess, result: attributesResults } = game1guess;

  const {
    account_creation: accountCreation,
    age,
    country,
    ecosystem,
    followers,
    name,
    pfpType,
  } = attributesResults;

  return (
    <>
      <Cell
        attributeResult={pfpType}
        className="bg-transparent p-0 m-0"
        isPfp={true}
      >
        <Image
          unoptimized
          src={guess?.pfp || "/user-icon.svg"}
          className="rounded-full"
          alt="user"
          width={40}
          height={20}
          objectFit="cover"
        />
      </Cell>

      <Cell attributeResult={age}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guess.ageDisplay}
        </span>
      </Cell>
      <Cell attributeResult={country}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guess.country}
        </span>
      </Cell>
      <Cell attributeResult={name}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guess.pfpType}
        </span>
      </Cell>
      <Cell attributeResult={accountCreation}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guess.accountCreation}
        </span>
      </Cell>
      <Cell attributeResult={followers}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guess.followersDisplay}
        </span>
      </Cell>
      <Cell attributeResult={ecosystem}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guess.ecosystem}
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
