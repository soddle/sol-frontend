"use client";
import * as React from "react";
import { Toaster } from "sonner";

import { RootStoreProvider } from "@/stores/storeProvider";
import AppWalletProvider from "./appWalletProvider";
import { ReactQueryProvider } from "./reactQueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootStoreProvider>
      <ReactQueryProvider>
        <AppWalletProvider>
          <Toaster />
          {children}
        </AppWalletProvider>
      </ReactQueryProvider>
    </RootStoreProvider>
  );
}
