import { OnchainKOL } from "@/lib/chains/types";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type GameType = 1 | 2 | 3;

export interface InitializeGameAccounts {
  gameState: PublicKey;
  authority: PublicKey;
  systemProgram: PublicKey;
}

export type AttributeResult =
  | "correct"
  | "incorrect"
  | "higher"
  | "lower"
  | "partially";

export interface AttributeGuess {
  kol: OnchainKOL;
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
