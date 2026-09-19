// Room coordinates are centimeters with Z up (see params.ts).
// three.js world is meters with Y up:  (x, y, z)_three = (X, Z, -Y)_room / 100

export type Cm3 = [number, number, number];

export function toWorld(x: number, y: number, z: number): [number, number, number] {
  return [x / 100, z / 100, -y / 100];
}

export function m(cm: number): number {
  return cm / 100;
}
