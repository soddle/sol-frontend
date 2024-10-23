"use client";
import * as React from "react";
import { ReactNode } from "react";

import Footer from "./footer";
import Header from "./header";
import Spinner from "../loadingUi";

import { useChainAdapter } from "@/hooks/useChainAdapter";
import { useUiStore } from "@/stores/uiStore";
import { useGameStore } from "@/stores/gameStore";

export function MainLayoutClient({ children }: { children: ReactNode }) {
  const chainAdapter = useChainAdapter();

  const isLoading = useUiStore((state) => state.isLoading);
  const { setCurrentCompetition } = useGameStore((state) => ({
    setCurrentCompetition: state.setCurrentCompetition,
    currentCompetition: state.currentCompetition,
    gameSession: state.currentPlaySession,
    setGameSession: state.setPlaySession,
  }));

  const { isModalOpen, ModalComponent } = useUiStore((state) => ({
    isModalOpen: state.isPopupOpen,
    ModalComponent: state.ModalComponent,
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  React.useEffect(() => {
    const grabCurrentCompetition = async () => {
      // 🔥TODO: fix this type error
      // @ts-expect-error type error
      chainAdapter.connect();
      const currentCompetition = await chainAdapter.fetchCurrentCompetition();
      if (currentCompetition) {
        setCurrentCompetition(currentCompetition);
      }
    };
    grabCurrentCompetition();
  }, [chainAdapter.fetchCurrentCompetition, setCurrentCompetition]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 ">
          <Spinner />
        </div>
      )}
      {isModalOpen && <ModalBackground>{ModalComponent}</ModalBackground>}
      <div className="min-h-screen flex flex-col text-white">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export function ModalBackground({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal text-white">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative p-6 max-w-md w-full">{children}</div>
    </div>
  );
}

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
