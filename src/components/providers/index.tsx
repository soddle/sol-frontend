"use client";
import * as React from "react";
import { Toaster } from "sonner";

import { RootStoreProvider } from "@/stores/storeProvider";
import AppWalletProvider from "./appWalletProvider";
import { ReactQueryProvider } from "./reactQueryProvider";
import { StoreProvider } from "./storesProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootStoreProvider>
      {/* <StoreProvider> */}
      <ReactQueryProvider>
        <AppWalletProvider>
          <Toaster />
          {children}
        </AppWalletProvider>
      </ReactQueryProvider>
      {/* </StoreProvider> */}
    </RootStoreProvider>
  );
}
