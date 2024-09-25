"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type UIStore, createUiStore } from "@/stores/userInterfaceStore";
// import { type AuthStore, createAuthStore } from "@/stores/authStore";
// import {
//   type SettingsStore,
//   createSettingsStore,
// } from "@/stores/settingsStore";

export type UIStoreApi = ReturnType<typeof createUiStore>;
// export type AuthStoreApi = ReturnType<typeof createAuthStore>;
// export type SettingsStoreApi = ReturnType<typeof createSettingsStore>;

export const UIStoreContext = createContext<UIStoreApi | undefined>(undefined);
// export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
//   undefined
// );
// export const SettingsStoreContext = createContext<SettingsStoreApi | undefined>(
//   undefined
// );

export interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const uiStoreRef = useRef<UIStoreApi>();
  // const authStoreRef = useRef<AuthStoreApi>();
  // const settingsStoreRef = useRef<SettingsStoreApi>();

  if (!uiStoreRef.current) {
    uiStoreRef.current = createUiStore();
  }
  // if (!authStoreRef.current) {
  //   authStoreRef.current = createAuthStore();
  // }
  // if (!settingsStoreRef.current) {
  //   settingsStoreRef.current = createSettingsStore();
  // }

  return (
    <UIStoreContext.Provider value={uiStoreRef.current}>
      {/* <AuthStoreContext.Provider value={authStoreRef.current}>
        <SettingsStoreContext.Provider value={settingsStoreRef.current}>
          {children} */}
      {/* </SettingsStoreContext.Provider>
      </AuthStoreContext.Provider> */}
    </UIStoreContext.Provider>
  );
};

export const useUIStore = <T,>(selector: (store: UIStore) => T): T => {
  const uiStoreContext = useContext(UIStoreContext);

  if (!uiStoreContext) {
    throw new Error(`useUIStore must be used within StoreProvider`);
  }

  return useStore(uiStoreContext, selector);
};

// export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
//   const authStoreContext = useContext(AuthStoreContext);

//   if (!authStoreContext) {
//     throw new Error(`useAuthStore must be used within StoreProvider`);
//   }

//   return useStore(authStoreContext, selector);
// };

// export const useSettingsStore = <T,>(
//   selector: (store: SettingsStore) => T
// ): T => {
//   const settingsStoreContext = useContext(SettingsStoreContext);

//   if (!settingsStoreContext) {
//     throw new Error(`useSettingsStore must be used within StoreProvider`);
//   }

//   return useStore(settingsStoreContext, selector);
// };
