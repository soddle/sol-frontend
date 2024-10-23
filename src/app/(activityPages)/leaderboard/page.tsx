import CyberPunkLeaderboard from "./_components/cyberPunkLeaderboard";
import LeaderBoardClient from "./leaderboardPageClient";
import { fetchLatestCompetition } from "@/actions/gameActions";

export default async function LeaderBoardPage() {
  const competition = await fetchLatestCompetition();
  // return <LeaderBoardClient competition={competition} />;
  const entries = [
    {
      rank: 1,
      name: "CyberRunner",
      topPercent: 0.1,
      points: 15000,
      bestTime: 145,
    },
    // ... more entries
  ];

  return (
    <CyberPunkLeaderboard
      entries={entries}
      competition={competition}
      type="today"
    />
  );
}
