import { PublicKey } from "@solana/web3.js";
import { KOL } from ".";

export interface StartGameRequestBody {
  publicKey: string;
  gameType: number;
  game: {
    gameType: number;
    startTime: number;
    game1Completed: boolean;
    game2Completed: boolean;
    game1Score: number;
    game2Score: number;
    game1Guesses: any[]; // You might want to define a more specific type for guesses
    game2Guesses: any[]; // You might want to define a more specific type for guesses
    totalScore: number;
    completed: boolean;
    score: number;
    kol: KOL;
    competitionId: string;
    guesses: any[]; // You might want to define a more specific type for guesses
  };
}
