import React from "react";

import Image from "next/image";

interface EmojisGuessListProps {
  guess3Results: any[];
}

export const EmojisGuessList: React.FC<EmojisGuessListProps> = ({
  guess3Results,
}) => {
  return (
    <ul className="flex flex-col gap-2">
      {guess3Results.map((guessResult) => (
        <ListItem key={guessResult.kol.id} guessResult={guessResult} />
      ))}
    </ul>
  );
};

function ListItem({ guessResult }: { guessResult: any }) {
  return (
    <li
      className={`bg-${
        guessResult.result ? "green" : "red"
      }-500  py-4 px-2 text-white flex items-center gap-2 justify-center`}
    >
      <Image
        src={guessResult.kol.pfp || "/user-icon.svg"}
        alt={guessResult.kol.name}
        width={40}
        height={40}
      />
      <p>{guessResult.kol.name}</p>
    </li>
  );
}
