import { Block } from "./Block";
import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import * as P from "../../room/params";

const GAP = 0.3; // door gap, cm
const BEVEL = 0.25;

const X_SINK = P.KITCHEN_X0;
const X_NICHE = X_SINK + P.MOD_SINK;
const X_OVEN = X_NICHE + P.MOD_NICHE;
const X_DRAWER = X_OVEN + P.MOD_OVEN;
const X_TALL = X_DRAWER + P.MOD_DRAWER;
const X_END = X_TALL + P.MOD_TALL;

const WALL_Y = P.ROOM_L;
const BASE_Y0 = WALL_Y - P.KITCHEN_D;
const FRONT_Y0 = BASE_Y0 - P.FRONT_T;
const BASE_Z0 = P.PLINTH_H;
const BASE_Z1 = P.COUNTER_H - P.COUNTER_T;

/** Curved brushed-silver bow handle. Vertical or horizontal, 12 cm. */
function Handle({
  x,
  z,
  y,
  vertical,
}: {
  x: number;
  z: number;
  /** front face Y the handle is mounted on */
  y: number;
  vertical: boolean;
}) {
  const mats = useMaterials();
  const len = 12;
  const stand = 3;
  if (vertical) {
    return (
      <group>
        <Block min={[x - 0.6, y - stand - 1.1, z]} size={[1.2, 1.1, len]} material={mats.handle} radius={0.5} castShadow={false} />
        <Block min={[x - 0.5, y - stand, z + 1]} size={[1, stand, 1]} material={mats.handle} castShadow={false} />
        <Block min={[x - 0.5, y - stand, z + len - 2]} size={[1, stand, 1]} material={mats.handle} castShadow={false} />
      </group>
    );
  }
  return (
    <group>
      <Block min={[x, y - stand - 1.1, z - 0.6]} size={[len, 1.1, 1.2]} material={mats.handle} radius={0.5} castShadow={false} />
      <Block min={[x + 1, y - stand, z - 0.5]} size={[1, stand, 1]} material={mats.handle} castShadow={false} />
      <Block min={[x + len - 2, y - stand, z - 0.5]} size={[1, stand, 1]} material={mats.handle} castShadow={false} />
    </group>
  );
}

/** Cabinet front with a shallow framed/recessed field. */
function Door({
  x0,
  x1,
  z0,
  z1,
  y,
}: {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
  /** Y of the front face plane the door is mounted on */
  y: number;
}) {
  const mats = useMaterials();
  const f = 6; // frame width of the door's raised border
  return (
    <group>
      <Block min={[x0 + GAP, y - P.FRONT_T, z0 + GAP]} size={[x1 - x0 - 2 * GAP, P.FRONT_T, z1 - z0 - 2 * GAP]} material={mats.cabinet} radius={BEVEL} />
      {/* recessed center field, 4 mm back */}
      <Block
        min={[x0 + f, y - P.FRONT_T - 0.4, z0 + f]}
        size={[x1 - x0 - 2 * f, 0.4, z1 - z0 - 2 * f]}
        material={mats.cabinetField}
        castShadow={false}
      />
    </group>
  );
}

function Sink() {
  const mats = useMaterials();
  const plateX0 = 114;
  const plateX1 = 204;
  const plateY0 = 570;
  const plateY1 = 620;
  const bx0 = 120;
  const bx1 = 160;
  const by0 = 578;
  const by1 = 614;
  const top = P.COUNTER_H;
  const depth = 15;
  const t = 0.6;
  return (
    <group>
      {/* sink plate around the basin */}
      <Block min={[plateX0, plateY0, top]} size={[bx0 - plateX0, plateY1 - plateY0, 0.8]} material={mats.steel} />
      <Block min={[bx1, plateY0, top]} size={[plateX1 - bx1, plateY1 - plateY0, 0.8]} material={mats.steel} />
      <Block min={[bx0, plateY0, top]} size={[bx1 - bx0, by0 - plateY0, 0.8]} material={mats.steel} />
      <Block min={[bx0, by1, top]} size={[bx1 - bx0, plateY1 - by1, 0.8]} material={mats.steel} />
      {/* basin walls + bottom */}
      <Block min={[bx0, by0, top - depth]} size={[t, by1 - by0, depth + 0.8]} material={mats.steel} />
      <Block min={[bx1 - t, by0, top - depth]} size={[t, by1 - by0, depth + 0.8]} material={mats.steel} />
      <Block min={[bx0, by0, top - depth]} size={[bx1 - bx0, t, depth + 0.8]} material={mats.steel} />
      <Block min={[bx0, by1 - t, top - depth]} size={[bx1 - bx0, t, depth + 0.8]} material={mats.steel} />
      <Block min={[bx0, by0, top - depth]} size={[bx1 - bx0, by1 - by0, t]} material={mats.steel} />
      {/* draining grooves */}
      {[168, 176, 184, 192].map((x) => (
        <Block key={x} min={[x, 582, top + 0.8]} size={[1, 30, 0.3]} material={mats.steelBrushed} castShadow={false} />
      ))}
      {/* faucet */}
      <mesh position={toWorld(140, 617, top + 14)} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.018, 0.02, 0.28, 16]} />
      </mesh>
      <mesh position={toWorld(140, 607, top + 28)} rotation={[Math.PI / 2, 0, 0]} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 12]} />
      </mesh>
      <mesh position={toWorld(140, 597, top + 24.5)} material={mats.steel} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.07, 12]} />
      </mesh>
      <Block min={[144, 615, top + 24]} size={[5, 3, 1.4]} material={mats.steel} radius={0.5} castShadow={false} />
    </group>
  );
}

function Countertop() {
  const mats = useMaterials();
  const y0 = WALL_Y - P.COUNTER_D;
  const z0 = P.COUNTER_H - P.COUNTER_T;
  const bx0 = 120;
  const bx1 = 160;
  const by0 = 578;
  const by1 = 614;
  return (
    <group>
      <Block min={[X_SINK, y0, z0]} size={[bx0 - X_SINK, P.COUNTER_D, P.COUNTER_T]} material={mats.counter} radius={0.3} />
      <Block min={[bx1, y0, z0]} size={[X_TALL - bx1, P.COUNTER_D, P.COUNTER_T]} material={mats.counter} radius={0.3} />
      <Block min={[bx0, y0, z0]} size={[bx1 - bx0, by0 - y0, P.COUNTER_T]} material={mats.counter} />
      <Block min={[bx0, by1, z0]} size={[bx1 - bx0, WALL_Y - by1, P.COUNTER_T]} material={mats.counter} />
    </group>
  );
}

function Oven() {
  const mats = useMaterials();
  const x0 = X_OVEN;
  const x1 = X_DRAWER;
  const z0 = 26;
  const z1 = BASE_Z1;
  const y = FRONT_Y0;
  return (
    <group>
      {/* lower wood panel */}
      <Door x0={x0} x1={x1} z0={BASE_Z0} z1={z0} y={BASE_Y0} />
      {/* stainless front */}
      <Block min={[x0 + 0.5, y, z0]} size={[x1 - x0 - 1, P.FRONT_T, z1 - z0]} material={mats.steel} radius={BEVEL} />
      {/* black glass door window */}
      <Block min={[x0 + 6, y - 0.4, z0 + 5]} size={[x1 - x0 - 12, 0.4, 28]} material={mats.ovenGlass} castShadow={false} />
      {/* control panel */}
      <Block min={[x0 + 2, y - 0.3, z1 - 12]} size={[x1 - x0 - 4, 0.3, 10]} material={mats.steelBrushed} castShadow={false} />
      <Block min={[x0 + 25, y - 0.6, z1 - 9]} size={[10, 0.3, 4]} material={mats.ovenGlass} castShadow={false} />
      {[x0 + 8, x0 + 16, x0 + 44, x0 + 52].map((kx) => (
        <mesh key={kx} position={toWorld(kx, y - 1.2, z1 - 7)} rotation={[Math.PI / 2, 0, 0]} material={mats.steel} castShadow={false}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
        </mesh>
      ))}
      {/* door handle bar */}
      <Block min={[x0 + 4, y - 4.5, z1 - 17]} size={[x1 - x0 - 8, 1.4, 1.4]} material={mats.steel} radius={0.6} castShadow={false} />
      <Block min={[x0 + 5, y - 3.2, z1 - 16.8]} size={[1.2, 3.2, 1]} material={mats.steel} castShadow={false} />
      <Block min={[x1 - 6.2, y - 3.2, z1 - 16.8]} size={[1.2, 3.2, 1]} material={mats.steel} castShadow={false} />
    </group>
  );
}

function Cooktop() {
  const mats = useMaterials();
  return <Block min={[X_OVEN + 1, WALL_Y - 58, P.COUNTER_H]} size={[P.MOD_OVEN - 2, 51, 1]} material={mats.cooktop} radius={0.3} castShadow={false} />;
}

function Hood() {
  const mats = useMaterials();
  const x0 = X_OVEN;
  const x1 = X_DRAWER;
  const y0 = WALL_Y - P.HOOD_D;
  const z0 = P.HOOD_Z0;
  const z1 = z0 + P.HOOD_H;
  const cabZ1 = P.UPPER_Z1;
  const cabY0 = WALL_Y - P.UPPER_D;
  return (
    <group>
      {/* extractor body */}
      <Block min={[x0 + 1, y0, z0]} size={[x1 - x0 - 2, P.HOOD_D, P.HOOD_H]} material={mats.steelBrushed} radius={0.4} />
      <Block min={[x0 + 6, y0 + 4, z0 - 0.5]} size={[x1 - x0 - 12, P.HOOD_D - 10, 0.5]} material={mats.black} castShadow={false} />
      <Block min={[x0 + 4, y0 + 1, z0 + 2]} size={[6, 0.6, 3]} material={mats.black} castShadow={false} />
      {/* frosted-front cabinet above the hood */}
      <Block min={[x0, cabY0, z1]} size={[x1 - x0, P.UPPER_D, cabZ1 - z1]} material={mats.cabinetCarcass} />
      <Block min={[x0 + GAP, cabY0 - 2, z1 + GAP]} size={[2, 2, cabZ1 - z1 - 2 * GAP]} material={mats.steelBrushed} />
      <Block min={[x1 - 2 - GAP, cabY0 - 2, z1 + GAP]} size={[2, 2, cabZ1 - z1 - 2 * GAP]} material={mats.steelBrushed} />
      <Block min={[x0 + GAP, cabY0 - 2, cabZ1 - 2 - GAP]} size={[x1 - x0 - 2 * GAP, 2, 2]} material={mats.steelBrushed} />
      <Block min={[x0 + GAP, cabY0 - 2, z1 + GAP]} size={[x1 - x0 - 2 * GAP, 2, 2]} material={mats.steelBrushed} />
      <Block min={[x0 + 2, cabY0 - 1.5, z1 + 2]} size={[x1 - x0 - 4, 0.8, cabZ1 - z1 - 4]} material={mats.frosted} castShadow={false} />
    </group>
  );
}

function UpperCabinets() {
  const mats = useMaterials();
  const y0 = WALL_Y - P.UPPER_D;
  const z0 = P.UPPER_Z0;
  const z1 = P.UPPER_Z1;
  return (
    <group>
      <Block min={[X_SINK, y0, z0]} size={[X_OVEN - X_SINK, P.UPPER_D, z1 - z0]} material={mats.cabinetCarcass} />
      <Block min={[X_DRAWER, y0, z0]} size={[X_TALL - X_DRAWER, P.UPPER_D, z1 - z0]} material={mats.cabinetCarcass} />
      <Door x0={X_SINK} x1={X_NICHE} z0={z0} z1={z1} y={y0} />
      <Door x0={X_NICHE} x1={X_OVEN} z0={z0} z1={z1} y={y0} />
      <Door x0={X_DRAWER} x1={X_TALL} z0={z0} z1={z1} y={y0} />
      <Handle x={X_NICHE - 5} z={z0 + 5} y={y0 - P.FRONT_T} vertical />
      <Handle x={X_NICHE + 5} z={z0 + 5} y={y0 - P.FRONT_T} vertical />
      <Handle x={X_DRAWER + 5} z={z0 + 5} y={y0 - P.FRONT_T} vertical />
    </group>
  );
}

function BaseCabinets() {
  const mats = useMaterials();
  return (
    <group>
      {/* plinth, recessed 3 cm */}
      <Block min={[X_SINK, BASE_Y0 + 3, 0]} size={[X_TALL - X_SINK, P.KITCHEN_D - 3, P.PLINTH_H]} material={mats.plinth} />
      {/* carcasses */}
      <Block min={[X_SINK, BASE_Y0, BASE_Z0]} size={[P.MOD_SINK, P.KITCHEN_D, BASE_Z1 - BASE_Z0]} material={mats.cabinetCarcass} />
      <Block min={[X_DRAWER, BASE_Y0, BASE_Z0]} size={[P.MOD_DRAWER, P.KITCHEN_D, BASE_Z1 - BASE_Z0]} material={mats.cabinetCarcass} />
      {/* open niche: dark recess with the counter above */}
      <Block min={[X_NICHE, WALL_Y - 26, BASE_Z0]} size={[P.MOD_NICHE, 26, BASE_Z1 - BASE_Z0]} material={mats.nicheInterior} />
      <Block min={[X_NICHE, BASE_Y0, BASE_Z0]} size={[P.MOD_NICHE, P.KITCHEN_D, 1.6]} material={mats.cabinetCarcass} />
      <mesh position={toWorld(X_NICHE + 24, WALL_Y - 30, 45)} rotation={[0, 0, 0.5]} material={mats.steelBrushed} castShadow={false}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
      </mesh>
      {/* oven module: appliance sits between carcasses */}
      <Block min={[X_OVEN, BASE_Y0, BASE_Z0]} size={[P.MOD_OVEN, P.KITCHEN_D, BASE_Z1 - BASE_Z0]} material={mats.cabinetCarcass} />

      {/* fronts */}
      <Door x0={X_SINK} x1={X_NICHE} z0={BASE_Z0} z1={BASE_Z1} y={BASE_Y0} />
      <Handle x={X_NICHE - 5} z={BASE_Z1 - 17} y={FRONT_Y0} vertical />
      <Door x0={X_DRAWER} x1={X_TALL} z0={BASE_Z0} z1={64} y={BASE_Y0} />
      <Handle x={X_DRAWER + 5} z={64 - 17} y={FRONT_Y0} vertical />
      <Door x0={X_DRAWER} x1={X_TALL} z0={64} z1={BASE_Z1} y={BASE_Y0} />
      <Handle x={X_DRAWER + P.MOD_DRAWER / 2 - 6} z={(64 + BASE_Z1) / 2} y={FRONT_Y0} vertical={false} />
      <Oven />
    </group>
  );
}

function TallUnit() {
  const mats = useMaterials();
  const x0 = X_TALL;
  const x1 = X_END;
  const split = 88;
  return (
    <group>
      <Block min={[x0, BASE_Y0 + 3, 0]} size={[x1 - x0, P.KITCHEN_D - 3, P.PLINTH_H]} material={mats.plinth} />
      <Block min={[x0, BASE_Y0, P.PLINTH_H]} size={[x1 - x0, P.KITCHEN_D, P.TALL_UNIT_H - P.PLINTH_H]} material={mats.cabinetCarcass} />
      <Door x0={x0} x1={x1} z0={P.PLINTH_H} z1={split} y={BASE_Y0} />
      <Door x0={x0} x1={x1} z0={split} z1={P.TALL_UNIT_H} y={BASE_Y0} />
      <Handle x={x0 + 5} z={split - 17} y={FRONT_Y0} vertical />
      <Handle x={x0 + 5} z={split + 5} y={FRONT_Y0} vertical />
    </group>
  );
}

function Backsplash() {
  const mats = useMaterials();
  const z0 = P.COUNTER_H;
  const z1 = P.UPPER_Z0;
  return (
    <group>
      <mesh
        position={toWorld((X_SINK + X_TALL) / 2, WALL_Y - 0.4, (z0 + z1) / 2)}
        material={mats.tile}
        receiveShadow
      >
        <planeGeometry args={[(X_TALL - X_SINK) / 100, (z1 - z0) / 100]} />
      </mesh>
      <mesh position={toWorld((X_SINK + X_TALL) / 2, WALL_Y - 0.7, P.TILE_STRIP_Z + 2.5)} material={mats.tileStrip} receiveShadow>
        <planeGeometry args={[(X_TALL - X_SINK) / 100, 0.05]} />
      </mesh>
    </group>
  );
}

export function Kitchen() {
  return (
    <group>
      <BaseCabinets />
      <Countertop />
      <Sink />
      <Cooktop />
      <Backsplash />
      <UpperCabinets />
      <Hood />
      <TallUnit />
    </group>
  );
}
