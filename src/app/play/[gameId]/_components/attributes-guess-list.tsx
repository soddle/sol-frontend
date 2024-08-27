import { AttributeResult, Game1GuessResult } from "@/lib/types/idl-types";
import Image from "next/image";
import React from "react";

interface AttributesGuessListProps {
  guess1Results: Game1GuessResult[];
}

const cellStyle = "p-2 overflow-hidden";
const cellContentStyle = "w-full h-full flex items-center justify-center";
const cellTextStyle = "text-xs sm:text-sm md:text-base truncate";

interface CellProps {
  children: React.ReactNode;
  attributeResult: AttributeResult;
  className?: string;
}

const Cell: React.FC<CellProps> = ({
  children,
  attributeResult,
  className,
}) => {
  return (
    <div
      className={`${cellStyle} ${
        Math.random() > 0.5 ? "bg-green-500" : "bg-red-500"
      } ${className}`}
    >
      <div className={`${cellContentStyle} aspect-[2/1]`}>{children}</div>
    </div>
  );
};

const HeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={`${cellStyle} `}>
    <div className={`${cellContentStyle} aspect-[2/1]`}>
      <span className={cellTextStyle}>{children}</span>
    </div>
  </div>
);

export const AttributesGuessListTable: React.FC<AttributesGuessListProps> = ({
  guess1Results,
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
          {guess1Results.map((guess1Result) => (
            <TableItem key={guess1Result.kol.id} guess1Result={guess1Result} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TableItemProps {
  guess1Result: Game1GuessResult;
}

function TableItem({ guess1Result }: TableItemProps) {
  const { kol, result } = guess1Result;
  const attributesResults = result.map(
    (obj) => Object.keys(obj)[0]
  ) as AttributeResult[];

  return (
    <>
      <Cell
        attributeResult={attributesResults[0]}
        className="bg-transparent p-0 m-0"
      >
        <Image
          unoptimized
          src={kol.pfp || "/user-icon.svg"}
          alt="user"
          width={40}
          height={20}
          objectFit="cover"
        />
      </Cell>
      <Cell attributeResult={attributesResults[1]}>
        <span className={cellTextStyle}>{kol.age}</span>
      </Cell>
      <Cell attributeResult={attributesResults[2]}>
        <span className={cellTextStyle}>{kol.country}</span>
      </Cell>

      <Cell attributeResult={attributesResults[3]}>
        <span className={cellTextStyle}>{kol.accountCreation}</span>
      </Cell>
      <Cell attributeResult={attributesResults[4]}>
        <span className={cellTextStyle}>{formatCount(kol.followers)}</span>
      </Cell>
      <Cell attributeResult={attributesResults[5]}>
        <span className={cellTextStyle}>{kol.ecosystem}</span>
      </Cell>
    </>
  );
}

function formatCount(count: number): string {
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
