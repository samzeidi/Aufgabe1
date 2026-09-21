import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Block } from "./Block";
import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import * as P from "../../room/params";

interface ShellProps {
  wallOpacity: number;
  showCeiling: boolean;
  accentWall: boolean;
  /** drop the two walls nearest the camera, and the entrance nook, for the whole-room view */
  dollhouse: boolean;
}

function FloorPatch({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) {
  const mats = useMaterials();
  const material = useMemo(() => {
    const mat = mats.floor.clone();
    const tex = (mats.floor.map as THREE.Texture).clone();
    tex.repeat.set((x1 - x0) / 200, (y1 - y0) / 200);
    tex.offset.set((x0 / 200) % 1, (y0 / 200) % 1);
    tex.needsUpdate = true;
    mat.map = tex;
    return mat;
  }, [mats.floor, x0, y0, x1, y1]);
  return (
    <mesh
      position={toWorld((x0 + x1) / 2, (y0 + y1) / 2, 0)}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
      receiveShadow
    >
      <planeGeometry args={[(x1 - x0) / 100, (y1 - y0) / 100]} />
    </mesh>
  );
}

function CeilingPatch({
  x0,
  y0,
  x1,
  y1,
  z,
}: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  z: number;
}) {
  const mats = useMaterials();
  return (
    <mesh
      position={toWorld((x0 + x1) / 2, (y0 + y1) / 2, z)}
      rotation={[Math.PI / 2, 0, 0]}
      material={mats.ceiling}
      receiveShadow
    >
      <planeGeometry args={[(x1 - x0) / 100, (y1 - y0) / 100]} />
    </mesh>
  );
}

/** Baseboard strip along a wall face. axis "x": runs along X at fixed Y; "y": runs along Y at fixed X. */
function Baseboard({
  axis,
  from,
  to,
  at,
  inward,
}: {
  axis: "x" | "y";
  from: number;
  to: number;
  at: number;
  /** +1 if the room is on the positive side of the wall face, -1 otherwise */
  inward: 1 | -1;
}) {
  const mats = useMaterials();
  const t = P.BASEBOARD_T;
  const off = inward === 1 ? at : at - t;
  if (axis === "x") {
    return <Block min={[from, off, 0]} size={[to - from, t, P.BASEBOARD_H]} material={mats.baseboard} castShadow={false} />;
  }
  return <Block min={[off, from, 0]} size={[t, to - from, P.BASEBOARD_H]} material={mats.baseboard} castShadow={false} />;
}

export function Shell({ wallOpacity, showCeiling, accentWall, dollhouse }: ShellProps) {
  const mats = useMaterials();
  const W = P.ROOM_W;
  const L = P.ROOM_L;
  const H = P.ROOM_H;
  const T = P.WALL_T;
  const E = P.EXT_WALL_T;

  useEffect(() => {
    for (const mat of [mats.wall, mats.wallAccent, mats.ceiling, mats.baseboard]) {
      mat.transparent = wallOpacity < 1;
      mat.opacity = wallOpacity;
      mat.depthWrite = wallOpacity >= 0.99;
      mat.needsUpdate = true;
    }
  }, [wallOpacity, mats]);

  const wall = mats.wall;

  const nookY0 = P.RIGHT_WALL;
  const nookX1 = P.NOOK_X1;
  const doorX0 = P.BATH_DOOR_X0;
  const doorX1 = doorX0 + P.DOOR_W;
  const corrY0 = P.CORRIDOR_Y0;
  const corrY1 = corrY0 + P.CORRIDOR_W;
  const corrX1 = nookX1 + T + P.CORRIDOR_LEN;

  return (
    <group>
      {/* Floors */}
      <FloorPatch x0={0} y0={0} x1={W} y1={L} />
      {!dollhouse && (
        <>
          <FloorPatch x0={W} y0={nookY0} x1={nookX1} y1={L} />
          <FloorPatch x0={nookX1} y0={corrY0} x1={corrX1} y1={corrY1} />
        </>
      )}

      {/* Ceilings */}
      {showCeiling && (
        <>
          <CeilingPatch x0={0} y0={0} x1={W} y1={L} z={H} />
          <CeilingPatch x0={W} y0={nookY0} x1={nookX1} y1={L} z={P.NOOK_CEILING} />
          <CeilingPatch x0={nookX1} y0={corrY0} x1={corrX1} y1={corrY1} z={P.NOOK_CEILING} />
        </>
      )}
      {/* Ceiling step between the room (243) and the nook (225) */}
      {!dollhouse && <Block min={[W, nookY0, P.NOOK_CEILING]} size={[2, L - nookY0, H - P.NOOK_CEILING]} material={wall} />}

      {/* Bottom (bed) wall, Y = 0 — this is the one that can take an accent colour.
          In the dollhouse view the two walls nearest the camera are dropped so you can see in. */}
      {!dollhouse && <Block min={[-E, -T, 0]} size={[W + T + E, T, H]} material={accentWall ? mats.wallAccent : wall} />}

      {/* Window wall, X = 0: solid segments, lintels, sills */}
      <Block min={[-E, 0, 0]} size={[E, P.WINDOW1_Y0, H]} material={wall} />
      <Block min={[-E, P.WINDOW1_Y1, 0]} size={[E, P.WINDOW2_Y0 - P.WINDOW1_Y1, H]} material={wall} />
      <Block min={[-E, P.WINDOW2_Y1, 0]} size={[E, L + T - P.WINDOW2_Y1, H]} material={wall} />
      {[P.WINDOW1_Y0, P.WINDOW2_Y0].map((y0) => (
        <group key={y0}>
          <Block min={[-E, y0, P.WINDOW_TOP]} size={[E, P.WINDOW_W, H - P.WINDOW_TOP]} material={wall} />
          <Block min={[-E, y0, 0]} size={[E, P.WINDOW_W, P.WINDOW_SILL]} material={mats.black} />
          {/* white roller-blind housing, close to the ceiling */}
          <Block
            min={[0, y0 - 3, H - P.BLIND_HOUSING.h - 1]}
            size={[P.BLIND_HOUSING.d, P.WINDOW_W + 6, P.BLIND_HOUSING.h]}
            material={mats.blind}
            radius={0.5}
          />
        </group>
      ))}

      {/* Kitchen wall, Y = L (stops at the wall return in the dollhouse view) */}
      <Block min={[-E, L, 0]} size={[(dollhouse ? W + P.RETURN_LEN : nookX1 + T) + E, T, H]} material={wall} />

      {/* Right wall, X = W, solid for Y = 0..305 */}
      {!dollhouse && <Block min={[W, -T, 0]} size={[T, nookY0 + T, H]} material={wall} />}

      {/* Diagonal wall return beside the kitchen (from the sketch), carrying the light switches.
          Runs from the kitchen-wall corner at (400, 624) toward (+X, -Y) at 45°. */}
      <group position={toWorld(W + P.RETURN_LEN / 2, L - P.RETURN_LEN / 2, 0)} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0, H / 200, 0]} material={wall} castShadow receiveShadow>
          <boxGeometry args={[(P.RETURN_LEN * Math.SQRT2) / 100, H / 100, T / 100]} />
        </mesh>
        {[104, 114, 124].map((z) => (
          <mesh key={z} position={[-0.06, (z + 4) / 100, T / 200 + 0.005]} material={mats.switchPlate} castShadow={false}>
            <boxGeometry args={[0.08, 0.08, 0.01]} />
          </mesh>
        ))}
        <mesh position={[0, P.BASEBOARD_H / 200, T / 200 + P.BASEBOARD_T / 200]} material={mats.baseboard} castShadow={false}>
          <boxGeometry args={[(P.RETURN_LEN * Math.SQRT2) / 100, P.BASEBOARD_H / 100, P.BASEBOARD_T / 100]} />
        </mesh>
      </group>

      {!dollhouse && (
        <group>
      {/* Nook south wall (Y = 305) with the bathroom door opening */}
      <Block min={[W + T, nookY0 - T, 0]} size={[doorX0 - (W + T), T, H]} material={wall} />
      <Block min={[doorX0, nookY0 - T, P.DOOR_H]} size={[P.DOOR_W, T, H - P.DOOR_H]} material={wall} />
      <Block min={[doorX1, nookY0 - T, 0]} size={[nookX1 + T - doorX1, T, H]} material={wall} />
      {/* bathroom door leaf + frame + handle */}
      <Block min={[doorX0 - 3, nookY0 - 2, 0]} size={[3, 4, P.DOOR_H + 3]} material={mats.door} />
      <Block min={[doorX1, nookY0 - 2, 0]} size={[3, 4, P.DOOR_H + 3]} material={mats.door} />
      <Block min={[doorX0 - 3, nookY0 - 2, P.DOOR_H]} size={[P.DOOR_W + 6, 4, 3]} material={mats.door} />
      <Block min={[doorX0, nookY0 - 9, 0]} size={[P.DOOR_W, 4, P.DOOR_H]} material={mats.door} radius={0.3} />
      <Block min={[doorX1 - 14, nookY0 - 4.5, 103]} size={[10, 1.5, 1.5]} material={mats.doorHandle} radius={0.5} />

      {/* Nook east wall (X = 530) with the corridor opening */}
      <Block min={[nookX1, nookY0 - T, 0]} size={[T, corrY0 - (nookY0 - T), H]} material={wall} />
      <Block min={[nookX1, corrY0, P.NOOK_CEILING - 20]} size={[T, P.CORRIDOR_W, H - (P.NOOK_CEILING - 20)]} material={wall} />
      <Block min={[nookX1, corrY1, 0]} size={[T, L + T - corrY1, H]} material={wall} />

      {/* Corridor toward the front door */}
      <Block min={[nookX1 + T, corrY0 - T, 0]} size={[P.CORRIDOR_LEN, T, H]} material={wall} />
      <Block min={[nookX1 + T, corrY1, 0]} size={[P.CORRIDOR_LEN, T, H]} material={wall} />
      <Block min={[corrX1, corrY0 - T, 0]} size={[T, P.CORRIDOR_W + 2 * T, H]} material={wall} />
      <Block min={[corrX1 - 4, corrY0 + 4, 0]} size={[4, P.CORRIDOR_W - 8, P.DOOR_H]} material={mats.door} />
        </group>
      )}

      {/* Baseboards */}
      <Baseboard axis="x" from={0} to={W} at={0} inward={1} />
      <Baseboard axis="y" from={0} to={P.WINDOW1_Y0} at={0} inward={1} />
      <Baseboard axis="y" from={P.WINDOW1_Y1} to={P.WINDOW2_Y0} at={0} inward={1} />
      <Baseboard axis="y" from={P.WINDOW2_Y1} to={L} at={0} inward={1} />
      <Baseboard axis="x" from={0} to={P.KITCHEN_X0} at={L} inward={-1} />
      {!dollhouse && (
        <group>
          <Baseboard axis="y" from={0} to={nookY0} at={W} inward={-1} />
          <Baseboard axis="x" from={W} to={doorX0 - 3} at={nookY0} inward={1} />
          <Baseboard axis="x" from={doorX1 + 3} to={nookX1} at={nookY0} inward={1} />
          <Baseboard axis="y" from={nookY0} to={corrY0} at={nookX1} inward={-1} />
          <Baseboard axis="y" from={corrY1} to={L} at={nookX1} inward={-1} />
          <Baseboard axis="x" from={W + P.RETURN_LEN} to={nookX1} at={L} inward={-1} />
        </group>
      )}
    </group>
  );
}
