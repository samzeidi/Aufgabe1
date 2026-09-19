import type { Unit } from "./types";

const METERS_PER_FOOT = 0.3048;

export function metersToDisplay(meters: number, unit: Unit): number {
  return unit === "ft" ? meters / METERS_PER_FOOT : meters;
}

export function displayToMeters(value: number, unit: Unit): number {
  return unit === "ft" ? value * METERS_PER_FOOT : value;
}

export function formatLength(meters: number, unit: Unit): string {
  const value = metersToDisplay(meters, unit);
  return `${value.toFixed(2)} ${unit}`;
}
