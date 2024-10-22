import AttributesGamePageClient from "./attributesGameClient";
import { prisma } from "@/lib/prisma";
import {
  fetchTodaySession,
  fetchUserGuessesByAddress,
  fetchLatestCompetition,
} from "@/actions/gameActions";

async function AttributesGamePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { address } = await searchParams;

  const [todaySession, userGuesses, currentCompetition, kols] =
    await Promise.all([
      fetchTodaySession(address as string),
      fetchUserGuessesByAddress(address as string),
      fetchLatestCompetition(),
      prisma.kOL.findMany(),
    ]);
  return (
    <AttributesGamePageClient
      kols={kols}
      todaySession={todaySession}
      currentCompetition={currentCompetition}
      userGuesses={userGuesses}
    />
  );
}

export default AttributesGamePage;
