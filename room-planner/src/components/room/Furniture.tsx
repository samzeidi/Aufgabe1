import { Block } from "./Block";
import { Movable } from "./Movable";
import { Rug } from "./Decor";
import { Shelf } from "./Shelves";
import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import { footprint, isShelf, type PlacedItem } from "../../room/design";
import { useDesignStore } from "../../store/useDesignStore";
import * as P from "../../room/params";

/* All geometry below is drawn around the item's own centre, in centimetres:
   local X = width, local Y = depth (head of the bed at -Y), local Z = height. */

function Bedding({ w, d, top }: { w: number; d: number; top: number }) {
  const mats = useMaterials();
  const duvetY0 = -d / 2 + 52;
  return (
    <group>
      {/* duvet */}
      <Block
        min={[-w / 2 - 3, duvetY0, top]}
        size={[w + 6, d / 2 + 48 - 4, 9]}
        material={mats.bedding}
        radius={3}
        castShadow={false}
      />
      {/* turned-back top sheet */}
      <Block min={[-w / 2 - 3, duvetY0 - 12, top]} size={[w + 6, 14, 6]} material={mats.beddingSoft} radius={2.5} castShadow={false} />
      {/* pillows */}
      <Block min={[-w / 2 + 6, -d / 2 + 12, top + 1]} size={[w / 2 - 10, 34, 13]} material={mats.beddingSoft} radius={5} castShadow={false} />
      <Block min={[4, -d / 2 + 12, top + 1]} size={[w / 2 - 10, 34, 13]} material={mats.beddingSoft} radius={5} castShadow={false} />
      {/* cushions in the accent colour */}
      <Block min={[-w / 2 + 16, -d / 2 + 26, top + 13]} size={[36, 18, 14]} material={mats.cushion} radius={4} castShadow={false} />
      {/* folded throw at the foot */}
      <Block min={[-w / 2 - 5, d / 2 - 46, top + 1]} size={[w + 10, 40, 7]} material={mats.throwBlanket} radius={3} castShadow={false} />
    </group>
  );
}

function Bed({ item }: { item: PlacedItem }) {
  const mats = useMaterials();
  const styles = useDesignStore((s) => s.styles);
  const style = styles.bed;
  const [w, d] = footprint(item, styles);

  if (style === "wood") {
    const frameH = 26;
    const top = frameH;
    return (
      <group>
        <Block min={[-w / 2 - 6, -d / 2 - 6, 0]} size={[w + 12, d + 12, frameH]} material={mats.oakLight} radius={1} />
        <Block min={[-w / 2, -d / 2, frameH - 3]} size={[w, d, 3]} material={mats.oakLight} />
        {/* slatted headboard */}
        <Block min={[-w / 2 - 6, -d / 2 - 8, frameH]} size={[6, 4, 70]} material={mats.oakLight} radius={0.6} />
        <Block min={[w / 2, -d / 2 - 8, frameH]} size={[6, 4, 70]} material={mats.oakLight} radius={0.6} />
        {Array.from({ length: 9 }, (_, i) => (
          <Block
            key={i}
            min={[-w / 2 + 4 + i * ((w - 8) / 9), -d / 2 - 7, frameH + 4]}
            size={[(w - 8) / 9 - 4, 2.5, 62]}
            material={mats.oakLight}
            radius={0.4}
          />
        ))}
        <Block min={[-w / 2 - 6, -d / 2 - 8, frameH + 66]} size={[w + 12, 4, 6]} material={mats.oakLight} radius={0.6} />
        <Block min={[-w / 2 + 2, -d / 2 + 3, top]} size={[w - 4, d - 6, P.MATTRESS_T]} material={mats.bedding} radius={3} />
        <Bedding w={w - 4} d={d - 6} top={top + P.MATTRESS_T} />
      </group>
    );
  }

  if (style === "upholstered") {
    const frameH = 28;
    const top = frameH;
    return (
      <group>
        <Block min={[-w / 2, -d / 2, 6]} size={[w, d, frameH - 6]} material={mats.upholstery} radius={2} />
        {/* padded headboard */}
        <Block min={[-w / 2, -d / 2 - 10, 0]} size={[w, 10, 118]} material={mats.upholstery} radius={3} />
        {Array.from({ length: 4 }, (_, i) => (
          <Block
            key={i}
            min={[-w / 2 + 6 + i * ((w - 12) / 4), -d / 2 - 11, 44]}
            size={[(w - 12) / 4 - 5, 2, 66]}
            material={mats.upholstery}
            radius={2.5}
            castShadow={false}
          />
        ))}
        <Block min={[-w / 2 + 3, -d / 2 + 3, top]} size={[w - 6, d - 6, P.MATTRESS_T]} material={mats.bedding} radius={3} />
        <Bedding w={w - 6} d={d - 6} top={top + P.MATTRESS_T} />
      </group>
    );
  }

  // the real bed: dark frame with the decorative headboard panel
  const r = 5;
  const legH = 20;
  const railZ1 = P.BED_FRAME_H;
  const corners: [number, number][] = [
    [-w / 2, -d / 2],
    [w / 2 - r, -d / 2],
    [-w / 2, d / 2 - r],
    [w / 2 - r, d / 2 - r],
  ];
  return (
    <group>
      {corners.map(([lx, ly]) => (
        <Block key={`${lx}-${ly}`} min={[lx, ly, 0]} size={[r, r, legH]} material={mats.bedFrame} radius={0.3} />
      ))}
      <Block min={[-w / 2, -d / 2, legH]} size={[w, r, railZ1 - legH]} material={mats.bedFrame} radius={0.3} />
      <Block min={[-w / 2, d / 2 - r, legH]} size={[w, r, railZ1 - legH]} material={mats.bedFrame} radius={0.3} />
      <Block min={[-w / 2, -d / 2, legH]} size={[r, d, railZ1 - legH]} material={mats.bedFrame} radius={0.3} />
      <Block min={[w / 2 - r, -d / 2, legH]} size={[r, d, railZ1 - legH]} material={mats.bedFrame} radius={0.3} />
      <Block min={[-w / 2 + r, -d / 2 + r, railZ1 - 3]} size={[w - 2 * r, d - 2 * r, 3]} material={mats.bedFrame} />
      <Block min={[-w / 2, -d / 2, railZ1]} size={[r, r, P.HEADBOARD_H - railZ1]} material={mats.bedFrame} radius={0.3} />
      <Block min={[w / 2 - r, -d / 2, railZ1]} size={[r, r, P.HEADBOARD_H - railZ1]} material={mats.bedFrame} radius={0.3} />
      <Block min={[-w / 2, -d / 2, P.HEADBOARD_H - 5]} size={[w, r, 5]} material={mats.bedFrame} radius={0.3} />
      <Block min={[-w / 2, -d / 2, 45]} size={[w, r, 4]} material={mats.bedFrame} radius={0.3} />
      <Block min={[-w / 2 + 15, -d / 2 + 1, 49]} size={[w - 30, 3, P.HEADBOARD_H - 5 - 49]} material={mats.bedPanel} radius={0.3} />
      <Block min={[-w / 2 + 2, -d / 2 + 3, railZ1]} size={[w - 4, d - 6, P.MATTRESS_T]} material={mats.bedding} radius={3} />
      <Bedding w={w - 4} d={d - 6} top={railZ1 + P.MATTRESS_T} />
    </group>
  );
}

function SofaCushionRow({ x0, x1, y0, y1, z, n }: { x0: number; x1: number; y0: number; y1: number; z: number; n: number }) {
  const mats = useMaterials();
  const step = (x1 - x0) / n;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => (
        <Block
          key={i}
          min={[x0 + i * step + 1, y0, z]}
          size={[step - 2, y1 - y0, 9]}
          material={mats.sofa}
          radius={3.5}
          castShadow={false}
        />
      ))}
    </group>
  );
}

function Sofa({ item }: { item: PlacedItem }) {
  const mats = useMaterials();
  const styles = useDesignStore((s) => s.styles);
  const style = styles.sofa;
  const [w, d] = footprint(item, styles);
  const hw = w / 2;
  const hd = d / 2;

  if (style === "chesterfield") {
    const seatH = 42;
    const backH = 74;
    const arm = 20;
    return (
      <group>
        {/* rolled arms */}
        {[-hw + arm / 2, hw - arm / 2].map((cx) => (
          <mesh key={cx} position={toWorld(cx, 0, backH - arm / 2)} rotation={[Math.PI / 2, 0, 0]} material={mats.sofaLeather} castShadow>
            <cylinderGeometry args={[arm / 200, arm / 200, d / 100, 20]} />
          </mesh>
        ))}
        <Block min={[-hw, -hd, 10]} size={[arm, d, backH - arm / 2]} material={mats.sofaLeather} radius={2} />
        <Block min={[hw - arm, -hd, 10]} size={[arm, d, backH - arm / 2]} material={mats.sofaLeather} radius={2} />
        {/* back with buttons */}
        <Block min={[-hw, hd - 24, 10]} size={[w, 24, backH]} material={mats.sofaLeather} radius={3} />
        {[0, 1, 2].map((row) =>
          Array.from({ length: 5 }, (_, i) => (
            <mesh
              key={`${row}-${i}`}
              position={toWorld(-hw + 22 + i * ((w - 44) / 4), hd - 24.5, 50 + row * 9)}
              rotation={[Math.PI / 2, 0, 0]}
              material={mats.sofaDark}
              castShadow={false}
            >
              <sphereGeometry args={[0.016, 8, 6]} />
            </mesh>
          )),
        )}
        <Block min={[-hw + arm, -hd, 10]} size={[w - 2 * arm, d - 24, seatH - 10]} material={mats.sofaDark} radius={2} />
        <SofaCushionRow x0={-hw + arm} x1={hw - arm} y0={-hd + 2} y1={hd - 26} z={seatH - 9} n={3} />
        {[-hw + 6, hw - 12].map((lx) => (
          <Block key={lx} min={[lx, -hd + 4, 0]} size={[6, 6, 10]} material={mats.artFrame} radius={0.5} />
        ))}
        <Block min={[-hw + 30, -hd + 6, seatH + 2]} size={[34, 16, 14]} material={mats.cushion} radius={4} castShadow={false} />
        <Block min={[hw - 64, -hd + 6, seatH + 2]} size={[34, 16, 14]} material={mats.cushion} radius={4} castShadow={false} />
      </group>
    );
  }

  if (style === "sectional") {
    const seatH = 42;
    const backH = 76;
    const arm = 18;
    const runD = 85; // the straight run along the back
    const chaiseW = 95;
    const y0 = -hd;
    const y1 = y0 + runD;
    return (
      <group>
        {/* long run */}
        <Block min={[-hw, y1 - 24, 8]} size={[w, 24, backH - 8]} material={mats.sofa} radius={3} />
        <Block min={[hw - arm, y0, 8]} size={[arm, runD, 60]} material={mats.sofaDark} radius={3} />
        <Block min={[-hw, y0, 8]} size={[w - arm, runD - 24, seatH - 8]} material={mats.sofaDark} radius={2} />
        <SofaCushionRow x0={-hw} x1={hw - arm} y0={y0 + 2} y1={y1 - 26} z={seatH - 9} n={3} />
        {/* chaise returning into the room */}
        <Block min={[-hw, y1 - 24, 8]} size={[chaiseW, d - runD + 24, seatH - 8]} material={mats.sofaDark} radius={2} />
        <SofaCushionRow x0={-hw + 2} x1={-hw + chaiseW - 2} y0={y1 - 20} y1={hd - 4} z={seatH - 9} n={2} />
        <Block min={[-hw, y1 - 24, seatH]} size={[arm, d - runD + 24, 26]} material={mats.sofaDark} radius={3} />
        {/* back cushions */}
        <Block min={[-hw + 6, y1 - 26, seatH]} size={[w - arm - 12, 18, 30]} material={mats.sofa} radius={4} castShadow={false} />
        <Block min={[-hw + 20, y0 + 6, seatH + 2]} size={[34, 16, 16]} material={mats.cushion} radius={4} castShadow={false} />
        <Block min={[hw - 70, y0 + 6, seatH + 2]} size={[34, 16, 16]} material={mats.cushion} radius={4} castShadow={false} />
        {[[-hw + 4, y0 + 4], [hw - 10, y0 + 4], [-hw + 4, hd - 10], [hw - 10, y1 - 10]].map(([lx, ly]) => (
          <Block key={`${lx}-${ly}`} min={[lx, ly, 0]} size={[6, 6, 8]} material={mats.artFrame} radius={0.5} />
        ))}
      </group>
    );
  }

  if (style === "loveseat") {
    const seatH = 43;
    const backH = 78;
    const arm = 18;
    return (
      <group>
        <Block min={[-hw, hd - 22, 12]} size={[w, 22, backH - 12]} material={mats.sofa} radius={4} />
        <Block min={[-hw, -hd, 12]} size={[arm, d, 62 - 12]} material={mats.sofa} radius={5} />
        <Block min={[hw - arm, -hd, 12]} size={[arm, d, 62 - 12]} material={mats.sofa} radius={5} />
        <Block min={[-hw + arm, -hd, 12]} size={[w - 2 * arm, d - 22, seatH - 12]} material={mats.sofaDark} radius={3} />
        <SofaCushionRow x0={-hw + arm} x1={hw - arm} y0={-hd + 2} y1={hd - 24} z={seatH - 9} n={2} />
        <Block min={[-hw + arm + 2, hd - 24, seatH]} size={[(w - 2 * arm) / 2 - 3, 18, 28]} material={mats.sofa} radius={4} castShadow={false} />
        <Block min={[1, hd - 24, seatH]} size={[(w - 2 * arm) / 2 - 3, 18, 28]} material={mats.sofa} radius={4} castShadow={false} />
        <Block min={[-hw + 24, -hd + 6, seatH + 2]} size={[32, 15, 15]} material={mats.cushion} radius={4} castShadow={false} />
        <Block min={[hw - 56, -hd + 6, seatH + 2]} size={[32, 15, 15]} material={mats.cushion} radius={4} castShadow={false} />
        {[[-hw + 5, -hd + 5], [hw - 11, -hd + 5], [-hw + 5, hd - 11], [hw - 11, hd - 11]].map(([lx, ly]) => (
          <mesh key={`${lx}-${ly}`} position={toWorld(lx + 3, ly + 3, 6)} rotation={[0.06, 0, 0.06]} material={mats.oakLight} castShadow>
            <cylinderGeometry args={[0.022, 0.016, 0.12, 10]} />
          </mesh>
        ))}
      </group>
    );
  }

  // the real sofa
  const arm = 18;
  const backD = 22;
  const feet = 8;
  return (
    <group>
      {[[-hw + 3, -hd + 3], [hw - 7, -hd + 3], [-hw + 3, hd - 7], [hw - 7, hd - 7]].map(([lx, ly]) => (
        <Block key={`${lx}-${ly}`} min={[lx, ly, 0]} size={[4, 4, feet]} material={mats.bedFrame} />
      ))}
      <Block min={[-hw + arm, -hd, feet]} size={[w - 2 * arm, d, P.SOFA_SEAT_H - feet - 6]} material={mats.sofaDark} radius={2.5} />
      <SofaCushionRow x0={-hw + arm + 1} x1={hw - arm - 1} y0={-hd + 2} y1={hd - backD - 2} z={P.SOFA_SEAT_H - 6} n={2} />
      <Block min={[-hw + arm, hd - backD, feet]} size={[w - 2 * arm, backD, P.SOFA_H - feet]} material={mats.sofa} radius={3} />
      <Block min={[-hw, -hd, feet]} size={[arm, d, 62 - feet]} material={mats.sofaDark} radius={3} />
      <Block min={[hw - arm, -hd, feet]} size={[arm, d, 62 - feet]} material={mats.sofaDark} radius={3} />
      <Block min={[-hw + 24, -hd + 6, P.SOFA_SEAT_H + 1]} size={[30, 15, 14]} material={mats.cushion} radius={4} castShadow={false} />
      <Block min={[hw - 54, -hd + 6, P.SOFA_SEAT_H + 1]} size={[30, 15, 14]} material={mats.cushion} radius={4} castShadow={false} />
    </group>
  );
}

function RoundTable() {
  const mats = useMaterials();
  const r = P.TABLE_DIAMETER / 2;
  const top = P.TABLE_H;
  const topT = 3;
  const leg = 6;
  const inset = 30;
  return (
    <group>
      <mesh position={toWorld(0, 0, top - topT / 2)} material={mats.table} castShadow receiveShadow>
        <cylinderGeometry args={[r / 100, r / 100, topT / 100, 64]} />
      </mesh>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sy]) => (
        <Block
          key={`${sx}${sy}`}
          min={[sx * inset - leg / 2, sy * inset - leg / 2, 0]}
          size={[leg, leg, top - topT]}
          material={mats.table}
          radius={0.3}
        />
      ))}
    </group>
  );
}

/** Draws whatever kind an item is. */
function Piece({ item }: { item: PlacedItem }) {
  if (isShelf(item.kind)) return <Shelf item={item} />;
  switch (item.kind) {
    case "bed":
      return <Bed item={item} />;
    case "sofa":
      return <Sofa item={item} />;
    case "table":
      return <RoundTable />;
    case "rug":
      return <Rug />;
    default:
      return null;
  }
}

export function Furnishings() {
  const layout = useDesignStore((s) => s.layout);
  const rugStyle = useDesignStore((s) => s.styles.rug);

  return (
    <group>
      {Object.entries(layout).map(([id, item]) => {
        if (item.kind === "rug" && rugStyle === "none") return null;
        return (
          <Movable key={id} id={id}>
            <Piece item={item} />
          </Movable>
        );
      })}
    </group>
  );
}
