import { SupportedChain } from "@/lib/chains/types";

export type XFollowersRange =
  | "0-50k"
  | "50-100k"
  | "100-200k"
  | "200-300k"
  | "300-500k"
  | "over 500k";

export type AgeRange = "20-30" | "21-30" | "30-40" | "31-40" | "41-50";

export type Ecosystem = "NFTs" | "SOLANA" | "Founder" | "Influencer";

export interface KOL {
  name: string;
  xHandle: string;
  link: string;
  country: string;
  ageRange: string;
  xAccountCreation: number;
  xFollowersRange: XFollowersRange;
  pfpType: "Artificial" | "Human";
  ecosystem: Ecosystem[];
  descriptions: [string, string, string];
  supportedChains: SupportedChain[]; // New field for multichain support
  tweets: string[];
}

export const kols: KOL[] = [
  {
    name: "Frank",
    xHandle: "frankdegods",
    link: "https://x.com/frankdegods",
    country: "USA",
    ageRange: "20-30",
    xAccountCreation: 2021,
    xFollowersRange: "200-300k",
    pfpType: "Artificial",
    ecosystem: ["NFTs"],
    descriptions: [
      "Inventor of the paper hand bitch tax.",
      "Paved the way for NFTs on SOLANA. Got lost on his own way and moved to ETHEREUM, now back though.",
      "A brave man, was wearing sweatpants at the Iggy party.",
    ],
    supportedChains: ["SOLANA", "ECLIPSE"],
    tweets: [
      "Just dropped a new NFT collection! Check it out! #NFTs",
      "Excited for the future of SOLANA! 🚀",
      "Remember, always do your own research! #DYOR",
    ],
  },
  {
    name: "Lily Liu",
    xHandle: "calilyliu",
    link: "https://x.com/calilyliu",
    country: "Switzerland",
    ageRange: "31-40",
    xAccountCreation: 2009,
    xFollowersRange: "0-50k",
    pfpType: "Human",
    ecosystem: ["SOLANA"],
    descriptions: [
      "Will go down in the history books as first president of SOLANA.",
      "Working three jobs at the same time, role model for all Asians.",
      "Probably an unsung hero, pulling all the SOLANA strings.",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Proud to be part of the SOLANA community! 🌟",
      "Hard work pays off! Let's keep pushing boundaries!",
      "Grateful for all the support! #SOLANA",
    ],
  },
  {
    name: "Austin Federa",
    xHandle: "austin_federa",
    link: "https://x.com/austin_federa",
    country: "USA",
    ageRange: "31-40",
    xAccountCreation: 2009,
    xFollowersRange: "100-200k",
    pfpType: "Artificial",
    ecosystem: ["SOLANA"],
    descriptions: [
      "Spends more than three hours a day to make his hair- it does look good though.",
      "Giving American Psycho vibes, let's hope he's a good guy.",
      "Big brain, big smile.",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Just finished a great meeting about the future of SOLANA!",
      "Hair game strong today! 💇‍♂️",
      "Always learning, always growing! #Crypto",
    ],
  },
  {
    name: "Kash Danda",
    xHandle: "kashdhanda",
    link: "https://x.com/kashdhanda",
    country: "England",
    ageRange: "31-40",
    xAccountCreation: 2013,
    xFollowersRange: "0-50k",
    pfpType: "Artificial",
    ecosystem: ["SOLANA"],
    descriptions: [
      "Built an army of SOLANA maxis all around the world.",
      "Hands down the best SOLANA updates, go watch the SOLANA Ecosystem Call on YouTube.",
      "Has friends in every country (as long as there's a Superteam).",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "SOLANA is the future! Join the revolution! 🔥",
      "Check out my latest video on SOLANA updates!",
      "Community is everything! Let's grow together!",
    ],
  },
  {
    name: "Nom",
    xHandle: "theonlynom",
    link: "https://x.com/theonlynom",
    country: "USA",
    ageRange: "41-50",
    xAccountCreation: 2011,
    xFollowersRange: "50-100k",
    pfpType: "Artificial",
    ecosystem: ["NFTs"],
    descriptions: [
      "Likes monkes and dogs.",
      "Responsible for arguably the best airdrop in crypto history.",
      "BONK BONK BONK BONK BONK",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Just got my hands on some new NFTs! 🐵",
      "Airdrop season is the best season! #Crypto",
      "Who else loves dogs? 🐶",
    ],
  },
  {
    name: "meow",
    xHandle: "weremeow",
    link: "https://x.com/weremeow",
    country: "Singapore",
    ageRange: "41-50",
    xAccountCreation: 2008,
    xFollowersRange: "over 500k",
    pfpType: "Artificial",
    ecosystem: ["Founder"],
    descriptions: [
      "Named himself after a cat, his company after a planet.",
      "Watch his interview with Luke Belmar if you're trying to lose brain cells.",
      "Built arguably the best DEX in the world.",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Excited to announce our new DEX features! 🚀",
      "Cats and crypto, what more do you need?",
      "Check out my latest interview for some insights!",
    ],
  },
  {
    name: "mert",
    xHandle: "0xMert_",
    link: "https://x.com/0xMert_",
    country: "Canada",
    ageRange: "31-40",
    xAccountCreation: 2020,
    xFollowersRange: "100-200k",
    pfpType: "Artificial",
    ecosystem: ["Founder"],
    descriptions: [
      "Egghead. (all jokes aside: jacked, smart and rich. We're all jealous)",
      "*insert a bald joke*",
      "Big head for a lot of brains, bebe.",
    ],
    supportedChains: ["SOLANA", "ETHEREUM"],
    tweets: [
      "Building the future of finance! 💪",
      "Who says you can't be smart and jacked?",
      "Always learning, always evolving!",
    ],
  },
  {
    name: "Armani Ferrante",
    xHandle: "armaniferrante",
    link: "https://x.com/armaniferrante",
    country: "USA",
    ageRange: "31-40",
    xAccountCreation: 2011,
    xFollowersRange: "50-100k",
    pfpType: "Human",
    ecosystem: ["NFTs", "Founder"],
    descriptions: [
      "Favourite accessoire is a backpack.",
      "Lost 90% in the FTX crash, came back stronger than ever before.",
      "Had five different haircuts in the last two years, looks good in all of them.",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Resilience is key in this game! 💪",
      "Back with a vengeance! #Crypto",
      "Haircuts are just a part of the journey!",
    ],
  },
  {
    name: "raj",
    xHandle: "rajgokal",
    link: "https://x.com/rajgokal",
    country: "USA",
    ageRange: "41-50",
    xAccountCreation: 2010,
    xFollowersRange: "200-300k",
    pfpType: "Artificial",
    ecosystem: ["SOLANA", "Founder"],
    descriptions: [
      "Has the best PFP on Crypto Twitter.",
      "Founder with the best humour, man of the people!",
      "raj&toly = yin&yang",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Humor is the best medicine! 😂",
      "PFP game strong! #CryptoTwitter",
      "Let's keep building together!",
    ],
  },
  {
    name: "toly",
    xHandle: "aeyakovenko",
    link: "https://x.com/aeyakovenko",
    country: "USA",
    ageRange: "41-50",
    xAccountCreation: 2014,
    xFollowersRange: "300-500k",
    pfpType: "Artificial",
    ecosystem: ["SOLANA", "Founder"],
    descriptions: [
      "Cosplayer turned Crypto Founder.",
      "The best things happen after two coffee and a beer.",
      "The hat stays on.",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Cosplay and crypto, a perfect blend! 🎭",
      "Coffee fuels my creativity! ☕️",
      "Always keep the hat on! #Crypto",
    ],
  },
  {
    name: "Ansem",
    xHandle: "blknoiz06",
    link: "https://x.com/blknoiz06",
    country: "USA",
    ageRange: "21-30",
    xAccountCreation: 2012,
    xFollowersRange: "over 500k",
    pfpType: "Artificial",
    ecosystem: ["Influencer"],
    descriptions: [
      "Can't decide if he's a founder, influencer, boxer or trader.",
      "Very tall guy.",
      "A little weird at times, but who are we to judge.",
    ],
    supportedChains: ["SOLANA", "ETHEREUM"],
    tweets: [
      "Life is all about balance! ⚖️",
      "Height is just a number! #TallGuy",
      "Embrace the weirdness! 🌈",
    ],
  },
  {
    name: "Jakey",
    xHandle: "soljakey",
    link: "https://x.com/soljakey",
    country: "Canada",
    ageRange: "21-30",
    xAccountCreation: 2022,
    xFollowersRange: "100-200k",
    pfpType: "Artificial",
    ecosystem: ["Influencer", "NFTs"],
    descriptions: [
      "A little weird but we like him.",
      "Could be Steve-O's son.",
      "Has the highest output in whole Crypto Twitter.",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Weird is the new cool! 😎",
      "Output is everything! #Crypto",
      "Always pushing the limits!",
    ],
  },
  {
    name: "KSI",
    xHandle: "ksicrypto",
    link: "https://x.com/ksicrypto",
    country: "UK",
    ageRange: "30-40",
    xAccountCreation: 2021,
    xFollowersRange: "300-500k",
    pfpType: "Artificial",
    ecosystem: ["Influencer"],
    descriptions: [
      "Has no idea what he's doing.",
      "Not the same since he doesn't have the SMB PFP anymore.",
      "Can't decide whether he's bullish or bearish.",
    ],
    supportedChains: ["SOLANA", "ETHEREUM"],
    tweets: [
      "Just trying to figure it all out! 🤔",
      "Bullish on the future! #Crypto",
      "Change is the only constant!",
    ],
  },
  {
    name: "Iggy",
    xHandle: "IGGYAZALEA",
    link: "https://x.com/IGGYAZALEA",
    country: "Australia",
    ageRange: "31-40",
    xAccountCreation: 2010,
    xFollowersRange: "over 500k",
    pfpType: "Human",
    ecosystem: ["Influencer"],
    descriptions: [
      "Used to be a mid rapper, now a top tier memecoin founder.",
      "The only celebrity that launched a memecoin and didn't rug.",
      "Trying to make crypto mainstream in her own way, you gotta respect it.",
    ],
    supportedChains: ["SOLANA"],
    tweets: [
      "Memecoins are the future! 🐶",
      "Let's make crypto fun and accessible!",
      "Grateful for the journey! #Crypto",
    ],
  },
  {
    name: "vibhu",
    xHandle: "vibhu",
    link: "https://x.com/vibhu",
    country: "India",
    ageRange: "30-40",
    xAccountCreation: 2008,
    xFollowersRange: "0-50k",
    pfpType: "Artificial",
    ecosystem: ["Founder"],
    descriptions: [
      "Has a lot of drip.",
      "In it for the art.",
      "Not into tokens or DeFi. NGMI except he already made it.",
    ],
    supportedChains: ["SOLANA", "ETHEREUM"],
    tweets: [
      "Art is the essence of life! 🎨",
      "Drip is everything! #Style",
      "Crypto is just a part of the journey!",
    ],
  },
];
