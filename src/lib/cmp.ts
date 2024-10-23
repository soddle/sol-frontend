type AttributeResult =
  | "correct"
  | "incorrect"
  | "partially_correct"
  | "higher"
  | "lower";

interface KOL {
  id: string;
  name: string;
  age: number;
  followers: number;
  country: string;
  ageRange: string;
  twitterHandle: string;
  twitterAccountCreationYear: number;
  twitterFollowersRange: string;
  pfp: string;
  pfpType: string;
  ecosystem: string;
}

export function compareKOLs(
  guessedKOL: KOL,
  targetKOL: KOL
): Record<keyof KOL, AttributeResult> {
  const result: Partial<Record<keyof KOL, AttributeResult>> = {};

  for (const key in guessedKOL) {
    if (key === "id" || key === "pfp") continue;

    const guessedValue = guessedKOL[key as keyof KOL];
    const targetValue = targetKOL[key as keyof KOL];

    if (typeof guessedValue === "number" && typeof targetValue === "number") {
      result[key as keyof KOL] = compareNumeric(guessedValue, targetValue);
    } else if (
      typeof guessedValue === "string" &&
      typeof targetValue === "string"
    ) {
      result[key as keyof KOL] = compareString(
        guessedValue,
        targetValue,
        key as keyof KOL
      );
    }
  }

  return result as Record<keyof KOL, AttributeResult>;
}

function compareNumeric(guessed: number, target: number): AttributeResult {
  if (guessed === target) return "correct";
  return guessed > target ? "lower" : "higher";
}

function compareString(
  guessed: string,
  target: string,
  key: keyof KOL
): AttributeResult {
  if (guessed === target) return "correct";

  switch (key) {
    case "ageRange":
    case "twitterFollowersRange":
      return compareRange(guessed, target);
    case "ecosystem":
      return compareEcosystem(guessed, target);
    default:
      return "incorrect";
  }
}

function compareRange(guessed: string, target: string): AttributeResult {
  const [guessedMin, guessedMax] = guessed.split("-").map(Number);
  const [targetMin, targetMax] = target.split("-").map(Number);

  if (guessedMin === targetMin && guessedMax === targetMax) return "correct";
  if (guessedMax < targetMin) return "higher";
  if (guessedMin > targetMax) return "lower";
  return "partially_correct";
}

function compareEcosystem(guessed: string, target: string): AttributeResult {
  const guessedArray = guessed.split(",").map((s) => s.trim());
  const targetArray = target.split(",").map((s) => s.trim());

  if (
    guessedArray.length === targetArray.length &&
    guessedArray.every((value) => targetArray.includes(value))
  ) {
    return "correct";
  }

  const intersection = guessedArray.filter((x) => targetArray.includes(x));
  return intersection.length > 0 ? "partially_correct" : "incorrect";
}
