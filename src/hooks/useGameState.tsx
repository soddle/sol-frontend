"use client";
import * as anchor from "@coral-xyz/anchor";
import { useCallback, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import { useRootStore } from "@/stores/storeProvider";
import idl from "@/lib/constants/idl.json";
import { GameState } from "@/lib/types/idl-types";

export const useSoddleProgram = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return useCallback(() => {
    if (wallet && connection) {
      try {
        const provider = new anchor.AnchorProvider(connection, wallet, {
          maxRetries: 10,
          commitment: "confirmed",
        });
        anchor.setProvider(provider);

        const program = new anchor.Program(
          idl as anchor.Idl,
          provider
        ) as anchor.Program<anchor.Idl>;

        if (program) {
          return program;
        } else {
          throw new Error("Program not found");
        }
      } catch (error) {
        console.error("Error setting up Soddle program", error);
        return null;
      }
    }
  }, [connection, wallet]);
};

export const useGameState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getProgram = useSoddleProgram();

  const fetchGameState = async () => {
    try {
      setLoading(true);
      const program = getProgram();

      if (program) {
        const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("game_state")],
          program.programId
        );

        // @ts-expect-error gameState type is not inferred
        const gameStateAccount = await program.account.gameState.fetch(
          gameStatePDA
        );

        if (gameStateAccount) {
          return gameStateAccount as GameState;
        } else {
          throw new Error("Game state account not found");
        }
      }
    } catch (err) {
      console.error("Error fetching game state:", err);
      setError("Failed to fetch game state");
    } finally {
      setLoading(false);
    }
  };

  const initializeGame = useCallback(async () => {
    const program = getProgram();

    if (!program) {
      setError("Program not initialized");
      return;
    }

    try {
      setLoading(true);
      const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_state")],
        program.programId
      );

      await fetchGameState();
    } catch (err) {
      console.error("Error initializing game:", err);
      setError("Failed to initialize game");
    } finally {
      setLoading(false);
    }
  }, [fetchGameState]);

  const endCompetition = useCallback(async () => {
    const program = getProgram();

    if (!program) {
      setError("Program not initialized");
      return;
    }

    try {
      setLoading(true);
      const [gameStatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game_state")],
        program.programId
      );

      await fetchGameState();
    } catch (err) {
      console.error("Error ending competition:", err);
      setError("Failed to end competition");
    } finally {
      setLoading(false);
    }
  }, [fetchGameState]);

  return {
    loading,
    error,
    fetchGameState,
    initializeGame,
    endCompetition,
  };
};

// {
//   "player": "DWcQ72YcxVN783QVeLHeLoegELtjEdudEvdiTuBuM1Tm",
//   "gameType": 1,
//   "startTime": "66cda7ae",
//   "game1Completed": false,
//   "game2Completed": false,
//   "game3Completed": false,
//   "game1Score": 0,
//   "game2Score": 0,
//   "game3Score": 0,
//   "game1GuessesCount": 1,
//   "game2GuessesCount": 0,
//   "game3GuessesCount": 0,
//   "totalScore": 0,
//   "targetIndex": 8,
//   "game1Guesses": [
//       {
//           "kol": {
//               "id": "66c7dbc1d484e54c72d24072",
//               "name": "Jim Cramer",
//               "age": 65,
//               "country": "USA",
//               "accountCreation": 2008,
//               "pfp": "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/dvdlkrxcwav3xmvmkmdu",
//               "followers": 2000000,
//               "ecosystem": "Reporter"
//           },
//           "result": [
//               {
//                   "incorrect": {}
//               },
//               {
//                   "lower": {}
//               },
//               {
//                   "incorrect": {}
//               },
//               {
//                   "incorrect": {}
//               },
//               {
//                   "higher": {}
//               },
//               {
//                   "higher": {}
//               },
//               {
//                   "incorrect": {}
//               }
//           ]
//       }
//   ],
//   "game2Guesses": [],
//   "game3Guesses": [],
//   "completed": false,,
//   "score": 0,
//   "deposit": "0f4240",
//   "kol": {
//       "id": "vitalikbuterin",
//       "name": "Vitalik Buterin",
//       "age": 25,
//       "country": "Russia",
//       "accountCreation": 2011,
//       "pfp": "/images/vitalik.png",
//       "followers": 5000000,
//       "ecosystem": "Chain Founder"
//   },
//   "competitionId": "COMP51893"
// }
