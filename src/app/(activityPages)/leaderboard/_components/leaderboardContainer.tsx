import React, { useState, useEffect } from "react";
import DateSelector from "./dateSelector";
import GameTypeSelector from "./gameTypeSelector";
import LeaderboardTable from "./leaderboardTable";
import PaginationIndicator from "./paginationIndicator";
import TimerDisplay from "@/components/ui/timeDisplay";
import { LeaderboardEntry } from "@/types";
import { fetchLeaderboard } from "@/lib/api";

const LeaderboardContainer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedGameType, setSelectedGameType] =
    useState<string>("Attributes");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalEntries, setTotalEntries] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const gameType = selectedGameType === "Attributes" ? 1 : 2; // Adjust this mapping as needed
        const leaderboardType = getLeaderboardType(selectedDate);
        const response = await fetchLeaderboard(gameType, leaderboardType);

        if (response.success) {
          const formattedData = response.data.map((entry, index) => ({
            rank: index + 1,
            reward: calculateReward(index + 1),
            name: entry.player,
            points: entry.totalScore,
          }));

          setLeaderboardData(formattedData);
          setTotalEntries(formattedData.length);
        } else {
          console.error("Failed to fetch leaderboard:", response.message);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboardData();
  }, [selectedDate, selectedGameType, currentPage]);

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 px-4 sm:px-6 py-4">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <TimerDisplay />
      </div>
      <GameTypeSelector
        selectedType={selectedGameType}
        onTypeChange={setSelectedGameType}
      />
      <LeaderboardTable data={leaderboardData} />
      <PaginationIndicator
        currentPage={currentPage}
        totalEntries={totalEntries}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LeaderboardContainer;

function getLeaderboardType(date: Date): string {
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  ) {
    return "monthly";
  } else {
    return "all-time"; // Or adjust this based on your API's available options
  }
}

function calculateReward(rank: number): string {
  const percentage = Math.min(5 + Math.floor(rank / 20), 20);
  const multiplier = Math.max(6 - Math.floor(rank / 20), 1);
  return `${percentage}% (${multiplier}x)`;
}
