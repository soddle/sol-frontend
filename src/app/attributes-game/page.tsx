import AttributesGamePageClient from "./attributesGameClient";
import { prisma } from "@/lib/prisma";

async function AttributesGamePage() {
  const kols = await prisma.kOL.findMany(); // Fetch all KOLs from the database
  return <AttributesGamePageClient kols={kols} />;
}

export default AttributesGamePage;
