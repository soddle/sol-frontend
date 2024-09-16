export interface GameStartResponse {
  success: boolean;
  data: {
    player: string;
    gameType: number;
    startTime: number;
    game1Completed: boolean;
    game2Completed: boolean;
    game1Score: number;
    game2Score: number;
    game1Guesses: any[];
    game2Guesses: any[];
    game1GuessesCount: number;
    game2GuessesCount: number;
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
    _id: string;
    __v: number;
  };
  message: string;
}
