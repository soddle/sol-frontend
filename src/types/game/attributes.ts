import { KOL } from "../index";

export type AttributeResult = "correct" | "incorrect" | "higher" | "lower";

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

export interface AttributesGameState {
  guesses: AttributeGuess[];
  currentGuess: number;
  isCompleted: boolean;
}
