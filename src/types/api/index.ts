import { AttributeResult } from "../game";

export * from "./requests";
export * from "./responses";

export interface GameSessionFromApiResponse {
  success: boolean;
  data: GameSessionFromApi;
  message: string | null;
}

export interface GameSessionFromApi {
  _id: string;
  player: string;
  gameType: number;
  startTime: number;
  game1Completed: boolean;
  game2Completed: boolean;
  game1Score: number;
  game2Score: number;
  game1Guesses: Game1Guess[]; // You might want to define a more specific type for game1Guesses
  game2Guesses: any[];
  game1GuessesCount: number;
  game2GuessesCount: number;
  totalScore: number;
  completed: boolean;
  score: number;
  kol: KOL;
  competitionId: string;
  __v: number;
}

export interface Game1Guess {
  guess: KOL;
  result: GuessResult;
}

export interface GuessResult {
  account_creation: AttributeResult;
  age: AttributeResult;
  country: AttributeResult;
  ecosystem: AttributeResult;
  followers: AttributeResult;
  name: AttributeResult;
  pfpType: AttributeResult;
}

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
