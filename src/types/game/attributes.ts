import { KOL, AttributeResult } from "../index";

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
