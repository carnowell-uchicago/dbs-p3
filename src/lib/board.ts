import type { Postcard, Spot } from "./store";

// Placing postcards on the corkboard. Each new card tries a handful of random
// spots and takes the one farthest from the cards already there, so the board
// fills its empty space first and only starts overlapping once it's full.

// The board's free room measured in card sizes: how many card widths fit
// across the room left after one card, and how many card heights fit down.
export type Room = { across: number; down: number };

const tries = 40;

export function placeNew(postcards: Postcard[], room: Room): Record<string, Spot> {
  const placed = postcards.filter((p) => p.spot).map((p) => p.spot!);
  const spots: Record<string, Spot> = {};
  // Oldest first, so cards land in the order they were written.
  const waiting = postcards.filter((p) => !p.spot).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  for (const postcard of waiting) {
    let best: Spot | undefined;
    let bestGap = -1;
    for (let i = 0; i < tries; i++) {
      const candidate = { x: Math.random(), y: Math.random(), tilt: 0 };
      const gap = nearest(candidate, placed, room);
      if (gap > bestGap) {
        best = candidate;
        bestGap = gap;
      }
    }
    const spot = { x: round(best!.x), y: round(best!.y), tilt: round((Math.random() * 2 - 1) * 5) };
    spots[postcard.id] = spot;
    placed.push(spot);
  }
  return spots;
}

// Distance to the closest card, in card sizes (1 or more means no overlap).
function nearest(spot: Spot, others: Spot[], room: Room): number {
  let min = Infinity;
  for (const other of others) {
    const gap = Math.max(Math.abs(spot.x - other.x) * room.across, Math.abs(spot.y - other.y) * room.down);
    min = Math.min(min, gap);
  }
  return min;
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}
