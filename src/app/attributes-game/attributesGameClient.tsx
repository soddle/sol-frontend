"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "./_components/searchBar";
import { GameType } from "@/lib/constants";
import TimerDisplay from "../../components/ui/timeDisplay";
import { AttributesGuessListTable } from "./_components/attributesGuessList";

import Legend from "./_components/legends";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

import { useRootStore } from "@/stores/storeProvider";
import QuestionBox from "./_components/questionBox";
import UserProfileModal from "@/components/modals/userProfileModal";
import { Container } from "@/components/layout/mainLayoutClient";
import { GameSession, KOL } from "@prisma/client";
import { useChainAdapter } from "@/hooks/useChainAdapter";

export default function AttributesGameClient({ kols }: { kols: KOL[] }) {
  const router = useRouter();
  const { wallet } = useWallet();
  const chainAdapter = useChainAdapter();

  const { ui, game } = useRootStore();
  const uiStore = ui((state) => state);
  const gameStore = game((state) => state);

  useEffect(() => {
    if (!gameStore.gameSession) {
      toast("No Active game session!");
      router.push("/");
    }
  }, []);
  useEffect(() => {
    if (!wallet || !gameStore.gameSession) {
      router.push("/");
    }
  }, [wallet, router]);

  useEffect(() => {
    if (!gameStore.gameSession) {
      router.push("/");
    }
  });

  const handleGuess = async (koll: KOL) => {
    try {
      uiStore.setLoading(true);
      // const allCorrect = Object.values(guess.result).every(
      //   (value) => value === "Correct"
      // );
      // if (allCorrect) {
      //   // uiStore.openModal(<UserProfileModal gameSession={returnedSessionFromApi} />);
      // } else {
      // }
    } catch (error) {
      console.error("error", error);
      toast.error("Error making guess");
    } finally {
      uiStore.setLoading(false);
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
        <QuestionBox>
          <section className=" text-white flex flex-col justify-between items-center">
            <h1 className="text-2xl font-bold text-center">
              Guess today's personality!
            </h1>
          </section>
        </QuestionBox>
      </Container>

      {/* search bar */}
      <Container>
        <SearchBar kols={kols} handleGuess={handleGuess} />
      </Container>

      {/* guessResults section */}
      {
        // <section className="text-white no-scrollbar">
        //   <AttributesGuessListTable
        //     allKols={kols}
        //     loadingApiGameSession={loadingApiGameSession}
        //     gameSessionFromApi={currentActiveSession}
        //   />
        // </section>
      }
      {/* Legends */}
      {uiStore.isLegendOpen && (
        <Container>
          <Legend />
        </Container>
      )}
    </div>
  );
}
