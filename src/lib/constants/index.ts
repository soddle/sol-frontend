export { default as solanaIdl } from "./solana.json";
export { default as eclipseIdl } from "./eclipse.json";
export { default as blastAbi } from "./blast.json";
export { default as ethereumAbi } from "./ethereum.json";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const enum GameType {
  Attributes = 1,
  Tweets = 2,
  Emojis = 3,
}
export enum LEGEND_BOX_COLORS {
  correct = "#0DBF2E", // Bright green
  incorrect = "#D21210", // Bright red
  partially_correct = "#FFA500", // Orange
  higher = "#D21210",
  lower = "#D21210",
}

export enum LEGEND_BOX_TYPES {
  correct = "correct",
  partially_correct = "partially_correct",
  incorrect = "incorrect",
  higher = "higher",
  lower = "lower",
}

export const REQUIRED_DEPOSIT = 0.2 * LAMPORTS_PER_SOL; // 0.2 SOL in lamports
export const MAX_GUESSES = 10;
