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
  const setLoading = ui((state) => state.setLoading);
  const setCurrentGameType = game((state) => state.setCurrentGameType);
  const chainAdapter = useChainAdapter();
  const router = useRouter();

  const handleStartGameSession = async (gameType: GameType) => {
    try {
      setLoading(true);
      const gameSession = await chainAdapter.startGameSession(gameType);
      if (gameSession) {
        router.push(`/play/${gameType.toString().toLowerCase()}-game`);
      } else throw new Error("Unable to start game.");
    } catch (error) {
      console.error(error);
      if (
        error instanceof GameSessionNotFoundError ||
        error instanceof GameAlreadyCompletedError ||
        error instanceof ApiRequestError ||
        error instanceof InternalServerError
      ) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <UserInfoCard />
        <TimeSection />
        {GAME_TYPES.map((type) => (
          <GameButton
            key={type.type}
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
