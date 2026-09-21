import * as P from "./params";

export type SofaStyle = "existing" | "loveseat" | "sectional" | "chesterfield";
export type BedStyle = "existing" | "wood" | "upholstered";
export type RugStyle = "none" | "jute" | "persian" | "shag";
export type CurtainStyle = "none" | "linen" | "velvet";
/** stick-on splashback tiles; "original" is the real cream tiling */
export type BacksplashStyle = "original" | "plain" | "metro" | "zellige" | "checker" | "pattern";
/** the decorative border row on the splashback */
export type BorderRow = "keep" | "hide" | "band";

export interface DesignColors {
  wall: string;
  accentWall: string;
  ceiling: string;
  sofa: string;
  cushions: string;
  bedding: string;
  throwBlanket: string;
  rug: string;
  curtains: string;
  art: string;
  tile: string;
  tilePattern: string;
}

export interface DesignStyles {
  accentWall: boolean;
  sofa: SofaStyle;
  bed: BedStyle;
  rug: RugStyle;
  curtains: CurtainStyle;
  plants: boolean;
  art: boolean;
  backsplash: BacksplashStyle;
  borderRow: BorderRow;
}

/** What a placed object actually is. Several of one kind can exist at once. */
export type ItemKind =
  | "bed"
  | "sofa"
  | "table"
  | "rug"
  | "shelfLow"
  | "shelfTall"
  | "bookcase"
  | "cubeShelf"
  | "wallShelf";

export interface PlacedItem {
  kind: ItemKind;
  /** centre in room cm */
  x: number;
  y: number;
  /** rotation in degrees, clockwise in plan view */
  rot: number;
  /** wall shelves only: height of the board above the floor */
  z?: number;
  /** shelves only: 40, 60 or 80 cm wide (the four real ones are 36) */
  w?: number;
}

export type Layout = Record<string, PlacedItem>;

export const KIND_LABELS: Record<ItemKind, string> = {
  bed: "Bed",
  sofa: "Sofa",
  table: "Round table",
  rug: "Rug",
  shelfLow: "Small shelf",
  shelfTall: "Tall shelf",
  bookcase: "Bookcase",
  cubeShelf: "Cube shelf",
  wallShelf: "Wall shelf",
};

/** Kinds she can add herself, in the order they appear in the panel. */
export const ADDABLE: { kind: ItemKind; label: string; note: string }[] = [
  { kind: "wallShelf", label: "Wall shelf", note: "80 × 22 cm board" },
  { kind: "shelfLow", label: "Small shelf", note: "36 × 30 × 75 cm" },
  { kind: "shelfTall", label: "Tall shelf", note: "36 × 30 × 100 cm" },
  { kind: "bookcase", label: "Bookcase", note: "80 × 30 × 180 cm" },
  { kind: "cubeShelf", label: "Cube shelf", note: "77 × 39 × 77 cm" },
];

export const SHELF_KINDS: ItemKind[] = ["shelfLow", "shelfTall", "bookcase", "cubeShelf", "wallShelf"];
export const SHELF_WIDTHS = [40, 60, 80] as const;
export const DEFAULT_SHELF_WIDTH = 60;

export function isShelf(kind: ItemKind): boolean {
  return SHELF_KINDS.includes(kind);
}

/** Depth of each shelf kind, in cm. */
const SHELF_DEPTH: Partial<Record<ItemKind, number>> = {
  shelfLow: P.SHELF_D,
  shelfTall: P.SHELF_D,
  bookcase: 30,
  cubeShelf: 39,
  wallShelf: 22,
};

/** Height of a piece, for the shelf-style boxes. */
export const SHELF_HEIGHT: Partial<Record<ItemKind, number>> = {
  shelfLow: 75,
  shelfTall: 100,
  bookcase: 180,
  cubeShelf: 77,
  wallShelf: 4,
};

export function shelfWidth(item: PlacedItem): number {
  return item.w ?? DEFAULT_SHELF_WIDTH;
}

export const DEFAULT_WALL_SHELF_Z = 140;

/** The measured/real starting layout. */
export const DEFAULT_LAYOUT: Layout = {
  bed: { kind: "bed", x: 300, y: 100, rot: 0 },
  sofa: { kind: "sofa", x: 105, y: 470, rot: 0 },
  table: { kind: "table", x: 135, y: 270, rot: 0 },
  rug: { kind: "rug", x: 140, y: 300, rot: 0 },
  shelfBedside: { w: 36, kind: "shelfLow", x: 213, y: 15, rot: 0 },
  shelfCorner: { w: 36, kind: "shelfLow", x: 22, y: 19, rot: 0 },
  shelfWindow: { w: 36, kind: "shelfTall", x: 22, y: 315, rot: 0 },
  shelfKitchen: { w: 36, kind: "shelfTall", x: 22, y: 521, rot: 0 },
};

/**
 * Alternative arrangement: the bed slides left so a tall shelf fits against
 * the wall on its right, with a wall shelf above it. The trailing plants on
 * top then grow along that wall.
 */
export const SHELF_WALL_LAYOUT: Layout = {
  bed: { kind: "bed", x: 272, y: 100, rot: 0 },
  sofa: { kind: "sofa", x: 105, y: 470, rot: 0 },
  table: { kind: "table", x: 135, y: 270, rot: 0 },
  rug: { kind: "rug", x: 140, y: 300, rot: 0 },
  shelfBedside: { w: 36, kind: "shelfLow", x: 188, y: 15, rot: 0 },
  shelfCorner: { w: 36, kind: "shelfLow", x: 22, y: 19, rot: 0 },
  shelfWindow: { w: 36, kind: "shelfTall", x: 22, y: 315, rot: 0 },
  shelfKitchen: { w: 36, kind: "shelfTall", x: 22, y: 521, rot: 0 },
  shelfRight: { kind: "shelfTall", x: 385, y: 55, rot: 90 },
  shelfRightWall: { kind: "wallShelf", x: 389, y: 152, rot: 90, z: 146 },
};

export const RUG_SIZES: Record<Exclude<RugStyle, "none">, [number, number]> = {
  jute: [200, 260],
  persian: [200, 290],
  shag: [180, 240],
};

/** Footprint in cm before rotation. Sofa/bed/rug depend on the chosen style. */
export function footprint(item: PlacedItem, styles: DesignStyles): [number, number] {
  const kind = item.kind;
  if (isShelf(kind)) return [shelfWidth(item), SHELF_DEPTH[kind]!];
  switch (kind) {
    case "bed":
      return styles.bed === "upholstered" ? [150, 210] : [P.BED_W, P.BED_L];
    case "sofa":
      if (styles.sofa === "sectional") return [230, 160];
      if (styles.sofa === "chesterfield") return [170, 88];
      if (styles.sofa === "loveseat") return [150, 85];
      return [P.SOFA_L, P.SOFA_D];
    case "table":
      return [P.TABLE_DIAMETER, P.TABLE_DIAMETER];
    case "rug":
      return styles.rug === "none" ? [0, 0] : RUG_SIZES[styles.rug];
    default:
      return [60, 30];
  }
}

/** The kitchen run is real and fixed: nothing may be dragged into it. */
const KITCHEN_ZONE = {
  x0: P.KITCHEN_X0 - 4,
  x1: P.ROOM_W,
  y0: P.ROOM_L - P.KITCHEN_D - 4,
  y1: P.ROOM_L,
};

function rotatedExtent(w: number, d: number, rotDeg: number): [number, number] {
  const a = (rotDeg * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  return [w * c + d * s, w * s + d * c];
}

/** Keep an item inside the room and out of the kitchen run. Rugs slide under things. */
export function clampItem(item: PlacedItem, styles: DesignStyles): PlacedItem {
  const [w, d] = footprint(item, styles);
  const [ew, ed] = rotatedExtent(w, d, item.rot);
  const halfW = ew / 2;
  const halfD = ed / 2;

  let x = Math.min(Math.max(item.x, halfW), P.ROOM_W - halfW);
  let y = Math.min(Math.max(item.y, halfD), P.ROOM_L - halfD);

  const overlapsX = x + halfW > KITCHEN_ZONE.x0 && x - halfW < KITCHEN_ZONE.x1;
  const overlapsY = y + halfD > KITCHEN_ZONE.y0 && y - halfD < KITCHEN_ZONE.y1;
  // a wall shelf can hang above the worktop, a rug can slide under
  const blockedByKitchen = item.kind !== "rug" && !(item.kind === "wallShelf" && (item.z ?? 0) > P.COUNTER_H);
  if (overlapsX && overlapsY && blockedByKitchen) {
    const pushY = KITCHEN_ZONE.y0 - (y + halfD);
    const pushX = KITCHEN_ZONE.x0 - (x + halfW);
    if (Math.abs(pushY) <= Math.abs(pushX)) y += pushY;
    else x += pushX;
    x = Math.min(Math.max(x, halfW), P.ROOM_W - halfW);
    y = Math.min(Math.max(y, halfD), P.ROOM_L - halfD);
  }

  const SNAP = 8;
  if (x - halfW < SNAP) x = halfW;
  if (P.ROOM_W - (x + halfW) < SNAP) x = P.ROOM_W - halfW;
  if (y - halfD < SNAP) y = halfD;
  if (P.ROOM_L - (y + halfD) < SNAP && !overlapsX) y = P.ROOM_L - halfD;

  const z = item.kind === "wallShelf" ? Math.min(Math.max(item.z ?? DEFAULT_WALL_SHELF_Z, 40), P.ROOM_H - 20) : undefined;
  return { ...item, x: Math.round(x), y: Math.round(y), z };
}

/** A free-ish spot for something newly added, so it doesn't land inside the bed. */
export function findFreeSpot(probe: PlacedItem, layout: Layout, styles: DesignStyles): { x: number; y: number } {
  const [w, d] = footprint(probe, styles);
  const taken = Object.values(layout)
    .filter((it) => it.kind !== "rug")
    .map((it) => {
      const [iw, id] = footprint(it, styles);
      const [ew, ed] = rotatedExtent(iw, id, it.rot);
      return { x: it.x, y: it.y, hw: ew / 2, hd: ed / 2 };
    });

  const clear = (x: number, y: number) =>
    !taken.some((t) => Math.abs(t.x - x) < t.hw + w / 2 + 10 && Math.abs(t.y - y) < t.hd + d / 2 + 10);

  // walk the room on a coarse grid, preferring spots against a wall
  const candidates: { x: number; y: number; score: number }[] = [];
  for (let x = w / 2 + 5; x <= P.ROOM_W - w / 2 - 5; x += 20) {
    for (let y = d / 2 + 5; y <= P.ROOM_L - d / 2 - 5; y += 20) {
      if (!clear(x, y)) continue;
      const wallDist = Math.min(x - w / 2, P.ROOM_W - (x + w / 2), y - d / 2, P.ROOM_L - (y + d / 2));
      candidates.push({ x, y, score: wallDist });
    }
  }
  if (candidates.length === 0) return { x: P.ROOM_W / 2, y: P.ROOM_L / 2 };
  candidates.sort((a, b) => a.score - b.score);
  return { x: candidates[0].x, y: candidates[0].y };
}

/** Accepts the old fixed-id layout as well as the current one. */
export function migrateLayout(raw: unknown): Layout {
  if (!raw || typeof raw !== "object") return DEFAULT_LAYOUT;
  const legacyKinds: Record<string, ItemKind> = {
    bed: "bed",
    sofa: "sofa",
    table: "table",
    rug: "rug",
    shelfBedside: "shelfLow",
    shelfCorner: "shelfLow",
    shelfWindow: "shelfTall",
    shelfKitchen: "shelfTall",
  };
  const out: Layout = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    const v = value as Partial<PlacedItem> | null;
    if (!v || typeof v.x !== "number" || typeof v.y !== "number") continue;
    const kind = (v.kind ?? legacyKinds[id]) as ItemKind | undefined;
    if (!kind || !(kind in KIND_LABELS)) continue;
    out[id] = { kind, x: v.x, y: v.y, rot: typeof v.rot === "number" ? v.rot : 0, z: v.z, w: v.w };
  }
  return Object.keys(out).length ? out : DEFAULT_LAYOUT;
}

/**
 * Ready-made wall-shelf arrangements, offsets relative to a starting point on
 * a wall: dy runs along the wall, z is the height of each board.
 */
export const SHELF_PATTERNS: { id: string; label: string; note: string; boards: { dy: number; z: number; w: number }[] }[] = [
  {
    id: "zigzag",
    label: "Zigzag",
    note: "staggered left and right, climbing",
    boards: [
      { dy: -35, z: 110, w: 60 },
      { dy: 35, z: 150, w: 60 },
      { dy: -30, z: 190, w: 40 },
    ],
  },
  {
    id: "staircase",
    label: "Staircase",
    note: "stepping up in one direction",
    boards: [
      { dy: -45, z: 105, w: 40 },
      { dy: 10, z: 145, w: 60 },
      { dy: 70, z: 185, w: 40 },
    ],
  },
  {
    id: "column",
    label: "Stacked",
    note: "three in a straight column",
    boards: [
      { dy: 0, z: 105, w: 80 },
      { dy: 0, z: 150, w: 80 },
      { dy: 0, z: 195, w: 80 },
    ],
  },
  {
    id: "pair",
    label: "Pair",
    note: "two offset boards",
    boards: [
      { dy: -25, z: 120, w: 60 },
      { dy: 35, z: 165, w: 40 },
    ],
  },
];
