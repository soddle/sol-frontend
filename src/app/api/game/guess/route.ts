import { appConfig } from "@/lib/config";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { GameSessionFromApiResponse, StartGameRequestBody } from "@/types";

export async function POST(request: Request) {
  const API_BASE_URL = appConfig.apiBaseUrl;
  try {
    const body: StartGameRequestBody = await request.json();

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

    const data: GameSessionFromApiResponse = await response.json();

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error submitting guess:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit guess" },
      { status: 500 }
    );
  }
}
