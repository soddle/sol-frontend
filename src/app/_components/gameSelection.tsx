import { HashtagIcon } from "@heroicons/react/24/outline";
import { GameType } from "@/lib/constants";
import { GameButton } from "./gameTypeButton";
import { LaughingEmojiIcon } from "@/components/icons";

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
] as const;

export const GameSelection: React.FC<{
  handleStartGameSession: (gameType: GameType) => void;
}> = ({ handleStartGameSession }) => {
  return (
    <>
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
    </>
  );
};
