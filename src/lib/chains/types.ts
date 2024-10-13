import { GameSession, GameState, KOL } from "@/types";
import { Idl } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export interface ChainConfig {
  rpcEndpoint: string;
  chainId?: number;
  contractAddresses: {
    game: string;
  };
  idl?: Idl; // For SVM chains
  abi?: any; // For EVM chains
}

export interface BaseChainAdapter {
  getChainConfig(): ChainConfig;
  getProvider(): any;
  signAndSendTransaction(transaction: any): Promise<string>;

  fetchGameState(): Promise<GameState>;
  fetchGameSession(playerAddress: string): Promise<GameSession>;
  startGameSession(gameType: number, kol: KOL): Promise<GameSession>;
  makeGuess(gameType: number, guess: KOL): Promise<any>;
}

export interface SVMChainAdapter extends BaseChainAdapter {
  connect(wallet: AnchorWallet): Promise<string>;
  disconnect(): Promise<void>;
  getSVMProvider(): SVMProvider;
  signAndSendSVMTransaction(transaction: SVMTransaction): Promise<string>;
  startSVMGameSession(gameType: number, kol: any): Promise<SVMGameSession>;
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

// Define these interfaces based on your specific implementation
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
