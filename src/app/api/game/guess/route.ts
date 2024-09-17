import { appConfig } from "@/lib/config";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export interface GuessRequest {
  gameType: number;
  publicKey: PublicKey;
  guess: {
    id: string;
    name: string;
    age: number;
    country: string;
    pfp: string;
    accountCreation: number;
    followers: number;
    ecosystem: string;
  };
}

export interface GuessResponse {
  success: boolean;
  data: {
    _id: string;
    player: string;
    gameType: number;
    startTime: number;
    game1Completed: boolean;
    game2Completed: boolean;
    game1Score: number;
    game2Score: number;
    game1Guesses: Array<{
      guess: GuessRequest["guess"];
      result: {
        name: string;
        age: string;
        country: string;
        pfp: string;
        account_creation: string;
        followers: string;
        ecosystem: string;
      };
    }>;
    game2Guesses: Array<{
      guess: GuessRequest["guess"];
      result: {
        kol: GuessRequest["guess"];
        result: boolean;
      };
    }>;
    game1GuessesCount: number;
    game2GuessesCount: number;
    totalScore: number;
    completed: boolean;
    score: number;
    kol: GuessRequest["guess"];
    competitionId: string;
    __v: number;
  };
  message: string | null;
}

export async function POST(request: Request) {
  const API_BASE_URL = appConfig.apiBaseUrl;
  try {
    const body: GuessRequest = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/game/guess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to submit guess");
    }

    const data: GuessResponse = await response.json();

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error submitting guess:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit guess" },
      { status: 500 }
    );
  }
}
