import { Block } from "./Block";
import { toWorld } from "../../room/coords";
import { useMaterials } from "../../room/materials";
import { SHELF_HEIGHT, shelfWidth, type PlacedItem } from "../../room/design";
import { useDesignStore } from "../../store/useDesignStore";

const BOOK_COLORS = ["#7A6A58", "#8E5B4A", "#5E6B5A", "#C4B49C", "#3E4639", "#9A7B52"];

/** A row of books sitting on a board. */
function Books({ x0, x1, y, z, seed }: { x0: number; x1: number; y: number; z: number; seed: number }) {
  const mats = useMaterials();
  const books: { x: number; w: number; h: number; c: string; lean: number }[] = [];
  let x = x0 + 2;
  let n = seed;
  const rnd = () => {
    n = (n * 1103515245 + 12345) & 0x7fffffff;
    return n / 0x7fffffff;
  };
  while (x < x1 - 6) {
    const w = 2 + rnd() * 2.5;
    if (x + w > x1 - 3) break;
    books.push({ x, w, h: 16 + rnd() * 7, c: BOOK_COLORS[Math.floor(rnd() * BOOK_COLORS.length)], lean: 0 });
    x += w + 0.4;
  }
  return (
    <group>
      {books.map((b, i) => (
        <Block
          key={i}
          min={[b.x, y, z]}
          size={[b.w, 16, b.h]}
          material={mats.book(b.c)}
          radius={0.15}
          castShadow={false}
        />
      ))}
    </group>
  );
}

/**
 * A trailing plant: pot, a small bushy top and vines that grow out and along
 * the wall behind the shelf, plus a couple hanging over the front edge.
 */
export function TrailingPlant({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const mats = useMaterials();
  const s = scale;

  // each vine: direction along the wall (+1/-1), length, how far it climbs
  const vines = [
    { dir: 1, len: 52, rise: 26, droop: 0 },
    { dir: -1, len: 40, rise: 18, droop: 0 },
    { dir: 1, len: 30, rise: -34, droop: 1 },
    { dir: -1, len: 24, rise: -28, droop: 1 },
  ];

  return (
    <group position={toWorld(x, 0, z)}>
      {/* pot */}
      <mesh position={toWorld(0, 0, 6 * s)} material={mats.pot} castShadow>
        <cylinderGeometry args={[(7 * s) / 100, (5.5 * s) / 100, (12 * s) / 100, 16]} />
      </mesh>
      <mesh position={toWorld(0, 0, 12 * s)} material={mats.soil} castShadow={false}>
        <cylinderGeometry args={[(6.6 * s) / 100, (6.6 * s) / 100, 0.01, 16]} />
      </mesh>
      {/* bushy top */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((a, i) => (
        <mesh
          key={a}
          position={toWorld(Math.cos(a) * 5 * s, Math.sin(a) * 4 * s, (17 + (i % 2) * 3) * s)}
          rotation={[0, -a, 0.9]}
          scale={[0.05 * s, 0.012, 0.035 * s]}
          material={i % 2 ? mats.leafDark : mats.leaf}
          castShadow={false}
        >
          <sphereGeometry args={[1, 8, 6]} />
        </mesh>
      ))}
      {/* vines along the wall */}
      {vines.map((v, vi) => {
        const steps = Math.max(4, Math.round(v.len / 7));
        return (
          <group key={vi}>
            {Array.from({ length: steps }, (_, i) => {
              const tt = (i + 1) / steps;
              const vx = v.dir * v.len * tt;
              // climbing vines arc upward, drooping ones fall away
              const vz = v.droop
                ? 14 * s + v.rise * tt * tt
                : 16 * s + v.rise * Math.sin(tt * 1.4);
              const wobble = Math.sin(tt * 6 + vi) * 2.5;
              return (
                <group key={i}>
                  <mesh
                    position={toWorld(vx, wobble * 0.3, vz)}
                    rotation={[0, 0, v.droop ? -0.5 : 0.25 * v.dir]}
                    scale={[0.028 * s, 0.008, 0.02 * s]}
                    material={i % 2 ? mats.leafDark : mats.leaf}
                    castShadow={false}
                  >
                    <sphereGeometry args={[1, 6, 6]} />
                  </mesh>
                  {i < steps - 1 && (
                    <mesh
                      position={toWorld(vx - (v.dir * v.len) / steps / 2, wobble * 0.3, vz)}
                      rotation={[0, 0, Math.PI / 2]}
                      material={mats.stem}
                      castShadow={false}
                    >
                      <cylinderGeometry args={[0.004, 0.004, v.len / steps / 100, 5]} />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

/**
 * Every shelf kind, drawn around its own centre with local z = 0 at its base.
 * Widths are whatever the item carries (40 / 60 / 80, or the real 36).
 */
export function Shelf({ item }: { item: PlacedItem }) {
  const mats = useMaterials();
  const showPlants = useDesignStore((s) => s.styles.plants);
  const w = shelfWidth(item);
  const h = SHELF_HEIGHT[item.kind] ?? 75;
  const t = 2;

  if (item.kind === "wallShelf") {
    const d = 22;
    return (
      <group>
        <Block min={[-w / 2, -d / 2, 0]} size={[w, d, 3.5]} material={mats.shelf} radius={0.4} />
        {/* brackets underneath */}
        {[-w / 2 + 7, w / 2 - 10].map((bx) => (
          <Block key={bx} min={[bx, -d / 2 + 3, -7]} size={[3, d - 8, 7]} material={mats.artFrame} radius={0.2} castShadow={false} />
        ))}
        {showPlants && <TrailingPlant x={-w / 2 + 12} z={3.5} scale={0.95} />}
        <Books x0={-w / 2 + 16} x1={w / 2 - 4} y={-8} z={3.5} seed={Math.round(w * 31)} />
      </group>
    );
  }

  if (item.kind === "cubeShelf") {
    const d = 39;
    const half = w / 2;
    return (
      <group>
        <Block min={[-half, -d / 2, 0]} size={[t, d, h]} material={mats.shelf} radius={0.2} />
        <Block min={[half - t, -d / 2, 0]} size={[t, d, h]} material={mats.shelf} radius={0.2} />
        <Block min={[-half, -d / 2, 0]} size={[w, d, t]} material={mats.shelf} radius={0.2} />
        <Block min={[-half, -d / 2, h / 2 - t / 2]} size={[w, d, t]} material={mats.shelf} radius={0.2} />
        <Block min={[-half, -d / 2, h - t]} size={[w, d, t]} material={mats.shelf} radius={0.2} />
        <Block min={[-t / 2, -d / 2, 0]} size={[t, d, h]} material={mats.shelf} radius={0.2} />
        <Block min={[-half, d / 2 - 0.6, 0]} size={[w, 0.6, h]} material={mats.shelfBack} castShadow={false} />
        <Books x0={-half + t + 2} x1={-2} y={-8} z={h / 2 + t / 2} seed={7} />
        <Books x0={t} x1={half - t - 2} y={-8} z={t} seed={13} />
        {showPlants && <TrailingPlant x={-half + 14} z={h} />}
      </group>
    );
  }

  // standing shelves: small, tall, bookcase
  const d = item.kind === "bookcase" ? 30 : 30;
  const shelfCount = item.kind === "bookcase" ? 4 : h > 90 ? 3 : 2;
  const gaps = Array.from({ length: shelfCount }, (_, i) => ((i + 1) * (h - t)) / (shelfCount + 1));
  const boards = [0, ...gaps, h - t];

  return (
    <group>
      <Block min={[-w / 2, -d / 2, 0]} size={[t, d, h]} material={mats.shelf} radius={0.2} />
      <Block min={[w / 2 - t, -d / 2, 0]} size={[t, d, h]} material={mats.shelf} radius={0.2} />
      {boards.map((z) => (
        <Block key={z} min={[-w / 2 + t, -d / 2, z]} size={[w - 2 * t, d, t]} material={mats.shelf} radius={0.2} />
      ))}
      <Block min={[-w / 2, d / 2 - 0.6, 0]} size={[w, 0.6, h]} material={mats.shelfBack} castShadow={false} />
      {gaps.map((z, i) =>
        i % 2 === 0 ? <Books key={z} x0={-w / 2 + t + 2} x1={w / 2 - t - 2} y={-8} z={z + t} seed={i * 17 + 3} /> : null,
      )}
      {showPlants && <TrailingPlant x={w / 2 - 13} z={h} />}
    </group>
  );
}
