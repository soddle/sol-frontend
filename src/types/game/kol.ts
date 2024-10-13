export interface KOL {
  name: string;
  handle: string;
  link: string;
  country: string;
  ageRange: string;
  twitterAccountCreation: number;
  twitterFollowersRange: TwitterFollowersRange;
  pfpType: "Artificial" | "Human";
  ecosystem: Ecosystem[];
  descriptions: [string, string, string];
  supportedChains: Chain[]; // New field for multichain support
}

export type TwitterFollowersRange =
  | "0-50k"
  | "50-100k"
  | "100-200k"
  | "200-300k"
  | "300-500k"
  | "over 500k";

export type AgeRange = "20-30" | "21-30" | "30-40" | "31-40" | "41-50";

export type Ecosystem = "NFTs" | "Solana" | "Founder" | "Influencer";

export type Chain = "Solana" | "Ethereum" | "Sei" | "Aptos" | "Base" | "Sui"; // Add other SVM-compatible chains as needed

export const kols: KOL[] = [
  {
    name: "Frank",
    handle: "frankdegods",
    link: "https://x.com/frankdegods",
    country: "USA",
    ageRange: "20-30",
    twitterAccountCreation: 2021,
    twitterFollowersRange: "200-300k",
    pfpType: "Artificial",
    ecosystem: ["NFTs"],
    descriptions: [
      "Inventor of the paper hand bitch tax.",
      "Paved the way for NFTs on Solana. Got lost on his own way and moved to Ethereum, now back though.",
      "A brave man, was wearing sweatpants at the Iggy party.",
    ],
    supportedChains: ["Solana", "Ethereum"],
  },
  {
    name: "Lily Liu",
    handle: "calilyliu",
    link: "https://x.com/calilyliu",
    country: "Switzerland",
    ageRange: "31-40",
    twitterAccountCreation: 2009,
    twitterFollowersRange: "0-50k",
    pfpType: "Human",
    ecosystem: ["Solana"],
    descriptions: [
      "Will go down in the history books as first president of Solana.",
      "Working three jobs at the same time, role model for all Asians.",
      "Probably an unsung hero, pulling all the Solana strings.",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "Austin Federa",
    handle: "austin_federa",
    link: "https://x.com/austin_federa",
    country: "USA",
    ageRange: "31-40",
    twitterAccountCreation: 2009,
    twitterFollowersRange: "100-200k",
    pfpType: "Artificial",
    ecosystem: ["Solana"],
    descriptions: [
      "Spends more than three hours a day to make his hair- it does look good though.",
      "Giving American Psycho vibes, let's hope he's a good guy.",
      "Big brain, big smile.",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "Kash Danda",
    handle: "kashdhanda",
    link: "https://x.com/kashdhanda",
    country: "England",
    ageRange: "31-40",
    twitterAccountCreation: 2013,
    twitterFollowersRange: "0-50k",
    pfpType: "Artificial",
    ecosystem: ["Solana"],
    descriptions: [
      "Built an army of Solana maxis all around the world.",
      "Hands down the best Solana updates, go watch the Solana Ecosystem Call on YouTube.",
      "Has friends in every country (as long as there's a Superteam).",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "Nom",
    handle: "theonlynom",
    link: "https://x.com/theonlynom",
    country: "USA",
    ageRange: "41-50",
    twitterAccountCreation: 2011,
    twitterFollowersRange: "50-100k",
    pfpType: "Artificial",
    ecosystem: ["NFTs"],
    descriptions: [
      "Likes monkes and dogs.",
      "Responsible for arguably the best airdrop in crypto history.",
      "BONK BONK BONK BONK BONK",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "meow",
    handle: "weremeow",
    link: "https://x.com/weremeow",
    country: "Singapore",
    ageRange: "41-50",
    twitterAccountCreation: 2008,
    twitterFollowersRange: "over 500k",
    pfpType: "Artificial",
    ecosystem: ["Founder"],
    descriptions: [
      "Named himself after a cat, his company after a planet.",
      "Watch his interview with Luke Belmar if you're trying to lose brain cells.",
      "Built arguably the best DEX in the world.",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "mert",
    handle: "0xMert_",
    link: "https://x.com/0xMert_",
    country: "Canada",
    ageRange: "31-40",
    twitterAccountCreation: 2020,
    twitterFollowersRange: "100-200k",
    pfpType: "Artificial",
    ecosystem: ["Founder"],
    descriptions: [
      "Egghead. (all jokes aside: jacked, smart and rich. We're all jealous)",
      "*insert a bald joke*",
      "Big head for a lot of brains, bebe.",
    ],
    supportedChains: ["Solana", "Ethereum"],
  },
  {
    name: "Armani Ferrante",
    handle: "armaniferrante",
    link: "https://x.com/armaniferrante",
    country: "USA",
    ageRange: "31-40",
    twitterAccountCreation: 2011,
    twitterFollowersRange: "50-100k",
    pfpType: "Human",
    ecosystem: ["NFTs", "Founder"],
    descriptions: [
      "Favourite accessoire is a backpack.",
      "Lost 90% in the FTX crash, came back stronger than ever before.",
      "Had five different haircuts in the last two years, looks good in all of them.",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "raj",
    handle: "rajgokal",
    link: "https://x.com/rajgokal",
    country: "USA",
    ageRange: "41-50",
    twitterAccountCreation: 2010,
    twitterFollowersRange: "200-300k",
    pfpType: "Artificial",
    ecosystem: ["Solana", "Founder"],
    descriptions: [
      "Has the best PFP on Crypto Twitter.",
      "Founder with the best humour, man of the people!",
      "raj&toly = yin&yang",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "toly",
    handle: "aeyakovenko",
    link: "https://x.com/aeyakovenko",
    country: "USA",
    ageRange: "41-50",
    twitterAccountCreation: 2014,
    twitterFollowersRange: "300-500k",
    pfpType: "Artificial",
    ecosystem: ["Solana", "Founder"],
    descriptions: [
      "Cosplayer turned Crypto Founder.",
      "The best things happen after two coffee and a beer.",
      "The hat stays on.",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "Ansem",
    handle: "blknoiz06",
    link: "https://x.com/blknoiz06",
    country: "USA",
    ageRange: "21-30",
    twitterAccountCreation: 2012,
    twitterFollowersRange: "over 500k",
    pfpType: "Artificial",
    ecosystem: ["Influencer"],
    descriptions: [
      "Can't decide if he's a founder, influencer, boxer or trader.",
      "Very tall guy.",
      "A little weird at times, but who are we to judge.",
    ],
    supportedChains: ["Solana", "Ethereum"],
  },
  {
    name: "Jakey",
    handle: "soljakey",
    link: "https://x.com/soljakey",
    country: "Canada",
    ageRange: "21-30",
    twitterAccountCreation: 2022,
    twitterFollowersRange: "100-200k",
    pfpType: "Artificial",
    ecosystem: ["Influencer", "NFTs"],
    descriptions: [
      "A little weird but we like him.",
      "Could be Steve-O's son.",
      "Has the highest output in whole Crypto Twitter.",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "KSI",
    handle: "ksicrypto",
    link: "https://x.com/ksicrypto",
    country: "UK",
    ageRange: "30-40",
    twitterAccountCreation: 2021,
    twitterFollowersRange: "300-500k",
    pfpType: "Artificial",
    ecosystem: ["Influencer"],
    descriptions: [
      "Has no idea what he's doing.",
      "Not the same since he doesn't have the SMB PFP anymore.",
      "Can't decide whether he's bullish or bearish.",
    ],
    supportedChains: ["Solana", "Ethereum"],
  },
  {
    name: "Iggy",
    handle: "IGGYAZALEA",
    link: "https://x.com/IGGYAZALEA",
    country: "Australia",
    ageRange: "31-40",
    twitterAccountCreation: 2010,
    twitterFollowersRange: "over 500k",
    pfpType: "Human",
    ecosystem: ["Influencer"],
    descriptions: [
      "Used to be a mid rapper, now a top tier memecoin founder.",
      "The only celebrity that launched a memecoin and didn't rug.",
      "Trying to make crypto mainstream in her own way, you gotta respect it.",
    ],
    supportedChains: ["Solana"],
  },
  {
    name: "vibhu",
    handle: "vibhu",
    link: "https://x.com/vibhu",
    country: "India",
    ageRange: "30-40",
    twitterAccountCreation: 2008,
    twitterFollowersRange: "0-50k",
    pfpType: "Artificial",
    ecosystem: ["Founder"],
    descriptions: [
      "Has a lot of drip.",
      "In it for the art.",
      "Not into tokens or DeFi. NGMI except he already made it.",
    ],
    supportedChains: ["Solana", "Ethereum"],
  },
];
