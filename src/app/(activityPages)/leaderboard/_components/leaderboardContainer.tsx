import React, { useState, useEffect } from "react";
import DateSelector from "./dateSelector";
import GameTypeSelector from "./gameTypeSelector";
import LeaderboardTable from "./leaderboardTable";
import PaginationIndicator from "./paginationIndicator";
import TimerDisplay from "@/components/ui/timeDisplay";
import { LeaderboardEntry } from "@/types";

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
      /* TODO:
       API call to fetch leaderboard data based on selectedDate, selectedGameType, and currentPage
       Update setLeaderboardData and setTotalEntries with the fetched data
    */

      // Simulating API call with mock data
      const mockData = generateMockLeaderboardData(100);
      const pageSize = 10;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      setLeaderboardData(mockData.slice(startIndex, endIndex));
      setTotalEntries(mockData.length);
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

export function generateMockLeaderboardData(count: number): LeaderboardEntry[] {
  const mockData: LeaderboardEntry[] = [];

  for (let i = 1; i <= count; i++) {
    mockData.push({
      rank: i,
      reward: `${Math.min(5 + Math.floor(i / 20), 20)}% (${Math.max(
        6 - Math.floor(i / 20),
        1
      )}x)`,
      name: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random()
        .toString(16)
        .substr(2, 4)}`,
      points: Math.floor(1000 - i * 10 + Math.random() * 20),
    });
  }

  return mockData;
}

// Example usage:
export const mockLeaderboardData = generateMockLeaderboardData(100);
