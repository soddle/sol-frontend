import React, { useState, useEffect } from "react";
import DateSelector from "./dateSelector";
import GameTypeSelector from "./gameTypeSelector";
import LeaderboardTable from "./leaderboardTable";
import PaginationIndicator from "./paginationIndicator";
import TimerDisplay from "@/components/ui/timeDisplay";
import { LeaderboardEntry } from "@/types";
import {
  fetchLeaderboard,
  getUserRankAndScore,
} from "@/actions/leaderboardActions";

const LeaderboardContainer: React.FC = () => {
  const [selectedLeaderboardType, setSelectedLeaderboardType] = useState<
    "today" | "yesterday" | "alltime"
  >("today");
  const [selectedGameType, setSelectedGameType] =
    useState<string>("Attributes");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [userRankAndScore, setUserRankAndScore] = useState<{
    rank: number | null;
    score: number;
    totalPlayers: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const entriesPerPage = 10;

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const gameType = selectedGameType === "Attributes" ? 2 : 1;
        const response = await fetchLeaderboard(
          gameType,
          selectedLeaderboardType,
          currentPage,
          entriesPerPage
        );
        setLeaderboardData(response.entries);
        setTotalEntries(response.totalEntries);
        console.log(response);

        // Fetch user rank and score
        const userWallet = "USER_WALLET_ADDRESS"; // Replace with actual user wallet address
        const userRankAndScore = await getUserRankAndScore(
          userWallet,
          gameType,
          selectedLeaderboardType
        );
        console.log(userRankAndScore);
        setUserRankAndScore(userRankAndScore);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboardData();
  }, [selectedLeaderboardType, selectedGameType, currentPage]);

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 px-4 sm:px-6 py-4">
        <DateSelector
          selectedDate={selectedLeaderboardType}
          onDateChange={setSelectedLeaderboardType}
        />
        <TimerDisplay />
      </div>
      <GameTypeSelector
        selectedType={selectedGameType}
        onTypeChange={setSelectedGameType}
      />
      <LeaderboardTable
        data={leaderboardData}
        userWallet="USER_WALLET_ADDRESS"
      />
      <PaginationIndicator
        currentPage={currentPage}
        totalEntries={totalEntries}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LeaderboardContainer;
