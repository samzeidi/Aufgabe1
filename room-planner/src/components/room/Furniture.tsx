import { Block } from "./Block";
import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import * as P from "../../room/params";

function Bed() {
  const mats = useMaterials();
  const x0 = P.BED_X0;
  const x1 = x0 + P.BED_W;
  const y0 = P.BED_Y0;
  const y1 = y0 + P.BED_L;
  const r = 5; // rail thickness
  const legH = 20;
  const railZ0 = legH;
  const railZ1 = P.BED_FRAME_H;
  return (
    <group>
      {/* legs */}
      {[
        [x0, y0],
        [x1 - r, y0],
        [x0, y1 - r],
        [x1 - r, y1 - r],
      ].map(([lx, ly]) => (
        <Block key={`${lx}-${ly}`} min={[lx, ly, 0]} size={[r, r, legH]} material={mats.bedFrame} radius={0.3} />
      ))}
      {/* rails */}
      <Block min={[x0, y0, railZ0]} size={[P.BED_W, r, railZ1 - railZ0]} material={mats.bedFrame} radius={0.3} />
      <Block min={[x0, y1 - r, railZ0]} size={[P.BED_W, r, railZ1 - railZ0]} material={mats.bedFrame} radius={0.3} />
      <Block min={[x0, y0, railZ0]} size={[r, P.BED_L, railZ1 - railZ0]} material={mats.bedFrame} radius={0.3} />
      <Block min={[x1 - r, y0, railZ0]} size={[r, P.BED_L, railZ1 - railZ0]} material={mats.bedFrame} radius={0.3} />
      {/* slat base */}
      <Block min={[x0 + r, y0 + r, railZ1 - 3]} size={[P.BED_W - 2 * r, P.BED_L - 2 * r, 3]} material={mats.bedFrame} />
      {/* headboard against the bed wall */}
      <Block min={[x0, y0, railZ1]} size={[r, r, P.HEADBOARD_H - railZ1]} material={mats.bedFrame} radius={0.3} />
      <Block min={[x1 - r, y0, railZ1]} size={[r, r, P.HEADBOARD_H - railZ1]} material={mats.bedFrame} radius={0.3} />
      <Block min={[x0, y0, P.HEADBOARD_H - 5]} size={[P.BED_W, r, 5]} material={mats.bedFrame} radius={0.3} />
      <Block min={[x0, y0, 45]} size={[P.BED_W, r, 4]} material={mats.bedFrame} radius={0.3} />
      <Block min={[x0 + 15, y0 + 1, 49]} size={[P.BED_W - 30, 3, P.HEADBOARD_H - 5 - 49]} material={mats.bedPanel} radius={0.3} />
      {/* mattress */}
      <Block
        min={[x0 + 2, y0 + 3, railZ1]}
        size={[P.BED_W - 4, P.BED_L - 6, P.MATTRESS_T]}
        material={mats.mattress}
        radius={3}
      />
    </group>
  );
}

function Sofa() {
  const mats = useMaterials();
  const x0 = P.SOFA_X0;
  const x1 = x0 + P.SOFA_L;
  const y0 = P.SOFA_Y0;
  const y1 = y0 + P.SOFA_D;
  const arm = 18;
  const backD = 22;
  const feet = 8;
  return (
    <group>
      {[
        [x0 + 3, y0 + 3],
        [x1 - 7, y0 + 3],
        [x0 + 3, y1 - 7],
        [x1 - 7, y1 - 7],
      ].map(([fx, fy]) => (
        <Block key={`${fx}-${fy}`} min={[fx, fy, 0]} size={[4, 4, feet]} material={mats.bedFrame} />
      ))}
      {/* seat base */}
      <Block min={[x0 + arm, y0, feet]} size={[x1 - x0 - 2 * arm, P.SOFA_D, P.SOFA_SEAT_H - feet - 6]} material={mats.sofaDark} radius={2.5} />
      {/* seat cushions */}
      <Block min={[x0 + arm + 1, y0 + 2, P.SOFA_SEAT_H - 6]} size={[(x1 - x0 - 2 * arm) / 2 - 1.5, y1 - backD - y0 - 2, 8]} material={mats.sofa} radius={3} />
      <Block
        min={[x0 + arm + (x1 - x0 - 2 * arm) / 2 + 0.5, y0 + 2, P.SOFA_SEAT_H - 6]}
        size={[(x1 - x0 - 2 * arm) / 2 - 1.5, y1 - backD - y0 - 2, 8]}
        material={mats.sofa}
        radius={3}
      />
      {/* backrest */}
      <Block min={[x0 + arm, y1 - backD, feet]} size={[x1 - x0 - 2 * arm, backD, P.SOFA_H - feet]} material={mats.sofa} radius={3} />
      {/* arms */}
      <Block min={[x0, y0, feet]} size={[arm, P.SOFA_D, 62 - feet]} material={mats.sofaDark} radius={3} />
      <Block min={[x1 - arm, y0, feet]} size={[arm, P.SOFA_D, 62 - feet]} material={mats.sofaDark} radius={3} />
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
      <mesh position={toWorld(P.TABLE_CX, P.TABLE_CY, top - topT / 2)} material={mats.table} castShadow receiveShadow>
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
          min={[P.TABLE_CX + sx * inset - leg / 2, P.TABLE_CY + sy * inset - leg / 2, 0]}
          size={[leg, leg, top - topT]}
          material={mats.table}
          radius={0.3}
        />
      ))}
    </group>
  );
}

function Shelf({ x, y, h }: { x: number; y: number; h: number }) {
  const mats = useMaterials();
  const t = 2;
  const boards = h > 90 ? [0, h / 3, (2 * h) / 3, h - t] : [0, h / 2, h - t];
  return (
    <group>
      <Block min={[x, y, 0]} size={[t, P.SHELF_D, h]} material={mats.shelf} radius={0.2} />
      <Block min={[x + P.SHELF_W - t, y, 0]} size={[t, P.SHELF_D, h]} material={mats.shelf} radius={0.2} />
      {boards.map((z) => (
        <Block key={z} min={[x + t, y, z]} size={[P.SHELF_W - 2 * t, P.SHELF_D, t]} material={mats.shelf} radius={0.2} />
      ))}
    </group>
  );
}

export function Furniture() {
  return (
    <group>
      <Bed />
      <Sofa />
      <RoundTable />
      <Shelf {...P.SHELF_BEDSIDE} />
      <Shelf {...P.SHELF_CORNER} />
      <Shelf {...P.SHELF_KITCHEN_SIDE} />
      <Shelf {...P.SHELF_BETWEEN_WINDOWS} />
    </group>
  );
}
