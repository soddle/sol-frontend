import { NextResponse } from "next/server";

export interface GameStartRequest {
  publicKey: string;
  gameType: number;
  game: {
    gameType: number;
    startTime: number;
    game1Completed: boolean;
    game2Completed: boolean;
    game1Score: number;
    game2Score: number;
    game1Guesses: any[];
    game2Guesses: any[];
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
    guesses: any[];
  };
}

export async function POST(request: Request) {
  try {
    const body: GameStartRequest = await request.json();

    const response = await fetch(
      "https://soddle-backend.adaptable.app/api/v1/game/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to start game");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { success: false, message: "Failed to start game" },
      { status: 500 }
    );
  }
}
