"use client";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  SalmonWalletAdapter,
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { EthereumProvider } from "@/lib/chains/evm/ethereumProvider";
import { SVMChainAdapter, EVMChainAdapter } from "@/lib/chains/types";
import { useChain } from "./chainProvider";

require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentChain, currentNetwork, chainManager } = useChain();
  const adapter = chainManager.getAdapter(currentChain);
  // alert(currentChain);

  const solanaWallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new SalmonWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    []
  );

  if (chainManager.isSVMChain(currentChain)) {
    const svmAdapter = adapter as SVMChainAdapter;
    const config = svmAdapter.getChainConfig();

    // Check if the currentNetwork exists in the config.networks
    const networkConfig = config.networks[currentNetwork];
    if (!networkConfig) {
      throw new Error(
        `Network configuration for ${currentNetwork} is not defined.`
      );
    }

    const endpoint = networkConfig.rpcEndpoint;
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={solanaWallets} autoConnect={true}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  } else if (chainManager.isEVMChain(currentChain)) {
    const evmAdapter = adapter as EVMChainAdapter;
    const config = evmAdapter.getChainConfig();

    // Check if the currentNetwork exists in the config.networks
    const networkConfig = config.networks[currentNetwork];
    if (!networkConfig) {
      throw new Error(
        `Network configuration for ${currentNetwork} is not defined.`
      );
    }

    const chainId = networkConfig.chainId;
    return <EthereumProvider>{children}</EthereumProvider>;
  }

  return <>{children}</>; // Fallback for unsupported chains
}
