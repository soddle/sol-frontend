import { LeaderboardEntry } from "@/types";
import React from "react";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  userWallet?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  userWallet,
}) => {
  // const calculateReward = (rank: number, totalEntries: number) => {
  //   const percentile = (rank / totalEntries) * 100;
  //   if (percentile <= 50) {
  //     return `Top ${Math.round(percentile)}% (2x)`;
  //   }
  //   return "-";
  // };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#181716] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-[#1c1b1a]">
            <tr className="border-b border-gray-700">
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Top% (Reward)
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.rank}
                className={`
                  ${index % 2 === 0 ? "bg-[#1c1b1a]" : "bg-[#181716]"}
                  ${
                    entry.player === userWallet
                      ? "bg-green-900 bg-opacity-50"
                      : ""
                  }
                  hover:bg-[#2a342a] transition-colors duration-150 ease-in-out
                `}
              >
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="text-white">{entry.rank}</div>
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-green-400 hidden sm:table-cell">
                  {/* {calculateReward(entry.rank, entries.length)} */}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  <div className="text-white font-medium truncate max-w-[120px] sm:max-w-none">
                    {entry.player === userWallet
                      ? `${entry.player} (You)`
                      : entry.player}
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-right text-white">
                  {entry.totalScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
