import { useCallback, useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { GameSession, KOL } from "@/lib/types/idlTypes";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useProgram } from "./useProgram";
import {
  createError,
  ErrorCode,
  GameError,
  WalletConnectionError,
  GameSessionNotFoundError,
  ApiRequestError,
  InternalServerError,
  InvalidGameTypeError,
  MaxGuessesReachedError,
  GameAlreadyCompletedError,
  InvalidGuessError,
} from "@/lib/errors";

export const useGameSession = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getProgram = useProgram();
  const { wallet } = useWallet();

  const fetchGameSession = useCallback(
    async (playerPublicKey: PublicKey) => {
      try {
        const program = getProgram();
        if (!program) {
          throw new WalletConnectionError();
        }
        const [gameSessionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("game_session"), playerPublicKey.toBuffer()],
          program.programId
        );

        //@ts-ignore
        const fetchedSession = await program.account.gameSession.fetch(
          gameSessionPDA
        );

        if (!fetchedSession) {
          throw new GameSessionNotFoundError();
        }

        setGameSession(fetchedSession as GameSession);
        return fetchedSession as GameSession;
      } catch (err) {
        console.error("Error fetching game session:", err);
        if (err instanceof GameError) {
          setError(err.message);
          throw err;
        } else {
          const apiError = new ApiRequestError("Failed to fetch game session");
          setError(apiError.message);
          throw apiError;
        }
      }
    },
    [getProgram]
  );

  const startGameSession = useCallback(
    async (gameType: number, kol: KOL) => {
      try {
        const program = getProgram();
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

        const [vaultPDA] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("vault")],
          program.programId
        );

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

        await fetchGameSession(wallet?.adapter.publicKey!);
        toast.success("Game session started successfully");
      } catch (err) {
        console.error("Error starting game session:", err);
        if (err instanceof GameError) {
          toast.error(err.message);
          setError(err.message);
        } else if (err instanceof Error) {
          const apiError = new ApiRequestError("Failed to start game session");
          toast.error(apiError.message);
          setError(apiError.message);
        } else {
          const internalError = new InternalServerError();
          toast.error(internalError.message);
          setError(internalError.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [getProgram, fetchGameSession, wallet]
  );

  const makeGuess = useCallback(
    async (gameType: number, guess: KOL) => {
      try {
        const program = getProgram();
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

        toast.success("Guess made successfully");
        await fetchGameSession(wallet?.adapter.publicKey!);
      } catch (err) {
        console.error("Error making guess:", err);
        if (err instanceof GameError) {
          toast.error(err.message);
          setError(err.message);
        } else if (err instanceof Error) {
          if (err.message.includes("Invalid game type")) {
            throw new InvalidGameTypeError();
          } else if (
            err.message.includes("Maximum number of guesses reached")
          ) {
            throw new MaxGuessesReachedError();
          } else if (
            err.message.includes("Game session is already completed")
          ) {
            throw new GameAlreadyCompletedError();
          } else if (err.message.includes("Invalid guess")) {
            throw new InvalidGuessError();
          } else {
            throw new ApiRequestError("Failed to make guess");
          }
        } else {
          throw new InternalServerError();
        }
      } finally {
        setLoading(false);
      }
    },
    [getProgram, fetchGameSession, wallet]
  );

  return {
    gameSession,
    error,
    loading,
    fetchGameSession,
    startGameSession,
    makeGuess,
  };
};
