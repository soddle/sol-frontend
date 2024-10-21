"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "./_components/searchBar";
import TimerDisplay from "../../components/ui/timeDisplay";
import Legend from "./_components/legends";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRootStore } from "@/stores/storeProvider";
import QuestionBox from "./_components/questionBox";
import { Container } from "@/components/layout/mainLayoutClient";
import { Guess, KOL } from "@prisma/client";
import { useGame } from "@/hooks/useGame";
import { motion, AnimatePresence } from "framer-motion";
import { AttributesGuessListTable } from "./_components/attributesGuessList";
import {
  GameSessionWithGuesses,
  GuessWithGuessedKol,
} from "@/lib/chains/types";

export default function AttributesGameClient({ kols }: { kols: KOL[] }) {
  const [gameSession, setGameSession] = useState<GameSessionWithGuesses | null>(
    null
  );
  console.log("gameSession ", gameSession);
  const [guesses, setGuesses] = useState<GuessWithGuessedKol[]>(
    (gameSession?.guesses as GuessWithGuessedKol[]) || []
  );

  const [remainingGuesses, setRemainingGuesses] = useState<KOL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { publicKey } = useWallet();
  const {
    fetchUserGuesses,
    makeGuess,
    fetchCurrentCompetition,
    fetchGameSession,
  } = useGame();

  const { ui } = useRootStore();
  const uiStore = ui((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      if (!publicKey) {
        toast.error("Please connect your wallet to play.");
        router.push("/");
        return;
      }

      try {
        setIsLoading(true);
        const competition = await fetchCurrentCompetition();
        if (!competition) {
          toast.error("No active competition found.");
          router.push("/");
          return;
        }
        const session = await fetchGameSession(publicKey.toString());
        console.log(session);

        if (!session) {
          toast.error("No active game session!");
          router.push("/");
          return;
        }
        setGameSession(session);

        const userGuesses = await fetchUserGuesses(session.id);
        const guessedKolIds = new Set(
          userGuesses.map((guess) => guess.guessedKOLId)
        );
        const remainingKols = kols.filter((kol) => !guessedKolIds.has(kol.id));
        setRemainingGuesses(remainingKols);
      } catch (error) {
        console.error("Error fetching game data:", error);
        toast.error("Failed to load game data");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    publicKey,
    router,
    fetchCurrentCompetition,
    fetchGameSession,
    fetchUserGuesses,
    kols,
  ]);

  const handleGuess = async (kol: KOL) => {
    if (!gameSession) return;

    try {
      uiStore.setLoading(true);
      console.log("gameSession", gameSession);
      const guess = await makeGuess(gameSession.id, kol.id);
      setGuesses((prevGuesses) => [
        ...prevGuesses,
        guess as GuessWithGuessedKol,
      ]);
      setRemainingGuesses((prevGuesses) =>
        prevGuesses.filter((g) => g.id !== kol.id)
      );
      toast.success("Guess submitted successfully!");
      if (guess.isCorrect && gameSession.completed) {
        toast.success("Congratulations! You've guessed correctly!");
        // Handle game completion (e.g., show results, update UI)
      }
    } catch (error) {
      console.error("Error making guess:", error);
      toast.error("Error making guess");
    } finally {
      uiStore.setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#2FFF2B] border-t-transparent rounded-full"
          />
        </div>
      </Container>
    );
  }

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
                  key={remainingGuesses.length}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {remainingGuesses.length}
                </motion.span>
              </div>
            </section>
          </QuestionBox>
        </Container>

        <Container>
          {remainingGuesses.length > 0 ? (
            <SearchBar kols={remainingGuesses} handleGuess={handleGuess} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[#2FFF2B] p-4 bg-[#111411] rounded-md"
            >
              You've used all your guesses! Check your results below.
            </motion.div>
          )}
        </Container>

        <Container>
          <AttributesGuessListTable guesses={guesses} loadingGuesses={false} />
        </Container>

        {uiStore.isLegendOpen && (
          <Container>
            <Legend />
          </Container>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
