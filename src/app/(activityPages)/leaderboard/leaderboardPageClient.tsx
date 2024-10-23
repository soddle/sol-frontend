"use client";

import { Competition } from "@prisma/client";
import { Container } from "@/components/layout/mainLayoutClient";

import CyberPunkLeaderboard from "./_components/cyberPunkLeaderboard";
import { LeaderboardEntry } from "@/types";
import GameSelector from "./_components/cyberpunkGameSelector";
import { useState } from "react";

export default async function LeaderBoardClient({
  competition,
  entries,
}: {
  competition: Competition | null;
  entries: LeaderboardEntry[];
}) {
  const games = [
    {
      id: "game1",
      name: "Attributes Game",
      icon: "usersearch",
      description: "Attributes Game",
    },
    {
      id: "game2",
      name: "Tweets Game",
      icon: "messagesquare",
      description: "Tweets Game",
    },
    {
      id: "game3",
      name: "Emoji Game",
      icon: "emoji",
      description: "Emoji Game",
    },
  ];

  const [selectedGame, setSelectedGame] = useState(games[0].id);

  return (
    <Container className="sm:max-w-[700px] h-full">
      {/* <Trapezoid> */}
      {/* <LeaderboardContainer competition={competition} /> */}
      {/* </Trapezoid> */}
      <>
        <GameSelector
          games={games}
          selectedGame={selectedGame}
          onSelectGame={setSelectedGame}
        />{" "}
        <CyberPunkLeaderboard
          entries={entries}
          competition={competition}
          type="today"
        />
      </>
    </Container>
  );
}
