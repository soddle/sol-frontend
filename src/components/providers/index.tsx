"use client";
import * as React from "react";
import { SolanaProviders } from "./solana-providers";
import { Toaster } from "sonner";
import { UIStoreProvider } from "./uiStoreProvider";
import { GameStoreProvider } from "./gameStoreProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProviders>
      <UIStoreProvider>
        <GameStoreProvider>
          <Toaster />
          {children}
        </GameStoreProvider>
      </UIStoreProvider>
    </SolanaProviders>
  );
}
