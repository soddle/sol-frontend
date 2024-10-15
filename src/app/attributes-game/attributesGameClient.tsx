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
import { KOL } from "@prisma/client";
import { useChainAdapter } from "@/hooks/useChainAdapter";
import { fetchCurrentActiveSession } from "@/actions/game";
import { GameSession } from "@/types";

export default function AttributesGameClient({ kols }: { kols: KOL[] }) {
  const router = useRouter();
  const { wallet } = useWallet();
  const chainAdapter = useChainAdapter();

  const [gameSess, setGameSess] = useState<GameSession | null>(null);

  const [currentActiveSession, setCurrentActiveSession] =
    useState<GameSession | null>();

  const [loadingApiGameSession, setLoadingApiGameSession] =
    useState<boolean>(true);

  const { ui } = useRootStore();
  const isLegendOpen = ui((state) => state.isLegendOpen);
  const setLoading = ui((state) => state.setLoading);
  const setError = ui((state) => state.setError);
  const openModal = ui((state) => state.openModal);

  useEffect(() => {
    if (!wallet) {
      router.push("/");
    }
  }, [wallet, router, gameSess]);

  useEffect(() => {
    async function getActiveSession() {
      const activeSession = await fetchCurrentActiveSession(
        wallet?.adapter.publicKey?.toString()!
      );
      setCurrentActiveSession(activeSession);
    }

    try {
      getActiveSession();
    } catch (error) {
      console.error("error fetching game session: ", error);
    } finally {
      setLoadingApiGameSession(false);
    }
  }, [wallet?.adapter.publicKey]);

  useEffect(() => {
    async function getGameSessionFromOnchain() {
      const gameSession = await chainAdapter.fetchGameSession(
        wallet?.adapter.publicKey?.toString()!
      );
      setGameSess(gameSession);
    }
    try {
      setLoading(true);
      getGameSessionFromOnchain();
    } catch (error) {
      toast.error("Error fetching game session");
      setError("Error fetching game session");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGuess = async (koll: KOL) => {
    const kol: KOL = {
      xAccountCreation: koll.accountCreation,
      age: koll.age,
      country: koll.country,
      ecosystem: koll.ecosystem,
      followers: koll.followers,
      id: koll.id,
      name: koll.name,
      pfp: koll.pfp,
      pfpType: koll.pfpType,
    };

    try {
      setLoading(true);
      const returnedSessionFromApi = await chainAdapter.makeGuess(
        GameType.Attributes,
        kol
      );
      setGameSessionFromApi(returnedSessionFromApi);
      console.log("returned session from API: ", returnedSessionFromApi);

      const guess = returnedSessionFromApi.game1Guesses.find(
        (g) => g.guess.id === kol.id
      )!;

      // Check if all guess results are Correct
      const allCorrect = Object.values(guess.result).every(
        (value) => value === "Correct"
      );
      if (allCorrect) {
        openModal(<UserProfileModal gameSession={returnedSessionFromApi} />);
      } else {
      }

      setGameSessionFromApi(returnedSessionFromApi);
    } catch (error) {
      console.error("error", error);
      toast.error("Error making guess");
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
        <section className="text-white no-scrollbar">
          <AttributesGuessListTable
            allKols={kols}
            loadingApiGameSession={loadingApiGameSession}
            gameSessionFromApi={currentActiveSession}
          />
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
