import GameHomePageClient from "./homePageClient";
import { fetchLatestCompetition } from "@/actions/gameActions";

export default async function GameHomePage() {
  const latestCompetition = await fetchLatestCompetition();
  console.log("lastest competition", latestCompetition);

  return <GameHomePageClient latestCompetition={latestCompetition} />;
}
