import { Block } from "./Block";
import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import { RUG_SIZES } from "../../room/design";
import { useDesignStore } from "../../store/useDesignStore";
import * as P from "../../room/params";

/** Rug, drawn around its own centre. */
export function Rug() {
  const mats = useMaterials();
  const style = useDesignStore((s) => s.styles.rug);
  if (style === "none") return null;
  const [w, d] = RUG_SIZES[style];
  const t = style === "shag" ? 3.5 : 1.4;
  return (
    <group>
      <Block min={[-w / 2, -d / 2, 0]} size={[w, d, t]} material={mats.rug} radius={style === "shag" ? 1.4 : 0.4} castShadow={false} />
      {style === "persian" && (
        <>
          <Block min={[-w / 2 + 10, -d / 2 + 10, t]} size={[w - 20, d - 20, 0.25]} material={mats.rugBorder} castShadow={false} />
          <Block min={[-w / 2 + 18, -d / 2 + 18, t + 0.25]} size={[w - 36, d - 36, 0.25]} material={mats.rug} castShadow={false} />
        </>
      )}
      {style === "jute" && (
        <Block min={[-w / 2 + 3, -d / 2 + 3, t]} size={[w - 6, d - 6, 0.15]} material={mats.rugBorder} castShadow={false} />
      )}
    </group>
  );
}

/**
 * One leaf on a short stem, standing up and out from the trunk.
 * `angle` turns it around the trunk, `tilt` lifts the blade from horizontal.
 */
function Leaf({
  angle,
  z,
  reach,
  tilt,
  size,
  dark,
}: {
  angle: number;
  z: number;
  reach: number;
  tilt: number;
  size: number;
  dark?: boolean;
}) {
  const mats = useMaterials();
  const material = dark ? mats.leafDark : mats.leaf;
  return (
    <group rotation={[0, -angle, 0]}>
      <mesh
        position={[reach / 100, z / 100, 0]}
        rotation={[0, 0, tilt]}
        scale={[0.155 * size, 0.016, 0.105 * size]}
        material={material}
        castShadow
      >
        <sphereGeometry args={[1, 10, 8]} />
      </mesh>
      <mesh
        position={[reach / 200, (z - 7) / 100, 0]}
        rotation={[0, 0, Math.PI / 2 - tilt * 0.6]}
        material={material}
        castShadow={false}
      >
        <cylinderGeometry args={[0.007, 0.009, reach / 100, 6]} />
      </mesh>
    </group>
  );
}

/** Big fiddle-leaf-ish plant, ~140 cm tall, drawn around its own centre. */
export function PlantTall() {
  const mats = useMaterials();
  const leaves = [
    { angle: 0.3, z: 74, reach: 20, tilt: 0.75, size: 1.05 },
    { angle: 2.3, z: 82, reach: 22, tilt: 0.6, size: 1 },
    { angle: 4.3, z: 90, reach: 19, tilt: 0.8, size: 0.95 },
    { angle: 1.2, z: 98, reach: 17, tilt: 0.9, size: 0.9 },
    { angle: 3.3, z: 106, reach: 18, tilt: 0.85, size: 1 },
    { angle: 5.3, z: 114, reach: 15, tilt: 1.0, size: 0.85 },
    { angle: 0.8, z: 122, reach: 13, tilt: 1.1, size: 0.8 },
    { angle: 2.9, z: 129, reach: 11, tilt: 1.2, size: 0.7 },
  ];
  return (
    <group>
      <mesh position={toWorld(0, 0, 13)} material={mats.pot} castShadow receiveShadow>
        <cylinderGeometry args={[0.19, 0.15, 0.26, 20]} />
      </mesh>
      <mesh position={toWorld(0, 0, 25)} material={mats.soil} castShadow={false}>
        <cylinderGeometry args={[0.175, 0.175, 0.02, 20]} />
      </mesh>
      <mesh position={toWorld(0, 0, 62)} material={mats.leafDark} castShadow>
        <cylinderGeometry args={[0.017, 0.025, 0.76, 10]} />
      </mesh>
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} dark={i % 2 === 1} />
      ))}
    </group>
  );
}

/** Small snake-plant, ~60 cm tall. */
export function PlantSmall() {
  const mats = useMaterials();
  const blades = [0, 1.1, 2.2, 3.3, 4.4, 5.5];
  return (
    <group>
      <mesh position={toWorld(0, 0, 9)} material={mats.pot} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.1, 0.18, 18]} />
      </mesh>
      <mesh position={toWorld(0, 0, 17)} material={mats.soil} castShadow={false}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 18]} />
      </mesh>
      {blades.map((a, i) => (
        <group key={a} rotation={[0, -a, 0]}>
          <mesh
            position={[0.045, 0.3, 0]}
            rotation={[0, 0, -0.16 - (i % 3) * 0.06]}
            scale={[0.032, 0.27, 0.011]}
            material={i % 2 ? mats.leafDark : mats.leaf}
            castShadow
          >
            <sphereGeometry args={[1, 8, 10]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Floor-length curtain panels either side of each window. */
export function Curtains() {
  const mats = useMaterials();
  const style = useDesignStore((s) => s.styles.curtains);
  if (style === "none") return null;
  const panelW = style === "velvet" ? 46 : 40;
  const depth = style === "velvet" ? 13 : 10;
  const top = P.ROOM_H - 10;
  const x0 = 4;

  return (
    <group>
      {[P.WINDOW1_Y0, P.WINDOW2_Y0].map((y0) => {
        const y1 = y0 + P.WINDOW_W;
        return (
          <group key={y0}>
            {/* rail */}
            <Block min={[x0, y0 - panelW + 6, top]} size={[4, P.WINDOW_W + 2 * panelW - 12, 3]} material={mats.blind} radius={0.6} castShadow={false} />
            {[y0 - panelW + 8, y1 - 8].map((py) => (
              <group key={py}>
                {[0, 1, 2].map((f) => (
                  <Block
                    key={f}
                    min={[x0 + (f % 2 === 0 ? 0 : 2.5), py + (f * panelW) / 3, 2]}
                    size={[depth - (f % 2 === 0 ? 0 : 3), panelW / 3 - 1, top - 3]}
                    material={mats.curtain}
                    radius={1.6}
                    castShadow={false}
                  />
                ))}
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/** A small gallery: two frames above the bed wall and one on the right wall. */
export function Art({ dollhouse }: { dollhouse: boolean }) {
  const mats = useMaterials();
  const show = useDesignStore((s) => s.styles.art);
  // in the dollhouse view the walls they hang on are gone, so the frames go too
  if (!show || dollhouse) return null;
  // the canvas sits a few mm proud of the frame so the frame reads as a border
  const frame = (x: number, z: number, w: number, h: number) => (
    <group key={`${x}-${z}`}>
      <Block min={[x, 1, z]} size={[w, 2.5, h]} material={mats.artFrame} radius={0.3} castShadow={false} />
      <Block min={[x + 3.5, 3.1, z + 3.5]} size={[w - 7, 0.5, h - 7]} material={mats.artCanvas} castShadow={false} />
    </group>
  );
  return (
    <group>
      {frame(252, 140, 46, 60)}
      {frame(312, 132, 56, 72)}
      {/* right wall, seen from the window side */}
      <group>
        <Block min={[P.ROOM_W - 3.5, 150, 128]} size={[2.5, 50, 64]} material={mats.artFrame} radius={0.3} castShadow={false} />
        <Block min={[P.ROOM_W - 4.6, 154, 132]} size={[1.6, 42, 56]} material={mats.artCanvas} castShadow={false} />
      </group>
    </group>
  );
}
