import { createContext, useContext, useMemo, type ReactNode } from "react";
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

export const PALETTE = {
  wall: "#F1EEE5",
  wallAlt: "#ECE8DD",
  ceiling: "#ECEAE4",
  baseboard: "#F2F0E9",
  floor: "#AF916C",
  cabinet: "#A97848",
  counter: "#292A27",
  tile: "#DDD7CA",
  grout: "#B8B3A9",
  windowFrame: "#1D2020",
  glass: "#DCE5E5",
  steel: "#A9ACA9",
  handle: "#B7B8B5",
  bedFrame: "#392D27",
  mattress: "#F4F1EA",
  sofa: "#A79A80",
  table: "#A99D87",
  shelf: "#896341",
  lamp: "#F4EFD9",
  door: "#EFEDE7",
  blind: "#E9E7E0",
  plinth: "#2E2A26",
  ovenGlass: "#0E0F10",
  railing: "#3A3C3D",
  facade: "#9A9A96",
  facadeDark: "#7E7C78",
  roof: "#7A4A3A",
  ground: "#5E5E5C",
};

function std(props: THREE.MeshStandardMaterialParameters) {
  return new THREE.MeshStandardMaterial(props);
}

export function createMaterials() {
  const floorTex = oakFloorTexture(P.NOOK_X1, P.ROOM_L);
  const wallTex = plasterTexture(PALETTE.wall, 400, 243);
  const ceilingTex = plasterTexture("#E2DFD8", 400, 624);
  const tileTex = kitchenTileTexture(P.KITCHEN_W, P.UPPER_Z0 - P.COUNTER_H);
  const stripTex = tileStripTexture(P.KITCHEN_W);
  const beech = beechTexture();

  const wall = std({ map: wallTex, roughness: 0.88, metalness: 0 });
  wall.transparent = false;

  const glass = new THREE.MeshPhysicalMaterial({
    color: PALETTE.glass,
    roughness: 0.05,
    metalness: 0,
    transparent: true,
    opacity: 0.18,
    ior: 1.45,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  return {
    floor: std({ map: floorTex, roughness: 0.55, metalness: 0 }),
    wall,
    ceiling: std({ map: ceilingTex, roughness: 0.9, metalness: 0, side: THREE.DoubleSide }),
    baseboard: std({ color: PALETTE.baseboard, roughness: 0.6 }),
    cabinet: std({ map: beech, color: "#ffffff", roughness: 0.45, metalness: 0 }),
    cabinetField: std({ map: beech, color: "#e6dfd6", roughness: 0.47, metalness: 0 }),
    cabinetCarcass: std({ color: "#A27A50", roughness: 0.6 }),
    nicheInterior: std({ color: "#5a4a3a", roughness: 0.9 }),
    plinth: std({ color: PALETTE.plinth, roughness: 0.7 }),
    counter: std({ color: "#5E5954", roughness: 0.55, metalness: 0.05 }),
    tile: std({ map: tileTex, roughness: 0.35, metalness: 0 }),
    tileStrip: std({ map: stripTex, roughness: 0.4 }),
    steel: std({ color: PALETTE.steel, roughness: 0.23, metalness: 0.85 }),
    steelBrushed: std({ color: "#8E9291", roughness: 0.4, metalness: 0.75 }),
    handle: std({ color: PALETTE.handle, roughness: 0.25, metalness: 0.8 }),
    ovenGlass: std({ color: PALETTE.ovenGlass, roughness: 0.15, metalness: 0.3 }),
    cooktop: std({ map: cooktopTexture(), roughness: 0.12, metalness: 0.2 }),
    frosted: std({ map: frostedTexture(), color: "#8f9493", roughness: 0.45, metalness: 0.25, transparent: true, opacity: 0.9 }),
    windowFrame: std({ color: PALETTE.windowFrame, roughness: 0.3, metalness: 0.1 }),
    glass,
    blind: std({ color: PALETTE.blind, roughness: 0.6 }),
    bedFrame: std({ color: "#231C19", roughness: 0.45, metalness: 0.15 }),
    bedPanel: std({ color: "#3A322C", roughness: 0.6 }),
    mattress: std({ color: "#E9E5DE", roughness: 0.9 }),
    sofa: std({ color: "#B7AC95", roughness: 0.8 }),
    sofaDark: std({ color: "#A69B84", roughness: 0.82 }),
    table: std({ color: "#C4B59C", roughness: 0.5 }),
    shelf: std({ color: "#B08F68", roughness: 0.6 }),
    lamp: std({
      color: PALETTE.lamp,
      emissive: "#FFE2B0",
      emissiveIntensity: 0.9,
      roughness: 0.9,
      transparent: true,
      opacity: 0.95,
    }),
    lampCord: std({ color: "#f2f2f2", roughness: 0.6 }),
    door: std({ color: PALETTE.door, roughness: 0.5 }),
    doorHandle: std({ color: "#C4C6C4", roughness: 0.25, metalness: 0.85 }),
    switchPlate: std({ color: "#F4F3EE", roughness: 0.45 }),
    railing: std({ color: PALETTE.railing, roughness: 0.4, metalness: 0.6 }),
    balcony: std({ color: "#A6A39C", roughness: 0.9 }),
    facade: std({ color: PALETTE.facade, roughness: 0.95 }),
    facadeDark: std({ color: PALETTE.facadeDark, roughness: 0.95 }),
    facadeWindow: std({ color: "#3b4450", roughness: 0.3, metalness: 0.2 }),
    roof: std({ color: PALETTE.roof, roughness: 0.9 }),
    ground: std({ color: PALETTE.ground, roughness: 1 }),
    black: std({ color: "#141516", roughness: 0.5 }),
  };
}

export type Materials = ReturnType<typeof createMaterials>;

const MaterialsContext = createContext<Materials | null>(null);

export function MaterialsProvider({ children }: { children: ReactNode }) {
  const materials = useMemo(() => createMaterials(), []);
  return <MaterialsContext.Provider value={materials}>{children}</MaterialsContext.Provider>;
}

export function useMaterials(): Materials {
  const materials = useContext(MaterialsContext);
  if (!materials) throw new Error("useMaterials must be used inside MaterialsProvider");
  return materials;
}
