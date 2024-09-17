import { KOL } from "../index";

export interface EmojiGuess {
  kol: KOL;
  result: boolean;
}

export interface EmojisGameState {
  guesses: EmojiGuess[];
  currentGuess: number;
  isCompleted: boolean;
  currentEmojis: string;
}
