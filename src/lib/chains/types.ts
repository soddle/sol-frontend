import { Idl } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Cluster as SolanaCluster } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { GameSession } from "@prisma/client";

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

  getProvider(): any;
  signAndSendTransaction(transaction: any): Promise<string>;
  setNetwork(network: SupportedNetwork): void;
  fetchGameState(): Promise<OnchainGameState>;
  fetchGameSession(playerAddress: string): Promise<OnchainGameSession>;
  startGameSession(
    gameType: number,
    wallet: AnchorWallet
  ): Promise<GameSession>;
  makeGuess(gameType: number, guess: OnchainKOL): Promise<any>;
}

export interface SVMChainAdapter extends BaseChainAdapter {
  connect(wallet: AnchorWallet): Promise<anchor.Program>;
  disconnect(): Promise<void>;
  getSVMProvider(): SVMProvider;
  signAndSendSVMTransaction(transaction: SVMTransaction): Promise<string>;
  startSVMGameSession(gameType: number): Promise<SVMGameSession>;
  makeSVMGuess(gameType: number, guess: any): Promise<SVMGuessResult>;
  getSVMPlayerGameState(address: string): Promise<SVMGameState>;
  claimSVMRewards(gameSessionId: string): Promise<SVMClaimResult>;
}

export interface EVMChainAdapter extends BaseChainAdapter {
  getEVMProvider(): EVMProvider;

  signAndSendEVMTransaction(transaction: EVMTransaction): Promise<string>;
  startEVMGameSession(gameType: number, kol: any): Promise<EVMGameSession>;
  makeEVMGuess(gameType: number, guess: any): Promise<EVMGuessResult>;
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
  player: PublicKey;
  gameType: number;
  startTime: BN;
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
  deposit: BN;
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
