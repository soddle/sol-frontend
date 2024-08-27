import { createStore } from "zustand/vanilla";

export interface UIState {
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  theme: "light" | "dark";
  sidebarOpen: boolean;
  isLegendOpen: boolean;
}

export interface UIActions {
  setLoading: (isLoading: boolean) => void;
  setIsLegendOpen: (isLegendOpen: boolean) => void;
  setError: (error: string | null) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export type UIStore = UIState & UIActions;

export const createUIStore = (initState: Partial<UIStore> = {}) => {
  return createStore<UIStore>()((set) => ({
    isLoading: false,
    error: null,
    isModalOpen: false,
    modalContent: null,
    theme: "light",
    sidebarOpen: false,
    isLegendOpen: true,
    ...initState,
    setLoading: (isLoading) => set({ isLoading }),
    setIsLegendOpen: (isLegendOpen) => set({ isLegendOpen }),
    setError: (error) => set({ error }),
    openModal: (content) => set({ isModalOpen: true, modalContent: content }),
    closeModal: () => set({ isModalOpen: false, modalContent: null }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleTheme: () =>
      set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  }));
};
