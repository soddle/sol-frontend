"use client";

import React, { createContext, useContext, useState } from "react";
import { ChainManager } from "@/lib/chains/chainManager";

const ChainContext = createContext<
  | {
      chainManager: ChainManager;
      currentChain: string;
      setCurrentChain: (chain: string) => void;
    }
  | undefined
>(undefined);

export function ChainProvider({ children }: { children: React.ReactNode }) {
  const [currentChain, setCurrentChain] = useState("solana"); // Default to Solana
  const chainManager = new ChainManager();

  return (
    <ChainContext.Provider
      value={{ chainManager, currentChain, setCurrentChain }}
    >
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
}
