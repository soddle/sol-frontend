import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UIState {
  isLoading: boolean;
  error: string | null;
  isPopupOpen: boolean;
  ModalComponent: React.ReactNode | null;
  sidebarOpen: boolean;
  isLegendOpen: boolean;
  announcement: {
    message: string;
    isVisible: boolean;
  };
}

interface UIActions {
  setLoading: (isLoading: boolean) => void;
  setIsLegendOpen: (isLegendOpen: boolean) => void;
  setError: (error: string | null) => void;
  showAnnouncement: (message: string) => void;
  hideAnnouncement: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
}

export type UiStore = UIState & UIActions;

const initialState: UIState = {
  isLoading: false,
  error: null,
  isPopupOpen: false,
  ModalComponent: null,
  sidebarOpen: false,
  isLegendOpen: true,
  announcement: {
    message: "",
    isVisible: false,
  },
};

export const useUiStore = create<UiStore>()(
  immer((set) => ({
    ...initialState,
    showAnnouncement: (message) =>
      set((state) => {
        state.announcement.message = message;
        state.announcement.isVisible = true;
      }),
    hideAnnouncement: () =>
      set((state) => {
        state.announcement.isVisible = false;
      }),
    setLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),
    setIsLegendOpen: (isLegendOpen) =>
      set((state) => {
        state.isLegendOpen = isLegendOpen;
      }),
    setError: (error) =>
      set((state) => {
        state.error = error;
      }),
    openModal: (content) =>
      set((state) => {
        state.isPopupOpen = true;
        state.ModalComponent = content;
      }),
    closeModal: () =>
      set((state) => {
        state.isPopupOpen = false;
        state.ModalComponent = null;
      }),
    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),
  }))
);
