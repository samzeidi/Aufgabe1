import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { toWorld } from "../room/coords";
import { useDesignStore } from "../store/useDesignStore";
import type { Lens, ViewId } from "../types";

interface Preset {
  /** camera position, room cm */
  pos: [number, number, number];
  /** look-at target, room cm */
  target: [number, number, number];
}

// Perspective presets approximate the reference photo pages (shot on a phone ultrawide).
export const VIEWS: Record<Exclude<ViewId, "top">, Preset> = {
  // dollhouse: the bed wall and the right wall are dropped, so look in over that corner
  overview: { pos: [620, -430, 470], target: [190, 290, 45] },
  // pages 6/7: just behind the sofa's right end, facing the kitchen
  kitchen: { pos: [215, 385, 150], target: [240, 624, 120] },
  // pages 10/11: from the kitchen side, facing the bed wall
  bed: { pos: [250, 540, 160], target: [280, 0, 90] },
  // page 12: from behind the sofa, table and the upper window
  // (kept clear of x ≤ 220 so it never ends up inside the corner sofa)
  table: { pos: [285, 530, 140], target: [50, 300, 105] },
  // pages 14/15: from the hallway opening, along the kitchen toward the window
  kitchenAlong: { pos: [425, 515, 150], target: [0, 470, 110] },
};

export const VIEW_LABELS: Record<ViewId, string> = {
  bed: "Bed & window",
  table: "Sofa & table",
  kitchen: "Kitchen",
  kitchenAlong: "Along the kitchen",
  overview: "Whole room",
  top: "Floor plan",
};

/** Vertical FOV for a full-frame-equivalent focal length; the long image side maps to 36 mm. */
export function fovForLens(lens: Lens, aspect: number): number {
  const half = aspect < 1 ? 18 : 12;
  return (2 * Math.atan(half / lens) * 180) / Math.PI;
}

export function CameraRig({ view, lens }: { view: ViewId; lens: Lens }) {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const dragging = useDesignStore((s) => s.dragging);

  if (view === "top") {
    const zoom = Math.min(size.width / 7.6, size.height / 8.2);
    const center = toWorld(255, 312, 0);
    return (
      <group key="top">
        <OrthographicCamera
          makeDefault
          position={toWorld(255, 312, 1500)}
          zoom={zoom}
          near={0.1}
          far={60}
          up={[0, 0, -1]}
          onUpdate={(c) => {
            c.lookAt(...center);
            c.updateProjectionMatrix();
          }}
        />
        <OrbitControls
          makeDefault
          enabled={!dragging}
          target={center}
          enableRotate={false}
          enableDamping
          dampingFactor={0.15}
          minZoom={zoom * 0.5}
          maxZoom={zoom * 4}
        />
      </group>
    );
  }

  const preset = VIEWS[view];
  const target = toWorld(...preset.target);
  return (
    <group key={`${view}-${lens}`}>
      <PerspectiveCamera makeDefault position={toWorld(...preset.pos)} fov={fovForLens(lens, aspect)} near={0.05} far={120} />
      <OrbitControls
        makeDefault
        enabled={!dragging}
        target={target}
        enableDamping
        dampingFactor={0.12}
        minDistance={0.3}
        maxDistance={40}
        maxPolarAngle={Math.PI - 0.05}
      />
    </group>
  );
}
