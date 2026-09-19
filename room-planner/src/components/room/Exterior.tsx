import { Block } from "./Block";
import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import * as P from "../../room/params";

const GROUND_Z = -P.FLOOR_LEVEL_ABOVE_GROUND;

function Building({
  x0,
  x1,
  y0,
  y1,
  top,
  dark,
}: {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  top: number;
  dark?: boolean;
}) {
  const mats = useMaterials();
  const windows: [number, number][] = [];
  for (let z = GROUND_Z + 120; z + 150 < top; z += 300) {
    for (let y = y0 + 60; y + 110 < y1; y += 220) {
      windows.push([y, z]);
    }
  }
  return (
    <group>
      <Block min={[x0, y0, GROUND_Z]} size={[x1 - x0, y1 - y0, top - GROUND_Z]} material={dark ? mats.facadeDark : mats.facade} castShadow={false} />
      {/* pitched roof, simplified as a shallow slab overhang */}
      <Block min={[x0 - 30, y0 - 30, top]} size={[x1 - x0 + 60, y1 - y0 + 60, 25]} material={mats.roof} castShadow={false} />
      <Block min={[x0 + 100, y0 + 40, top + 25]} size={[x1 - x0 - 200, y1 - y0 - 80, 140]} material={mats.roof} castShadow={false} />
      {windows.map(([y, z]) => (
        <Block key={`${y}-${z}`} min={[x1 - 2, y, z]} size={[4, 110, 150]} material={mats.facadeWindow} castShadow={false} receiveShadow={false} />
      ))}
    </group>
  );
}

export function Exterior() {
  const mats = useMaterials();
  const by0 = 60;
  const by1 = 540;
  const railX = -P.BALCONY_D + 5;
  const posts: number[] = [];
  for (let y = by0; y <= by1; y += 120) posts.push(y);

  return (
    <group>
      {/* street level */}
      <mesh position={toWorld(0, 300, GROUND_Z)} rotation={[-Math.PI / 2, 0, 0]} material={mats.ground} receiveShadow={false}>
        <planeGeometry args={[80, 80]} />
      </mesh>

      {/* balcony slab + railing outside the two French windows */}
      <Block min={[-P.BALCONY_D, by0, -P.BALCONY_SLAB_T]} size={[P.BALCONY_D, by1 - by0, P.BALCONY_SLAB_T]} material={mats.balcony} />
      <Block min={[railX - 2, by0, P.RAILING_H - 4]} size={[4, by1 - by0, 4]} material={mats.railing} castShadow={false} />
      {[28, 52, 76].map((z) => (
        <Block key={z} min={[railX - 1, by0, z]} size={[2, by1 - by0, 2]} material={mats.railing} castShadow={false} />
      ))}
      {posts.map((y) => (
        <Block key={y} min={[railX - 1.5, y - 1.5, 0]} size={[3, 3, P.RAILING_H - 4]} material={mats.railing} castShadow={false} />
      ))}
      {/* side railings back to the facade */}
      {[by0, by1 - 3].map((y) => (
        <group key={y}>
          <Block min={[railX, y, P.RAILING_H - 4]} size={[-railX, 3, 4]} material={mats.railing} castShadow={false} />
          {[28, 52, 76].map((z) => (
            <Block key={z} min={[railX, y + 0.5, z]} size={[-railX, 2, 2]} material={mats.railing} castShadow={false} />
          ))}
        </group>
      ))}

      {/* our own building's facade below and beside the apartment */}
      <Block min={[-P.EXT_WALL_T - 2, -600, GROUND_Z]} size={[2, 1800, P.FLOOR_LEVEL_ABOVE_GROUND - P.BALCONY_SLAB_T]} material={mats.facade} castShadow={false} />
      <Block min={[-P.EXT_WALL_T - 2, -600, -P.BALCONY_SLAB_T]} size={[2, 600, P.ROOM_H + 40 + P.BALCONY_SLAB_T]} material={mats.facade} castShadow={false} />
      <Block min={[-P.EXT_WALL_T - 2, P.ROOM_L + P.WALL_T, -P.BALCONY_SLAB_T]} size={[2, 1200 - P.ROOM_L, P.ROOM_H + 40 + P.BALCONY_SLAB_T]} material={mats.facade} castShadow={false} />
      <Block min={[-P.EXT_WALL_T - 2, -600, P.ROOM_H + 40]} size={[2, 1800, 300]} material={mats.facade} castShadow={false} />

      {/* buildings across the street */}
      <Building x0={-2700} x1={-1500} y0={-700} y1={-40} top={480} dark />
      <Building x0={-2650} x1={-1500} y0={40} y1={760} top={600} />
      <Building x0={-2700} x1={-1500} y0={840} y1={1500} top={430} dark />
    </group>
  );
}
