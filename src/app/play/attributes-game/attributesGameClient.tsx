"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "./_components/searchBar";
import { GameType } from "@/lib/constants";
import TimerDisplay from "./_components/timeDisplay";
import Container from "@/components/layout/container";
import { AttributesGuessListTable } from "./_components/attributesGuessList";

import Legend from "./_components/legends";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchRandomKOL } from "@/lib/api";
import { useGameSession } from "@/hooks/useGameSession";
import { useRootStore } from "@/stores/storeProvider";
import { KOL } from "@/types";
import QuestionBox from "./_components/questionBox";

export default function GameIdPageClient({ kols }: { kols: KOL[] }) {
  const router = useRouter();
  const { wallet } = useWallet();
  const { fetchGameSession, makeGuess } = useGameSession();
  const [randomizedKol, setRandomizedKol] = useState<KOL | null>(null);
  const { ui, game } = useRootStore();
  const isLegendOpen = ui((state) => state.isLegendOpen);
  const setLoading = ui((state) => state.setLoading);
  const setError = ui((state) => state.setError);
  const setGameSession = game((state) => state.setGameSession);
  const gameSession = game((state) => state.gameSession);

  useEffect(() => {
    if (!wallet) {
      router.push("/");
      return;
    }
  }, [wallet, router]);

  useEffect(() => {
    async function getGameSession() {
      const gameSession = await fetchGameSession(wallet?.adapter.publicKey!);
      console.log("Game session: ", gameSession);

      if (gameSession) {
        setGameSession(gameSession);
      }
    }

    try {
      setLoading(true);
      getGameSession();
    } catch (error) {
      toast.error("Error fetching game session");
      setError("Error fetching game session");
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (!gameSession) return;
    async function getRandomKol() {
      const randKol = await fetchRandomKOL();
      setRandomizedKol(randKol);
    }

    getRandomKol();
  }, [gameSession]);

  const handleSelect = async (kol: KOL) => {
    try {
      setLoading(true);
      if (kol) {
        await makeGuess(GameType.Attributes, kol);
        const gameSession = await fetchGameSession(wallet?.adapter.publicKey!);
        setGameSession(gameSession);
        return;
      }
    } catch (error) {
      toast.error("Error making guess");
      setError("Error making guess");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 flex flex-col gap-4 ">
      {/* Time Component */}
      <Container>
        <section className="flex justify-center mb-4">
          <TimerDisplay />
        </section>
      </Container>
      {/* question box */}
      <Container>
        <QuestionBox className="">
          <section className=" text-white flex flex-col justify-between items-center">
            <h1 className="text-2xl font-bold text-center">
              Guess today's personality!
            </h1>
          </section>
        </QuestionBox>
      </Container>

      {/* search bar */}
      <Container>
        <SearchBar kols={kols} onSelect={handleSelect} />
      </Container>

      {/* guessResults section */}
      {
        <section className="text-white no-scrollbar">
          {/* <AttributesGuessListTable
            guess1Results={
              gameSession?.game1Guesses as unknown as []
            }
          /> */}
        </section>
      }
      {/* Legends */}
      {isLegendOpen && (
        <Container>
          <Legend />
        </Container>
      )}
    </div>
  );
}
