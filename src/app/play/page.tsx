import { fetchKOLs } from "@/lib/api";
import GamePlayPageClient from "./playPageClient";
import Image from "next/image";

export default async function GamePlayPage() {
  return <GamePlayPageClient />;
}
