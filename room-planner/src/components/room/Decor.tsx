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
        <Block min={[P.ROOM_W - 3.5, 232, 128]} size={[2.5, 50, 64]} material={mats.artFrame} radius={0.3} castShadow={false} />
        <Block min={[P.ROOM_W - 4.6, 236, 132]} size={[1.6, 42, 56]} material={mats.artCanvas} castShadow={false} />
      </group>
    </group>
  );
}
