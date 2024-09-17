import { useGameSession } from "@/hooks/useGameSession";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRootStore } from "@/stores/storeProvider";
import { formatCount } from "@/lib/utils";
import { GameSessionFromApi, GameSessionFromApiResponse, KOL } from "@/types";
import { fetchGameSessionFromApi, fetchRandomKOL } from "@/lib/api";
interface AttributesGuessListProps {
  gameSessionFromApi: GameSessionFromApi;
}

interface CellProps {
  children: React.ReactNode;
  attributeResult: any;
  targetKol: KOL;
  guessKol: KOL;
  className?: string;
}

const Cell: React.FC<CellProps> = ({
  children,
  attributeResult,
  className,
}) => {
  return (
    <div
      className={` overflow-hidden ${
        attributeResult === "Correct"
          ? "bg-green-500"
          : attributeResult === "Incorrect"
          ? "bg-red-500"
          : attributeResult === "Higher"
          ? "bg-red-500"
          : attributeResult === "Lower"
          ? "bg-red-500"
          : "bg-yellow-500"
      } ${className}`}
    >
      <div
        className={`w-full h-full flex items-center justify-center aspect-[2/1]`}
      >
        {children}
      </div>
    </div>
  );
};

const HeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={` overflow-hidden `}>
    <div
      className={`w-full h-full flex items-center justify-center aspect-[2/1]`}
    >
      <span
        className={
          "text-[0.7rem] sm:text-xs md:text-sm break-words text-center"
        }
      >
        {children}
      </span>
    </div>
  </div>
);

export const AttributesGuessListTable: React.FC<AttributesGuessListProps> = ({
  gameSessionFromApi,
}) => {
  return (
    <div className="w-full max-w-[700px] mx-auto overflow-x-auto ">
      <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-6 gap-2 ">
          {[
            "KOL",
            "Age",
            "Country",
            "Account creation",
            "Followers",
            "Ecosystem",
          ].map((header) => (
            <HeaderCell key={header}>{header}</HeaderCell>
          ))}
          {gameSessionFromApi.game1Guesses?.map((game1guess) => {
            return (
              <TableRow key={game1guess.guess.id} game1guess={game1guess} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface TableItemProps {
  game1guess: any;
}

function TableRow({ game1guess }: TableItemProps) {
  const { wallet } = useWallet();
  const [targetKol, setTargetKol] = useState<KOL | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGameSession() {
      if (wallet?.adapter?.publicKey) {
        try {
          setLoading(true);
          const gameSession = await fetchGameSessionFromApi({
            publicKey: wallet.adapter.publicKey.toString(),
          });
          setTargetKol(gameSession.kol);
        } catch (error) {
          console.error("Error fetching game session:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchGameSession();
  }, [wallet?.adapter?.publicKey]);

  const { guess: guessKol, result: attributesResults } = game1guess;

  if (loading) return <div>Loading...</div>;
  if (!targetKol) return null;

  console.log("guessKol", guessKol);
  console.log("result", attributesResults);

  // const attributesResults = result.map(
  //   (obj: any) => Object.keys(obj)[0]
  // ) as any[];

  return (
    <>
      <Cell
        targetKol={targetKol}
        guessKol={guessKol}
        attributeResult={attributesResults.pfpType}
        className="bg-transparent p-0 m-0"
      >
        <Image
          unoptimized
          src={guessKol.pfp || "/user-icon.svg"}
          className="rounded-full"
          alt="user"
          width={40}
          height={20}
          objectFit="cover"
        />
      </Cell>
      <Cell
        attributeResult={attributesResults.age}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span
          className={
            "text-[0.7rem] sm:text-xs md:text-sm break-words text-center"
          }
        >
          {guessKol.age}
        </span>
      </Cell>
      <Cell
        attributeResult={attributesResults.country}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span
          className={
            "text-[0.7rem] sm:text-xs md:text-sm break-words text-center"
          }
        >
          {guessKol.country}
        </span>
      </Cell>

      <Cell
        attributeResult={attributesResults.accountCreation}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span
          className={
            "text-[0.7rem] sm:text-xs md:text-sm break-words text-center"
          }
        >
          {guessKol.accountCreation}
        </span>
      </Cell>
      <Cell
        attributeResult={attributesResults.followers}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span
          className={
            "text-[0.7rem] sm:text-xs md:text-sm break-words text-center"
          }
        >
          {formatCount(guessKol.followers)}
        </span>
      </Cell>
      <Cell
        attributeResult={attributesResults.ecosystem}
        guessKol={guessKol}
        targetKol={targetKol}
      >
        <span
          className={
            "text-[0.7rem] sm:text-xs md:text-sm break-words text-center"
          }
        >
          {guessKol.ecosystem}
        </span>
      </Cell>
    </>
  );
}

const t = {
  _id: "66e96811f7701e0638ab572c",
  player: "DWcQ72YcxVN783QVeLHeLoegELtjEdudEvdiTuBuM1Tm",
  gameType: 2,
  startTime: 1726582146828,
  game1Completed: false,
  game2Completed: false,
  game1Score: 0,
  game2Score: 0,
  game1Guesses: [
    {
      guess: {
        id: "66e73ef703e3b6308e74f19c",
        name: "vitalik.eth",
        age: 25,
        ageDisplay: "21-30",
        country: "Russia",
        pfpType: "human",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/msnhff7mch5y4qze5sxs",
        accountCreation: 2011,
        followers: 5000000,
        followersDisplay: "over 5M",
        ecosystem: "Chain Founder",
        tweets: [
          "7 years ago, before ethereum even\nbegan, I had only a few thousand dollars\nof net worth. I nevertheless sold half my\nbitcoin to make sure that I would not be\nbroke if BTC went to zero.",
          'Against choosing your political allegiances based on who is "pro-crypto',
          "7 years ago, before ethereum even began, I had only a few thousand\ndollars of net worth. I nevertheless sold half my bitcoin to make sure that\nI would not be broke if BTC went to zero.",
          'If all that we accomplish is lambo\nmemes and immature puns about\n"sharting", then I WILL leave.\nThough I still have a lot of hope that the\ncommunity can steer in the right\ndirection.',
          "The 'metaverse' is going to happen but I don't think any of the existing corporate attempts to intentionally create the metaverse are going anywhere.",
        ],
      },
      result: {
        name: "Incorrect",
        age: "Higher",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Correct",
        followers: "Lower",
        ecosystem: "Correct",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19c",
        name: "vitalik.eth",
        age: 25,
        ageDisplay: "21-30",
        country: "Russia",
        pfpType: "human",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/msnhff7mch5y4qze5sxs",
        accountCreation: 2011,
        followers: 5000000,
        followersDisplay: "over 5M",
        ecosystem: "Chain Founder",
        tweets: [
          "7 years ago, before ethereum even\nbegan, I had only a few thousand dollars\nof net worth. I nevertheless sold half my\nbitcoin to make sure that I would not be\nbroke if BTC went to zero.",
          'Against choosing your political allegiances based on who is "pro-crypto',
          "7 years ago, before ethereum even began, I had only a few thousand\ndollars of net worth. I nevertheless sold half my bitcoin to make sure that\nI would not be broke if BTC went to zero.",
          'If all that we accomplish is lambo\nmemes and immature puns about\n"sharting", then I WILL leave.\nThough I still have a lot of hope that the\ncommunity can steer in the right\ndirection.',
          "The 'metaverse' is going to happen but I don't think any of the existing corporate attempts to intentionally create the metaverse are going anywhere.",
        ],
      },
      result: {
        name: "Incorrect",
        age: "Higher",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Correct",
        followers: "Lower",
        ecosystem: "Correct",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19e",
        name: "Brian Armstrong",
        age: 45,
        ageDisplay: "41-50",
        country: "USA",
        pfpType: "artificial",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/ij2djmahfktykkt9vp5r",
        accountCreation: 2008,
        followers: 2000000,
        followersDisplay: "1-3M",
        ecosystem: "CEX",
        tweets: [
          "ETH is trading up 4% since we launched\nabout an hour ago.",
          "1/ Some folks asked for details of how our super bowl ad came to be, here\nis the quick back story...",
          "Regarding the SEC complaint against us today, we're\nproud to represent the industry in court to finally get\nsome clarity around crypto rules.\nRemember:\n1. The SEC reviewed our business and allowed us to\nbecome a public company in 2021.\n2. There is no path to \"come in and...",
          "Ripple, Stellar, and Altcoins are all a\ndistraction. Bitcoin is way too far ahead. We\nshould be focused on bitcoin and sidechains",
          'Achievement unlocked! I dreamt about a sitting U.S.\npresident needing to respond to growing cryptocurrency\nusage years ago. "First they ignore you, then they laugh at\nyou, then they fight you, then you win". We just made it to\nstep 3 y\'all.',
        ],
      },
      result: {
        name: "Incorrect",
        age: "Correct",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Higher",
        followers: "Lower",
        ecosystem: "Incorrect",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19e",
        name: "Brian Armstrong",
        age: 45,
        ageDisplay: "41-50",
        country: "USA",
        pfpType: "artificial",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/ij2djmahfktykkt9vp5r",
        accountCreation: 2008,
        followers: 2000000,
        followersDisplay: "1-3M",
        ecosystem: "CEX",
        tweets: [
          "ETH is trading up 4% since we launched\nabout an hour ago.",
          "1/ Some folks asked for details of how our super bowl ad came to be, here\nis the quick back story...",
          "Regarding the SEC complaint against us today, we're\nproud to represent the industry in court to finally get\nsome clarity around crypto rules.\nRemember:\n1. The SEC reviewed our business and allowed us to\nbecome a public company in 2021.\n2. There is no path to \"come in and...",
          "Ripple, Stellar, and Altcoins are all a\ndistraction. Bitcoin is way too far ahead. We\nshould be focused on bitcoin and sidechains",
          'Achievement unlocked! I dreamt about a sitting U.S.\npresident needing to respond to growing cryptocurrency\nusage years ago. "First they ignore you, then they laugh at\nyou, then they fight you, then you win". We just made it to\nstep 3 y\'all.',
        ],
      },
      result: {
        name: "Incorrect",
        age: "Correct",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Higher",
        followers: "Lower",
        ecosystem: "Incorrect",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19c",
        name: "vitalik.eth",
        age: 25,
        ageDisplay: "21-30",
        country: "Russia",
        pfpType: "human",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/msnhff7mch5y4qze5sxs",
        accountCreation: 2011,
        followers: 5000000,
        followersDisplay: "over 5M",
        ecosystem: "Chain Founder",
        tweets: [
          "7 years ago, before ethereum even\nbegan, I had only a few thousand dollars\nof net worth. I nevertheless sold half my\nbitcoin to make sure that I would not be\nbroke if BTC went to zero.",
          'Against choosing your political allegiances based on who is "pro-crypto',
          "7 years ago, before ethereum even began, I had only a few thousand\ndollars of net worth. I nevertheless sold half my bitcoin to make sure that\nI would not be broke if BTC went to zero.",
          'If all that we accomplish is lambo\nmemes and immature puns about\n"sharting", then I WILL leave.\nThough I still have a lot of hope that the\ncommunity can steer in the right\ndirection.',
          "The 'metaverse' is going to happen but I don't think any of the existing corporate attempts to intentionally create the metaverse are going anywhere.",
        ],
      },
      result: {
        name: "Incorrect",
        age: "Higher",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Correct",
        followers: "Lower",
        ecosystem: "Correct",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19c",
        name: "vitalik.eth",
        age: 25,
        ageDisplay: "21-30",
        country: "Russia",
        pfpType: "human",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/msnhff7mch5y4qze5sxs",
        accountCreation: 2011,
        followers: 5000000,
        followersDisplay: "over 5M",
        ecosystem: "Chain Founder",
        tweets: [
          "7 years ago, before ethereum even\nbegan, I had only a few thousand dollars\nof net worth. I nevertheless sold half my\nbitcoin to make sure that I would not be\nbroke if BTC went to zero.",
          'Against choosing your political allegiances based on who is "pro-crypto',
          "7 years ago, before ethereum even began, I had only a few thousand\ndollars of net worth. I nevertheless sold half my bitcoin to make sure that\nI would not be broke if BTC went to zero.",
          'If all that we accomplish is lambo\nmemes and immature puns about\n"sharting", then I WILL leave.\nThough I still have a lot of hope that the\ncommunity can steer in the right\ndirection.',
          "The 'metaverse' is going to happen but I don't think any of the existing corporate attempts to intentionally create the metaverse are going anywhere.",
        ],
      },
      result: {
        name: "Incorrect",
        age: "Higher",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Correct",
        followers: "Lower",
        ecosystem: "Correct",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19c",
        name: "vitalik.eth",
        age: 25,
        ageDisplay: "21-30",
        country: "Russia",
        pfpType: "human",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/msnhff7mch5y4qze5sxs",
        accountCreation: 2011,
        followers: 5000000,
        followersDisplay: "over 5M",
        ecosystem: "Chain Founder",
        tweets: [
          "7 years ago, before ethereum even\nbegan, I had only a few thousand dollars\nof net worth. I nevertheless sold half my\nbitcoin to make sure that I would not be\nbroke if BTC went to zero.",
          'Against choosing your political allegiances based on who is "pro-crypto',
          "7 years ago, before ethereum even began, I had only a few thousand\ndollars of net worth. I nevertheless sold half my bitcoin to make sure that\nI would not be broke if BTC went to zero.",
          'If all that we accomplish is lambo\nmemes and immature puns about\n"sharting", then I WILL leave.\nThough I still have a lot of hope that the\ncommunity can steer in the right\ndirection.',
          "The 'metaverse' is going to happen but I don't think any of the existing corporate attempts to intentionally create the metaverse are going anywhere.",
        ],
      },
      result: {
        name: "Incorrect",
        age: "Higher",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Correct",
        followers: "Lower",
        ecosystem: "Correct",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19c",
        name: "vitalik.eth",
        age: 25,
        ageDisplay: "21-30",
        country: "Russia",
        pfpType: "human",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/msnhff7mch5y4qze5sxs",
        accountCreation: 2011,
        followers: 5000000,
        followersDisplay: "over 5M",
        ecosystem: "Chain Founder",
        tweets: [
          "7 years ago, before ethereum even\nbegan, I had only a few thousand dollars\nof net worth. I nevertheless sold half my\nbitcoin to make sure that I would not be\nbroke if BTC went to zero.",
          'Against choosing your political allegiances based on who is "pro-crypto',
          "7 years ago, before ethereum even began, I had only a few thousand\ndollars of net worth. I nevertheless sold half my bitcoin to make sure that\nI would not be broke if BTC went to zero.",
          'If all that we accomplish is lambo\nmemes and immature puns about\n"sharting", then I WILL leave.\nThough I still have a lot of hope that the\ncommunity can steer in the right\ndirection.',
          "The 'metaverse' is going to happen but I don't think any of the existing corporate attempts to intentionally create the metaverse are going anywhere.",
        ],
      },
      result: {
        name: "Incorrect",
        age: "Higher",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Correct",
        followers: "Lower",
        ecosystem: "Correct",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19e",
        name: "Brian Armstrong",
        age: 45,
        ageDisplay: "41-50",
        country: "USA",
        pfpType: "artificial",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/ij2djmahfktykkt9vp5r",
        accountCreation: 2008,
        followers: 2000000,
        followersDisplay: "1-3M",
        ecosystem: "CEX",
        tweets: [
          "ETH is trading up 4% since we launched\nabout an hour ago.",
          "1/ Some folks asked for details of how our super bowl ad came to be, here\nis the quick back story...",
          "Regarding the SEC complaint against us today, we're\nproud to represent the industry in court to finally get\nsome clarity around crypto rules.\nRemember:\n1. The SEC reviewed our business and allowed us to\nbecome a public company in 2021.\n2. There is no path to \"come in and...",
          "Ripple, Stellar, and Altcoins are all a\ndistraction. Bitcoin is way too far ahead. We\nshould be focused on bitcoin and sidechains",
          'Achievement unlocked! I dreamt about a sitting U.S.\npresident needing to respond to growing cryptocurrency\nusage years ago. "First they ignore you, then they laugh at\nyou, then they fight you, then you win". We just made it to\nstep 3 y\'all.',
        ],
      },
      result: {
        name: "Incorrect",
        age: "Correct",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Higher",
        followers: "Lower",
        ecosystem: "Incorrect",
      },
    },
    {
      guess: {
        id: "66e73ef703e3b6308e74f19e",
        name: "Brian Armstrong",
        age: 45,
        ageDisplay: "41-50",
        country: "USA",
        pfpType: "artificial",
        pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/ij2djmahfktykkt9vp5r",
        accountCreation: 2008,
        followers: 2000000,
        followersDisplay: "1-3M",
        ecosystem: "CEX",
        tweets: [
          "ETH is trading up 4% since we launched\nabout an hour ago.",
          "1/ Some folks asked for details of how our super bowl ad came to be, here\nis the quick back story...",
          "Regarding the SEC complaint against us today, we're\nproud to represent the industry in court to finally get\nsome clarity around crypto rules.\nRemember:\n1. The SEC reviewed our business and allowed us to\nbecome a public company in 2021.\n2. There is no path to \"come in and...",
          "Ripple, Stellar, and Altcoins are all a\ndistraction. Bitcoin is way too far ahead. We\nshould be focused on bitcoin and sidechains",
          'Achievement unlocked! I dreamt about a sitting U.S.\npresident needing to respond to growing cryptocurrency\nusage years ago. "First they ignore you, then they laugh at\nyou, then they fight you, then you win". We just made it to\nstep 3 y\'all.',
        ],
      },
      result: {
        name: "Incorrect",
        age: "Correct",
        country: "Incorrect",
        pfpType: "Incorrect",
        account_creation: "Higher",
        followers: "Lower",
        ecosystem: "Incorrect",
      },
    },
  ],
  game2Guesses: [],
  game1GuessesCount: 24,
  game2GuessesCount: 0,
  totalScore: 0,
  completed: false,
  score: 0,
  kol: {
    id: "66c7dbc1d484e54c72d24066",
    name: "Emin Gün Sirer",
    age: 45,
    country: "Turkey",
    pfp: "https://res.cloudinary.com/dbuaprzc0/image/upload/f_auto,q_auto/v1/Soddle/ngmforjkndyfzkgwtbtm",
    accountCreation: 2011,
    followers: 250000,
    ecosystem: "Chain Founder",
  },
  competitionId: "comp321",
  __v: 42,
};

/* 

december anxiety sun chase play ginger panel theory domain soccer keep lock



*/
