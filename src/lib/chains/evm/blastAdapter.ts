import {
  EVMChainAdapter,
  ChainConfig,
  SupportedNetwork,
  OnchainGameState,
  OnchainGameSession,
} from "../types";
import { EthereumAdapter } from "./ethereumAdapter";
import { ethers } from "ethers";
import { KOL } from "@/types";
import { GameSession } from "@prisma/client";

export class BlastAdapter extends EthereumAdapter implements EVMChainAdapter {
  // protected currentNetwork: string;
  private blastProvider: ethers.JsonRpcProvider;
  private blastSigner: ethers.Signer | null = null;

  constructor(chainConfig: ChainConfig) {
    super(chainConfig);
    this.currentNetwork = chainConfig.defaultNetwork;
    this.blastProvider = new ethers.JsonRpcProvider(
      chainConfig.networks[this.currentNetwork]!.rpcEndpoint
    );
  }

  setNetwork(network: SupportedNetwork): void {
    if (this.chainConfig.networks && this.chainConfig.networks[network]) {
      this.currentNetwork = network;
      this.blastProvider = new ethers.JsonRpcProvider(
        this.chainConfig.networks[network].rpcEndpoint
      );
    } else {
      throw new Error(`Invalid Blast network: ${network}`);
    }
  }

  getCurrentNetwork(): SupportedNetwork {
    return this.currentNetwork;
  }

  getChainConfig(): ChainConfig {
    return {
      ...this.chainConfig,
      // rpcEndpoint: this.chainConfig.networks[this.currentNetwork].rpcEndpoint,
      // chainId: this.chainConfig.networks[this.currentNetwork].chainId,
    };
  }

  async connect(wallet: any): Promise<string> {
    this.blastSigner = await this.blastProvider.getSigner();
    const address = await this.blastSigner.getAddress();

    this.gameContract = new ethers.Contract(
      this.chainConfig.contractAddresses.game,
      [
        "function fetchGameState() view returns (tuple(uint256 id, uint256 startTime, uint256 endTime, uint256 prize))",
        "function fetchGameSession(address) view returns (tuple(uint256 id, uint8 gameType, uint256 startTime, uint256 endTime, uint8 status))",
        "function startGameSession(uint8, string) returns (tuple(uint256 id, uint8 gameType, uint256 startTime, uint256 endTime, uint8 status))",
        "function makeGuess(uint8, string) returns (bool)",
      ],
      this.blastSigner
    );

    return address;
  }

  async fetchGameState(): Promise<OnchainGameState> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const gameState = await this.gameContract.fetchGameState();
    return gameState;
  }

  async fetchGameSession(playerAddress: string): Promise<OnchainGameSession> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const gameSession = await this.gameContract.fetchGameSession(playerAddress);
    return gameSession;
  }

  // async startGameSession(gameType: number, kol: KOL): Promise<GameSession> {
  //   if (!this.gameContract) {
  //     throw new Error("Game contract not initialized");
  //   }

  //   const tx = await this.gameContract.startGameSession(
  //     gameType,
  //     JSON.stringify(kol)
  //   );
  //   const receipt = await tx.wait();

  //   const event = receipt.events?.find(
  //     (e: any) => e.event === "GameSessionStarted"
  //   );
  //   if (!event) {
  //     throw new Error("Failed to start game session");
  //   }

  //   return this.fetchGameSession(await this.blastSigner!.getAddress());
  // }

  async makeGuess(gameType: number, guess: KOL): Promise<boolean> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    const tx = await this.gameContract.makeGuess(
      gameType,
      JSON.stringify(guess)
    );
    const receipt = await tx.wait();

    const event = receipt.events?.find((e: any) => e.event === "GuessMade");
    return event ? event.args.isCorrect : false;
  }

  async getBlastGasPrice(): Promise<string> {
    const gasPrice = await this.blastProvider.getFeeData();
    return ethers.formatUnits(gasPrice.gasPrice || 3000000, "gwei");
  }
}
