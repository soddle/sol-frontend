"use client";
import * as React from "react";
import { Toaster } from "sonner";

import { RootStoreProvider } from "@/stores/storeProvider";
import { ChainProvider } from "./chainProvider";
import AppWalletProvider from "./appWalletProvider";
import { ReactQueryProvider } from "./reactQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootStoreProvider>
      <TooltipProvider>
        <ReactQueryProvider>
          <ChainProvider>
            <AppWalletProvider>
              <Toaster />
              {children}
            </AppWalletProvider>
          </ChainProvider>
        </ReactQueryProvider>
      </TooltipProvider>
    </RootStoreProvider>
  );
}
