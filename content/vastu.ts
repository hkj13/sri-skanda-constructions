import { en, type L } from "./i18n";

/**
 * Vastu guidance shown in the home page planning chapter.
 *
 * This is general, traditional guidance in plain words. The interactive
 * layout is always labelled "indicative": the real plan comes from the
 * consultation about a specific plot.
 *
 * The plot is a 3 x 3 grid. Rows run north (0) to south (2), columns run
 * west (0) to east (2), so { row: 0, col: 2 } is the north-east corner.
 *
 * TODO(client): have your Vastu consultant read this and correct it.
 */
export type Facing = "N" | "E" | "S" | "W";
export type RoomId =
  | "pooja"
  | "kitchen"
  | "master"
  | "living"
  | "dining"
  | "bedroom"
  | "stairs"
  | "bath";

export type Cell = { row: 0 | 1 | 2; col: 0 | 1 | 2 };

export const FACINGS: { id: Facing; label: L }[] = [
  { id: "N", label: en("North") },
  { id: "E", label: en("East") },
  { id: "S", label: en("South") },
  { id: "W", label: en("West") },
];

export const ROOMS: Record<RoomId, { label: L; short: L; note: L }> = {
  pooja: { label: en("Pooja room"), short: en("Pooja"), note: en("North-east, the quietest and brightest corner.") },
  kitchen: { label: en("Kitchen"), short: en("Kitchen"), note: en("South-east, the corner linked with fire.") },
  master: { label: en("Master bedroom"), short: en("Master"), note: en("South-west, the most settled corner.") },
  living: { label: en("Living room"), short: en("Living"), note: en("Near the entrance, open to the north or east.") },
  dining: { label: en("Dining"), short: en("Dining"), note: en("Close to the kitchen.") },
  bedroom: { label: en("Bedroom"), short: en("Bedroom"), note: en("West or south side.") },
  stairs: { label: en("Stairs"), short: en("Stairs"), note: en("South or west, away from the centre.") },
  bath: { label: en("Bath"), short: en("Bath"), note: en("North-west or west.") },
};

/** The centre of the plot is traditionally kept open. */
export const CENTRE_NOTE = en("Centre kept open");

/**
 * For each facing: which grid cell each room takes, and where on the facing
 * side the entrance sits (0 = start of that side, 1 = end, reading west to
 * east or north to south).
 */
export const LAYOUTS: Record<
  Facing,
  { entrance: number; rooms: Record<RoomId, Cell>; note: L }
> = {
  N: {
    entrance: 0.68,
    rooms: {
      pooja: { row: 0, col: 2 },
      living: { row: 0, col: 1 },
      bath: { row: 0, col: 0 },
      dining: { row: 1, col: 2 },
      bedroom: { row: 1, col: 0 },
      kitchen: { row: 2, col: 2 },
      stairs: { row: 2, col: 1 },
      master: { row: 2, col: 0 },
    },
    note: en("North facing: the entrance sits towards the north-east, and the living room opens to the north."),
  },
  E: {
    entrance: 0.32,
    rooms: {
      pooja: { row: 0, col: 2 },
      bath: { row: 0, col: 0 },
      bedroom: { row: 0, col: 1 },
      living: { row: 1, col: 2 },
      dining: { row: 1, col: 0 },
      kitchen: { row: 2, col: 2 },
      stairs: { row: 2, col: 1 },
      master: { row: 2, col: 0 },
    },
    note: en("East facing: the entrance sits towards the north-east, and the living room catches the morning light."),
  },
  S: {
    entrance: 0.68,
    rooms: {
      pooja: { row: 0, col: 2 },
      bedroom: { row: 0, col: 1 },
      bath: { row: 0, col: 0 },
      dining: { row: 1, col: 2 },
      stairs: { row: 1, col: 0 },
      kitchen: { row: 2, col: 2 },
      living: { row: 2, col: 1 },
      master: { row: 2, col: 0 },
    },
    note: en("South facing: the entrance sits towards the south-east, and the main rooms keep their corners."),
  },
  W: {
    entrance: 0.32,
    rooms: {
      pooja: { row: 0, col: 2 },
      dining: { row: 0, col: 1 },
      bath: { row: 0, col: 0 },
      bedroom: { row: 1, col: 2 },
      living: { row: 1, col: 0 },
      kitchen: { row: 2, col: 2 },
      stairs: { row: 2, col: 1 },
      master: { row: 2, col: 0 },
    },
    note: en("West facing: the entrance sits towards the north-west, and the living room opens to the west."),
  },
};

export const INDICATIVE = en(
  "Indicative layout. Your plot, its shape and its surroundings decide the real plan, which comes from a consultation.",
);
