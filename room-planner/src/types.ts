export type Unit = "m" | "ft";

export interface RoomDimensions {
  /** left-right size, meters */
  width: number;
  /** front-back size, meters */
  depth: number;
  /** floor-to-ceiling size, meters */
  height: number;
}

export interface RoomSettings {
  dimensions: RoomDimensions;
  unit: Unit;
  wallOpacity: number;
  showCeiling: boolean;
  showGrid: boolean;
}

/**
 * Placeholder for the next phase: products the user uploads and places
 * inside the room. Not editable yet, but the room scene already knows
 * how to render whatever ends up in this list.
 */
export interface PlacedProduct {
  id: string;
  name: string;
  modelUrl?: string;
  position: [number, number, number];
  rotationY: number;
  dimensions: RoomDimensions;
}
