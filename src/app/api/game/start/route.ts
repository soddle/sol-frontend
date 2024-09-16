import { GameStartRequest } from "@/types";
import { NextResponse } from "next/server";

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
