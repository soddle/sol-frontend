"use client";
import * as React from "react";
import { Toaster } from "sonner";

import { RootStoreProvider } from "@/stores/storeProvider";
import AppWalletProvider from "./appWalletProvider";
import { ReactQueryProvider } from "./reactQueryProvider";
import { StoreProvider } from "./storesProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootStoreProvider>
      {/* <StoreProvider> */}
      <TooltipProvider>
        <ReactQueryProvider>
          <AppWalletProvider>
            <Toaster />
            {children}
          </AppWalletProvider>
        </ReactQueryProvider>
      </TooltipProvider>
      {/* </StoreProvider> */}
    </RootStoreProvider>
  );
}
