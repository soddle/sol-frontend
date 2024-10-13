import { SVMChainAdapter, ChainConfig } from "../types";
import { SolanaAdapter } from "./solanaAdapter";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { KOL, GameSession, GameState } from "@/types";

export class EclipseAdapter extends SolanaAdapter implements SVMChainAdapter {
  private eclipseConnection: Connection;
  private eclipseProgram: anchor.Program<anchor.Idl> | null = null;

  constructor(config: ChainConfig) {
    super(config);
    this.eclipseConnection = new Connection(config.rpcEndpoint);
  }

  async connect(wallet: anchor.Wallet): Promise<string> {
    const provider = new anchor.AnchorProvider(this.eclipseConnection, wallet, {
      commitment: "confirmed",
    });
    anchor.setProvider(provider);

    this.eclipseProgram = new anchor.Program(
      this.config.idl as anchor.Idl,
      provider
    );

    return wallet.publicKey.toString();
  }

  async fetchGameState(): Promise<GameState> {
    if (!this.eclipseProgram) {
      throw new Error("Eclipse program not initialized");
    }

    // @ts-expect-error no type
    const gameState = await this.eclipseProgram.account.gameState.fetch(
      new PublicKey(this.config.contractAddresses.game)
    );

    // return {
    //   id: gameState.id.toString(),
    //   startTime: new Date(gameState.startTime.toNumber() * 1000),
    //   endTime: new Date(gameState.endTime.toNumber() * 1000),
    //   prize: gameState.prize.toString(),
    // };
    return gameState;
  }

  async fetchGameSession(playerAddress: string): Promise<GameSession> {
    if (!this.eclipseProgram) {
      throw new Error("Eclipse program not initialized");
    }

    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        new PublicKey(playerAddress).toBuffer(),
        Buffer.from(this.config.contractAddresses.game),
      ],
      this.eclipseProgram.programId
    );

    // @ts-expect-error no type
    const gameSession = await this.eclipseProgram.account.gameSession.fetch(
      gameSessionPDA
    );

    // return {
    //   id: gameSession.id.toString(),
    //   playerAddress,
    //   gameType: gameSession.gameType,
    //   startTime: new Date(gameSession.startTime.toNumber() * 1000),
    //   endTime: new Date(gameSession.endTime.toNumber() * 1000),
    //   status: gameSession.status,
    // };
    return gameSession;
  }

  async startGameSession(gameType: number, kol: KOL): Promise<GameSession> {
    if (!this.eclipseProgram) {
      throw new Error("Eclipse program not initialized");
    }

    const playerPublicKey = this.eclipseProgram.provider.publicKey;
    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey!.toBuffer(),
        Buffer.from(this.config.contractAddresses.game),
      ],
      this.eclipseProgram.programId
    );

    await this.eclipseProgram.methods
      .startGameSession(gameType, JSON.stringify(kol))
      .accounts({
        gameSession: gameSessionPDA,
        player: playerPublicKey!,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return this.fetchGameSession(playerPublicKey!.toString());
  }

  async makeGuess(gameType: number, guess: KOL): Promise<boolean> {
    if (!this.eclipseProgram) {
      throw new Error("Eclipse program not initialized");
    }

    const playerPublicKey = this.eclipseProgram.provider.publicKey;
    const [gameSessionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("game_session"),
        playerPublicKey!.toBuffer(),
        Buffer.from(this.config.contractAddresses.game),
      ],
      this.eclipseProgram.programId
    );

    const tx = await this.eclipseProgram.methods
      .makeGuess(gameType, JSON.stringify(guess))
      .accounts({
        gameSession: gameSessionPDA,
        player: playerPublicKey!,
      })
      .rpc();

    // Assuming the transaction success means the guess was valid
    return tx ? true : false;
  }

  async signAndSendSVMTransaction(transaction: Transaction): Promise<string> {
    if (!this.eclipseProgram) {
      throw new Error("Eclipse program not initialized");
    }

    // const signedTx = await this.eclipseProgram.provider.sendAndConfirm(
    //   transaction
    // );
    throw Error("Not implemented yet");
    // return signedTx;
  }

  getChainConfig(): ChainConfig {
    return {
      ...this.config,
      // Add any Eclipse-specific config here
      // eclipseSpecificField: "Some Eclipse specific value",
    };
  }

  // Eclipse-specific methods
  async getEclipseBlockHeight(): Promise<number> {
    return await this.eclipseConnection.getBlockHeight();
  }

  async getEclipseBalance(address: string): Promise<number> {
    const balance = await this.eclipseConnection.getBalance(
      new PublicKey(address)
    );
    return balance;
  }
}
