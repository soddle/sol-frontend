import CyberpunkProfile from "./cyberpunkProfile";

export default function ProfileClient() {
  const userProfile = {
    username: "CryptoMaster",
    level: 42,
    xp: 8750,
    xpToNext: 10000,
    totalPoints: 156750,
    rank: 13,
    totalPlayers: 10000,
    gameStats: {
      personalityGame: {
        played: 145,
        bestTime: 12.5,
        avgGuesses: 2.3,
        winRate: 92,
      },
      tweetGame: {
        played: 130,
        bestTime: 15.2,
        avgGuesses: 2.1,
        winRate: 88,
      },
      emojiGame: {
        played: 125,
        bestTime: 18.7,
        avgGuesses: 2.8,
        winRate: 85,
      },
      // ... other game stats
    },
    achievements: {
      dayStreak: 15,
      topRanks: 12,
      perfectGames: 25,
      fastestSolve: 8.2,
    },
  };

  return <CyberpunkProfile {...userProfile} />;
}
