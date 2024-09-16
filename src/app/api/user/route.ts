import { appConfig } from "@/lib/config";
import { NextResponse } from "next/server";

export interface UserRequest {
  publicKey: string;
}

export interface UserResponse {
  success: boolean;
  data: {
    _id: string;
    publicKey: string;
    currentGameSession: string;
    __v: number;
  };
  message: string;
}

export async function POST(request: Request) {
  const API_BASE_URL = appConfig.apiBaseUrl;
  try {
    const body: UserRequest = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/game/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to retrieve user");
    }

    const data: UserResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve user" },
      { status: 500 }
    );
  }
}
