import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { PublicKey } from "@solana/web3.js";

interface PlayerState {
  walletPublicKey: PublicKey | null;
  balance: number;
}

interface PlayerActions {
  setWalletPublicKey: (publicKey: PublicKey | null) => void;
  setBalance: (balance: number) => void;
}

export const createPlayerStore = () =>
  create(
    persist(
      immer<PlayerState & PlayerActions>((set) => ({
        walletPublicKey: null,
        balance: 0,
        setWalletPublicKey: (publicKey) =>
          set((state) => {
            state.walletPublicKey = publicKey;
          }),
        setBalance: (balance) =>
          set((state) => {
            state.balance = balance;
          }),
      })),
      {
        name: "player-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
