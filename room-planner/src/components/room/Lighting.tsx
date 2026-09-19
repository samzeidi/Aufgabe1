import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import * as P from "../../room/params";

export function Lighting() {
  const mats = useMaterials();
  const { x, y, diameter, centerZ } = P.PENDANT;
  const sphereTop = centerZ + diameter / 2;
  const cordLen = P.ROOM_H - 2 - sphereTop;
  const sunTarget = toWorld(180, 300, 0);

  return (
    <group>
      {/* daylight through the balcony windows */}
      <directionalLight
        position={toWorld(-700, 150, 520)}
        target-position={sunTarget}
        intensity={2.4}
        color="#eef2f7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <hemisphereLight args={["#e3e9f0", "#6f6455", 0.7]} />
      <ambientLight intensity={0.4} />

      {/* white paper pendant in the sleeping half */}
      <mesh position={toWorld(x, y, P.ROOM_H - 1)} material={mats.lampCord} castShadow={false}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 24]} />
      </mesh>
      <mesh position={toWorld(x, y, sphereTop + cordLen / 2)} material={mats.lampCord} castShadow={false}>
        <cylinderGeometry args={[0.003, 0.003, cordLen / 100, 8]} />
      </mesh>
      <mesh position={toWorld(x, y, centerZ)} material={mats.lamp} castShadow={false}>
        <sphereGeometry args={[diameter / 200, 32, 24]} />
      </mesh>
      <pointLight position={toWorld(x, y, centerZ)} intensity={11} color="#ffd8a6" decay={2} castShadow={false} />

      {/* understated flush fixture toward the kitchen */}
      <mesh position={toWorld(P.KITCHEN_LIGHT.x, P.KITCHEN_LIGHT.y, P.ROOM_H - 2)} material={mats.lamp} castShadow={false}>
        <cylinderGeometry args={[0.11, 0.13, 0.04, 32]} />
      </mesh>
      <pointLight position={toWorld(P.KITCHEN_LIGHT.x, P.KITCHEN_LIGHT.y, P.ROOM_H - 45)} intensity={4} color="#ffe2b8" decay={2} />
    </group>
  );
}
