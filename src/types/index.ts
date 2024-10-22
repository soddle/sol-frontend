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
  player: string;
  totalScore: number;
  bestTime: number;
  gamesPlayed: number;
  averageDifficulty: number;
  // mistakes: number;
}

// generated types
// Instruction Types
type InitializeGameInstruction = {
  name: "initialize_game";
  accounts: {
    gameState: PublicKey;
    authority: PublicKey;
    systemProgram: PublicKey;
  };
  args: [];
};

type StartGameSessionInstruction = {
  name: "start_game_session";
  accounts: {
    gameState: PublicKey;
    gameSession: PublicKey;
    player: PublicKey;
    vault: PublicKey;
    systemProgram: PublicKey;
  };
  args: [{ name: "gameType"; type: number }, { name: "kol"; type: KOL }];
};

type SubmitScoreInstruction = {
  name: "submit_score";
  accounts: {
    gameSession: PublicKey;
    player: PublicKey;
    authority: PublicKey;
    systemProgram: PublicKey;
  };
  args: [{ name: "score"; type: number }, { name: "gameType"; type: number }];
};

// Account Types
type GameSession = {
  player: PublicKey;
  gameType: number;
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
  deposit: bigint;
  kol: KOL;
  competitionId: string;
};

type GameState = {
  currentCompetition: Competition;
  lastUpdateTime: number;
};

// Struct Types
type KOL = {
  id: string;
  name: string;
  age: number;
  country: string;
  pfpType: string;
  pfp: string;
  accountCreation: number;
  followers: number;
  ecosystem: string;
};

type Competition = {
  id: string;
  startTime: number;
  endTime: number;
  prize: bigint;
};

type TweetGuessEvent = {
  kolId: number;
  tweet: string;
};

// Program Type
type SoddleGameProgram = {
  programId: PublicKey;
  instruction: {
    initializeGame: (
      accounts: InitializeGameInstruction["accounts"]
    ) => Promise<void>;
    startGameSession: (
      accounts: StartGameSessionInstruction["accounts"],
      args: StartGameSessionInstruction["args"]
    ) => Promise<void>;
    submitScore: (
      accounts: SubmitScoreInstruction["accounts"],
      args: SubmitScoreInstruction["args"]
    ) => Promise<void>;
  };
  account: {
    gameSession: {
      fetch: (address: PublicKey) => Promise<GameSession>;
    };
    gameState: {
      fetch: (address: PublicKey) => Promise<GameState>;
    };
  };
};

export type {
  SoddleGameProgram,
  InitializeGameInstruction,
  StartGameSessionInstruction,
  SubmitScoreInstruction,
  GameSession,
  GameState,
  KOL,
  Competition,
  TweetGuessEvent,
};
