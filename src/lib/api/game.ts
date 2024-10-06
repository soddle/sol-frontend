import { UserResponse } from "@/app/api/user/route";
import {
  GameStartResponse,
  StartGameRequestBody,
  GameSessionFromApi,
  // GameSessionFromApiResponse,
} from "@/types";

export async function startGameApi(
  gameStartRequest: StartGameRequestBody
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
  guessRequest: any
): Promise<GameSessionFromApi> {
  console.log("submitted guess request: ", guessRequest);
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
