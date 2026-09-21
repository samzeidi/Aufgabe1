import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import {
  beechTexture,
  cooktopTexture,
  frostedTexture,
  kitchenTileTexture,
  oakFloorTexture,
  plasterTexture,
  tileStripTexture,
} from "./textures";
import * as P from "./params";
import { useDesignStore } from "../store/useDesignStore";

/** Colours of the real, unchangeable parts of the flat (calibrated from the photos). */
export const REAL = {
  wall: "#F1EEE5",
  ceiling: "#E2DFD8",
  baseboard: "#F2F0E9",
  floor: "#C6A88B",
  cabinet: "#C09A6C",
  counter: "#5E5954",
  tile: "#E8E2D2",
  windowFrame: "#1D2020",
  steel: "#A9ACA9",
  bedFrame: "#231C19",
  sofa: "#4C5B44",
  table: "#C4B59C",
  shelf: "#B08F68",
  door: "#EFEDE7",
};

function std(props: THREE.MeshStandardMaterialParameters) {
  return new THREE.MeshStandardMaterial(props);
}

function shade(hex: string, factor: number): THREE.Color {
  const c = new THREE.Color(hex);
  return factor >= 1
    ? c.lerp(new THREE.Color("#ffffff"), factor - 1)
    : c.multiplyScalar(factor);
}

export function createMaterials() {
  const floorTex = oakFloorTexture(P.NOOK_X1, P.ROOM_L);
  // white-based plaster so a material colour reproduces the chosen paint exactly
  const wallTex = plasterTexture("#FFFFFF", 400, 243);
  const ceilingTex = plasterTexture("#FFFFFF", 400, 624);
  const tileTex = kitchenTileTexture(P.KITCHEN_W, P.UPPER_Z0 - P.COUNTER_H);
  const stripTex = tileStripTexture(P.KITCHEN_W);
  const beech = beechTexture();

  const glass = new THREE.MeshPhysicalMaterial({
    color: "#DCE5E5",
    roughness: 0.05,
    metalness: 0,
    transparent: true,
    opacity: 0.18,
    ior: 1.45,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  return {
    // --- the real flat ---
    floor: std({ map: floorTex, roughness: 0.55, metalness: 0 }),
    wall: std({ map: wallTex, color: REAL.wall, roughness: 0.88, metalness: 0 }),
    wallAccent: std({ map: wallTex, color: REAL.wall, roughness: 0.88, metalness: 0 }),
    ceiling: std({ map: ceilingTex, color: REAL.ceiling, roughness: 0.9, side: THREE.DoubleSide }),
    baseboard: std({ color: REAL.baseboard, roughness: 0.6 }),
    cabinet: std({ map: beech, color: "#ffffff", roughness: 0.45, metalness: 0 }),
    cabinetField: std({ map: beech, color: "#e6dfd6", roughness: 0.47, metalness: 0 }),
    cabinetCarcass: std({ color: "#A27A50", roughness: 0.6 }),
    nicheInterior: std({ color: "#5a4a3a", roughness: 0.9 }),
    plinth: std({ color: "#2E2A26", roughness: 0.7 }),
    counter: std({ color: REAL.counter, roughness: 0.55, metalness: 0.05 }),
    tile: std({ map: tileTex, roughness: 0.35, metalness: 0 }),
    tileStrip: std({ map: stripTex, roughness: 0.4 }),
    steel: std({ color: REAL.steel, roughness: 0.23, metalness: 0.85 }),
    steelBrushed: std({ color: "#8E9291", roughness: 0.4, metalness: 0.75 }),
    handle: std({ color: "#B7B8B5", roughness: 0.25, metalness: 0.8 }),
    ovenGlass: std({ color: "#0E0F10", roughness: 0.15, metalness: 0.3 }),
    cooktop: std({ map: cooktopTexture(), roughness: 0.12, metalness: 0.2 }),
    frosted: std({ map: frostedTexture(), color: "#8f9493", roughness: 0.45, metalness: 0.25, transparent: true, opacity: 0.9 }),
    windowFrame: std({ color: REAL.windowFrame, roughness: 0.3, metalness: 0.1 }),
    glass,
    blind: std({ color: "#E9E7E0", roughness: 0.6 }),
    bedFrame: std({ color: REAL.bedFrame, roughness: 0.45, metalness: 0.15 }),
    bedPanel: std({ color: "#3A322C", roughness: 0.6 }),
    table: std({ color: REAL.table, roughness: 0.5 }),
    shelf: std({ color: REAL.shelf, roughness: 0.6 }),
    door: std({ color: REAL.door, roughness: 0.5 }),
    doorHandle: std({ color: "#C4C6C4", roughness: 0.25, metalness: 0.85 }),
    switchPlate: std({ color: "#F4F3EE", roughness: 0.45 }),
    lamp: std({
      color: "#F4EFD9",
      emissive: "#FFE2B0",
      emissiveIntensity: 0.9,
      roughness: 0.9,
      transparent: true,
      opacity: 0.95,
    }),
    lampCord: std({ color: "#f2f2f2", roughness: 0.6 }),

    // --- outside ---
    railing: std({ color: "#3A3C3D", roughness: 0.4, metalness: 0.6 }),
    balcony: std({ color: "#A6A39C", roughness: 0.9 }),
    facade: std({ color: "#9A9A96", roughness: 0.95 }),
    facadeDark: std({ color: "#7E7C78", roughness: 0.95 }),
    facadeWindow: std({ color: "#3b4450", roughness: 0.3, metalness: 0.2 }),
    roof: std({ color: "#7A4A3A", roughness: 0.9 }),
    ground: std({ color: "#5E5E5C", roughness: 1 }),
    black: std({ color: "#141516", roughness: 0.5 }),

    // --- decorated, driven by the design store ---
    sofa: std({ color: REAL.sofa, roughness: 0.8 }),
    sofaDark: std({ color: REAL.sofa, roughness: 0.82 }),
    sofaLeather: std({ color: REAL.sofa, roughness: 0.5, metalness: 0.05 }),
    cushion: std({ color: "#9E937E", roughness: 0.85 }),
    bedding: std({ color: "#E9E5DE", roughness: 0.9 }),
    beddingSoft: std({ color: "#E9E5DE", roughness: 0.92 }),
    throwBlanket: std({ color: "#C9BFA9", roughness: 0.95 }),
    rug: std({ color: "#C9B8A2", roughness: 0.95 }),
    rugBorder: std({ color: "#B3A184", roughness: 0.95 }),
    curtain: std({ color: "#E6E1D6", roughness: 0.9, side: THREE.DoubleSide }),
    artCanvas: std({ color: "#8A907F", roughness: 0.8 }),
    artFrame: std({ color: "#3A3229", roughness: 0.5 }),
    leaf: std({ color: "#4E6B45", roughness: 0.75, side: THREE.DoubleSide }),
    leafDark: std({ color: "#3C5537", roughness: 0.75, side: THREE.DoubleSide }),
    pot: std({ color: "#B9A88E", roughness: 0.85 }),
    soil: std({ color: "#3A2F26", roughness: 1 }),
    shelfBack: std({ color: "#8E7250", roughness: 0.8 }),
    stem: std({ color: "#5A6B46", roughness: 0.8 }),
    oakLight: std({ color: "#C2A176", roughness: 0.55 }),
    upholstery: std({ color: "#C9BFAE", roughness: 0.9 }),
    brass: std({ color: "#C2A25B", roughness: 0.3, metalness: 0.8 }),
  };
}

const bookCache = new Map<string, THREE.MeshStandardMaterial>();
function bookMaterial(color: string) {
  let m = bookCache.get(color);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
    bookCache.set(color, m);
  }
  return m;
}

export type Materials = ReturnType<typeof createMaterials> & { book: (color: string) => THREE.MeshStandardMaterial };

const MaterialsContext = createContext<Materials | null>(null);

/** Pushes the chosen palette onto the materials that are allowed to change. */
function ApplyDesignColors({ materials }: { materials: Materials }) {
  const colors = useDesignStore((s) => s.colors);

  useEffect(() => {
    materials.wall.color.set(colors.wall);
    materials.wallAccent.color.set(colors.accentWall);
    materials.ceiling.color.set(colors.ceiling);
    materials.sofa.color.set(colors.sofa);
    materials.sofaDark.color.copy(shade(colors.sofa, 0.88));
    materials.sofaLeather.color.set(colors.sofa);
    materials.cushion.color.set(colors.cushions);
    materials.bedding.color.set(colors.bedding);
    materials.beddingSoft.color.copy(shade(colors.bedding, 1.06));
    materials.throwBlanket.color.set(colors.throwBlanket);
    materials.rug.color.set(colors.rug);
    materials.rugBorder.color.copy(shade(colors.rug, 0.82));
    materials.curtain.color.set(colors.curtains);
    materials.artCanvas.color.set(colors.art);
  }, [colors, materials]);

  return null;
}

export function MaterialsProvider({ children }: { children: ReactNode }) {
  const materials = useMemo(() => ({ ...createMaterials(), book: bookMaterial }), []);
  return (
    <MaterialsContext.Provider value={materials}>
      <ApplyDesignColors materials={materials} />
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials(): Materials {
  const materials = useContext(MaterialsContext);
  if (!materials) throw new Error("useMaterials must be used inside MaterialsProvider");
  return materials;
}
