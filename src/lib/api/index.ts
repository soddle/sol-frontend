"use server";

const API_BASE_URL = appConfig.apiBaseUrl;
import {
  APIKOL,
  GameSessionFromApi,
  GameSessionFromApiResponse,
  KolWithTweets,
} from "@/types";
import { appConfig } from "../config";

interface ApiResponse<T> {
  status: string;
  data: T;
}

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${url}`, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse<T> = await response.json();

  return data as any;
}

export async function fetchKOLs(): Promise<KolWithTweets[]> {
  try {
    const data = await fetchData<KolWithTweets[]>("api/v1/kols");
    return data;
  } catch (error) {
    console.error("Error fetching KOLs:", error);
    throw error;
  }
}

export async function fetchRandomKOL(): Promise<APIKOL> {
  try {
    const randKol = await fetchData<APIKOL>(`api/v1/kols/random`);
    return randKol;
  } catch (error) {
    console.error("Error fetching random APIKOL:", error);
    throw error;
  }
}

export async function fetchGameSessionFromApi({
  publicKey,
}: {
  publicKey: string;
}): Promise<GameSessionFromApi> {
  try {
    const data = await fetchData<GameSessionFromApiResponse>(
      `api/v1/game/${publicKey}`
    );

    return data.data;
  } catch (error) {
    console.error("Error fetching random GameSessionFromApi:", error);
    throw error;
  }
}

export interface LeaderboardEntry {
  totalScore: number;
  gamesPlayed: number;
  player: string;
}
export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
  message: string;
}

export async function fetchLeaderboard(
  gameType: number,
  leaderboardType: string
): Promise<LeaderboardResponse> {
  try {
    const data = await fetchData<LeaderboardResponse>(
      `api/v1/game/leaderboard?gameType=${gameType}&leaderboardType=${leaderboardType}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}
