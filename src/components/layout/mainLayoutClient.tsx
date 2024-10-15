"use client";
import * as React from "react";
import { ReactNode } from "react";

import Footer from "./footer";
import Header from "./header";
import Spinner from "../loadingUi";
import { useRootStore } from "@/stores/storeProvider";
import { useChainAdapter } from "@/hooks/useChainAdapter";

export function MainLayoutClient({ children }: { children: ReactNode }) {
  const chainAdapter = useChainAdapter();
  const { ui, game } = useRootStore();
  const isLoading = ui((state) => state.isLoading);
  const { setGameState } = game((state) => ({
    setGameState: state.setGameState,
    gameState: state.gameState,
    gameSession: state.gameSession,
    setGameSession: state.setGameSession,
  }));

  const { isModalOpen, ModalComponent } = ui((state) => ({
    isModalOpen: state.isModalOpen,
    ModalComponent: state.modalContent,
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  React.useEffect(() => {
    const fetchGState = async () => {
      // 🔥TODO: fix this type error
      // @ts-expect-error type error
      chainAdapter.connect();
      const gameState = await chainAdapter.fetchGameState();
      if (gameState) {
        setGameState(gameState);
      }
    };
    fetchGState();
  }, [chainAdapter.fetchGameState, setGameState]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 ">
          <Spinner />
        </div>
      )}
      {isModalOpen && <ModalWrapper>{ModalComponent}</ModalWrapper>}
      <div className="min-h-screen flex flex-col text-white">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export function ModalWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal text-white">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative p-6 max-w-md w-full">{children}</div>
    </div>
  );
}
/*
curl https://staging-rpc.dev2.eclipsenetwork.xyz -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"requestAirdrop", "params":["DWcQ72YcxVN783QVeLHeLoegELtjEdudEvdiTuBuM1Tm", 1000000000]}' */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto sm:max-w-[500px]  w-full ${className}`}>
      {children}
    </div>
  );
}
