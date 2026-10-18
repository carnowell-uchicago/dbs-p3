"use client";

import { useSyncExternalStore } from "react";
import type { Comfort } from "@/data/ideas";
import { dayKey } from "./dates";

// Everything Kind Regards remembers lives in one localStorage entry on this
// device. Components read it with useKindRegards(), which is null during the
// server render and the first hydration pass (pages show a skeleton then).

export type Postcard = {
  id: string;
  createdAt: string; // ISO time, for ordering
  day: string; // local YYYY-MM-DD it was written
  what: string;
  to?: string;
  reaction?: string;
  feeling?: string;
  ideaId?: string;
  spot?: Spot; // where it's pinned on the corkboard, set the first time the wall shows it
  practice?: boolean; // the tutorial's example postcard: shown, never saved
};

// Position on the corkboard as a fraction (0–1) of the room left after the
// card's own size, so a card always fits whatever the board's size. Tilt is
// in degrees.
export type Spot = { x: number; y: number; tilt: number };

export type PostcardInput = Pick<Postcard, "what" | "to" | "reaction" | "feeling" | "ideaId"> & { day?: string };

// What's typed in the form but not yet pinned. `editId` marks an edit.
export type When = "today" | "yesterday" | "earlier";
export type Draft = {
  what: string;
  to: string;
  when: When;
  day: string; // YYYY-MM-DD, used when `when` is "earlier"
  reaction: string;
  feeling: string;
  ideaId?: string;
  editId?: string;
};

export type State = {
  version: 1;
  postcards: Postcard[]; // newest first
  today?: { day: string; comfort: Comfort }; // the comfort level picked today
  draft?: Draft;
  visits?: { current: string; previous?: string };
};

const KEY = "kind-regards:v1";
const empty: State = { version: 1, postcards: [] };

// --- Storage, with an in-memory fallback when the browser blocks it ---------

let persistent: boolean | undefined;
let memory: string | null = null;

function canPersist(): boolean {
  if (persistent === undefined) {
    try {
      const probe = `${KEY}:probe`;
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      persistent = true;
    } catch {
      persistent = false;
    }
  }
  return persistent;
}

function readRaw(): string | null {
  if (!canPersist()) return memory;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

function parse(raw: string | null): State {
  if (!raw) return empty;
  try {
    const data = JSON.parse(raw) as Partial<State>;
    if (data && data.version === 1 && Array.isArray(data.postcards)) return { ...empty, ...data } as State;
  } catch {
    // Unreadable data: start fresh rather than crash. The bad entry is left
    // in place until the next save overwrites it.
  }
  return empty;
}

let cachedRaw: string | null | undefined;
let cached: State = empty;

// What's saved on this device.
function getSaved(): State {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
    shown = undefined;
  }
  return cached;
}

// --- The tutorial's practice postcard, kept in memory only ------------------
// Finishing the first-visit tutorial with the example shows it like a real
// postcard everywhere, marked "Practice", until the page is left or reloaded.
// It's never written to localStorage, and it goes away once a real postcard
// is pinned.

let practice: Postcard | undefined;
let tutorialDone = false;
let shown: State | undefined;

// What pages see: what's saved, plus the practice postcard while there's no
// real one.
function getSnapshot(): State {
  const saved = getSaved();
  if (!shown) shown = practice && saved.postcards.length === 0 ? { ...saved, postcards: [practice] } : saved;
  return shown;
}

function changedInMemory() {
  shown = undefined;
  listeners.forEach((listener) => listener());
}

export function pinPractice(input: PostcardInput): string {
  const now = new Date();
  practice = {
    id: "practice",
    createdAt: now.toISOString(),
    day: dayKey(now),
    ...clean(input),
    practice: true,
    spot: { x: 0.3, y: 0.2, tilt: -3 },
  };
  tutorialDone = true;
  changedInMemory();
  return practice.id;
}

export function removePractice() {
  practice = undefined;
  changedInMemory();
}

// Skipping the tutorial ends it for this page session, like pinning does.
export function skipTutorial() {
  tutorialDone = true;
  changedInMemory();
}

// The tutorial runs on the first visit until a postcard (real or practice) is
// pinned, or it's skipped, in this page session.
export function useTutorial(): boolean {
  const state = useKindRegards();
  const done = useSyncExternalStore(subscribe, () => tutorialDone, () => false);
  return Boolean(state) && state!.postcards.length === 0 && !done;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab saved: re-read.
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(change: (state: State) => State) {
  const raw = JSON.stringify(change(getSaved()));
  memory = raw;
  if (canPersist()) {
    try {
      window.localStorage.setItem(KEY, raw);
    } catch {
      persistent = false; // full or blocked: keep going in memory
    }
  }
  listeners.forEach((listener) => listener());
}

export function useKindRegards(): State | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

// False when this browser won't keep anything after the tab closes.
export function useCanSave(): boolean {
  return useSyncExternalStore(subscribe, canPersist, () => true);
}

// --- Actions ----------------------------------------------------------------

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clean(input: PostcardInput) {
  const trim = (value?: string) => value?.trim() || undefined;
  return {
    what: input.what.trim(),
    to: trim(input.to),
    reaction: trim(input.reaction),
    feeling: trim(input.feeling),
    ideaId: input.ideaId,
  };
}

// Newest day first; within a day, most recently written first.
function byNewest(a: Postcard, b: Postcard) {
  if (a.day !== b.day) return a.day < b.day ? 1 : -1;
  return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
}

export function addPostcard(input: PostcardInput): string {
  const now = new Date();
  const postcard: Postcard = { id: newId(), createdAt: now.toISOString(), day: input.day ?? dayKey(now), ...clean(input) };
  practice = undefined;
  tutorialDone = true;
  update((s) => ({ ...s, postcards: [postcard, ...s.postcards].sort(byNewest), draft: undefined }));
  return postcard.id;
}

export function updatePostcard(id: string, input: PostcardInput) {
  update((s) => ({
    ...s,
    postcards: s.postcards
      .map((p) => (p.id === id ? { ...p, ...clean(input), day: input.day ?? p.day } : p))
      .sort(byNewest),
    draft: undefined,
  }));
}

export function deletePostcard(id: string): { postcard: Postcard; index: number } | undefined {
  const state = getSaved();
  const index = state.postcards.findIndex((p) => p.id === id);
  if (index < 0) return undefined;
  const postcard = state.postcards[index];
  update((s) => ({ ...s, postcards: s.postcards.filter((p) => p.id !== id) }));
  return { postcard, index };
}

// Undo a delete. The list is kept in date order, so it slots back in place.
export function restorePostcard(postcard: Postcard) {
  update((s) => {
    if (s.postcards.some((p) => p.id === postcard.id)) return s;
    return { ...s, postcards: [...s.postcards, postcard].sort(byNewest) };
  });
}

// Pins newly placed postcards to their spots on the corkboard.
export function placePostcards(spots: Record<string, Spot>) {
  update((s) => ({ ...s, postcards: s.postcards.map((p) => (spots[p.id] ? { ...p, spot: spots[p.id] } : p)) }));
}

export function saveDraft(draft: Draft | undefined) {
  update((s) => ({ ...s, draft }));
}

export function setComfort(comfort: Comfort) {
  update((s) => ({ ...s, today: { day: dayKey(), comfort } }));
}

// Called once per page load. Moves the last visit day into `previous` when
// the day changes, so Today can say "Welcome back" with when you were last here.
export function recordVisit() {
  const today = dayKey();
  const visits = getSaved().visits;
  if (visits?.current === today) return;
  update((s) => ({ ...s, visits: { current: today, previous: s.visits?.current } }));
}
