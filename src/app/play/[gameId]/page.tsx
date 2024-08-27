import { fetchKOLs } from "@/lib/fns/fetchers";
import GamePageClient from "./client";

export default async function GamePage({
  params,
}: {
  params: { gameId: string };
}) {
  const gameId = parseInt(params.gameId);
  const kols = await fetchKOLs();
  return <GamePageClient gameId={gameId} kols={kols} />;
}
