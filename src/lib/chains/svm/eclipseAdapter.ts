import {
  SVMChainAdapter,
  ChainConfig,
  SupportedNetworksOrClusters,
} from "../types";
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
  private currentCluster: SupportedNetworksOrClusters;
  private eclipseConnection: Connection;
  private eclipseProgram: anchor.Program<anchor.Idl> | null = null;

  constructor(config: ChainConfig) {
    super(config);

    // Ensure that defaultNetwork is defined in the config
    if (!config.defaultNetwork || !config.networks[config.defaultNetwork]) {
      throw new Error(
        "Invalid configuration: defaultNetwork is not defined or does not exist in networks."
      );
    }

    this.currentCluster = config.defaultNetwork;
    this.eclipseConnection = new Connection(
      config.networks[this.currentCluster]!.rpcEndpoint
    );
  }

  setNetwork = (cluster: SupportedNetworksOrClusters): void => {
    if (this.config.networks && this.config.networks[cluster]) {
      this.currentCluster = cluster;
      this.eclipseConnection = new Connection(
        this.config.networks[cluster].rpcEndpoint
      );
    } else {
      throw new Error(`Invalid Eclipse cluster: ${cluster}`);
    }
  };

  getCurrentClusterOrNetwork = (): SupportedNetworksOrClusters => {
    return this.currentCluster;
  };

  getChainConfig = (): ChainConfig => {
    return {
      ...this.config,
      // rpcEndpoint: this.config.clusters[this.currentCluster].rpcEndpoint,
    };
  };

  connect = async (wallet: anchor.Wallet): Promise<anchor.Program> => {
    const provider = new anchor.AnchorProvider(this.eclipseConnection, wallet, {
      commitment: "confirmed",
    });
    anchor.setProvider(provider);

    this.eclipseProgram = new anchor.Program(
      this.config.idl as anchor.Idl,
      provider
    );

    return this.eclipseProgram;
  };

  fetchGameState = async (): Promise<GameState> => {
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
  };

  fetchGameSession = async (playerAddress: string): Promise<GameSession> => {
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
  };

  startGameSession = async (
    gameType: number,
    kol: KOL
  ): Promise<GameSession> => {
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
  };

  makeGuess = async (gameType: number, guess: KOL): Promise<boolean> => {
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
  };

  signAndSendSVMTransaction = async (
    transaction: Transaction
  ): Promise<string> => {
    if (!this.eclipseProgram) {
      throw new Error("Eclipse program not initialized");
    }

    // const signedTx = await this.eclipseProgram.provider.sendAndConfirm(
    //   transaction
    // );
    throw Error("Not implemented yet");
    // return signedTx;
  };

  // Eclipse-specific methods
  getEclipseBlockHeight = async (): Promise<number> => {
    return await this.eclipseConnection.getBlockHeight();
  };

  getEclipseBalance = async (address: string): Promise<number> => {
    const balance = await this.eclipseConnection.getBalance(
      new PublicKey(address)
    );
    return balance;
  };
}
