"use client";

import { createContext, useRef, useContext, ReactNode } from "react";
import { createRootStore, RootStore } from "@/stores/rootStore";

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<RootStore>();
  if (!storeRef.current) {
    storeRef.current = createRootStore();
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }
  return store;
};
