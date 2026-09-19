import * as P from "./params";

export interface Check {
  label: string;
  expected: string;
  actual: string;
  ok: boolean;
}

function eq(label: string, actual: number, expected: number): Check {
  return { label, expected: `${expected}`, actual: `${actual}`, ok: actual === expected };
}

export function runChecks(): Check[] {
  const kitchenModules = P.MOD_SINK + P.MOD_NICHE + P.MOD_OVEN + P.MOD_DRAWER + P.MOD_TALL;
  return [
    eq("Room width", P.ROOM_W, 400),
    eq("Room length", P.ROOM_L, 624),
    eq("Ceiling height", P.ROOM_H, 243),
    eq("Window width", P.WINDOW_W, 127),
    eq("Window height", P.WINDOW_H, 225),
    {
      label: "Window wall sequence",
      expected: "107 / 127 / 131 / 127 / 132",
      actual: `${P.BOTTOM_TO_WINDOW} / ${P.WINDOW_W} / ${P.BETWEEN_WINDOWS} / ${P.WINDOW_W} / ${P.TOP_TO_WINDOW}`,
      ok:
        P.BOTTOM_TO_WINDOW === 107 &&
        P.BETWEEN_WINDOWS === 131 &&
        P.TOP_TO_WINDOW === 132,
    },
    eq("Window wall sum = room length", P.WINDOW_WALL_TOTAL, P.ROOM_L),
    eq("Kitchen length", P.KITCHEN_W, 285),
    eq("Kitchen starts from window wall", P.KITCHEN_OFFSET, 110),
    eq("Kitchen modules sum", kitchenModules, P.KITCHEN_W),
    {
      label: "Kitchen end vs room width",
      expected: "395 ≤ 400",
      actual: `${P.KITCHEN_X1} ≤ ${P.ROOM_W}`,
      ok: P.KITCHEN_X1 === 395 && P.KITCHEN_X1 <= P.ROOM_W,
    },
    {
      label: "Bed footprint",
      expected: "140 × 200",
      actual: `${P.BED_W} × ${P.BED_L}`,
      ok: P.BED_W === 140 && P.BED_L === 200,
    },
    eq("Table diameter", P.TABLE_DIAMETER, 110),
    eq("Sofa length", P.SOFA_L, 150),
    {
      label: "Shelf footprint",
      expected: "36 × 30",
      actual: `${P.SHELF_W} × ${P.SHELF_D}`,
      ok: P.SHELF_W === 36 && P.SHELF_D === 30,
    },
    eq("Right solid wall", P.RIGHT_WALL, 305),
    {
      label: "Wall above windows",
      expected: "18",
      actual: `${P.ROOM_H - P.WINDOW_TOP}`,
      ok: P.ROOM_H - P.WINDOW_TOP >= 14 && P.ROOM_H - P.WINDOW_TOP <= 18,
    },
  ];
}
