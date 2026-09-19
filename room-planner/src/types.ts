export type Unit = "m" | "ft";

export type ViewId = "overview" | "top" | "kitchen" | "bed" | "table" | "kitchenAlong";

/** full-frame-equivalent focal length: 14 = phone 0.5× ultrawide, 24 = phone main, 35 = normal */
export type Lens = 14 | 24 | 35;

export interface RoomSettings {
  unit: Unit;
  wallOpacity: number;
  showCeiling: boolean;
  showDimensions: boolean;
  showExterior: boolean;
  lens: Lens;
}

export interface RoomDimensions {
  width: number;
  depth: number;
  height: number;
}

/**
 * Placeholder for the next phase: products the user uploads and places
 * inside the room. Positions are room centimeters (X, Y, Z).
 */
export interface PlacedProduct {
  id: string;
  name: string;
  modelUrl?: string;
  position: [number, number, number];
  rotationZ: number;
  dimensions: RoomDimensions;
}
