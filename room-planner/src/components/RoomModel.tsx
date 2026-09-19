import { useRoomStore } from "../store/useRoomStore";

const WALL_THICKNESS = 0.1;
const FLOOR_COLOR = "#c9bda2";
const WALL_COLOR = "#e8e4da";
const CEILING_COLOR = "#f5f3ee";

export function RoomModel() {
  const { dimensions, wallOpacity, showCeiling, showGrid } = useRoomStore(
    (state) => state.settings,
  );
  const { width, depth, height } = dimensions;
  const transparent = wallOpacity < 1;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={FLOOR_COLOR} side={2} />
      </mesh>

      {showGrid && (
        <gridHelper
          args={[Math.max(width, depth) * 1.2, Math.round(Math.max(width, depth) * 2), "#8d8465", "#b8ae90"]}
          position={[0, 0.001, 0]}
        />
      )}

      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, WALL_THICKNESS]} />
        <meshStandardMaterial color={WALL_COLOR} transparent={transparent} opacity={wallOpacity} side={2} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, height, depth]} />
        <meshStandardMaterial color={WALL_COLOR} transparent={transparent} opacity={wallOpacity} side={2} />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WALL_THICKNESS, height, depth]} />
        <meshStandardMaterial color={WALL_COLOR} transparent={transparent} opacity={wallOpacity} side={2} />
      </mesh>

      {/* Ceiling (optional, off by default so it's easier to look inside) */}
      {showCeiling && (
        <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color={CEILING_COLOR} transparent opacity={0.85} side={2} />
        </mesh>
      )}
    </group>
  );
}
