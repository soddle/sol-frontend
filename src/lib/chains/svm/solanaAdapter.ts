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
  OnchainGameState,
  GuessWithGuessedKol,
} from "../types";
import {
  createGameSession,
  fetchTodaySession,
  fetchUserGuesses,
  makeGuess,
  upsertCurrentCompetition,
} from "@/actions/gameActions";
import { fetchRandomKOL } from "@/actions/kolActions";
import { Competition, GameSession, Guess } from "@prisma/client";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { fetchLeaderboard } from "@/actions/leaderboardActions";
import { LeaderboardEntry } from "@/types";
import {
  DailyGameLimitReachedError,
  GameSessionCreationError,
  NoActiveCompetitionError,
  ProgramNotInitializedError,
  SoddleError,
} from "@/lib/errors";
import { LeaderboardType } from "@/app/(activityPages)/leaderboard/leaderboardPageClient";

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

  fetchUserGuesses = async (
    sessionId: string
  ): Promise<GuessWithGuessedKol[]> => {
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
      const gameState = await this.fetchOnChainGameState();

      // Use the upsertCurrentCompetition server action
      const competition = await upsertCurrentCompetition({
        onChainId: gameState.currentCompetition.id,
        startTime: gameState.currentCompetition.startTime.toNumber(),
        endTime: gameState.currentCompetition.endTime.toNumber(),
        prize: 10000,
      });

      return competition;
    } catch (error) {
      console.error("Error fetching current competition:", error);
      throw error;
    }
  };

  fetchOnChainGameSession = async (
    program: anchor.Program,
    playerPublicKey: PublicKey,
    competition: Competition
  ): Promise<OnchainGameSession> => {
    try {
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
    } catch (error) {
      console.error("Error fetching on-chain game session:", error);
      throw new Error("Failed to fetch on-chain game session");
    }
  };

  fetchOnChainGameState = async (): Promise<OnchainGameState> => {
    const program = await this.connect(this.wallet!);
    if (!program) throw new Error("Program not initialized");

    // Fetch on-chain game state
    const [gameStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      program.programId
    );
    // @ts-expect-error types
    const gameState = (await program.account.gameState.fetch(
      gameStatePDA
    )) as OnchainGameState;

    console.log("On-chain game state:", gameState);
    return gameState;
  };

  fetchTodaySession = async (
    playerAddress: string
  ): Promise<GameSessionWithGuesses | null> => {
    const todaySession = await fetchTodaySession(playerAddress);
    return todaySession;
  };

  private _startOnChainGameSession = async (
    program: anchor.Program,
    playerPublicKey: PublicKey,
    competition: Competition,
    gameType: number
  ): Promise<OnchainGameSession> => {
    const targetKOL = await fetchRandomKOL();
    console.log(
      "🎯 Target KOL selected: 😂😂😂😂😂😂😂😂😂😂😂😂🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣",
      targetKOL?.name
    );

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

    const newOnchainGameSession = await this.fetchOnChainGameSession(
      program,
      playerPublicKey,
      competition
    );
    return newOnchainGameSession;
  };

  startGameSession = async (
    gameType: number,
    wallet: AnchorWallet
  ): Promise<GameSession> => {
    const program = await this.connect(wallet);
    if (!program) throw new ProgramNotInitializedError();

    try {
      const playerPublicKey = program.provider.publicKey;
      const todaySession = await this.fetchTodaySession(
        playerPublicKey?.toString()!
      );
      if (todaySession) {
        return todaySession;
      }

      const competition = await this.fetchCurrentCompetition();
      if (!competition) throw new NoActiveCompetitionError();

      const newOnchainGameSession = await this._startOnChainGameSession(
        program,
        playerPublicKey!,
        competition,
        gameType
      );

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
        startTime: newOnchainGameSession.startTime.toString(),
        targetIndex: newOnchainGameSession.targetIndex,
        totalScore: newOnchainGameSession.totalScore,
      };

      return createGameSession(newSession);
    } catch (error) {
      if (error instanceof SoddleError) {
        throw error;
      }
      throw new GameSessionCreationError((error as Error).message);
    }
  };

  makeGuess = async (
    sessionId: string,
    guessedKOLId: string
  ): Promise<Guess> => {
    return makeGuess(sessionId, guessedKOLId);
  };

  // Leaderboard functions
  fetchLeaderboard = async (
    gameType: 1 | 2 | 3,
    leaderboardType: LeaderboardType
  ): Promise<{ entries: LeaderboardEntry[]; totalEntries: number }> => {
    return fetchLeaderboard(gameType, leaderboardType);
  };

  getUserRank = async (
    walletAddress: string,
    gameType: number,
    leaderboardType: "today" | "yesterday" | "alltime"
  ): Promise<number | null> => {
    const leaderboard = await this.fetchLeaderboard(
      gameType as 1 | 2 | 3,
      leaderboardType
    );
    const userEntry = leaderboard.entries.find(
      (entry: any) => entry.player === walletAddress
    );
    return userEntry ? userEntry.rank : null;
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
