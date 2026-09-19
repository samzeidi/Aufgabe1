import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lens, PlacedProduct, RoomSettings, Unit, ViewId } from "../types";

const DEFAULT_SETTINGS: RoomSettings = {
  unit: "m",
  wallOpacity: 1,
  showCeiling: true,
  showDimensions: false,
  showExterior: true,
  lens: 24,
};

const VIEW_IDS: ViewId[] = ["overview", "top", "kitchen", "bed", "table", "kitchenAlong"];

function initialView(): ViewId {
  if (typeof window === "undefined") return "kitchen";
  const v = new URLSearchParams(window.location.search).get("view");
  return VIEW_IDS.includes(v as ViewId) ? (v as ViewId) : "kitchen";
}

interface RoomStore {
  settings: RoomSettings;
  view: ViewId;
  products: PlacedProduct[];
  setView: (view: ViewId) => void;
  setUnit: (unit: Unit) => void;
  setLens: (lens: Lens) => void;
  setWallOpacity: (value: number) => void;
  toggle: (key: "showCeiling" | "showDimensions" | "showExterior") => void;
  reset: () => void;
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      view: initialView(),
      products: [],
      setView: (view) => set({ view }),
      setUnit: (unit) => set((s) => ({ settings: { ...s.settings, unit } })),
      setLens: (lens) => set((s) => ({ settings: { ...s.settings, lens } })),
      setWallOpacity: (value) =>
        set((s) => ({ settings: { ...s.settings, wallOpacity: value } })),
      toggle: (key) =>
        set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),
      reset: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: "room-planner-v2",
      partialize: (s) => ({ settings: s.settings, products: s.products }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<RoomStore>;
        return {
          ...current,
          ...p,
          settings: { ...DEFAULT_SETTINGS, ...(p.settings ?? {}) },
          // a ?view= URL parameter always wins over the persisted view
          view: current.view,
        };
      },
    },
  ),
);
