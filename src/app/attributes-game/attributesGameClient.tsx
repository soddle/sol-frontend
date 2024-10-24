"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "./_components/searchBar";
import TimerDisplay from "../../components/ui/timeDisplay";
import Legend from "./_components/legends";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import QuestionBox from "./_components/questionBox";
import { Container } from "@/components/layout/mainLayoutClient";
import { GameSession, KOL, Competition } from "@prisma/client";
import { useGame } from "@/hooks/useGame";
import { motion, AnimatePresence } from "framer-motion";
import { AttributesGuessListTable } from "./_components/attributesGuessList";
import { GuessWithGuessedKol } from "@/lib/chains/types";
import GameResultPopup from "@/components/modals/gameResultPopup";
import { useUiStore } from "@/stores/uiStore";
import Announcement from "@/components/announcement";
import {
  GameSessionNotFoundError,
  NoActiveCompetitionError,
  SoddleError,
} from "@/lib/errors";

export default function AttributesGameClient({
  kols,
  todaySession: initialTodaySession,
  userGuesses: initialUserGuesses,
  currentCompetition,
}: {
  kols: KOL[];
  todaySession: GameSession | null;
  userGuesses: GuessWithGuessedKol[];
  currentCompetition: Competition | null;
}) {
  const [todaySession, setTodaySession] = useState<GameSession | null>(
    initialTodaySession
  );
  const [userGuesses, setUserGuesses] =
    useState<GuessWithGuessedKol[]>(initialUserGuesses);
  const [remainingGuessKOLs, setRemainingGuessKOLs] = useState<KOL[]>(
    kols.filter(
      (kol) =>
        !initialUserGuesses.map((guess) => guess.guessedKOLId).includes(kol.id)
    )
  );

  const { setLoading, isLegendOpen, openModal } = useUiStore((state) => state);

  const router = useRouter();
  const { publicKey } = useWallet();
  const { makeGuess } = useGame();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!currentCompetition) {
          throw new NoActiveCompetitionError();
        }
        if (!todaySession) {
          throw new GameSessionNotFoundError();
        }
        const guessedKolIds = new Set(
          userGuesses.map((guess) => guess.guessedKOLId)
        );
        const remainingKols = kols.filter((kol) => !guessedKolIds.has(kol.id));
        setRemainingGuessKOLs(remainingKols);
      } catch (error) {
        console.log("error", error);
        if (error instanceof SoddleError) {
          toast.error(error.message);
        }
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicKey, router, kols]);

  const handleGuess = async (kol: KOL) => {
    if (!todaySession) return;

    try {
      setLoading(true);
      console.log("currentSession", todaySession);
      const guess = (await makeGuess(
        todaySession.id,
        kol.id
      )) as GuessWithGuessedKol;

      setUserGuesses([guess, ...userGuesses]);

      setRemainingGuessKOLs(
        remainingGuessKOLs.filter((kol) => kol.id !== guess.guessedKOLId)
      );

      if (guess.isCorrect) {
        toast.success("Congratulations! You've guessed correctly!");

        console.log("gameResult", guess);
        openModal(
          <GameResultPopup
            correctKOL={guess.guessedKOL as KOL}
            playerStats={{
              rank: 1,
              score: 100,
              totalPlayers: 100,
              attempts: 1,
              duration: 100,
            }}
            playerAddress={publicKey?.toString() || ""}
          />
        );
      }
    } catch (error) {
      console.error("Error making guess:", error);
      if (error instanceof SoddleError) {
        toast.error(error.message);
      } else {
        toast.error("Error making guess");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="py-4 flex flex-col gap-4"
      >
        <Container>
          <section className="flex justify-center mb-4">
            <TimerDisplay />
          </section>
        </Container>

        <Container>
          <QuestionBox>
            <section className="text-white flex flex-col justify-between items-center">
              <h1 className="text-2xl font-bold text-center mb-4">
                Guess today's personality!
              </h1>
              <div className="flex items-center justify-center bg-[#1a1e1b] rounded-full p-2 border border-[#2FFF2B]">
                <motion.div
                  className="text-[#2FFF2B] font-semibold"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  Guesses left:
                </motion.div>
                <motion.span
                  className="ml-2 text-xl font-bold text-[#2FFF2B]"
                  key={remainingGuessKOLs.length}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {remainingGuessKOLs.length}
                </motion.span>
              </div>
            </section>
          </QuestionBox>
        </Container>
        <Announcement />
        <Container>
          <SearchBar
            remainingGuessKOLs={remainingGuessKOLs}
            handleGuess={handleGuess}
          />
        </Container>

        <AttributesGuessListTable
          guesses={userGuesses}
          loadingGuesses={false}
        />

        {isLegendOpen && (
          <Container>
            <Legend />
          </Container>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
