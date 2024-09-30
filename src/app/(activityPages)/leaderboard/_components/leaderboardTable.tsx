import React from "react";

interface LeaderboardEntry {
  rank: number;
  reward: string;
  name: string;
  points: number;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  userRank?: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  userRank,
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
            {data.map((entry, index) => (
              <tr
                key={entry.rank}
                className={`
                  ${index % 2 === 0 ? "bg-[#1c1b1a]" : "bg-[#181716]"}
                  ${entry.rank === userRank ? "bg-green-900 bg-opacity-50" : ""}
                  hover:bg-[#2a342a] transition-colors duration-150 ease-in-out
                `}
              >
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="text-white">{entry.rank}</div>
                    <div className="ml-2 text-green-400 text-xs sm:hidden">
                      {entry.reward}
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-green-400 hidden sm:table-cell">
                  {entry.reward}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm">
                  <div className="text-white font-medium truncate max-w-[120px] sm:max-w-none">
                    {entry.name}
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-right text-white">
                  {entry.points}
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
