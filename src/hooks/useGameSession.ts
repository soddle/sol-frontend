import { useCallback, useState } from "react";
import {
  PublicKey,
  SendTransactionError,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import { GameSession } from "@/types/";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useProgram } from "./useProgram";

import { KOL } from "@/types";
import { submitGuess } from "@/lib/api/game";

export const useGameSession = () => {
  const getProgram = useProgram();

  const { wallet } = useWallet();

  const fetchGameSession = useCallback(
    async (playerPublicKey: PublicKey) => {
      const program = getProgram();

      const [gameSessionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_session"), playerPublicKey.toBuffer()],
        program.programId
      );

      //@ts-expect-error Not typed
      const fetchedSession = await program.account.gameSession.fetch(
        gameSessionPDA
      );
      console.log(
        "returned value from fetching game session: ",
        fetchedSession
      );

      return fetchedSession as GameSession;
    },
    [getProgram]
  );

  const startGameSession = useCallback(
    async (gameType: number, kol: KOL) => {
      const program = getProgram();

      const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_state")],
        program.programId
      );
      console.log("game state pda: ", gameStatePDA);

      const [gameSessionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_session"), wallet?.adapter.publicKey!.toBuffer()!],
        program.programId
      );

      console.log("game session pda", gameSessionPDA);
      const [playerStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("player_state"), wallet?.adapter.publicKey!.toBuffer()!],
        program.programId
      );
      console.log("game player pda: ", playerStatePDA);

      const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault")],
        program.programId
      );

      console.log("game vault pda:", vaultPDA);

      const tx = await program.methods
        .startGameSession(gameType, kol)
        .accounts({
          gameState: gameStatePDA,
          gameSession: gameSessionPDA,
          player: wallet?.adapter.publicKey!,
          playerState: playerStatePDA,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(tx);

      const gS = fetchGameSession(wallet?.adapter.publicKey!);
      console.log("game session", gS);

      return gS;
    },
    [getProgram, fetchGameSession, wallet]
  );

  const makeGuess = useCallback(
    async (gameType: number, guess: KOL) => {
      const response = await submitGuess({
        gameType: gameType,
        publicKey: wallet?.adapter.publicKey!,
        guess: guess,
      });

      console.log(response);
      /*   const program = getProgram();
        if (!program) {
          throw new WalletConnectionError();
        }

        setLoading(true);
        const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("game_state")],
          program.programId
        );

        const [gameSessionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("game_session"), wallet?.adapter.publicKey!.toBuffer()!],
          program.programId
        );

        const [playerStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("player_state"), wallet?.adapter.publicKey!.toBuffer()!],
          program.programId
        );

        await program.methods
          .makeGuess(gameType, guess)
          .accounts({
            gameState: gameStatePDA,
            gameSession: gameSessionPDA,
            player: wallet?.adapter.publicKey!,
            playerState: playerStatePDA,
          })
          .rpc();

        */

      toast.success("Guess made successfully");
      await fetchGameSession(wallet?.adapter.publicKey!);
    },
    [getProgram, fetchGameSession, wallet]
  );

  return {
    fetchGameSession,
    startGameSession,
    makeGuess,
  };
};

export function getKeypairFromSecretKey(): Keypair {
  const secretKey = new Uint8Array([
    209, 21, 219, 119, 127, 25, 156, 84, 17, 101, 204, 253, 197, 190, 92, 69,
    102, 251, 213, 250, 241, 240, 228, 145, 231, 142, 86, 8, 193, 173, 7, 240,
    115, 41, 26, 145, 167, 22, 121, 57, 110, 119, 234, 247, 252, 144, 196, 236,
    32, 187, 12, 30, 168, 111, 163, 0, 93, 10, 55, 245, 93, 54, 62, 254,
  ]);

  const keypair = Keypair.fromSecretKey(secretKey);
  console.log("keypair to copy", keypair.publicKey.toString());

  return keypair;
}

/* 
curl https://staging-rpc.dev2.eclipsenetwork.xyz -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"requestAirdrop", "params":["8kYEnR6Uq4R84hBRWk6ptufHnHgX7x9h9Ar2J4snuBAV", 1000000000]}'
*/
