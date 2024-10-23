"use client";
import UserInfoCard from "./_components/userInfoCard";
import TimeSection from "./_components/timeSection";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  GameSessionCreationError,
  SoddleError,
  WalletNotConnectedError,
} from "@/lib/errors";
import { Container } from "@/components/layout/mainLayoutClient";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { GameSelection } from "./_components/gameSelection";
import { GameType } from "@/lib/constants";
import { useUiStore } from "@/stores/uiStore";

import { useGame } from "@/hooks/useGame";

export default function GamePlayPageClient() {
  const anchorWallet = useAnchorWallet();
  const uiStore = useUiStore((state) => state);
  const { startGameSession } = useGame();
  const router = useRouter();

  const handleStartGameSession = async (gameType: GameType) => {
    try {
      if (!anchorWallet) {
        throw new WalletNotConnectedError();
      }

      uiStore.setLoading(true);
      const todaySession = await startGameSession(gameType, anchorWallet);

      if (todaySession) {
        router.push(
          `/attributes-game?adr=${anchorWallet.publicKey
            ?.toBase58()
            .slice(0, 6)}`
        );
      } else {
        throw new GameSessionCreationError();
      }
    } catch (error) {
      console.error(error);
      if (error instanceof SoddleError) {
        toast.error(error.message);
        console.log(error);
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
