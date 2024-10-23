"use client";

import Trapezoid from "@/components/ui/trapezoid";
import LeaderboardContainer from "./_components/leaderboardContainer";
import { Competition } from "@prisma/client";
import { Container } from "@/components/layout/mainLayoutClient";
export default async function LeaderBoardClient({
  competition,
}: {
  competition: Competition | null;
}) {
  return (
    <Container className="sm:max-w-[700px] h-full">
      <Trapezoid>
        <LeaderboardContainer competition={competition} />
      </Trapezoid>
    </Container>
  );
}
