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
  SupportedNetwork,
} from "../types";
import { KOL, GameSession, GameState } from "@/types";

export class EthereumAdapter implements EVMChainAdapter {
  protected currentNetwork: SupportedNetwork;
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;
  protected gameContract: ethers.Contract | null = null;
  protected config: ChainConfig;

  constructor(config: ChainConfig) {
    this.config = config;
    this.currentNetwork = config.defaultNetwork;
    this.provider = new ethers.JsonRpcProvider(
      config.networks[this.currentNetwork]!.rpcEndpoint
    );
    if (!config.abi) {
      throw new Error("ABI is required for EthereumAdapter");
    }
  }

  setNetwork(network: SupportedNetwork): void {
    if (this.config.networks && this.config.networks[network]) {
      this.currentNetwork = network;
      this.provider = new ethers.JsonRpcProvider(
        this.config.networks[network].rpcEndpoint
      );
      this.signer = null;
      this.gameContract = null;
    } else {
      throw new Error(`Invalid Ethereum network: ${network}`);
    }
  }

  getCurrentNetwork(): SupportedNetwork {
    return this.currentNetwork;
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

    this.gameContract = new ethers.Contract(
      this.config.contractAddresses.game,
      this.config.abi,
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
    return gameState;
  }

  async fetchGameSession(playerAddress: string): Promise<GameSession> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const gameSession = await this.gameContract.fetchGameSession(playerAddress);
    return gameSession;
  }

  async startGameSession(gameType: number, kol: KOL): Promise<GameSession> {
    // return this.startEVMGameSession(gameType, kol);
    return {} as GameSession;
  }

  async makeGuess(gameType: number, guess: KOL): Promise<boolean> {
    const result = await this.makeEVMGuess(gameType, guess);
    return true;
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
    return {
      ...this.config,
      // rpcEndpoint: this.config.networks[this.currentNetwork].rpcEndpoint,
      // chainId: this.config.networks[this.currentNetwork].chainId,
    };
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

  async getGasPrice(): Promise<string> {
    const feeData = await this.provider.getFeeData();
    return ethers.formatUnits(feeData.gasPrice || 3000000, "gwei");
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }
}
