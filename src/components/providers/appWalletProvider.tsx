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
  const { currentChain, chainManager } = useChain();
  const adapter = chainManager.getAdapter(currentChain);

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
    return (
      <ConnectionProvider endpoint={svmAdapter.getChainConfig().rpcEndpoint}>
        <WalletProvider wallets={solanaWallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  } else if (chainManager.isEVMChain(currentChain)) {
    const evmAdapter = adapter as EVMChainAdapter;
    return (
      // chainId={evmAdapter.getChainConfig().chainId}
      <EthereumProvider>{children}</EthereumProvider>
    );
  }

  return <>{children}</>; // Fallback for unsupported chains
}
