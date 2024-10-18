"use server";

import { prisma } from "@/lib/prisma";
import { KOL } from "@prisma/client";
import crypto from "crypto";

export async function fetchRandomKOL(): Promise<KOL | null> {
  const kolCount = await prisma.kOL.count();

  if (kolCount === 0) {
    console.log("No KOLs found in the database");
    return null;
  }

  // Generate a cryptographically secure random index
  const randomIndex = crypto.randomInt(0, kolCount);

  // Fetch the KOL at the random index
  const randomKOL = await prisma.kOL.findMany({
    take: 1,
    skip: randomIndex,
  });

  if (randomKOL.length === 0) {
    console.log("No KOL found at the random index");
    return null;
  }

  return randomKOL[0];
}

export async function fetchAllKOLs(): Promise<KOL[]> {
  const kolList = await prisma.kOL.findMany();

  return kolList;
}
