"use client";

import TimerDisplay from "@/components/ui/timeDisplay";
import Trapezoid from "@/components/ui/trapezoid";
import LeaderboardContainer from "./_components/leaderboardContainer";
import { Container } from "@/components/layout/mainLayoutClient";

export default function LeaderBoardClient() {
  return (
    <Container className="sm:max-w-[700px] h-full">
      <Trapezoid>
        <LeaderboardContainer />
      </Trapezoid>
    </Container>
  );
}
