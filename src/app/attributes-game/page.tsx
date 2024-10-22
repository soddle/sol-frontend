import AttributesGamePageClient from "./attributesGameClient";
import { prisma } from "@/lib/prisma";
import {
  fetchTodaySession,
  fetchLatestCompetition,
} from "@/actions/gameActions";
import { GuessWithGuessedKol } from "@/lib/chains/types";

export const revalidate = 0; // Disable caching

async function AttributesGamePage({
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { adr } = await searchParams;

  const [todaySession, currentCompetition, kols] = await Promise.all([
    fetchTodaySession(adr as string),
    fetchLatestCompetition(),
    prisma.kOL.findMany(),
  ]);

  const userGuesses = todaySession?.guesses || [];

  return (
    <AttributesGamePageClient
      kols={kols}
      todaySession={todaySession}
      currentCompetition={currentCompetition}
      userGuesses={userGuesses as GuessWithGuessedKol[]}
    />
  );
}

export default AttributesGamePage;
