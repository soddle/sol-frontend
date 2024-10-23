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
  return (
    <div className="w-full max-w-4xl mx-auto bg-[#181716] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-[#1c1b1a]">
            <tr className="border-b border-gray-700">
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Points
              </th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Best Time
              </th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Games Played
              </th>
              <th className="px-2 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Avg Difficulty
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
                    entry.name === userWallet
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
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  <div className="text-white font-medium truncate max-w-[120px] sm:max-w-none">
                    {entry.name === userWallet
                      ? `${entry.name} (You)`
                      : entry.name}
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-right text-white">
                  {entry.points}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-right text-white">
                  {entry.bestTime}s
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-right text-white">
                  {entry.gamesPlayed}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-right text-white">
                  {entry.averageDifficulty.toFixed(1)}
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
