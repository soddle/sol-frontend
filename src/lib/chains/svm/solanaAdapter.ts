import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { SVMChainAdapter, ChainConfig } from "../types";
import { KOL, GameSession, GameState } from "@/types";
// import idl from "@/lib/constants/idl.json";

export class SolanaAdapter implements SVMChainAdapter {
  private connection: Connection;
  protected config: ChainConfig;
  private program: anchor.Program<anchor.Idl> | null = null;
  private wallet: anchor.Wallet | null = null;

  constructor(config: ChainConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcEndpoint);
    if (!config.idl) {
      throw new Error("IDL is required for SolanaAdapter");
    }
  }
  getProvider(): any {
    if (!this.program) throw new Error("Program not initialized");
    return this.program.provider;
  }
  async connect(wallet: anchor.Wallet): Promise<string> {
    this.wallet = wallet;
    const provider = new anchor.AnchorProvider(this.connection, wallet, {
      commitment: "confirmed",
    });
    anchor.setProvider(provider);

    this.program = new anchor.Program(this.config.idl as anchor.Idl, provider);

    return wallet.publicKey.toString();
  }

  async disconnect(): Promise<void> {
    this.wallet = null;
    this.program = null;
  }

  getChainConfig(): ChainConfig {
    return this.config;
  }

  getSVMProvider(): any {
    if (!this.program) throw new Error("Program not initialized");
    return this.program.provider;
  }

  async signAndSendTransaction(transaction: Transaction): Promise<string> {
    return this.signAndSendSVMTransaction(transaction);
  }

  async signAndSendSVMTransaction(transaction: Transaction): Promise<string> {
    if (!this.wallet) throw new Error("Wallet not connected");
    if (!this.program) throw new Error("Program not initialized");

    const provider = this.program.provider as anchor.AnchorProvider;
    const signedTx = await provider.sendAndConfirm(transaction);
    return signedTx;
  }

  async startSVMGameSession(gameType: number, kol: KOL): Promise<GameSession> {
    return this.startGameSession(gameType, kol);
  }

  async makeSVMGuess(gameType: number, guess: KOL): Promise<any> {
    return this.makeGuess(gameType, guess);
  }

  async getSVMPlayerGameState(address: string): Promise<GameSession> {
    return this.fetchGameSession(address);
  }

  async claimSVMRewards(gameSessionId: string): Promise<any> {
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
  }

  async fetchGameState(): Promise<GameState> {
    if (!this.program) throw new Error("Program not initialized");

    const [gameStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      this.program.programId
    );

    // @ts-expect-error no type
    const gameStateAccount = await this.program.account.gameState.fetch(
      gameStatePDA
    );

    return gameStateAccount as GameState;
  }

  async fetchGameSession(playerAddress: string): Promise<GameSession> {
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

    return gameSessionAccount as GameSession;
  }

  async startGameSession(gameType: number, kol: KOL): Promise<GameSession> {
    if (!this.program) throw new Error("Program not initialized");

    const gameState = await this.fetchGameState();
    const playerPublicKey = this.program.provider.publicKey;

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
      .startGameSession(gameType, kol)
      .accounts({
        gameState: gameStatePDA,
        gameSession: gameSessionPDA,
        player: playerPublicKey!,
        playerState: playerStatePDA,
        vault: vaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return this.fetchGameSession(playerPublicKey!.toString());
  }

  async makeGuess(gameType: number, guess: KOL): Promise<any> {
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
  }
}
