"use client";

import React, { useState, useEffect } from "react";
import DateSelector from "./dateSelector";
import GameTypeSelector from "./gameTypeSelector";
import LeaderboardTable from "./leaderboardTable";
import PaginationIndicator from "./paginationIndicator";

import { LeaderboardEntry } from "@/types";
import {
  fetchLeaderboard,
  getUserRankAndScore,
} from "@/actions/leaderboardActions";
import Trapezoid from "@/components/ui/trapezoid";
import { Container } from "@/components/layout/mainLayoutClient";
import { useWallet } from "@solana/wallet-adapter-react";
import { Competition } from "@prisma/client";
import CompetitionCountdown from "@/components/competitionCountdown";
import CompetitionTimer from "@/components/competitionTimer";

const LeaderboardContainer: React.FC<{ competition: Competition | null }> = ({
  competition,
}) => {
  const wallet = useWallet();
  const [selectedLeaderboardType, setSelectedLeaderboardType] = useState<
    "today" | "yesterday" | "alltime"
  >("today");
  const [selectedGameType, setSelectedGameType] = useState<number>(1);
  const [leaderboardEntries, setLeaderboardEntries] = useState<
    LeaderboardEntry[]
  >([]);
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
        const response = await fetchLeaderboard(
          selectedGameType,
          selectedLeaderboardType,
          currentPage,
          entriesPerPage
        );
        setLeaderboardEntries(response.entries);
        setTotalEntries(response.totalEntries);
        console.log("fetched leaderboard in container", response);

        // Fetch user rank and score
        const userWallet =
          wallet.publicKey?.toBase58() ||
          "D9iqMouX8SxW8LaxA9PPoKHn87R33b6yvSnRtBAVJeys";
        const userRankAndScore = await getUserRankAndScore(
          userWallet,
          selectedGameType,
          selectedLeaderboardType
        );
        console.log("user rank and score in container", userRankAndScore);
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
        <CompetitionTimer competition={competition} />
      </div>
      <GameTypeSelector
        selectedType={selectedGameType}
        onTypeChange={setSelectedGameType}
      />
      <LeaderboardTable
        entries={leaderboardEntries}
        userWallet={wallet.publicKey?.toString()}
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
