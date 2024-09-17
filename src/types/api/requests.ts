export interface ApiPostBody {
  publicKey: string;
  gameType: number;
  game: {
    gameType: number;
    startTime: number;
    game1Completed: boolean;
    game2Completed: boolean;
    game1Score: number;
    game2Score: number;
    game1Guesses: any[]; // You might want to define a more specific type for guesses
    game2Guesses: any[]; // You might want to define a more specific type for guesses
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
    guesses: any[]; // You might want to define a more specific type for guesses
  };
}

// export interface GameSession {
//   player: PublicKey;
//   gameType: GameType;
//   startTime: number;
//   game1Completed: boolean;
//   game2Completed: boolean;
//   game1Score: number;
//   game2Score: number;
//   game1GuessesCount: number;
//   game2GuessesCount: number;
//   totalScore: number;
//   targetIndex: number;
//   completed: boolean;
//   score: number;
//   deposit: number;
//   kol: KOL;
//   competitionId: string;
// }
