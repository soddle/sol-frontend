"use client";

import React, { createContext, useContext, useState } from "react";
import { ChainManager } from "@/lib/chains/chainManager";
import { SupportedChain } from "@/lib/chains/types";
import { Cluster } from "@solana/web3.js";

const ChainContext = createContext<
  | {
      chainManager: ChainManager;
      currentChain: SupportedChain;
      currentNetwork: Cluster;
      setCurrentChain: (chain: SupportedChain) => void;
      setCurrentNetwork: (network: Cluster) => void;
    }
  | undefined
>(undefined);

export function ChainProvider({ children }: { children: React.ReactNode }) {
  const [currentChain, setCurrentChain] = useState<SupportedChain>("ECLIPSE");
  const [currentNetwork, setCurrentNetwork] = useState<Cluster>("devnet");
  const chainManager = new ChainManager();

  const setChainAndNetwork = (chain: SupportedChain, network: Cluster) => {
    setCurrentChain(chain);
    setCurrentNetwork(network);
    const adapter = chainManager.getAdapter(chain);
    adapter.setNetwork(network);
  };

  return (
    <ChainContext.Provider
      value={{
        chainManager,
        currentChain,
        currentNetwork,
        setCurrentChain: (chain: SupportedChain) =>
          setChainAndNetwork(chain, currentNetwork),
        setCurrentNetwork: (network: Cluster) =>
          setChainAndNetwork(currentChain, network),
      }}
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
