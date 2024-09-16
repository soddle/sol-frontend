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
