import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRoomStore } from "../store/useRoomStore";
import { RoomModel } from "./RoomModel";

export function Scene() {
  const dimensions = useRoomStore((state) => state.settings.dimensions);
  const target: [number, number, number] = [0, dimensions.height / 2, 0];
  const camDistance = Math.max(dimensions.width, dimensions.depth) * 1.3 + 2;

  return (
    <Canvas shadows dpr={[1, 2]} style={{ touchAction: "none" }}>
      <PerspectiveCamera
        makeDefault
        position={[camDistance * 0.7, dimensions.height * 1.1 + 1, camDistance * 0.9]}
        fov={55}
        near={0.1}
        far={100}
      />
      <OrbitControls
        target={target}
        enableDamping
        dampingFactor={0.12}
        minDistance={1}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 - 0.02}
      />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[dimensions.width, dimensions.height * 3, dimensions.depth]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#e8f0ff", "#3a3529", 0.4]} />

      <RoomModel />
    </Canvas>
  );
}
