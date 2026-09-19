import { Block } from "./Block";
import { useMaterials } from "../../room/materials";
import * as P from "../../room/params";

const FRAME_X0 = -16; // frame sits inside the 20 cm wall, leaving an 8 cm inner reveal
const FRAME_T = 8;
const OUTER = 6; // outer frame member width
const SASH = 5; // sash frame member width
const MEETING = 5; // half-width of the central meeting stiles

function Panel({ y0, y1, z0, z1 }: { y0: number; y1: number; z0: number; z1: number }) {
  const mats = useMaterials();
  const sashX0 = FRAME_X0 + 1;
  const sashT = FRAME_T - 2;
  return (
    <group>
      <Block min={[sashX0, y0, z0]} size={[sashT, SASH, z1 - z0]} material={mats.windowFrame} />
      <Block min={[sashX0, y1 - SASH, z0]} size={[sashT, SASH, z1 - z0]} material={mats.windowFrame} />
      <Block min={[sashX0, y0, z1 - SASH]} size={[sashT, y1 - y0, SASH]} material={mats.windowFrame} />
      <Block min={[sashX0, y0, z0]} size={[sashT, y1 - y0, SASH]} material={mats.windowFrame} />
      <Block
        min={[FRAME_X0 + FRAME_T / 2 - 0.4, y0 + SASH, z0 + SASH]}
        size={[0.8, y1 - y0 - 2 * SASH, z1 - z0 - 2 * SASH]}
        material={mats.glass}
        castShadow={false}
        receiveShadow={false}
      />
    </group>
  );
}

function FrenchWindow({ y0 }: { y0: number }) {
  const mats = useMaterials();
  const y1 = y0 + P.WINDOW_W;
  const z0 = P.WINDOW_SILL;
  const z1 = P.WINDOW_TOP;
  const yc = (y0 + y1) / 2;
  const innerZ0 = z0 + OUTER;
  const innerZ1 = z1 - OUTER;
  return (
    <group>
      {/* outer frame */}
      <Block min={[FRAME_X0, y0, z0]} size={[FRAME_T, OUTER, z1 - z0]} material={mats.windowFrame} />
      <Block min={[FRAME_X0, y1 - OUTER, z0]} size={[FRAME_T, OUTER, z1 - z0]} material={mats.windowFrame} />
      <Block min={[FRAME_X0, y0, z1 - OUTER]} size={[FRAME_T, P.WINDOW_W, OUTER]} material={mats.windowFrame} />
      <Block min={[FRAME_X0, y0, z0]} size={[FRAME_T, P.WINDOW_W, OUTER]} material={mats.windowFrame} />
      {/* two tall glazed panels meeting in the middle */}
      <Panel y0={y0 + OUTER} y1={yc - MEETING + SASH} z0={innerZ0} z1={innerZ1} />
      <Panel y0={yc + MEETING - SASH} y1={y1 - OUTER} z0={innerZ0} z1={innerZ1} />
      {/* handle on the left leaf, at the meeting stile */}
      <Block min={[FRAME_X0 + FRAME_T, yc - 4, 108]} size={[2, 2.5, 2.5]} material={mats.windowFrame} radius={0.4} />
      <Block min={[FRAME_X0 + FRAME_T + 1.5, yc - 4, 100]} size={[1.6, 1.6, 12]} material={mats.windowFrame} radius={0.4} />
    </group>
  );
}

export function Windows() {
  return (
    <group>
      <FrenchWindow y0={P.WINDOW1_Y0} />
      <FrenchWindow y0={P.WINDOW2_Y0} />
    </group>
  );
}
