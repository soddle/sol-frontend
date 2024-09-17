export * from "./attributes";
export * from "./emojis";
export * from "./tweets";
export * from "./props";

import { PublicKey } from "@solana/web3.js";

export type GameType = 1 | 2 | 3;

export interface KOL {
  id: string;
  name: string;
  age: number;
  country: string;
  pfp: string;
  accountCreation: number;
  followers: number;
  ecosystem: string;
}

export interface Competition {
  id: string;
  startTime: number;
  endTime: number;
}

export interface GameSession {
  player: PublicKey;
  gameType: GameType;
  startTime: number;
  game1Completed: boolean;
  game2Completed: boolean;
  game1Score: number;
  game2Score: number;
  game1GuessesCount: number;
  game2GuessesCount: number;
  totalScore: number;
  targetIndex: number;
  completed: boolean;
  score: number;
  deposit: number;
  kol: KOL;
  competitionId: string;
}

export interface GameState {
  currentCompetition: Competition;
  lastUpdateTime: number;
}

export interface TweetGuessEvent {
  kolId: number;
  tweet: string;
}

export interface InitializeGameAccounts {
  gameState: PublicKey;
  authority: PublicKey;
  systemProgram: PublicKey;
}

export interface StartGameSessionAccounts {
  gameState: PublicKey;
  gameSession: PublicKey;
  player: PublicKey;
  vault: PublicKey;
  systemProgram: PublicKey;
}

export interface StartGameSessionArgs {
  gameType: GameType;
  kol: KOL;
}

export interface SubmitScoreAccounts {
  gameSession: PublicKey;
  player: PublicKey;
  authority: PublicKey;
  systemProgram: PublicKey;
}

export interface SubmitScoreArgs {
  gameType: GameType;
  score: number;
  guesses: number;
}
