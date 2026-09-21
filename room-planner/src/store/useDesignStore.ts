import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_LAYOUT,
  clampTransform,
  type DesignColors,
  type DesignStyles,
  type ItemId,
  type Layout,
  type Transform,
} from "../room/design";
import { DEFAULT_TEMPLATE, DEFAULT_STYLES, templateById } from "../room/palettes";
import { DEFAULT_LAYOUT as LAYOUT } from "../room/design";

export interface DesignSnapshot {
  templateId: string;
  colors: DesignColors;
  styles: DesignStyles;
  layout: Layout;
}

interface DesignStore extends DesignSnapshot {
  selected: ItemId | null;
  /** nothing moves by accident: dragging only works once Move is switched on */
  moveMode: boolean;
  dragging: boolean;
  setMoveMode: (value: boolean) => void;
  applyTemplate: (id: string) => void;
  setColor: (key: keyof DesignColors, value: string) => void;
  setStyle: <K extends keyof DesignStyles>(key: K, value: DesignStyles[K]) => void;
  select: (id: ItemId | null) => void;
  setDragging: (value: boolean) => void;
  moveItem: (id: ItemId, x: number, y: number) => void;
  rotateItem: (id: ItemId, deltaDeg: number) => void;
  nudgeItem: (id: ItemId, dx: number, dy: number) => void;
  resetLayout: () => void;
  resetAll: () => void;
  load: (snapshot: DesignSnapshot) => void;
  snapshot: () => DesignSnapshot;
}

const INITIAL: DesignSnapshot = {
  templateId: DEFAULT_TEMPLATE.id,
  colors: DEFAULT_TEMPLATE.colors,
  styles: { ...DEFAULT_STYLES, ...DEFAULT_TEMPLATE.styles },
  layout: DEFAULT_LAYOUT,
};

/** Re-clamp everything, e.g. after a style change alters a footprint. */
function reclamp(layout: Layout, styles: DesignStyles): Layout {
  const next = {} as Layout;
  for (const key of Object.keys(layout) as ItemId[]) {
    next[key] = clampTransform(key, layout[key], styles);
  }
  return next;
}

export function encodeDesign(s: DesignSnapshot): string {
  const json = JSON.stringify(s);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeDesign(encoded: string): DesignSnapshot | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json) as DesignSnapshot;
    if (!parsed.colors || !parsed.styles || !parsed.layout) return null;
    return {
      templateId: parsed.templateId ?? "custom",
      colors: { ...INITIAL.colors, ...parsed.colors },
      styles: { ...INITIAL.styles, ...parsed.styles },
      layout: { ...DEFAULT_LAYOUT, ...parsed.layout },
    };
  } catch {
    return null;
  }
}

/** A shared design (#d=…) or a named look (?look=as-is) both win over what's saved locally. */
function fromUrl(): DesignSnapshot | null {
  if (typeof window === "undefined") return null;

  const match = /[#&]d=([A-Za-z0-9\-_]+)/.exec(window.location.hash);
  if (match) {
    const shared = decodeDesign(match[1]);
    if (shared) return shared;
  }

  const look = new URLSearchParams(window.location.search).get("look");
  const template = look ? templateById(look) : undefined;
  if (template) {
    return {
      templateId: template.id,
      colors: template.colors,
      styles: { ...DEFAULT_STYLES, ...template.styles },
      layout: LAYOUT,
    };
  }
  return null;
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      selected: null,
      moveMode: false,
      dragging: false,
      setMoveMode: (value) => set({ moveMode: value }),

      applyTemplate: (id) => {
        const template = templateById(id);
        if (!template) return;
        const styles = { ...DEFAULT_STYLES, ...template.styles };
        set((s) => ({
          templateId: template.id,
          colors: template.colors,
          styles,
          layout: reclamp(s.layout, styles),
        }));
      },

      setColor: (key, value) =>
        set((s) => ({ colors: { ...s.colors, [key]: value }, templateId: "custom" })),

      setStyle: (key, value) =>
        set((s) => {
          const styles = { ...s.styles, [key]: value };
          return { styles, layout: reclamp(s.layout, styles), templateId: "custom" };
        }),

      // picking something new always leaves move switched off
      select: (id) => set({ selected: id, moveMode: false }),
      setDragging: (value) => set({ dragging: value }),

      moveItem: (id, x, y) =>
        set((s) => ({
          layout: { ...s.layout, [id]: clampTransform(id, { ...s.layout[id], x, y }, s.styles) },
        })),

      rotateItem: (id, deltaDeg) =>
        set((s) => {
          const current = s.layout[id];
          const rot = (((current.rot + deltaDeg) % 360) + 360) % 360;
          return { layout: { ...s.layout, [id]: clampTransform(id, { ...current, rot }, s.styles) } };
        }),

      nudgeItem: (id, dx, dy) =>
        set((s) => {
          const current = s.layout[id];
          const next: Transform = { ...current, x: current.x + dx, y: current.y + dy };
          return { layout: { ...s.layout, [id]: clampTransform(id, next, s.styles) } };
        }),

      resetLayout: () => set((s) => ({ layout: reclamp(DEFAULT_LAYOUT, s.styles) })),
      resetAll: () => set({ ...INITIAL, selected: null, moveMode: false }),
      load: (snapshot) =>
        set({
          ...snapshot,
          layout: reclamp(snapshot.layout, snapshot.styles),
          selected: null,
          moveMode: false,
        }),
      snapshot: () => {
        const { templateId, colors, styles, layout } = get();
        return { templateId, colors, styles, layout };
      },
    }),
    {
      name: "room-planner-design",
      partialize: (s) => ({
        templateId: s.templateId,
        colors: s.colors,
        styles: s.styles,
        layout: s.layout,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<DesignSnapshot>;
        const shared = fromUrl();
        const source: DesignSnapshot = shared ?? {
          templateId: p.templateId ?? INITIAL.templateId,
          colors: { ...INITIAL.colors, ...(p.colors ?? {}) },
          styles: { ...INITIAL.styles, ...(p.styles ?? {}) },
          layout: { ...DEFAULT_LAYOUT, ...(p.layout ?? {}) },
        };
        return { ...current, ...source, layout: reclamp(source.layout, source.styles) };
      },
    },
  ),
);
