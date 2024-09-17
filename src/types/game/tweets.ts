import { KOL } from "../index";

export interface TweetGuess {
  kol: KOL;
  result: boolean;
}

export interface TweetsGameState {
  guesses: TweetGuess[];
  currentGuess: number;
  isCompleted: boolean;
  currentTweet: string;
}
