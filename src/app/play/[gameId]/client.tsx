"use client";
import React, { useEffect, useState } from "react";
import { GuessResult, KOL, KolWithTweets } from "@/lib/types/idl-types";
import SearchBar from "./_components/search-bar";
import { GameType } from "@/lib/constants";
import TimerDisplay from "./_components/time-display";
import Container from "@/components/layout/container";
import { AttributesGuessList } from "./_components/attributes-guess-list";
import { TweetsGuessList } from "./_components/tweets-guess-list";
import { EmojisGuessList } from "./_components/emojis-guess-list";
import Legend from "./_components/legends";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchRandomKOL } from "@/lib/fns/fetchers";
import TweetQuestionBoxWrapper from "./_components/tweet-question-box-wrapper";
import { useGameSession } from "@/hooks/useGameSession";
import Link from "next/link";
import { useRootStore } from "@/stores/storeProvider";

export default function GameIdPageClient({
  gameId,
  kols,
}: {
  gameId: number;
  kols: KolWithTweets[];
}) {
  const router = useRouter();
  const { wallet } = useWallet();
  const { fetchGameSession, makeGuess, gameSession } = useGameSession();
  const [randomizedKol, setRandomizedKol] = useState<KolWithTweets | null>(
    null
  );
  const { ui, game } = useRootStore();
  const isLegendOpen = ui((state) => state.isLegendOpen);
  const setLoading = ui((state) => state.setLoading);
  const setError = ui((state) => state.setError);
  const setGameSession = game((state) => state.setGameSession);

  useEffect(() => {
    if (!wallet) {
      router.push("/");
      return;
    }
  }, [wallet, router]);

  useEffect(() => {
    async function getGameSession() {
      const gameSession = await fetchGameSession(wallet?.adapter.publicKey!);
      setGameSession(gameSession);
    }
    try {
      getGameSession();
    } catch (error) {
      toast.error("Error fetching game session");
      setError("Error fetching game session");
    }
  }, [gameSession]);

  useEffect(() => {
    async function getRandomKol() {
      const randKol = await fetchRandomKOL();
      setRandomizedKol(randKol);
    }

    getRandomKol();
  }, [gameSession]);

  const handleSelect = async (kol: KOL) => {
    try {
      setLoading(true);
      if (gameId && kol) {
        await makeGuess(gameId, kol);
        return;
      }
    } catch (error) {
      toast.error("Error making guess");
      setError("Error making guess");
    } finally {
      setLoading(false);
    }
  };

  if (!gameSession) {
    return (
      <div className="text-white">
        You are not in a game session. Start a new game{" "}
        <Link href="/play" className="text-blue-500">
          here
        </Link>
      </div>
    );
  }

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
        <TweetQuestionBoxWrapper className="">
          <section className=" text-white flex flex-col justify-between items-center">
            <h1 className="text-2xl font-bold text-center">
              {gameId === GameType.Attributes
                ? "Guess today's personality!"
                : gameId === GameType.Tweets
                ? "Who published that tweet?"
                : "Which personalities do these emojis describe?"}
            </h1>
            <div className="flex justify-center items-center">
              {gameId === GameType.Attributes ? (
                <div className="">{null}</div>
              ) : gameId === GameType.Tweets ? (
                <div className="">{randomizedKol?.tweets[0]}</div>
              ) : (
                gameId === GameType.Emojis && <div className="">{null}</div>
              )}
            </div>
          </section>
        </TweetQuestionBoxWrapper>
      </Container>

      {/* search bar */}
      <Container>
        <SearchBar kols={kols} onSelect={handleSelect} />
      </Container>

      {/* guessResults section */}

      {
        <section className="text-white no-scrollbar">
          {gameId === GameType.Attributes ? (
            <AttributesGuessList guessResults={gameSession.guesses} />
          ) : gameId === GameType.Tweets ? (
            <Container>
              <TweetsGuessList guessResults={gameSession.guesses} />
            </Container>
          ) : (
            gameId === GameType.Emojis && (
              <Container>
                <EmojisGuessList guessResults={gameSession.guesses} />
              </Container>
            )
          )}
        </section>
      }
      {/* Legends */}
      {isLegendOpen && (
        <Container>
          <>
            <Legend />
          </>
        </Container>
      )}
    </div>
  );
}
