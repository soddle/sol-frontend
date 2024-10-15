import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  SVMChainAdapter,
  ChainConfig,
  SupportedNetwork,
  OnchainGameState,
  OnchainGameSession,
} from "../types";
import { KOL } from "@/types";
import { createGameSession, fetchCurrentActiveSession } from "@/actions/game";
import { fetchRandomKOL } from "@/actions/kol";
import { GameSession } from "@prisma/client";

export class SolanaAdapter implements SVMChainAdapter {
  private connection: Connection;
  private currentNetwork: SupportedNetwork; // the same as cluster for SVM
  protected config: ChainConfig;
  private program: anchor.Program<anchor.Idl> | null = null;
  private wallet: anchor.Wallet | null = null;

  constructor(config: ChainConfig) {
    this.config = config;

    // Ensure that the defaultNetwork is defined and exists in networks
    if (!config.defaultNetwork || !config.networks[config.defaultNetwork]) {
      throw new Error(
        "Invalid configuration: defaultNetwork is not defined or does not exist in networks."
      );
    }

    this.currentNetwork = config.defaultNetwork;
    this.connection = new Connection(
      config.networks[this.currentNetwork]!.rpcEndpoint
    );

    if (!config.idl) {
      throw new Error("IDL is required for SolanaAdapter");
    }
  }

  setNetwork = (network: SupportedNetwork): void => {
    if (this.config.networks[network]) {
      this.currentNetwork = network;
      this.connection = new Connection(
        this.config.networks[network].rpcEndpoint
      );
    } else {
      throw new Error(`Invalid Solana network: ${network}`);
    }
  };

  getCurrentNetwork = (): SupportedNetwork => {
    return this.currentNetwork;
  };

  getProvider = (): any => {
    if (!this.program) throw new Error("Program not initialized");
    return this.program.provider;
  };

  connect = async (wallet: anchor.Wallet): Promise<anchor.Program> => {
    this.wallet = wallet;
    const provider = new anchor.AnchorProvider(this.connection, wallet, {
      commitment: "confirmed",
    });
    anchor.setProvider(provider);

    this.program = new anchor.Program(this.config.idl as anchor.Idl, provider);

    return this.program;
  };

  disconnect = async (): Promise<void> => {
    this.wallet = null;
    this.program = null;
  };

  get chainConfig(): ChainConfig {
    return this.config;
  }
  getSVMProvider = (): any => {
    if (!this.program) throw new Error("Program not initialized");
    return this.program.provider;
  };

  signAndSendTransaction = async (
    transaction: Transaction
  ): Promise<string> => {
    return this.signAndSendSVMTransaction(transaction);
  };

  signAndSendSVMTransaction = async (
    transaction: Transaction
  ): Promise<string> => {
    if (!this.wallet) throw new Error("Wallet not connected");
    if (!this.program) throw new Error("Program not initialized");

    const provider = this.program.provider as anchor.AnchorProvider;
    const signedTx = await provider.sendAndConfirm(transaction);
    return signedTx;
  };

  startSVMGameSession = async (gameType: number): Promise<GameSession> => {
    return this.startGameSession(gameType);
  };

  makeSVMGuess = async (gameType: number, guess: KOL): Promise<any> => {
    return this.makeGuess(gameType, guess);
  };

  getSVMPlayerGameState = async (
    address: string
  ): Promise<OnchainGameSession> => {
    return this.fetchGameSession(address);
  };

  claimSVMRewards = async (gameSessionId: string): Promise<any> => {
    if (!this.program) throw new Error("Program not initialized");
    if (!this.wallet) throw new Error("Wallet not connected");

    const playerPublicKey = this.wallet.publicKey;

    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey.toBuffer(),
        Buffer.from(gameSessionId),
      ],
      this.program.programId
    );

    const [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      this.program.programId
    );

    const tx = await this.program.methods
      .claimRewards()
      .accounts({
        gameSession: gameSessionPDA,
        player: playerPublicKey,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return tx;
  };

  fetchGameState = async (): Promise<OnchainGameState> => {
    const [gameStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      new PublicKey(this.config.contractAddresses["game"])
    );

    // @ts-expect-error no type
    const gameStateAccount = await this.program.account.gameState.fetch(
      gameStatePDA
    );

    return gameStateAccount as OnchainGameState;
  };

  fetchGameSession = async (
    playerAddress: string
  ): Promise<OnchainGameSession> => {
    if (!this.program) throw new Error("Program not initialized");

    const gameState = await this.fetchGameState();
    const playerPublicKey = new PublicKey(playerAddress);

    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey.toBuffer(),
        Buffer.from(gameState.currentCompetition.id),
      ],
      this.program.programId
    );

    // @ts-expect-error types
    const gameSessionAccount = await this.program.account.gameSession.fetch(
      gameSessionPDA
    );

    return gameSessionAccount as OnchainGameSession;
  };

  startGameSession = async (gameType: number): Promise<GameSession> => {
    if (!this.program) throw new Error("Program not initialized");
    const playerPublicKey = this.program.provider.publicKey;

    // fetch and return active game session if it exists (both onchain and offchain)
    const activeSession = await fetchCurrentActiveSession(
      playerPublicKey?.toString()!
    );
    if (activeSession) {
      return activeSession;
    }

    // else start a new session for the wallet
    const gameState = await this.fetchGameState();
    const targetKOL = await fetchRandomKOL();

    const [gameStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      this.program.programId
    );

    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey!.toBuffer(),
        Buffer.from(gameState.currentCompetition.id),
      ],
      this.program.programId
    );

    const [playerStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("player_state"), playerPublicKey!.toBuffer()],
      this.program.programId
    );

    const [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      this.program.programId
    );

    await this.program.methods
      .startGameSession(gameType, targetKOL)
      .accounts({
        gameState: gameStatePDA,
        gameSession: gameSessionPDA,
        player: playerPublicKey!,
        playerState: playerStatePDA,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const newOnchainGameSession = await this.fetchGameSession(
      playerPublicKey!.toString()
    );

    const newGameSession = await createGameSession(newOnchainGameSession);
    return newGameSession;
  };

  makeGuess = async (gameType: number, guess: KOL): Promise<any> => {
    if (!this.program) throw new Error("Program not initialized");

    const gameState = await this.fetchGameState();
    const playerPublicKey = this.program.provider.publicKey;

    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey!.toBuffer(),
        Buffer.from(gameState.currentCompetition.id),
      ],
      this.program.programId
    );

    const tx = await this.program.methods
      .makeGuess(gameType, guess)
      .accounts({
        gameSession: gameSessionPDA,
        player: playerPublicKey!,
      })
      .rpc();

    return tx;
  };
}
