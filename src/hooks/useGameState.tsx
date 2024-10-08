"use client";
import * as anchor from "@coral-xyz/anchor";
import { useCallback } from "react";
import { GameState } from "@/types/";
import { useProgram } from "./useProgram";

export const useGameState = () => {
  const getProgram = useProgram();

  const fetchGameState = useCallback(async (): Promise<GameState | null> => {
    const program = getProgram();
    console.log(program.programId.toString());

    const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      program.programId
    );
    //@ts-expect-error
    const gameStateAccount = await program.account.gameState.fetch(
      gameStatePDA
    );

    return gameStateAccount as GameState;
  }, [getProgram]);

  return {
    fetchGameState,
  };
};
