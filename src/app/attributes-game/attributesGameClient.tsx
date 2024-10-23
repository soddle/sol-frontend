"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "./_components/searchBar";
import Legend from "./_components/legends";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
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
import CompetitionTimer from "@/components/competitionTimer";
import EnhancedQuestionSection from "@/components/questionSection";

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
            <CompetitionTimer competition={currentCompetition} />
          </section>
        </Container>
        <Container>
          <EnhancedQuestionSection remainingGuessKOLs={remainingGuessKOLs} />
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
