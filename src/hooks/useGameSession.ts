import { useCallback } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
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

      const [gameSessionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_session"), wallet?.adapter.publicKey!.toBuffer()!],
        program.programId
      );

      const [playerStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("player_state"), wallet?.adapter.publicKey!.toBuffer()!],
        program.programId
      );

      const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault")],
        program.programId
      );

      const gameSess = await fetchGameSession(wallet?.adapter.publicKey!);
      if (gameSess) return gameSess;

      await program.methods
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

      const gS = fetchGameSession(wallet?.adapter.publicKey!);

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

/* 
curl https://staging-rpc.dev2.eclipsenetwork.xyz -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"requestAirdrop", "params":["8kYEnR6Uq4R84hBRWk6ptufHnHgX7x9h9Ar2J4snuBAV", 1000000000]}'
*/
