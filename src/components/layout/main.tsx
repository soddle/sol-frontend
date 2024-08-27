"use client";
import * as React from "react";
import { ReactNode } from "react";

import Footer from "./footer";
import Header from "./header";
import Spinner from "../spinner";
import { useGameState } from "@/hooks/useGameState";
import { useRootStore } from "@/stores/storeProvider";
import PopUpWindow from "../pop-up-window";

export function MainLayout({ children }: { children: ReactNode }) {
  const { ui, game } = useRootStore();
  const isLoading = ui((state) => state.isLoading);
  const isModalOpen = ui((state) => state.isModalOpen);
  const setGameState = game((state) => state.setGameState);
  const { fetchGameState } = useGameState();

  React.useEffect(() => {
    const fetchGState = async () => {
      const gameState = await fetchGameState();
      if (gameState) {
        setGameState(gameState);
      }
    };
    fetchGState();
  }, [fetchGameState, setGameState]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 ">
          <Spinner />
        </div>
      )}
      {isModalOpen && (
        <PopUpWindowBg>
          <PopUpWindow />
        </PopUpWindowBg>
      )}
      <div className="min-h-screen flex flex-col text-white">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export function PopUpWindowBg({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      {/* <div className="relative bg-[#111411] border border-[#2A342A] p-6 rounded-lg max-w-md w-full"> */}
      <div className="relative p-6 max-w-md w-full">{children}</div>
    </div>
  );
}
/*
curl https://staging-rpc.dev2.eclipsenetwork.xyz -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"requestAirdrop", "params":["DWcQ72YcxVN783QVeLHeLoegELtjEdudEvdiTuBuM1Tm", 1000000000]}' */
