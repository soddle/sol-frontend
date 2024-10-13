import { ethers } from "ethers";
import {
  EVMChainAdapter,
  EVMProvider,
  EVMTransaction,
  ChainConfig,
  EVMGameSession,
  EVMGuessResult,
  EVMGameState,
  EVMClaimResult,
} from "../types";
import { KOL, GameSession, GameState } from "@/types";

export class EthereumAdapter implements EVMChainAdapter {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;
  protected gameContract: ethers.Contract | null = null;
  protected config: ChainConfig;

  constructor(config: ChainConfig) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.rpcEndpoint);
    if (!config.abi) {
      throw new Error("ABI is required for EthereumAdapter");
    }
  }

  getChainName(): string {
    return "Ethereum";
  }

  getEVMProvider(): EVMProvider {
    return this.provider;
  }

  async connect(wallet: any): Promise<string> {
    this.signer = await this.provider.getSigner();
    const address = await this.signer.getAddress();

    // Initialize the game contract
    this.gameContract = new ethers.Contract(
      this.config.contractAddresses.game,
      [
        "function fetchGameState() view returns (tuple(uint256 id, uint256 startTime, uint256 endTime, uint256 prize))",
        "function fetchGameSession(address player) view returns (tuple(uint256 id, address player, uint8 gameType, uint256 startTime, uint256 endTime, uint8 status))",
        "function startGameSession(uint8 gameType, string memory kol) returns (uint256)",
        "function makeGuess(uint8 gameType, string memory guess) returns (bool)",
        "function claimRewards(uint256 gameSessionId) returns (uint256)",
      ],
      this.signer
    );

    return address;
  }

  async disconnect(): Promise<void> {
    this.signer = null;
    this.gameContract = null;
  }

  getProvider(): any {
    return this.provider;
  }

  async signAndSendTransaction(transaction: EVMTransaction): Promise<string> {
    return this.signAndSendEVMTransaction(transaction);
  }

  async fetchGameState(): Promise<GameState> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const gameState = await this.gameContract.fetchGameState();
    // return {
    //   id: gameState.id.toString(),
    //   startTime: new Date(gameState.startTime.toNumber() * 1000),
    //   endTime: new Date(gameState.endTime.toNumber() * 1000),
    //   prize: ethers.formatEther(gameState.prize),
    // };

    return gameState;
  }

  async fetchGameSession(playerAddress: string): Promise<GameSession> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const gameSession = await this.gameContract.fetchGameSession(playerAddress);
    // return {
    //   id: gameSession.id.toString(),
    //   playerAddress: gameSession.player,
    //   gameType: gameSession.gameType,
    //   startTime: new Date(gameSession.startTime.toNumber() * 1000),
    //   endTime: new Date(gameSession.endTime.toNumber() * 1000),
    //   status: gameSession.status,
    // };
    return gameSession;
  }

  async startGameSession(gameType: number, kol: KOL): Promise<GameSession> {
    // just to disable this error for now.

    // return this.startEVMGameSession(gameType, kol);
    return {} as GameSession;
  }

  async makeGuess(gameType: number, guess: KOL): Promise<boolean> {
    // just to disable this error for now.
    return this.makeEVMGuess(gameType, guess) as unknown as boolean;
  }

  async signAndSendEVMTransaction(
    transaction: EVMTransaction
  ): Promise<string> {
    if (!this.signer) {
      throw new Error("Signer not initialized");
    }

    const tx = await this.signer.sendTransaction(transaction);
    const receipt = await tx.wait();

    return receipt?.hash as string;
  }

  getChainConfig(): ChainConfig {
    return this.config;
  }

  async startEVMGameSession(
    gameType: number,
    kol: any
  ): Promise<EVMGameSession> {
    if (!this.gameContract || !this.signer) {
      throw new Error("Game contract or signer not initialized");
    }

    const tx = await this.gameContract.startGameSession(
      gameType,
      JSON.stringify(kol)
    );
    const receipt = await tx.wait();

    const playerAddress = await this.signer.getAddress();
    return this.fetchGameSession(playerAddress) as EVMGameSession;
  }

  async makeEVMGuess(gameType: number, guess: any): Promise<EVMGuessResult> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const tx = await this.gameContract.makeGuess(
      gameType,
      JSON.stringify(guess)
    );
    const receipt = await tx.wait();

    return { success: receipt.status === 1 };
  }

  async getEVMPlayerGameState(address: string): Promise<EVMGameState> {
    return this.fetchGameState() as EVMGameState;
  }

  async claimEVMRewards(gameSessionId: string): Promise<EVMClaimResult> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const tx = await this.gameContract.claimRewards(gameSessionId);
    const receipt = await tx.wait();

    return {
      success: receipt.status === 1,
      rewardAmount:
        receipt.events?.find((e: any) => e.event === "RewardsClaimed")?.args
          ?.amount || "0",
    };
  }

  // Additional Ethereum-specific methods
  async getGasPrice(): Promise<string> {
    // just to disable this error for now.
    // const gasPrice = await this.provider.getGasPrice();
    return ethers.formatUnits(3000000, "gwei");
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }
}
