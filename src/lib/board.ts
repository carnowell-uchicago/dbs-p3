import type { Postcard, Spot } from "./store";

// Placing postcards on the corkboard. While there's room, each new card takes
// one of the free slots on a loose grid (nudged at random, so it doesn't look
// lined up), favoring the slots farthest from the cards already there. So the
// board fills its empty space first, and even a narrow phone board never
// overlaps early. Once every slot is taken, a card goes wherever is emptiest
// among many random tries, and cards start to overlap.

// The board's free room measured in card sizes: how many card widths fit
// across the room left after one card, and how many card heights fit down.
export type Room = { across: number; down: number };

const tries = 150;
const spacing = 1.25; // slots sit at least this many card sizes apart
const clear = 1.12; // a slot this far from every card doesn't overlap one, tilt included

export function placeNew(postcards: Postcard[], room: Room): Record<string, Spot> {
  const placed = postcards.filter((p) => p.spot).map((p) => p.spot!);
  const spots: Record<string, Spot> = {};
  // Oldest first, so cards land in the order they were written.
  const waiting = postcards.filter((p) => !p.spot).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  for (const postcard of waiting) {
    const best = freeSlot(placed, room) ?? emptiest(placed, room);
    const spot = { x: round(best.x), y: round(best.y), tilt: round((Math.random() * 2 - 1) * 5) };
    spots[postcard.id] = spot;
    placed.push(spot);
  }
  return spots;
}

// A random pick among the roomiest free slots, or undefined if none is free.
function freeSlot(placed: Spot[], room: Room): Spot | undefined {
  const xs = axis(room.across);
  const ys = axis(room.down);
  const free: { spot: Spot; gap: number }[] = [];
  for (let i = 0; i < xs.slots; i++) {
    for (let j = 0; j < ys.slots; j++) {
      const spot = {
        x: clamp((xs.slots > 1 ? i * xs.step : 0.5) + (Math.random() * 2 - 1) * xs.jitter),
        y: clamp((ys.slots > 1 ? j * ys.step : 0.5) + (Math.random() * 2 - 1) * ys.jitter),
        tilt: 0,
      };
      const gap = Math.min(nearest(spot, placed, room), 99);
      if (gap >= clear) free.push({ spot, gap });
    }
  }
  if (!free.length) return undefined;
  const widest = Math.max(...free.map((f) => f.gap));
  const roomy = free.filter((f) => f.gap >= widest * 0.8);
  return roomy[Math.floor(Math.random() * roomy.length)].spot;
}

// Slots along one side: how many, how far apart (as a fraction), and how far
// each may be nudged without reaching the next.
function axis(length: number) {
  // Loose spacing where there's room; on a narrow side (a phone board), two
  // slots whenever two cards fit side by side at all.
  const slots = Math.max(Math.floor(length / spacing) + 1, Math.min(Math.floor(length / clear) + 1, 2));
  if (slots === 1) return { slots, step: 0, jitter: 0.5 };
  const step = 1 / (slots - 1);
  return { slots, step, jitter: Math.max(0, (step * length - clear) / 2) / length };
}

// The farthest from every card among random tries (used once the board is full).
function emptiest(placed: Spot[], room: Room): Spot {
  let best: Spot = { x: Math.random(), y: Math.random(), tilt: 0 };
  let bestGap = -1;
  for (let i = 0; i < tries; i++) {
    const candidate = { x: Math.random(), y: Math.random(), tilt: 0 };
    const gap = nearest(candidate, placed, room);
    if (gap > bestGap) {
      best = candidate;
      bestGap = gap;
    }
  }
  return best;
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

function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}
