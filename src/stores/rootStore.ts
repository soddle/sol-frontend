import { createGameStore } from "./gameStore";
import { createPlayerStore } from "./playerStore";
import { createUIStore } from "./uiStore";

export const createRootStore = () => ({
  game: createGameStore(),
  player: createPlayerStore(),
  ui: createUIStore(),
});

export type RootStore = ReturnType<typeof createRootStore>;
