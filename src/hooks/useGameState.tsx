"use client";
import * as anchor from "@coral-xyz/anchor";
import { useCallback } from "react";
import { GameState } from "@/types/";
import { useProgram } from "./useProgram";

export const useGameState = () => {
  const getProgram = useProgram();

  const fetchGameState = useCallback(async (): Promise<GameState | null> => {
    try {
      const program = getProgram();

      const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_state")],
        program.programId
      );

      //@ts-expect-error
      const gameStateAccount = await program.account.gameState.fetch(
        gameStatePDA
      );
      console.log(
        "Game state account returned from fetchGameState: ",
        gameStateAccount
      );
      if (gameStateAccount) {
        return gameStateAccount as GameState;
      } else {
        throw new Error("Game state account not found");
      }
    } catch (err) {
      console.error("Error fetching game state:", err);

      return null;
    }
  }, [getProgram]);

  const initializeGame = useCallback(async () => {
    try {
      const program = getProgram();

      const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_state")],
        program.programId
      );

      await fetchGameState();
    } catch (err) {
      console.error("Error initializing game:", err);
    }
  }, [fetchGameState, getProgram]);

  return {
    fetchGameState,
    initializeGame,
  };
};
