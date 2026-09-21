import * as P from "./params";

export type SofaStyle = "existing" | "loveseat" | "sectional" | "chesterfield";
export type BedStyle = "existing" | "wood" | "upholstered";
export type RugStyle = "none" | "jute" | "persian" | "shag";
export type CurtainStyle = "none" | "linen" | "velvet";

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
}

export interface DesignStyles {
  accentWall: boolean;
  sofa: SofaStyle;
  bed: BedStyle;
  rug: RugStyle;
  curtains: CurtainStyle;
  plants: boolean;
  art: boolean;
}

export type ItemId =
  | "bed"
  | "sofa"
  | "table"
  | "rug"
  | "shelfBedside"
  | "shelfCorner"
  | "shelfWindow"
  | "shelfKitchen"
  | "plantWindow"
  | "plantCorner";

/** Centre position in room cm plus a rotation in degrees (clockwise in plan view). */
export interface Transform {
  x: number;
  y: number;
  rot: number;
}

export type Layout = Record<ItemId, Transform>;

export const ITEM_LABELS: Record<ItemId, string> = {
  bed: "Bed",
  sofa: "Sofa",
  table: "Round table",
  rug: "Rug",
  shelfBedside: "Bedside shelf",
  shelfCorner: "Corner shelf",
  shelfWindow: "Shelf by the window",
  shelfKitchen: "Shelf by the kitchen",
  plantWindow: "Tall plant",
  plantCorner: "Small plant",
};

/** The measured/real starting layout (centres, from the floor plan). */
export const DEFAULT_LAYOUT: Layout = {
  bed: { x: 300, y: 100, rot: 0 },
  sofa: { x: 105, y: 470, rot: 0 },
  table: { x: 135, y: 270, rot: 0 },
  rug: { x: 140, y: 300, rot: 0 },
  shelfBedside: { x: 213, y: 15, rot: 0 },
  shelfCorner: { x: 22, y: 19, rot: 0 },
  shelfWindow: { x: 22, y: 315, rot: 0 },
  shelfKitchen: { x: 22, y: 521, rot: 0 },
  plantWindow: { x: 78, y: 340, rot: 0 },
  plantCorner: { x: 55, y: 592, rot: 0 },
};

export const RUG_SIZES: Record<Exclude<RugStyle, "none">, [number, number]> = {
  jute: [200, 260],
  persian: [200, 290],
  shag: [180, 240],
};

/** Footprint in cm, before rotation. Depends on the chosen style for sofa/bed/rug. */
export function footprint(id: ItemId, styles: DesignStyles): [number, number] {
  switch (id) {
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
    case "plantWindow":
      return [56, 56];
    case "plantCorner":
      return [44, 44];
    default:
      return [P.SHELF_W, P.SHELF_D];
  }
}

/** The kitchen run is real and fixed: nothing may be dragged into it. */
const KITCHEN_ZONE = {
  x0: P.KITCHEN_X0 - 4,
  x1: P.ROOM_W,
  y0: P.ROOM_L - P.KITCHEN_D - 4,
  y1: P.ROOM_L,
};

/** Axis-aligned extent of a footprint once rotated. */
function rotatedExtent(w: number, d: number, rotDeg: number): [number, number] {
  const a = (rotDeg * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));
  return [w * c + d * s, w * s + d * c];
}

/** Keep an item inside the room and out of the kitchen run. Rugs may slide under things. */
export function clampTransform(id: ItemId, t: Transform, styles: DesignStyles): Transform {
  const [w, d] = footprint(id, styles);
  const [ew, ed] = rotatedExtent(w, d, t.rot);
  const halfW = ew / 2;
  const halfD = ed / 2;

  let x = Math.min(Math.max(t.x, halfW), P.ROOM_W - halfW);
  let y = Math.min(Math.max(t.y, halfD), P.ROOM_L - halfD);

  // push out of the kitchen zone along whichever axis needs the smaller move
  const overlapsX = x + halfW > KITCHEN_ZONE.x0 && x - halfW < KITCHEN_ZONE.x1;
  const overlapsY = y + halfD > KITCHEN_ZONE.y0 && y - halfD < KITCHEN_ZONE.y1;
  if (overlapsX && overlapsY && id !== "rug") {
    const pushY = KITCHEN_ZONE.y0 - (y + halfD);
    const pushX = KITCHEN_ZONE.x0 - (x + halfW);
    if (Math.abs(pushY) <= Math.abs(pushX)) y += pushY;
    else x += pushX;
    x = Math.min(Math.max(x, halfW), P.ROOM_W - halfW);
    y = Math.min(Math.max(y, halfD), P.ROOM_L - halfD);
  }

  // gentle snap flush to a wall
  const SNAP = 8;
  if (x - halfW < SNAP) x = halfW;
  if (P.ROOM_W - (x + halfW) < SNAP) x = P.ROOM_W - halfW;
  if (y - halfD < SNAP) y = halfD;
  if (P.ROOM_L - (y + halfD) < SNAP && !overlapsX) y = P.ROOM_L - halfD;

  return { x: Math.round(x), y: Math.round(y), rot: t.rot };
}
