"use client";
import UserInfoCard from "./_components/userInfoCard";
import TimeSection from "./_components/timeSection";
import { GameType } from "@/lib/constants";
import { GameButton } from "./_components/gameTypeButton";
import { HashtagIcon, LaughingEmojiIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useRootStore } from "@/stores/storeProvider";
import { toast } from "sonner";
import { useChainAdapter } from "@/hooks/useChainAdapter";
import {
  ApiRequestError,
  GameAlreadyCompletedError,
  GameSessionNotFoundError,
  InternalServerError,
} from "@/lib/errors";
import { Container } from "@/components/layout/mainLayoutClient";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";

const GAME_TYPES = [
  {
    title: "Attributes Game",
    description: "Find the daily KOL through clues on every try",
    type: GameType.Attributes,
    icon: "A",
  },
  {
    title: "Tweets Game",
    description: "Match an infamous tweet to its publisher",
    type: GameType.Tweets,
    icon: <HashtagIcon className="size-6" />,
  },
  {
    title: "Emoji's Game",
    description: "Guess the right KOL using emojis",
    type: GameType.Emojis,
    icon: <LaughingEmojiIcon className="size-6" />,
  },
];

export default function GamePlayPageClient() {
  const { ui, game } = useRootStore();
  const anchorWallet = useAnchorWallet();
  const uiStore = ui((state) => state);
  const gameStore = game((state) => state);

  const chainAdapter = useChainAdapter();
  const router = useRouter();

  const handleStartGameSession = async (gameType: GameType) => {
    try {
      if (!anchorWallet || !anchorWallet.publicKey) {
        toast.error("Please connect your wallet first");
        return;
      }

      uiStore.setLoading(true);
      const gameSession = await chainAdapter.startGameSession(
        gameType,
        anchorWallet
      );

      console.log("gameSession", gameSession);

      if (gameSession) {
        const serializableGameSession = {
          ...gameSession,
          id: gameSession.id.toString(),
          score: Number(gameSession.score),
          createdAt: new Date(gameSession.createdAt),
          updatedAt: new Date(gameSession.updatedAt),
          competitionId: gameSession.competitionId.toString(),
          user: null,
        };

        // gameStore.setGameSession(serializableGameSession);
        router.push(`/attributes-game`);
      } else {
        throw new Error("Unable to start game.");
      }
    } catch (error) {
      console.error(error);
      if (
        error instanceof GameSessionNotFoundError ||
        error instanceof GameAlreadyCompletedError ||
        error instanceof ApiRequestError ||
        error instanceof InternalServerError
      ) {
        toast.error(error.message);
      } else if (error instanceof WalletSignTransactionError) {
        toast.error("You need to sign transaction to proceed");
      } else if (
        error instanceof Error &&
        error.message === "No active competition found"
      ) {
        toast.error("No active competition found. Please try again later.");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      uiStore.setLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <UserInfoCard />
        <TimeSection />
        {GAME_TYPES.map((type, index) => (
          <GameButton
            key={type.type}
            disabled={index !== 0}
            description={type.description}
            type={type.type}
            title={type.title}
            icon={type.icon}
            onClick={() => handleStartGameSession(type.type)}
          />
        ))}
      </div>
    </Container>
  );
}
