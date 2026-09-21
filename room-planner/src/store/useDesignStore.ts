import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_LAYOUT,
  DEFAULT_SHELF_WIDTH,
  DEFAULT_WALL_SHELF_Z,
  clampItem,
  findFreeSpot,
  migrateLayout,
  isShelf,
  SHELF_PATTERNS,
  type DesignColors,
  type DesignStyles,
  type ItemKind,
  type Layout,
  type PlacedItem,
} from "../room/design";
import { DEFAULT_TEMPLATE, DEFAULT_STYLES, templateById } from "../room/palettes";

export interface DesignSnapshot {
  templateId: string;
  colors: DesignColors;
  styles: DesignStyles;
  layout: Layout;
}

interface DesignStore extends DesignSnapshot {
  selected: string | null;
  /** nothing moves by accident: dragging only works once Move is switched on */
  moveMode: boolean;
  dragging: boolean;
  setMoveMode: (value: boolean) => void;
  applyTemplate: (id: string) => void;
  setColor: (key: keyof DesignColors, value: string) => void;
  setStyle: <K extends keyof DesignStyles>(key: K, value: DesignStyles[K]) => void;
  select: (id: string | null) => void;
  setDragging: (value: boolean) => void;
  moveItem: (id: string, x: number, y: number) => void;
  rotateItem: (id: string, deltaDeg: number) => void;
  nudgeItem: (id: string, dx: number, dy: number) => void;
  setItemWidth: (id: string, w: number) => void;
  setItemHeight: (id: string, z: number) => void;
  addItem: (kind: ItemKind) => void;
  addShelfPattern: (patternId: string) => void;
  removeItem: (id: string) => void;
  resetLayout: () => void;
  resetAll: () => void;
  snapshot: () => DesignSnapshot;
}

const INITIAL: DesignSnapshot = {
  templateId: DEFAULT_TEMPLATE.id,
  colors: DEFAULT_TEMPLATE.colors,
  styles: { ...DEFAULT_STYLES, ...DEFAULT_TEMPLATE.styles },
  layout: DEFAULT_TEMPLATE.layout ?? DEFAULT_LAYOUT,
};

/** Re-clamp everything, e.g. after a style change alters a footprint. */
function reclamp(layout: Layout, styles: DesignStyles): Layout {
  const next: Layout = {};
  for (const [id, item] of Object.entries(layout)) next[id] = clampItem(item, styles);
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
    const parsed = JSON.parse(decodeURIComponent(escape(atob(b64)))) as Partial<DesignSnapshot>;
    if (!parsed.colors || !parsed.styles) return null;
    return {
      templateId: parsed.templateId ?? "custom",
      colors: { ...INITIAL.colors, ...parsed.colors },
      styles: { ...INITIAL.styles, ...parsed.styles },
      layout: migrateLayout(parsed.layout),
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
      styles: template.styles,
      layout: template.layout ?? DEFAULT_LAYOUT,
    };
  }
  return null;
}

function newId(kind: ItemKind, layout: Layout): string {
  let i = 1;
  while (layout[`${kind}-${i}`]) i += 1;
  return `${kind}-${i}`;
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
        set((s) => ({
          templateId: template.id,
          colors: template.colors,
          styles: template.styles,
          // a look that comes with an arrangement rearranges the room too
          layout: reclamp(template.layout ?? s.layout, template.styles),
          selected: null,
          moveMode: false,
        }));
      },

      setColor: (key, value) =>
        set((s) => ({ colors: { ...s.colors, [key]: value }, templateId: "custom" })),

      setStyle: (key, value) =>
        set((s) => {
          const styles = { ...s.styles, [key]: value };
          return { styles, layout: reclamp(s.layout, styles), templateId: "custom" };
        }),

      select: (id) => set({ selected: id, moveMode: false }),
      setDragging: (value) => set({ dragging: value }),

      moveItem: (id, x, y) =>
        set((s) => {
          const item = s.layout[id];
          if (!item) return {};
          return { layout: { ...s.layout, [id]: clampItem({ ...item, x, y }, s.styles) } };
        }),

      rotateItem: (id, deltaDeg) =>
        set((s) => {
          const item = s.layout[id];
          if (!item) return {};
          const rot = (((item.rot + deltaDeg) % 360) + 360) % 360;
          return { layout: { ...s.layout, [id]: clampItem({ ...item, rot }, s.styles) } };
        }),

      nudgeItem: (id, dx, dy) =>
        set((s) => {
          const item = s.layout[id];
          if (!item) return {};
          return {
            layout: { ...s.layout, [id]: clampItem({ ...item, x: item.x + dx, y: item.y + dy }, s.styles) },
          };
        }),

      setItemWidth: (id, w) =>
        set((s) => {
          const item = s.layout[id];
          if (!item || !isShelf(item.kind)) return {};
          return { layout: { ...s.layout, [id]: clampItem({ ...item, w }, s.styles) }, templateId: "custom" };
        }),

      setItemHeight: (id, z) =>
        set((s) => {
          const item = s.layout[id];
          if (!item || item.kind !== "wallShelf") return {};
          return { layout: { ...s.layout, [id]: clampItem({ ...item, z }, s.styles) } };
        }),

      addItem: (kind) =>
        set((s) => {
          const probe: PlacedItem = {
            kind,
            x: 0,
            y: 0,
            rot: 0,
            w: isShelf(kind) ? DEFAULT_SHELF_WIDTH : undefined,
            z: kind === "wallShelf" ? DEFAULT_WALL_SHELF_Z : undefined,
          };
          const spot = findFreeSpot(probe, s.layout, s.styles);
          const id = newId(kind, s.layout);
          return {
            layout: { ...s.layout, [id]: clampItem({ ...probe, ...spot }, s.styles) },
            selected: id,
            // ready to be dragged straight into place
            moveMode: true,
            templateId: "custom",
          };
        }),

      /** Adds a group of wall shelves on the wall to the right of the bed. */
      addShelfPattern: (patternId) =>
        set((s) => {
          const pattern = SHELF_PATTERNS.find((p) => p.id === patternId);
          if (!pattern) return {};
          const layout = { ...s.layout };
          let firstId: string | null = null;
          pattern.boards.forEach((board, i) => {
            const id = `wallShelf-p${Date.now().toString(36)}-${i}`;
            if (!firstId) firstId = id;
            layout[id] = clampItem(
              { kind: "wallShelf", x: 389, y: 150 + board.dy, rot: 90, z: board.z, w: board.w },
              s.styles,
            );
          });
          return { layout, selected: firstId, moveMode: false, templateId: "custom" };
        }),

      removeItem: (id) =>
        set((s) => {
          const layout = { ...s.layout };
          delete layout[id];
          return { layout, selected: null, moveMode: false, templateId: "custom" };
        }),

      resetLayout: () =>
        set((s) => ({
          layout: reclamp(templateById(s.templateId)?.layout ?? DEFAULT_LAYOUT, s.styles),
          selected: null,
          moveMode: false,
        })),
      resetAll: () => set({ ...INITIAL, selected: null, moveMode: false }),
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
          layout: p.layout ? migrateLayout(p.layout) : INITIAL.layout,
        };
        return { ...current, ...source, layout: reclamp(source.layout, source.styles) };
      },
    },
  ),
);
