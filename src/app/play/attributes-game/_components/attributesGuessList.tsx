"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Game1Guess, GameSessionFromApi, KOL, KolWithTweets } from "@/types";
import { fetchGameSessionFromApi, fetchKOLs } from "@/lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import UserProfileModal from "@/components/modals/userProfileModal";
import { useRootStore } from "@/stores/storeProvider";

interface AttributesGuessListProps {
  gameSessionFromApi: GameSessionFromApi | null;
}

interface CellProps {
  children: React.ReactNode;
  attributeResult: any;
  targetKol: KOL;
  guessKol: KolWithTweets;
  className?: string;
}

const Cell: React.FC<CellProps> = ({
  children,
  attributeResult,
  className,
}) => {
  return (
    <div
      className={`overflow-hidden ${
        attributeResult === "Correct"
          ? "bg-green-500"
          : attributeResult === "Incorrect"
          ? "bg-red-500"
          : attributeResult === "Higher"
          ? "bg-red-700"
          : attributeResult === "Lower"
          ? "bg-red-500"
          : ""
      } ${className}`}
    >
      <div
        className={`w-full h-full flex items-center justify-center aspect-[2/1]`}
      >
        {children}
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
  gameSessionFromApi: initialGameSession,
}) => {
  const [kolsFromApi, setKolsFromApi] = useState<KolWithTweets[] | null>();
  const [gameSessionFromApi, setGameSessionFromApi] =
    useState<GameSessionFromApi | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ui } = useRootStore();

  const openModal = ui((state) => state.openModal);

  const wallet = useWallet();

  useEffect(() => {
    const fetchGameSession = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const _kolsFromApi = await fetchKOLs();
        setKolsFromApi(_kolsFromApi);

        if (wallet.publicKey) {
          const gameSession = await fetchGameSessionFromApi({
            publicKey: wallet.publicKey.toString(),
          });
          setGameSessionFromApi(gameSession);
        }
      } catch (error) {
        console.error("Error fetching game session:", error);
        setError(
          "We are having trouble fetching your guesses. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameSession();
  }, [wallet.publicKey]);

  if (isLoading) {
    return <TableLoader />;
  }

  if (error) {
    return <div className="text-center text-green-500">{error}</div>;
  }

  if (!gameSessionFromApi) {
    return (
      <div className="text-center text-green-500">
        No game session found. Please start a new game.
      </div>
    );
  }

  const game1Guesses = gameSessionFromApi.game1Guesses.reverse();

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
          {game1Guesses?.map((game1guess) => (
            <TableRow
              key={game1guess.guess.id}
              game1guess={game1guess}
              kolsFromApi={kolsFromApi!}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
interface TableRowProps {
  game1guess: Game1Guess;
  kolsFromApi: KolWithTweets[];
}

function TableRow({ game1guess, kolsFromApi }: TableRowProps) {
  const { wallet } = useWallet();
  const [targetKol, setTargetKol] = useState<KOL | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGameSession() {
      if (wallet?.adapter?.publicKey) {
        try {
          setLoading(true);
          const gameSession = await fetchGameSessionFromApi({
            publicKey: wallet.adapter.publicKey.toString(),
          });
          setTargetKol(gameSession.kol);
        } catch (error) {
          console.error("Error fetching game session:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchGameSession();
  }, [wallet?.adapter?.publicKey]);

  const { guess, result: attributesResults } = game1guess;
  const guessKol = kolsFromApi.find(
    (kol) => kol.id === guess.id && kol.age === guess.age
  );

  const {
    account_creation: accountCreation,
    age,
    country,
    ecosystem,
    followers,
    name,
    pfpType,
  } = attributesResults;

  if (loading) return <TableRowLoader />;
  if (!targetKol || !guessKol) return null;
  if (!targetKol) return <div>No Guess Here.</div>;

  return (
    <>
      <Cell
        targetKol={targetKol}
        guessKol={guessKol}
        attributeResult={pfpType}
        className="bg-transparent p-0 m-0"
      >
        <Image
          unoptimized
          src={guessKol?.pfp || "/user-icon.svg"}
          className="rounded-full"
          alt="user"
          width={40}
          height={20}
          objectFit="cover"
        />
      </Cell>

      <Cell attributeResult={age} guessKol={guessKol} targetKol={targetKol}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guessKol.ageDisplay}
        </span>
      </Cell>
      <Cell attributeResult={country} guessKol={guessKol} targetKol={targetKol}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guessKol.country}
        </span>
      </Cell>
      <Cell attributeResult={name} guessKol={guessKol} targetKol={targetKol}>
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guessKol.pfpType}
        </span>
      </Cell>
      <Cell
        attributeResult={accountCreation}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guessKol.accountCreation}
        </span>
      </Cell>
      <Cell
        attributeResult={followers}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guessKol.followersDisplay}
        </span>
      </Cell>
      <Cell
        attributeResult={ecosystem}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span className="text-[0.7rem] sm:text-xs md:text-sm break-words text-center">
          {guessKol.ecosystem}
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
