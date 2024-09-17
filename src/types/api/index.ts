export * from "./requests";
export * from "./responses";

export interface GameSessionFromApiResponse {
  success: boolean;
  data: GameSessionFromApi;
  message: string | null;
}

export interface GameSessionFromApi {
  _id: string;
  player: string;
  gameType: number;
  startTime: number;
  game1Completed: boolean;
  game2Completed: boolean;
  game1Score: number;
  game2Score: number;
  game1Guesses: any[]; // You might want to define a more specific type for game1Guesses
  game2Guesses: Game2Guess[];
  game1GuessesCount: number;
  game2GuessesCount: number;
  totalScore: number;
  completed: boolean;
  score: number;
  kol: KOL;
  competitionId: string;
  __v: number;
}

export interface Game2Guess {
  guess: KOL;
  result: {
    kol: KOL;
    result: boolean;
  };
}

export interface KOL {
  id: string;
  name: string;
  age: number;
  country: string;
  pfp: string;
  accountCreation: number;
  followers: number;
  ecosystem: string;
}
