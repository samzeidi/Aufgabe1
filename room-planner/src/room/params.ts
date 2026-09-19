// All dimensions in centimeters, in the room coordinate system:
//   X: left→right across the 400 cm wall (window wall at X = 0)
//   Y: bed wall (Y = 0) → kitchen wall (Y = ROOM_L)
//   Z: floor (Z = 0) → ceiling (Z = ROOM_H)

// --- Measured (authoritative) ---
export const ROOM_W = 400;
export const ROOM_L = 624;
export const ROOM_H = 243;

export const WINDOW_W = 127;
export const WINDOW_H = 225;
export const BOTTOM_TO_WINDOW = 107;
export const BETWEEN_WINDOWS = 131;
export const TOP_TO_WINDOW = 132;

export const KITCHEN_OFFSET = 110;
export const KITCHEN_W = 285;
export const KITCHEN_D = 60;

export const RIGHT_WALL = 305;

export const BED_W = 140;
export const BED_L = 200;
export const TABLE_DIAMETER = 110;
export const SOFA_L = 150;
export const SHELF_W = 36;
export const SHELF_D = 30;

// --- Derived from the window wall sequence (bottom → kitchen) ---
export const WINDOW1_Y0 = BOTTOM_TO_WINDOW;
export const WINDOW1_Y1 = WINDOW1_Y0 + WINDOW_W;
export const WINDOW2_Y0 = WINDOW1_Y1 + BETWEEN_WINDOWS;
export const WINDOW2_Y1 = WINDOW2_Y0 + WINDOW_W;
export const WINDOW_WALL_TOTAL = WINDOW2_Y1 + TOP_TO_WINDOW;

export const WINDOW_SILL = 2;
export const WINDOW_TOP = WINDOW_SILL + WINDOW_H;

export const KITCHEN_X0 = KITCHEN_OFFSET;
export const KITCHEN_X1 = KITCHEN_OFFSET + KITCHEN_W;

// --- Architectural assumptions (no measurement available) ---
export const WALL_T = 14;
export const EXT_WALL_T = 20;
export const BASEBOARD_H = 5.5;
export const BASEBOARD_T = 1.2;

// Entrance / hallway nook (simplified; not a priority)
export const NOOK_X1 = 530;
export const NOOK_CEILING = 225;
export const RETURN_LEN = 55; // diagonal wall return beside the kitchen: (400,624) → (455,569)
export const BATH_DOOR_X0 = 425;
export const DOOR_W = 85;
export const DOOR_H = 200;
export const CORRIDOR_Y0 = 330;
export const CORRIDOR_W = 90;
export const CORRIDOR_LEN = 300;

// Kitchen build-up (estimated from photos)
export const COUNTER_H = 90;
export const COUNTER_T = 4;
export const COUNTER_D = 62;
export const PLINTH_H = 10;
export const FRONT_T = 2;
export const UPPER_Z0 = 145;
export const UPPER_Z1 = 212;
export const UPPER_D = 34;
export const TALL_UNIT_H = 228;
export const HOOD_Z0 = 150;
export const HOOD_H = 12;
export const HOOD_D = 50;
export const TILE_STRIP_Z = 122;

// Kitchen module widths, left → right, summing to KITCHEN_W
export const MOD_SINK = 60;
export const MOD_NICHE = 60;
export const MOD_OVEN = 60;
export const MOD_DRAWER = 45;
export const MOD_TALL = 60;

// Furniture (estimates unless noted)
export const BED_X0 = 230; // leaves ~30 cm to the right wall
export const BED_Y0 = 0;
export const BED_FRAME_H = 30;
export const MATTRESS_T = 18;
export const HEADBOARD_H = 85;

export const SOFA_X0 = 30;
export const SOFA_Y0 = 430;
export const SOFA_D = 80;
export const SOFA_H = 78;
export const SOFA_SEAT_H = 43;

export const TABLE_CX = 135;
export const TABLE_CY = 270;
export const TABLE_H = 75;

export const SHELF_BEDSIDE = { x: 195, y: 0, h: 75 };
export const SHELF_CORNER = { x: 4, y: 4, h: 75 };
export const SHELF_KITCHEN_SIDE = { x: 4, y: 506, h: 100 };
export const SHELF_BETWEEN_WINDOWS = { x: 4, y: 300, h: 100 };

export const PENDANT = { x: 300, y: 160, diameter: 42, centerZ: 208 };
export const KITCHEN_LIGHT = { x: 250, y: 470 };

export const BLIND_HOUSING = { h: 8, d: 8 };

// Exterior (for realistic views only)
export const BALCONY_D = 130;
export const BALCONY_SLAB_T = 18;
export const RAILING_H = 105;
export const FLOOR_LEVEL_ABOVE_GROUND = 900;
