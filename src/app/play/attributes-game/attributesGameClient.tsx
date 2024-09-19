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

import { useGameSession } from "@/hooks/useGameSession";
import { useRootStore } from "@/stores/storeProvider";
import { GameSession, GameSessionFromApi, KOL, KolWithTweets } from "@/types";
import QuestionBox from "./_components/questionBox";
import { fetchGameSessionFromApi } from "@/lib/api";
import { useUIStore } from "@/components/providers/storesProvider";
import UserProfileModal from "@/components/modals/userProfileModal";

export default function AttributesGameClient({
  kols,
}: {
  kols: KolWithTweets[];
}) {
  const router = useRouter();
  const { wallet } = useWallet();
  const { fetchGameSession, makeGuess } = useGameSession();
  const [gameSess, setGameSess] = useState<GameSession | null>(null);
  const [gameSessionFromApi, setGameSessionFromApi] =
    useState<GameSessionFromApi | null>(null);

  // const setLoading = useUIStore((state) => state.setLoading);
  // const openModal = useUIStore((state) => state.openModal);
  // const closeModal = useUIStore((state) => state.closeModal);

  const { ui } = useRootStore();
  const isLegendOpen = ui((state) => state.isLegendOpen);
  const setLoading = ui((state) => state.setLoading);
  const setError = ui((state) => state.setError);

  const openModal = ui((state) => state.openModal);
  const closeModal = ui((state) => state.closeModal);

  useEffect(() => {
    if (!wallet) {
      router.push("/");
    }
  }, [wallet, router, gameSess]);

  useEffect(() => {
    async function getGameSessions() {
      const [gameSessionFromApi, gameSession] = await Promise.all([
        fetchGameSessionFromApi({
          publicKey: wallet?.adapter.publicKey?.toString()!,
        }),
        fetchGameSession(wallet?.adapter.publicKey!),
      ]);
      console.log("api guess in attributesgameclient.tsx", gameSessionFromApi);

      if (gameSession) {
        setGameSess(gameSession);
      }
      if (gameSessionFromApi) setGameSessionFromApi(gameSessionFromApi);
    }

    try {
      setLoading(true);
      getGameSessions();
    } catch (error) {
      toast.error("Error fetching game session");
      setError("Error fetching game session");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGuess = async (kolWithTweets: KolWithTweets) => {
    const kol: KOL = {
      accountCreation: kolWithTweets.accountCreation,
      age: kolWithTweets.age,
      country: kolWithTweets.country,
      ecosystem: kolWithTweets.ecosystem,
      followers: kolWithTweets.followers,
      id: kolWithTweets.id,
      name: kolWithTweets.name,
      pfp: kolWithTweets.pfp,
    };
    console.log("kol inside handleGuess", kol);

    try {
      // openModal({
      //   // @ts-expect-error ddd
      //   component: UserProfileModal,
      //   props: {
      //     onClose: closeModal,
      //     gameSession: gameSessionFromApi,
      //   },
      // });
      console.log("modal was called");
      setLoading(true);
      const res = await makeGuess(GameType.Attributes, kol);

      const guess = res.game1Guesses.find((g) => g.guess.id === kol.id)!;

      // Check if all guess results are Correct
      const allCorrect = Object.values(guess.result).every(
        (value) => value === "Correct"
      );
      console.log("all correct?", allCorrect);
      if (allCorrect) {
        openModal(<UserProfileModal gameSession={res} />);
        alert(`Yey! you guessed right! ${res.game1Score} is your score.`);
        // You can add additional logic here, such as showing a message to the user
        toast.error("All guesses were correct. Congratulations!");
      } else {
        console.log("At least one guess was incorrect or partially incorrect.");
      }

      setGameSessionFromApi(res);
      console.log("res after set state: ", gameSessionFromApi);
    } catch (error) {
      console.log("error", error);
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
        <SearchBar
          kols={kols}
          handleGuess={handleGuess}
          // gameSessionFromApi={gameSessionFromApi}
        />
      </Container>

      {/* guessResults section */}
      {
        <section className="text-white no-scrollbar">
          <AttributesGuessListTable gameSessionFromApi={gameSessionFromApi} />
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
