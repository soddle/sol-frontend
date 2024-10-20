import { Idl } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Cluster as SolanaCluster } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { Competition, GameSession, Guess, KOL, Prisma } from "@prisma/client";

// Define supported chains
export type SupportedChain = "SOLANA" | "ETHEREUM" | "ECLIPSE" | "BLAST";

// export type S = SupportedNetwork;
export type SupportedNetwork = SolanaCluster | "sepolia" | "mainnet";

export type HexAddress = `0x${string}`;
export interface ChainConfig {
  networks: {
    [key in SupportedNetwork]?: {
      rpcEndpoint: `https://${string}`;
      chainId?: number; // For EVM chains
      cluster?: SupportedNetwork;
    };
  };
  defaultNetwork: SupportedNetwork;
  idl?: Idl;
  abi?: any;
  contractAddresses: {
    [key: string]: string;
  };
}
export interface BaseChainAdapter {
  chainConfig: ChainConfig;
  fetchCurrentCompetition(): Promise<Competition | null>;

  getProvider(): any;
  signAndSendTransaction(transaction: any): Promise<string>;
  setNetwork(network: SupportedNetwork): void;
  fetchUserGuesses(sessionId: string): Promise<Guess[]>;
  fetchGameSession(
    playerAddress: string
  ): Promise<GameSessionWithGuesses | null>;
  fetchOnchainGameSession(
    playerAddress: string
  ): Promise<OnchainGameSession | null>;
  startGameSession(
    gameType: number,
    wallet: AnchorWallet
  ): Promise<GameSession>;
  makeGuess(sessionId: string, guessedKOLId: string): Promise<any>;
}

export interface SVMChainAdapter extends BaseChainAdapter {
  connect(wallet: AnchorWallet): Promise<anchor.Program>;
  disconnect(): Promise<void>;
  signAndSendSVMTransaction(transaction: SVMTransaction): Promise<string>;
  startSVMGameSession(gameType: number): Promise<SVMGameSession>;
  makeSVMGuess(
    sessionId: string,
    guessedKOLId: string
  ): Promise<SVMGuessResult>;
  claimSVMRewards(gameSessionId: string): Promise<SVMClaimResult>;
}

export interface EVMChainAdapter extends BaseChainAdapter {
  getEVMProvider(): EVMProvider;

  signAndSendEVMTransaction(transaction: EVMTransaction): Promise<string>;
  startEVMGameSession(gameType: number, kol: any): Promise<EVMGameSession>;
  makeEVMGuess(
    sessionId: string,
    guessedKOLId: string
  ): Promise<EVMGuessResult>;
  getEVMPlayerGameState(address: string): Promise<EVMGameState>;
  claimEVMRewards(gameSessionId: string): Promise<EVMClaimResult>;
}

export type ChainAdapter = SVMChainAdapter | EVMChainAdapter;

// Onchain Types

export interface OnchainKOL {
  id: string;
  name: string;
  age: number;
  country: string;
  pfp: string; // URL to the profile picture
  pfpType: string;
  accountCreation: number; // Year of account creation
  followers: number; // Number of followers
  ecosystem: string; // Ecosystem type (e.g., Influencer)
}

export interface OnchainGameSession {
  player: anchor.Address;
  gameType: number;
  startTime: string;
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
  deposit: string;
  kol: OnchainKOL;
  competitionId: string;
}

export interface OnchainCompetition {
  id: string;
  startTime: BN;
  endTime: BN;
}

export interface OnchainGameState {
  currentCompetition: OnchainCompetition;
  lastUpdateTime: BN;
}

export type GuessWithSessionAndGuessedKol = Prisma.GuessGetPayload<{
  include: {
    session: true;
    guessedKOL: true;
  };
}>;

// GameSession without user
export type GameSessionWithGuesses = Prisma.GameSessionGetPayload<{
  include: { guesses: true };
}>;

// GameSession with user
export type GameSessionWithUser = Prisma.GameSessionGetPayload<{
  include: { guesses: true; competition: true; user: true };
}>;

// GameSession with partial user info
export type GameSessionWithPartialUser = Prisma.GameSessionGetPayload<{
  include: {
    guesses: true;
    competition: true;
    user: { select: { id: true; address: true } };
  };
}>;

export type GuessWithFeedbackAndGussedKOL = Prisma.GuessGetPayload<{
  include: {
    attributes: true;
    feedback: true;
    guessedKOL: true;
  };
}>;

export interface SVMProvider {}
export interface EVMProvider {}
export interface SVMTransaction {}
export interface EVMTransaction {}
export interface SVMGameSession {}
export interface EVMGameSession {}
export interface SVMGuessResult {}
export interface EVMGuessResult {}
export interface SVMGameState {}
export interface EVMGameState {}
export interface SVMClaimResult {}
export interface EVMClaimResult {}
