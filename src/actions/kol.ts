"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { KOL } from "@/types";

export async function fetchRandomKOL(): Promise<KOL> {
  // Get the total count of KOLs
  const kolCount = await prisma.kOL.count();

  // Generate a cryptographically secure random index
  const randomIndex = crypto.randomInt(0, kolCount);

  // Fetch the KOL at the random index
  const randomKOL = await prisma.kOL.findMany({
    take: 1,
    skip: randomIndex,
  });

  if (randomKOL.length === 0) {
    throw new Error("No KOL found");
  }

  // Convert Prisma KOL to our KOL type
  return {
    name: randomKOL[0].name,
    handle: randomKOL[0].handle,
    link: randomKOL[0].link,
    country: randomKOL[0].country,
    ageRange: randomKOL[0].ageRange,
    twitterAccountCreation: randomKOL[0].twitterAccountCreation,
    twitterFollowersRange: randomKOL[0].twitterFollowersRange as any,
    pfpType: randomKOL[0].pfpType as "Artificial" | "Human",
    ecosystem: randomKOL[0].ecosystem as any[],
    descriptions: randomKOL[0].descriptions,
    supportedChains: randomKOL[0].supportedChains as any[],
  };
}

export async function fetchAllKOLs(): Promise<KOL[]> {
  const kolList = await prisma.kOL.findMany();

  return kolList.map((kol) => ({
    id: kol.id,
    name: kol.name,
    handle: kol.handle,
    link: kol.link,
    country: kol.country,
    ageRange: kol.ageRange,
    twitterAccountCreation: kol.twitterAccountCreation,
    twitterFollowersRange: kol.twitterFollowersRange,
    pfpType: kol.pfpType,
    ecosystem: kol.ecosystem,
    descriptions: kol.descriptions,
    supportedChains: kol.supportedChains,
  }));
}
