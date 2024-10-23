import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notificationsEnabled: boolean;
  fontSize: "small" | "medium" | "large";
  isLegendOpen: boolean;
}

interface UserPreferencesActions {
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
  setIsLegendOpen: (isLegendOpen: boolean) => void;
  setFontSize: (size: "small" | "medium" | "large") => void;
}

export type UserPreferencesStore = UserPreferences & UserPreferencesActions;

const initialState: UserPreferences = {
  theme: "light",
  language: "en",
  notificationsEnabled: true,
  fontSize: "medium",
  isLegendOpen: true,
};

export const useUserPreferencesStore = create(
  persist<UserPreferencesStore>(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      setFontSize: (fontSize) => set({ fontSize }),
      setIsLegendOpen: (isLegendOpen) => set({ isLegendOpen }),
    }),
    {
      name: "user-preferences",
      getStorage: () => localStorage,
    }
  )
);
