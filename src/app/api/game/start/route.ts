import { appConfig } from "@/lib/config";
import { ApiPostBody } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiBaseUrl = appConfig.apiBaseUrl;
  try {
    const body: ApiPostBody = await request.json();

    const response = await fetch(`${apiBaseUrl}/api/v1/game/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("response insde startgame route.ts", response);

    if (!response.ok) {
      throw new Error("Failed to starting game in api");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to start game" },
      { status: 500 }
    );
  }
}
