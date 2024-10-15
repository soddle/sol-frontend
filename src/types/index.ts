import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { KOL } from "./kol";
export type { KOL } from "./kol";

export type GameType = 1 | 2 | 3;

export interface InitializeGameAccounts {
  gameState: PublicKey;
  authority: PublicKey;
  systemProgram: PublicKey;
}

// export interface StartGameSessionAccounts {
//   gameState: PublicKey;
//   gameSession: PublicKey;
//   player: PublicKey;
//   vault: PublicKey;
//   systemProgram: PublicKey;
// }

export type AttributeResult =
  | "correct"
  | "incorrect"
  | "higher"
  | "lower"
  | "partially";

export interface AttributeGuess {
  kol: KOL;
  result: [
    AttributeResult,
    AttributeResult,
    AttributeResult,
    AttributeResult,
    AttributeResult,
    AttributeResult,
    AttributeResult
  ];
}

export interface LeaderboardEntry {
  rank: number;
  reward: string;
  name: string;
  points: number;
}
