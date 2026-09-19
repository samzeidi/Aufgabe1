import { RoundedBox } from "@react-three/drei";
import type * as THREE from "three";
import { toWorld } from "../../room/coords";

interface BlockProps {
  /** min corner in room cm: [X, Y, Z] */
  min: [number, number, number];
  /** size in room cm: [width X, depth Y, height Z] */
  size: [number, number, number];
  material: THREE.Material;
  /** edge bevel in cm; 0 for a plain box */
  radius?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

/** Axis-aligned box addressed by its min corner and size, in room centimeters. */
export function Block({
  min,
  size,
  material,
  radius = 0,
  castShadow = true,
  receiveShadow = true,
}: BlockProps) {
  const [x, y, z] = min;
  const [w, d, h] = size;
  const center = toWorld(x + w / 2, y + d / 2, z + h / 2);
  const args: [number, number, number] = [w / 100, h / 100, d / 100];

  if (radius <= 0) {
    return (
      <mesh position={center} material={material} castShadow={castShadow} receiveShadow={receiveShadow}>
        <boxGeometry args={args} />
      </mesh>
    );
  }
  const r = Math.min(radius / 100, Math.min(...args) / 2 - 0.0005);
  return (
    <RoundedBox
      position={center}
      args={args}
      radius={r}
      smoothness={2}
      material={material}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  );
}
