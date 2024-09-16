"use client";
import * as React from "react";
import { SolanaProviders } from "./solanaProviders";
import { Toaster } from "sonner";

import { RootStoreProvider } from "@/stores/storeProvider";
import AppWalletProvider from "./appWalletProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootStoreProvider>
      <SolanaProviders>
        <Toaster />
        {children}
      </SolanaProviders>
    </RootStoreProvider>
  );
}
