import { GameType, KOL } from "../index";
import { AttributeGuess } from "../game/attributes";
import { TweetGuess } from "../game/tweets";
import { EmojiGuess } from "../game/emojis";

export interface SearchBarProps {
  kols: KOL[];
  onSelect: (kol: KOL) => void;
}

export interface TimerDisplayProps {
  endTime: number;
}

export interface LegendProps {
  gameType: GameType;
}

export interface GuessListProps {
  guesses: AttributeGuess[] | TweetGuess[] | EmojiGuess[];
  gameType: GameType;
}

export interface GameButtonProps {
  description: string;
  type: GameType;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface QuestionBoxProps {
  children: React.ReactNode;
  className?: string;
}
