"use client";

import Container from "@/components/layout/container";
import TimerDisplay from "@/components/ui/timeDisplay";
import Trapezoid from "@/components/ui/trapezoid";
import LeaderboardContainer from "./_components/leaderboardContainer";

export default function LeaderBoardClient({}) {
  return (
    <Container className="sm:max-w-[700px] h-full">
      <Trapezoid>
        <LeaderboardContainer />
      </Trapezoid>
    </Container>
  );
}
