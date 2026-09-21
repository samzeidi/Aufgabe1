import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { toWorld } from "../../room/coords";
import { footprint } from "../../room/design";
import { useDesignStore } from "../../store/useDesignStore";

const FLOOR = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

/**
 * Wraps an item so it can be tapped to select it. It only follows the finger
 * once Move has been switched on for it, so nothing gets shoved by accident.
 * Children are drawn in centimetres around the item's own centre, with local
 * z = 0 at the item's base (the mounting height for a wall shelf).
 */
export function Movable({ id, children }: { id: string; children: ReactNode }) {
  const item = useDesignStore((s) => s.layout[id]);
  const styles = useDesignStore((s) => s.styles);
  const selected = useDesignStore((s) => s.selected === id);
  const armed = useDesignStore((s) => s.selected === id && s.moveMode);
  const select = useDesignStore((s) => s.select);
  const setDragging = useDesignStore((s) => s.setDragging);
  const moveItem = useDesignStore((s) => s.moveItem);
  const grab = useRef<{ dx: number; dy: number } | null>(null);
  const hit = useRef(new THREE.Vector3());

  if (!item) return null;
  const [w, d] = footprint(item, styles);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!armed) {
      select(id);
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    grab.current = e.ray.intersectPlane(FLOOR, hit.current)
      ? { dx: item.x - hit.current.x * 100, dy: item.y + hit.current.z * 100 }
      : { dx: 0, dy: 0 };
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!grab.current) return;
    e.stopPropagation();
    if (!e.ray.intersectPlane(FLOOR, hit.current)) return;
    moveItem(id, hit.current.x * 100 + grab.current.dx, -hit.current.z * 100 + grab.current.dy);
  };

  const endDrag = (e: ThreeEvent<PointerEvent>) => {
    if (!grab.current) return;
    e.stopPropagation();
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    grab.current = null;
    setDragging(false);
  };

  return (
    <group
      position={toWorld(item.x, item.y, item.z ?? 0)}
      rotation={[0, (-item.rot * Math.PI) / 180, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
      {selected && w > 0 && (
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[(w + 8) / 100, (d + 8) / 100]} />
          <meshBasicMaterial
            color={armed ? "#8fae80" : "#5b8cff"}
            transparent
            opacity={armed ? 0.55 : 0.26}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
