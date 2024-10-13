export * from "./game";

export enum GameType {
  Attributes = 1,
  Tweets = 2,
  Emojis = 3,
}

export interface KOL {
  id: string;
  name: string;
  age: number;
  country: string;
  accountCreation: number;
  pfp: string;
  pfpType: "artificial" | "human" | string;
  followers: number;
  ecosystem: string;
}
export interface KolWithTweets {
  _id: string;
  id: string;
  name: string;
  age: number;
  ageDisplay: string;
  twitterHandle: string;
  pfpType: "artificial" | "real" | string;
  country: string;
  pfp: string;
  accountCreation: number;
  followers: number;
  followersDisplay: string;
  ecosystem: string;
  tweets: string[];
  __v: number;
}

export interface Competition {
  id: string;
  startTime: number;
  endTime: number;
}

export interface Player {
  game1Completed: boolean;
  game2Completed: boolean;
  game3Completed: boolean;
  game1Score: number;
  game2Score: number;
  game3Score: number;
}

export interface TweetGuessEvent {
  kolId: number;
  tweet: string;
}

export interface GameState {
  currentCompetition: Competition;
  lastUpdateTime: number;
}

export interface LeaderboardEntry {
  rank: number;
  reward: string;
  name: string;
  points: number;
}

// export interface LeaderboardEntry {
//   totalScore: number;
//   gamesPlayed: number;
//   player: string;
// }
