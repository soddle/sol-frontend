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
import { solanaIdl } from "@/lib/constants";
import { chainConfigs } from "@/lib/config";
// import { useAnchorWallet } from "@solana/wallet-adapter-react";

export const runtime = "dynamic";

// useAnchorWallet;
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

    const [gameStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      programId
    );

    // creating tx here manually (with coral-xyz) cuz anchor.Wallet refused to work
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: gameStatePDA, isSigner: false, isWritable: true },
        { pubkey: cronKeypair.publicKey, isSigner: true, isWritable: true },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId,
      data: Buffer.from([0]), // Assuming 0 is the instruction index for initializeGame
    });

    const transaction = new Transaction().add(instruction);
    transaction.feePayer = cronKeypair.publicKey;

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    transaction.sign(cronKeypair);
    const txId = await connection.sendRawTransaction(transaction.serialize());

    await connection.confirmTransaction(txId);

    logger.info(`Game initialized with transaction: ${txId}`);

    return NextResponse.json({ success: true, transaction: txId });
  } catch (error) {
    logger.error("Failed to initialize game:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize game" },
      { status: 500 }
    );
  }
}
