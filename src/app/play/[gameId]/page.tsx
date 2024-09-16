import { fetchKOLs } from "@/lib/api";
import GamePageClient from "./gameIdClient";

export default async function GamePage({
  params,
}: {
  params: { gameId: string };
}) {
  const gameId = parseInt(params.gameId);
  const kols = await fetchKOLs();
  return <GamePageClient gameId={gameId} kols={kols} />;
}
