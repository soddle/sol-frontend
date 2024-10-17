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
  OnchainGameSession,
  GameSessionWithGuesses,
} from "../types";
import {
  createGameSession,
  fetchCurrentActiveSession,
  fetchLatestCompetition,
  fetchUserGuesses,
  makeGuess,
} from "@/actions/gameActions";
import { fetchRandomKOL } from "@/actions/kolActions";
import { Competition, GameSession, Guess, KOL } from "@prisma/client";
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

  fetchUserGuesses = async (sessionId: string): Promise<Guess[]> => {
    return fetchUserGuesses(sessionId);
  };
  connect = async (wallet: AnchorWallet): Promise<anchor.Program> => {
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

  makeSVMGuess = async (
    sessionId: string,
    guessedKOLId: string
  ): Promise<any> => {
    return this.makeGuess(sessionId, guessedKOLId);
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

  fetchCurrentCompetition = async (): Promise<Competition | null> => {
    try {
      await this.connect(this.wallet!);
      const competition = await fetchLatestCompetition();
      if (!competition) {
        console.log("No current competition found");
        return null;
      }
      return competition;
    } catch (error) {
      console.error("Error fetching current competition:", error);
      throw error;
    }
  };

  fetchOnchainGameSession = async (
    playerAddress: string
  ): Promise<OnchainGameSession | null> => {
    if (!this.program) throw new Error("Program not initialized");

    const competition = await this.fetchCurrentCompetition();
    if (!competition) throw new Error("No active competition found");

    const playerPublicKey = new PublicKey(playerAddress);

    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey.toBuffer(),
        Buffer.from(competition.onChainId),
      ],
      this.program.programId
    );

    // @ts-expect-error types
    const gameSessionAccount = await this.program.account.gameSession.fetch(
      gameSessionPDA
    );

    return gameSessionAccount;
  };

  fetchOnChainGameSession = async (
    program: anchor.Program,
    playerPublicKey: PublicKey,
    competition: Competition
  ): Promise<OnchainGameSession> => {
    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey.toBuffer(),
        Buffer.from(competition.onChainId),
      ],
      program.programId
    );

    // @ts-expect-error types
    const gameSessionAccount = await program.account.gameSession.fetch(
      gameSessionPDA
    );

    return gameSessionAccount as OnchainGameSession;
  };

  fetchGameSession = async (
    playerAddress: string
  ): Promise<GameSessionWithGuesses | null> => {
    const activeSession = await fetchCurrentActiveSession(playerAddress);
    return activeSession;
  };

  private _startOnChainGameSession = async (
    program: anchor.Program,
    playerPublicKey: PublicKey,
    competition: Competition,
    gameType: number
  ): Promise<OnchainGameSession> => {
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
        playerPublicKey.toBuffer(),
        Buffer.from(competition.onChainId),
      ],
      program.programId
    );
    const [playerStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("player_state"), playerPublicKey.toBuffer()],
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
        player: playerPublicKey,
        playerState: playerStatePDA,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("✅ On-chain transaction completed successfully!");

    console.log("📡 Fetching newly created game session from chain...");
    const newOnchainGameSession = await this.fetchOnChainGameSession(
      program,
      playerPublicKey,
      competition
    );
    return newOnchainGameSession;
  };

  // fetchOnChainGameState = async (): Promise<any> => {
  //   if (!this.program) throw new Error("Program not initialized");

  //   const [gameStatePDA] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("game_state")],
  //     this.program.programId
  //   );

  //   try {
  //     // @ts-expect-error types
  //     const gameStateAccount = await this.program.account.gameState.fetch(
  //       gameStatePDA
  //     );

  //     console.log(gameStateAccount);

  //     return gameStateAccount as any;
  //   } catch (error) {
  //     console.error("Error fetching on-chain game state:", error);
  //     throw error;
  //   }
  // };

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
    const competition = await this.fetchCurrentCompetition();
    if (!competition) {
      throw new Error("No active competition found");
    }
    console.log("🌍 Current competition fetched successfully.");

    const newOnchainGameSession = await this._startOnChainGameSession(
      program,
      playerPublicKey!,
      competition,
      gameType
    );

    console.log("💾 Creating off-chain game session record...");
    console.log("New onchain Game Session: ", newOnchainGameSession);
    const newSession: Partial<OnchainGameSession> = {
      competitionId: competition.id,
      completed: newOnchainGameSession.completed,
      deposit: (newOnchainGameSession.deposit as anchor.BN).toString(),
      game1Completed: newOnchainGameSession.game1Completed,
      game1GuessesCount: newOnchainGameSession.game1GuessesCount,
      game1Score: newOnchainGameSession.game1Score,
      game2Completed: newOnchainGameSession.game2Completed,
      game2GuessesCount: newOnchainGameSession.game2GuessesCount,
      game2Score: newOnchainGameSession.game2Score,
      gameType: newOnchainGameSession.gameType,
      kol: newOnchainGameSession.kol,
      player: newOnchainGameSession.player.toString(),
      score: newOnchainGameSession.score,
      startTime: (newOnchainGameSession.startTime as anchor.BN).toString(),
      targetIndex: newOnchainGameSession.targetIndex,
      totalScore: newOnchainGameSession.totalScore,
    };
    const newGameSession = await createGameSession(newSession);
    console.log("🎮 New game session created and ready to play!");
    console.log("New game session: ", newGameSession);

    return newGameSession;
  };

  makeGuess = async (sessionId: string, guessedKOLId: string): Promise<any> => {
    return makeGuess(sessionId, guessedKOLId);
  };
}

export function calculateScore(
  attemptNumber: number,
  isCorrect: boolean
): number {
  const baseScore = 1000;
  const penaltyPerAttempt = 100;
  const bonusForQuickGuess = 500;

  if (!isCorrect) {
    return 0;
  }

  let score = baseScore - (attemptNumber - 1) * penaltyPerAttempt;

  if (attemptNumber <= 3) {
    score += bonusForQuickGuess;
  }

  return Math.max(score, 100); // Ensure the minimum score for a correct guess is 100
}
