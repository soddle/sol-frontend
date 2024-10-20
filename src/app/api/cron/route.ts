import { NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { rateLimit } from "@/lib/rateLimit";
import { getSecureKeypair } from "@/lib/keyManagement";
import { logger } from "@/lib/logger";
import * as anchor from "@coral-xyz/anchor";
// import { solanaIdl } from "@/lib/constants";
import { chainConfigs } from "@/lib/config";
import { SoddleGame } from "@/lib/constants/soddle_game";

// export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    // Verify authentication token
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn("Unauthorized access attempt to cron route");

      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting
    const { success } = await rateLimit(request);
    if (!success) {
      logger.warn("Rate limit exceeded for cron route");
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const connection = new Connection(
      chainConfigs.SOLANA.networks[
        chainConfigs.SOLANA.defaultNetwork
      ]?.rpcEndpoint!,
      {
        commitment: "confirmed",
      }
    );

    // Use a more secure method to retrieve the keypair
    const cronKeypair = await getSecureKeypair();
    const programId = new PublicKey(chainConfigs.SOLANA.contractAddresses.game);

    const wallet = new anchor.Wallet(cronKeypair);

    const anchorProvider = new anchor.AnchorProvider(connection, wallet);

    anchor.setProvider(anchorProvider);

    const [gameStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      programId
    );
    const program = anchor.workspace.Game as anchor.Program<SoddleGame>;
    const gameAccount = program.account.gameState.fetch(gameStatePDA);

    console.log(gameAccount);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to initialize game:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize game" },
      { status: 500 }
    );
  }
}
