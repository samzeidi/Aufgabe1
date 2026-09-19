import { Html, Line } from "@react-three/drei";
import { toWorld } from "../../room/coords";
import * as P from "../../room/params";

const Z = P.ROOM_H + 8;
const COLOR = "#ff6a3d";

function Label({ x, y, text, accent }: { x: number; y: number; text: string; accent?: boolean }) {
  return (
    <Html position={toWorld(x, y, Z)} center zIndexRange={[50, 0]} style={{ pointerEvents: "none" }}>
      <div className={`dim-label ${accent ? "accent" : ""}`}>{text}</div>
    </Html>
  );
}

/** Dimension line between two room points with end ticks and a centered label. */
function Dim({
  from,
  to,
  text,
  tick = 12,
}: {
  from: [number, number];
  to: [number, number];
  text: string;
  tick?: number;
}) {
  const horizontal = from[1] === to[1];
  const a = toWorld(from[0], from[1], Z);
  const b = toWorld(to[0], to[1], Z);
  const t1 = horizontal
    ? [toWorld(from[0], from[1] - tick / 2, Z), toWorld(from[0], from[1] + tick / 2, Z)]
    : [toWorld(from[0] - tick / 2, from[1], Z), toWorld(from[0] + tick / 2, from[1], Z)];
  const t2 = horizontal
    ? [toWorld(to[0], to[1] - tick / 2, Z), toWorld(to[0], to[1] + tick / 2, Z)]
    : [toWorld(to[0] - tick / 2, to[1], Z), toWorld(to[0] + tick / 2, to[1], Z)];
  return (
    <group>
      <Line points={[a, b]} color={COLOR} lineWidth={1.5} />
      <Line points={t1 as [number, number, number][]} color={COLOR} lineWidth={1.5} />
      <Line points={t2 as [number, number, number][]} color={COLOR} lineWidth={1.5} />
      <Label x={(from[0] + to[0]) / 2} y={(from[1] + to[1]) / 2} text={text} />
    </group>
  );
}

export function Dimensions() {
  const L = P.ROOM_L;
  const W = P.ROOM_W;
  return (
    <group>
      {/* room envelope */}
      <Dim from={[0, -45]} to={[W, -45]} text="400" />
      <Dim from={[-95, 0]} to={[-95, L]} text="624" />

      {/* window wall sequence */}
      <Dim from={[-50, 0]} to={[-50, P.WINDOW1_Y0]} text="107" />
      <Dim from={[-50, P.WINDOW1_Y0]} to={[-50, P.WINDOW1_Y1]} text="127" />
      <Dim from={[-50, P.WINDOW1_Y1]} to={[-50, P.WINDOW2_Y0]} text="131" />
      <Dim from={[-50, P.WINDOW2_Y0]} to={[-50, P.WINDOW2_Y1]} text="127" />
      <Dim from={[-50, P.WINDOW2_Y1]} to={[-50, L]} text="132" />

      {/* kitchen */}
      <Dim from={[0, L + 50]} to={[P.KITCHEN_X0, L + 50]} text="110" />
      <Dim from={[P.KITCHEN_X0, L + 50]} to={[P.KITCHEN_X1, L + 50]} text="285" />

      {/* right solid wall */}
      <Dim from={[W + 60, 0]} to={[W + 60, P.RIGHT_WALL]} text="305" />

      {/* furniture */}
      <Label x={P.BED_X0 + P.BED_W / 2} y={P.BED_Y0 + P.BED_L / 2} text="140 × 200" accent />
      <Label x={P.TABLE_CX} y={P.TABLE_CY} text="Ø110" accent />
      <Label x={P.SOFA_X0 + P.SOFA_L / 2} y={P.SOFA_Y0 + P.SOFA_D / 2} text="150" accent />
      <Label x={P.SHELF_BEDSIDE.x + 18} y={P.SHELF_BEDSIDE.y + 15} text="36×30" accent />
    </group>
  );
}
