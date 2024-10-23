"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GamepadIcon,
  Swords,
  Brain,
  UserSearch,
  Smile,
  MessagesSquare,
} from "lucide-react";

interface Game {
  id: string;
  name: string;
  icon: "usersearch" | "messagesquare" | "emoji" | string;
  description: string;
}

interface GameSelectorProps {
  games: Game[];
  selectedGame: string;
  onSelectGame: (gameId: string) => void;
}

const GameSelector = ({
  games,
  selectedGame,
  onSelectGame,
}: GameSelectorProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "usersearch":
        return <UserSearch className="w-6 h-6" />;
      case "messagesquare":
        return <MessagesSquare className="w-6 h-6" />;
      case "emoji":
        return <Smile className="w-6 h-6" />;
      default:
        return <GamepadIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="relative mb-8">
      {/* Glowing background line */}
      <div className="absolute h-1 w-full top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="relative flex justify-center gap-6 flex-wrap">
        <AnimatePresence mode="wait">
          {games.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={() => onSelectGame(game.id)}
                className={`relative group ${
                  selectedGame === game.id
                    ? "bg-green-500/20"
                    : "bg-[#111411] hover:bg-green-500/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  clipPath:
                    "polygon(0 20%, 20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%)",
                }}
              >
                {/* Border glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 opacity-0 group-hover:opacity-50 transition-opacity blur" />

                <div className="relative p-4 border-2 border-green-500/30 group-hover:border-green-500/60 transition-colors">
                  {/* Content container */}
                  <div className="flex flex-col items-center gap-2 min-w-48">
                    {/* Icon */}
                    <motion.div
                      className={`text-green-400 ${
                        selectedGame === game.id ? "opacity-100" : "opacity-60"
                      }`}
                      animate={
                        selectedGame === game.id
                          ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {getIcon(game.icon)}
                    </motion.div>

                    {/* Game name */}
                    <h3
                      className={`text-lg font-bold tracking-wider uppercase ${
                        selectedGame === game.id
                          ? "text-green-400"
                          : "text-green-400/60"
                      }`}
                    >
                      {game.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-green-400/40 text-center">
                      {game.description}
                    </p>

                    {/* Selection indicator */}
                    {selectedGame === game.id && (
                      <motion.div
                        layoutId="gameSelector"
                        className="absolute inset-0 border-2 border-green-500"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        style={{
                          clipPath:
                            "polygon(0 20%, 20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%)",
                        }}
                      />
                    )}

                    {/* Scan line effect */}
                    <motion.div
                      className="absolute inset-0 bg-green-500/5"
                      animate={{
                        opacity: [0, 0.5, 0],
                        y: ["0%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameSelector;
