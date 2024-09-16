import { GuessRequest, GuessResponse } from "@/app/api/game/guess/route";
import { GameStartRequest } from "@/app/api/game/start/route";
import { UserResponse } from "@/app/api/user/route";

interface GameStartResponse {
  success: boolean;
  data: {
    player: string;
    gameType: number;
    startTime: number;
    game1Completed: boolean;
    game2Completed: boolean;
    game1Score: number;
    game2Score: number;
    game1Guesses: any[];
    game2Guesses: any[];
    game1GuessesCount: number;
    game2GuessesCount: number;
    totalScore: number;
    completed: boolean;
    score: number;
    kol: {
      id: string;
      name: string;
      age: number;
      country: string;
      pfp: string;
      accountCreation: number;
      followers: number;
      ecosystem: string;
    };
    competitionId: string;
    _id: string;
    __v: number;
  };
  message: string;
}

export async function startGame(
  gameStartRequest: GameStartRequest
): Promise<GameStartResponse> {
  const response = await fetch("/api/game/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameStartRequest),
  });

  if (!response.ok) {
    throw new Error("Failed to start game");
  }

  return response.json();
}

export async function submitGuess(
  guessRequest: GuessRequest
): Promise<GuessResponse> {
  const response = await fetch("/api/game/guess", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(guessRequest),
  });

  if (!response.ok) {
    throw new Error("Failed to submit guess");
  }

  return response.json();
}

export async function getUser(publicKey: string): Promise<UserResponse> {
  const response = await fetch("/api/game/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicKey }),
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve user");
  }

  return response.json();
}
