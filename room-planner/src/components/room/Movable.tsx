import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { toWorld } from "../../room/coords";
import { footprint, type ItemId } from "../../room/design";
import { useDesignStore } from "../../store/useDesignStore";

const FLOOR = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

/**
 * Wraps an item so it can be tapped to select and dragged across the floor.
 * Children are drawn in centimetres relative to the item's own centre at floor level.
 */
export function Movable({ id, children }: { id: ItemId; children: ReactNode }) {
  const transform = useDesignStore((s) => s.layout[id]);
  const styles = useDesignStore((s) => s.styles);
  const selected = useDesignStore((s) => s.selected === id);
  const select = useDesignStore((s) => s.select);
  const setDragging = useDesignStore((s) => s.setDragging);
  const moveItem = useDesignStore((s) => s.moveItem);
  const grab = useRef<{ dx: number; dy: number } | null>(null);
  const hit = useRef(new THREE.Vector3());

  const [w, d] = footprint(id, styles);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    select(id);
    setDragging(true);
    if (e.ray.intersectPlane(FLOOR, hit.current)) {
      grab.current = {
        dx: transform.x - hit.current.x * 100,
        dy: transform.y + hit.current.z * 100,
      };
    } else {
      grab.current = { dx: 0, dy: 0 };
    }
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
      position={toWorld(transform.x, transform.y, 0)}
      rotation={[0, (-transform.rot * Math.PI) / 180, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {children}
      {selected && w > 0 && (
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[(w + 8) / 100, (d + 8) / 100]} />
          <meshBasicMaterial color="#5b8cff" transparent opacity={0.28} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
