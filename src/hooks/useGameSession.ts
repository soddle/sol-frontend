import { useCallback } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { GameSession } from "@/types/";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useProgram } from "./useProgram";

import { KOL } from "@/types";
import { submitGuess } from "@/lib/api/game";
import { useGameState } from "./useGameState";
import { fetchGameSessionFromApi } from "@/lib/api";

export const useGameSession = () => {
  const getProgram = useProgram();
  const { fetchGameState } = useGameState();

  const { wallet } = useWallet();

  const fetchGameSession = useCallback(
    async (playerPublicKey: PublicKey) => {
      const program = getProgram();
      const gameState = await fetchGameState();

      const [gameSessionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("game_session"),
          playerPublicKey.toBuffer(),
          Buffer.from(gameState?.currentCompetition.id!),
        ],
        program.programId
      );
      console.log("gameSessionPDA", gameSessionPDA.toString());

      //@ts-expect-error Not typed
      const fetchedSession = await program.account.gameSession.fetch(
        gameSessionPDA
      );

      return fetchedSession as GameSession;
    },
    [getProgram]
  );

  const startGameSession = useCallback(
    async (
      gameType: number,
      kol: KOL,
      playerPubKey = wallet?.adapter.publicKey
    ) => {
      const program = getProgram();
      const gameState = await fetchGameState();
      console.log("game state: ", gameState);

      const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_state")],
        program.programId
      );

      const [gameSessionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("game_session"),
          playerPubKey?.toBuffer()!,
          Buffer.from(gameState?.currentCompetition.id!),
        ],
        program.programId
      );
      console.log("gameSessionPDA", gameSessionPDA.toString());

      const [playerStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("player_state"), playerPubKey?.toBuffer()!],
        program.programId
      );

      const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vault")],
        program.programId
      );

      try {
        return await fetchGameSession(playerPubKey!);
      } catch (err) {
        console.log(err);
      }

      await program.methods
        .startGameSession(gameType, kol)
        .accounts({
          gameState: gameStatePDA,
          gameSession: gameSessionPDA,
          player: playerPubKey!,
          playerState: playerStatePDA,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const gS = fetchGameSession(playerPubKey!);

      return gS;
    },
    [getProgram, fetchGameSession, wallet]
  );

  const makeGuess = useCallback(
    async (gameType: number, guess: KOL) => {
      console.log(gameType, guess);
      const res = await submitGuess({
        gameType: gameType,
        publicKey: wallet?.adapter.publicKey!,
        guess: guess,
      });

      // toast.success("Guess made successfully");
      // await fetchGameSessionFromApi({
      //   publicKey: wallet?.adapter.publicKey?.toString()!,
      // });
      return res;
    },
    [getProgram, fetchGameSession]
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
