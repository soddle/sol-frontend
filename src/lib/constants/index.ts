import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const enum GameType {
  Attributes = 1,
  Tweets = 2,
  Emojis = 3,
}
export enum LEGEND_BOX_COLORS {
  Correct = "#0DBF2E", // Bright green
  Incorrect = "#D21210", // Bright red
  PartiallyCorrect = "#FFA500", // Orange
  Higher = "#D21210",
  Lower = "#D21210",
}

export enum LEGEND_BOX_TYPES {
  Correct = "Correct",
  PartiallyCorrect = "PartiallyCorrect",
  Incorrect = "Incorrect",
  Higher = "Higher",
  Lower = "Lower",
}

export const GAME_SESSION_PDA_SEED = "game_session";

export const REQUIRED_DEPOSIT = 0.1 * LAMPORTS_PER_SOL; // 0.1 SOL in lamports
export const MAX_GUESSES = 10;
