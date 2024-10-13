import { EVMChainAdapter, ChainConfig } from "../types";
import { EthereumAdapter } from "./ethereumAdapter";
import { ethers } from "ethers";
import { KOL, GameSession, GameState } from "@/types";

export class BlastAdapter extends EthereumAdapter implements EVMChainAdapter {
  private blastProvider: ethers.JsonRpcProvider;
  private blastSigner: ethers.Signer | null = null;
  // protected gameContract: ethers.Contract | null = null;

  constructor(config: ChainConfig) {
    super(config);
    this.blastProvider = new ethers.JsonRpcProvider(config.rpcEndpoint);
  }

  async connect(wallet: any): Promise<string> {
    this.blastSigner = await this.blastProvider.getSigner();
    const address = await this.blastSigner.getAddress();

    // Initialize the game contract
    this.gameContract = new ethers.Contract(
      this.config.contractAddresses.game,
      [
        "function fetchGameState() view returns (tuple(uint256 id, uint256 startTime, uint256 endTime, uint256 prize))",
      ],
      this.blastSigner
    );

    return address;
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
    //   prize: ethers.utils.formatEther(gameState.prize),
    // };
    return gameState;
  }

  async fetchGameSession(playerAddress: string): Promise<GameSession> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    // Implement Blast-specific logic to fetch game session
    // This is a placeholder and should be replaced with actual contract call
    const gameSession = await this.gameContract.fetchGameSession(playerAddress);
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
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    // Implement Blast-specific logic to start a game session
    const tx = await this.gameContract.startGameSession(
      gameType,
      JSON.stringify(kol)
    );
    const receipt = await tx.wait();

    // Assuming the event emitted contains the new game session details
    const event = receipt.events?.find(
      (e: any) => e.event === "GameSessionStarted"
    );
    if (!event) {
      throw new Error("Failed to start game session");
    }

    return this.fetchGameSession(await this.blastSigner!.getAddress());
  }

  async makeGuess(gameType: number, guess: KOL): Promise<any> {
    if (!this.gameContract) {
      throw new Error("Game contract not initialized");
    }

    // Implement Blast-specific logic to make a guess
    const tx = await this.gameContract.makeGuess(
      gameType,
      JSON.stringify(guess)
    );
    const receipt = await tx.wait();

    // Return the transaction receipt or any relevant data
    return receipt;
  }

  // Add any Blast-specific methods here
  async getBlastGasPrice(): Promise<string> {
    // const gasPrice = await this.blastProvider.estimateGas();
    return ethers.formatUnits(3000000, "gwei");
  }

  // Override the getChainConfig method if needed
  getChainConfig(): ChainConfig {
    return {
      ...this.config,
      // Add any Blast-specific config here
      // blastSpecificField: "Some Blast specific value",
    };
  }
}
