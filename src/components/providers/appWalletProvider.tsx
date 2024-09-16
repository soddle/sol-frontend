"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { SalmonWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useEclipseCluster } from "@/hooks/useEclipseCluster";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// imports here

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cluster = useEclipseCluster();
  const network = cluster.cluster.network;
  const endpoint = cluster.cluster.endpoint;

  const wallets = useMemo(
    () => [new SalmonWalletAdapter({ network })],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
