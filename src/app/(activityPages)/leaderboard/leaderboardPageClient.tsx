"use client";

import { Competition } from "@prisma/client";
import { Container } from "@/components/layout/mainLayoutClient";

import CyberPunkLeaderboard from "./_components/cyberPunkLeaderboard";
import { LeaderboardEntry } from "@/types";
import GameSelector from "./_components/cyberpunkGameSelector";
import { useState } from "react";
import { useGame } from "@/hooks/useGame";

export type LeaderboardType = "today" | "yesterday" | "alltime";

export default async function LeaderBoardClient({
  competition,
  entries,
}: {
  competition: Competition | null;
  entries: LeaderboardEntry[];
}) {
  const { fetchLeaderboard } = useGame();
  const [leaderboardEntries, setLeaderBoard] = useState(entries);
  const [leaderboardType, setLeaderboardType] =
    useState<LeaderboardType>("today");

  const games = [
    {
      id: 1,
      name: "Attributes Game",
      icon: "usersearch",
      description: "Attributes Game",
    },
    {
      id: 2,
      name: "Tweets Game",
      icon: "messagesquare",
      description: "Tweets Game",
    },
    {
      id: 3,
      name: "Emoji Game",
      icon: "emoji",
      description: "Emoji Game",
    },
  ];

  const [selectedGame, _] = useState(games[0].id);

  async function handleSelectLeaderboardType(gameId: number) {
    const entries = await fetchLeaderboard(
      gameId as 1 | 2 | 3,
      leaderboardType
    );
    setLeaderBoard(entries.entries);
  }

  return (
    <Container className="sm:max-w-[700px] h-full">
      {/* <Trapezoid> */}
      {/* <LeaderboardContainer competition={competition} /> */}
      {/* </Trapezoid> */}
      <>
        <GameSelector
          games={games}
          selectedGame={selectedGame}
          onSelectGame={handleSelectLeaderboardType}
        />{" "}
        <CyberPunkLeaderboard
          entries={leaderboardEntries}
          competition={competition}
          type={leaderboardType}
          onSelectType={(type) => setLeaderboardType(type)}
        />
      </>
    </Container>
  );
}
