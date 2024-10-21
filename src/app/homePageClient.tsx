"use client";
import UserInfoCard from "./_components/userInfoCard";
import TimeSection from "./_components/timeSection";
import { useRouter } from "next/navigation";
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
import { GameSelection } from "./_components/gameSelection";
import { GameType } from "@/lib/constants";
import { useUiStore } from "@/stores/uiStore";
import { useGameStore } from "@/stores/gameStore";
import { CyberButton } from "@/components/ui/cyberButton";

export default function GamePlayPageClient() {
  const anchorWallet = useAnchorWallet();
  const uiStore = useUiStore((state) => state);
  const gameStore = useGameStore((state) => state);

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

      if (gameSession) {
        router.push(`/attributes-game`);
      } else {
        throw new Error("Unable to start game.");
      }
    } catch (error) {
      console.error(error);
      if (
        error instanceof Error &&
        error.message === "You can only play once per day"
      ) {
        toast.error(error.message);
      } else if (
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
        <GameSelection handleStartGameSession={handleStartGameSession} />
      </div>
    </Container>
  );
}
