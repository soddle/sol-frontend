import { createStore } from "zustand/vanilla";
import React from "react";

export interface ModalProps {
  onClose: () => void;
  [key: string]: unknown;
}

interface ModalConfig {
  component: React.ComponentType<ModalProps & { [key: string]: any }>;
  props?: Omit<ModalProps, "onClose">;
}

interface UIState {
  isSidebarOpen: boolean;
  activeModal: ModalConfig | null;
  isLoading: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  setLoading: (isLoading: boolean) => void;
}

export type UIStore = UIState & UIActions;

export const initialState: UIState = {
  isSidebarOpen: true,
  activeModal: null,
  isLoading: false,
};

export const createUiStore = (initState: UIState = initialState) => {
  return createStore<UIStore>()((set) => ({
    ...initState,
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (config: ModalConfig) => set({ activeModal: config }),
    closeModal: () => set({ activeModal: null }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
  }));
};
