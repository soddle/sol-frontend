"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useState, useMemo } from "react";

export enum SolanaClusterName {
  MAINNET = "mainnet",
  TESTNET = "testnet",
  DEVNET = "devnet",
}

const HELIUS_API_KEY = "2db95077-90ac-433f-a13b-dbe4abcab384";

export const SOLANA_CLUSTERS = {
  [SolanaClusterName.MAINNET]: {
    name: "Solana Mainnet",
    endpoint: `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
    network: WalletAdapterNetwork.Mainnet,
    explorer: "",
  },
  [SolanaClusterName.TESTNET]: {
    name: "Solana Testnet",
    endpoint: "https://testnet.dev2.eclipsenetwork.xyz",
    network: WalletAdapterNetwork.Testnet,
    explorer: "https://explorer.dev2.eclipsenetwork.xyz",
  },
  [SolanaClusterName.DEVNET]: {
    name: "Solana Devnet",
    endpoint: `https://api.devnet.solana.com`,
    network: WalletAdapterNetwork.Devnet,
    explorer: "",
  },
};

export function useSolanaCluster() {
  const [cluster, setCluster] = useState(
    SOLANA_CLUSTERS[SolanaClusterName.DEVNET]
  );

  const endpoint = useMemo(() => cluster.endpoint, [cluster]);

  return {
    cluster,
    endpoint,
    setCluster: (name: SolanaClusterName) => setCluster(SOLANA_CLUSTERS[name]),
  };
}
