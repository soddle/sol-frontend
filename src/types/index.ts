export * from "./game";
export * from "./api";

export enum GameType {
  Attributes = 1,
  Tweets = 2,
  Emojis = 3,
}

export type AttributeResult = "correct" | "incorrect" | "higher" | "lower";

export interface KOL {
  id: string;
  name: string;
  age: number;
  country: string;
  accountCreation: number;
  pfp: string;
  followers: number;
  ecosystem: string;
}

export interface KolWithTweets extends KOL {
  tweets: string[];
}

export interface Competition {
  id: string;
  startTime: number;
  endTime: number;
}

export interface Player {
  game1Completed: boolean;
  game2Completed: boolean;
  game3Completed: boolean;
  game1Score: number;
  game2Score: number;
  game3Score: number;
}

export interface TweetGuessEvent {
  kolId: number;
  tweet: string;
}

export interface GameState {
  currentCompetition: Competition;
  lastUpdateTime: number;
}
