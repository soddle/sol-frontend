import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TimeObject {
  hours: string;
  minutes: string;
  seconds: string;
}

export type TimeInput = Date | number | TimeObject;

export const formatTime = (input: TimeInput): TimeObject => {
  if (input instanceof Date) {
    return {
      hours: input.getHours().toString().padStart(2, "0"),
      minutes: input.getMinutes().toString().padStart(2, "0"),
      seconds: input.getSeconds().toString().padStart(2, "0"),
    };
  } else if (typeof input === "number") {
    return formatTime(new Date(input));
  } else {
    return {
      hours: input.hours.padStart(2, "0"),
      minutes: input.minutes.padStart(2, "0"),
      seconds: input.seconds.padStart(2, "0"),
    };
  }
};

export function formatCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  }

  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });

  return formatter.format(count);
}

/**
 * Shortens a string by keeping a certain number of characters at the start and end,
 * replacing the middle with an ellipsis.
 *
 * @param str The string to shorten
 * @param startChars The number of characters to keep at the start
 * @param endChars The number of characters to keep at the end
 * @returns The shortened string
 */
export function shortenAddress(
  str: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (str.length <= startChars + endChars) {
    return str;
  }

  const start = str.slice(0, startChars);
  const end = str.slice(-endChars);

  return `${start}...${end}`;
}
