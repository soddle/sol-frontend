import { fetchLatestCompetition } from "@/actions/gameActions";
import CyberPunkLeaderboard from "./_components/cyberPunkLeaderboard";
import { fetchLeaderboard } from "@/actions/leaderboardActions";
import GameTypeSelector from "./_components/gameTypeSelector";
import LeaderBoardClient from "./leaderboardPageClient";

export default async function LeaderBoardPage() {
  const competition = await fetchLatestCompetition();
  const entries = await fetchLeaderboard(1, "today");
  return (
    <LeaderBoardClient competition={competition} entries={entries.entries} />
  );
  // const entries = [
  //   {
  //     rank: 1,
  //     name: "CyberRunner",
  //     topPercent: 0.1,
  //     points: 15000,
  //     bestTime: 145,
  //   },
  // ];
}
