"use client";
import * as anchor from "@coral-xyz/anchor";
import { useCallback } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "@/lib/constants/idl.json";
import { WalletConnectionError } from "@/lib/errors";

export const useProgram = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return useCallback(() => {
    if (!wallet?.publicKey) {
      throw new WalletConnectionError("Wallet not connected.");
    }

    const provider = new anchor.AnchorProvider(connection, wallet, {
      maxRetries: 10,
      commitment: "confirmed",
    });
    anchor.setProvider(provider);

    const program = new anchor.Program(
      idl as anchor.Idl,
      provider
    ) as anchor.Program<anchor.Idl>;

    console.log("program in useProgram: ", program.programId.toString());

    return program;
  }, [connection, wallet]);
};
