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

  const { ui } = useRootStore();
  const isLegendOpen = ui((state) => state.isLegendOpen);
  const setLoading = ui((state) => state.setLoading);
  const setError = ui((state) => state.setError);

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
      setLoading(true);
      const res = await makeGuess(GameType.Attributes, kol);
      console.log("res after making a successful guess", res);

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
