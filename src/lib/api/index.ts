"use server";

const API_BASE_URL = appConfig.apiBaseUrl;
import { appConfig } from "../config";
import { KolWithTweets } from "../types/idlTypes";

interface ApiResponse<T> {
  status: string;
  data: T;
}

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${url}`);

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

export async function fetchRandomKOL(): Promise<KolWithTweets> {
  try {
    return await fetchData<KolWithTweets>(`api/v1/kols/random`);
  } catch (error) {
    console.error("Error fetching random KolWithTweets:", error);
    throw error;
  }
}

export async function fetchGameSession({
  sessionId,
}: {
  sessionId: string;
}): Promise<KolWithTweets> {
  try {
    return await fetchData<KolWithTweets>(
      `api/v1/game/66e7138f95c2213b2aff761b`
    );
  } catch (error) {
    console.error("Error fetching random KolWithTweets:", error);
    throw error;
  }
}
