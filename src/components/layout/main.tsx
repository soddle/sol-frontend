"use client";
import * as React from "react";
import { ReactNode } from "react";

import Footer from "./footer";
import Header from "./header";
import Spinner from "../spinner";
import { useGameState } from "@/hooks/useGameState";
import { useRootStore } from "@/stores/storeProvider";

export function MainLayout({ children }: { children: ReactNode }) {
  const { ui, game } = useRootStore();
  const isLoading = ui((state) => state.isLoading);
  const setGameState = game((state) => state.setGameState);
  const { fetchGameState } = useGameState();

  React.useEffect(() => {
    async function fetchGState() {
      const gameState = await fetchGameState();
      console.log("gameState in main.tsx component", gameState);
      if (gameState) {
        console.log("setting game state in main.tsx component");
        console.log(gameState);
        setGameState(gameState);
      }
    }
    fetchGState();
  }, [fetchGameState]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 ">
          <Spinner />
        </div>
      )}
      <div className="min-h-screen flex flex-col text-white">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </>
  );
}

/*
curl https://staging-rpc.dev2.eclipsenetwork.xyz -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"requestAirdrop", "params":["DWcQ72YcxVN783QVeLHeLoegELtjEdudEvdiTuBuM1Tm", 1000000000]}' */
