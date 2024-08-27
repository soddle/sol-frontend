"use client";

import { ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import { createUIStore, UIStore } from "@/stores/uiStore";

export type UIStoreApi = ReturnType<typeof createUIStore>;

const UIStoreContext = createContext<UIStoreApi | null>(null);

export interface UIStoreProviderProps {
  children: ReactNode;
}

export const UIStoreProvider = ({ children }: UIStoreProviderProps) => {
  const storeRef = useRef<UIStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createUIStore();
  }

  return (
    <UIStoreContext.Provider value={storeRef.current}>
      {children}
    </UIStoreContext.Provider>
  );
};

export const useUIStore = <T,>(selector: (store: UIStore) => T): T => {
  const uiStoreContext = useContext(UIStoreContext);

  if (!uiStoreContext) {
    throw new Error(`useUIStore must be used within UIStoreProvider`);
  }

  return useStore(uiStoreContext, selector);
};
