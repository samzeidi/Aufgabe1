import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlacedProduct, RoomSettings, Unit } from "../types";

const DEFAULT_SETTINGS: RoomSettings = {
  dimensions: { width: 4, depth: 5, height: 2.5 },
  unit: "m",
  wallOpacity: 1,
  showCeiling: false,
  showGrid: true,
};

interface RoomStore {
  settings: RoomSettings;
  products: PlacedProduct[];
  setDimension: (key: keyof RoomSettings["dimensions"], value: number) => void;
  setUnit: (unit: Unit) => void;
  setWallOpacity: (value: number) => void;
  toggleCeiling: () => void;
  toggleGrid: () => void;
  reset: () => void;
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      products: [],
      setDimension: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            dimensions: { ...state.settings.dimensions, [key]: value },
          },
        })),
      setUnit: (unit) =>
        set((state) => ({ settings: { ...state.settings, unit } })),
      setWallOpacity: (value) =>
        set((state) => ({ settings: { ...state.settings, wallOpacity: value } })),
      toggleCeiling: () =>
        set((state) => ({
          settings: { ...state.settings, showCeiling: !state.settings.showCeiling },
        })),
      toggleGrid: () =>
        set((state) => ({
          settings: { ...state.settings, showGrid: !state.settings.showGrid },
        })),
      reset: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    { name: "room-planner-settings" },
  ),
);
