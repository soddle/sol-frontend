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
  OnchainKOL,
} from "../types";
import {
  createGameSession,
  fetchCurrentActiveSession,
} from "@/actions/gameActions";
import { fetchRandomKOL } from "@/actions/kolActions";
import { GameSession } from "@prisma/client";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export class SolanaAdapter implements SVMChainAdapter {
  private connection: Connection;
  private currentNetwork: SupportedNetwork; // the same as cluster for SVM
  protected config: ChainConfig;
  private program: anchor.Program<anchor.Idl> | null = null;
  private wallet: AnchorWallet | null = null;

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

  connect = async (wallet: AnchorWallet): Promise<anchor.Program> => {
    console.log("wallet address on connect: ", wallet);
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
    throw Error("not fully implemented");
    // return this.startGameSession(gameType);
  };

  makeSVMGuess = async (gameType: number, guess: OnchainKOL): Promise<any> => {
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
    playerAddress: anchor.Address
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

    return gameSessionAccount;
  };

  startGameSession = async (
    gameType: number,
    wallet: AnchorWallet
  ): Promise<GameSession> => {
    const program = await this.connect(wallet);
    if (!program) throw new Error("🚫 Program not initialized");
    const playerPublicKey = program.provider.publicKey;

    console.log("🕵️ Checking if an active session is available...");
    const activeSession = await fetchCurrentActiveSession(
      playerPublicKey?.toString()!
    );
    if (activeSession) {
      console.log("🎉 Active session found! Returning existing session.");
      return activeSession;
    }

    console.log("🆕 No active session found. Starting a new game session...");
    const gameState = await this.fetchGameState();
    console.log("🌍 Game state fetched successfully.");

    const targetKOL = await fetchRandomKOL();
    console.log("🎯 Target KOL selected:", targetKOL?.twitterHandle);

    console.log("🔑 Generating program derived addresses...");
    const [gameStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      program.programId
    );
    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey!.toBuffer(),
        Buffer.from(gameState.currentCompetition.id),
      ],
      program.programId
    );
    const [playerStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("player_state"), playerPublicKey!.toBuffer()],
      program.programId
    );
    const [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );

    console.log("🚀 Initiating on-chain transaction to start game session...");
    await program.methods
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
    console.log("✅ On-chain transaction completed successfully!");

    console.log("📡 Fetching newly created game session from chain...");
    const newOnchainGameSession = await this.fetchGameSession(
      playerPublicKey!.toString()
    );

    console.log("💾 Creating off-chain game session record...");
    console.log("New onchain Game Session: ", newOnchainGameSession);
    const newSession: Partial<OnchainGameSession> = {
      competitionId: newOnchainGameSession.competitionId,
      completed: newOnchainGameSession.completed,
      deposit: newOnchainGameSession.deposit,
      game1Completed: newOnchainGameSession.game1Completed,
      game1GuessesCount: newOnchainGameSession.game1GuessesCount,
      game1Score: newOnchainGameSession.game1Score,
      game2Completed: newOnchainGameSession.game2Completed,
      game2GuessesCount: newOnchainGameSession.game2GuessesCount,
      game2Score: newOnchainGameSession.game2Score,
      gameType: newOnchainGameSession.gameType,
      kol: newOnchainGameSession.kol,
      player: newOnchainGameSession.player,
      score: newOnchainGameSession.score,
      startTime: new Date(parseInt(newOnchainGameSession.startTime, 16)),
      targetIndex: newOnchainGameSession.targetIndex,
      totalScore: newOnchainGameSession.totalScore,
    };
    const newGameSession = await createGameSession(newSession);
    console.log("🎮 New game session created and ready to play!");

    return newGameSession;
  };

  makeGuess = async (gameType: number, guess: OnchainKOL): Promise<any> => {
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
