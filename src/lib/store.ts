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
};

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
  today?: { day: string; comfort: Comfort; offset: number };
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

function getSnapshot(): State {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
  }
  return cached;
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
  const raw = JSON.stringify(change(getSnapshot()));
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
  const state = getSnapshot();
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

export function saveDraft(draft: Draft | undefined) {
  update((s) => ({ ...s, draft }));
}

export function setComfort(comfort: Comfort) {
  update((s) => ({ ...s, today: { day: dayKey(), comfort, offset: 0 } }));
}

export function showAnotherIdea() {
  update((s) => {
    const today = dayKey();
    if (s.today?.day !== today) return { ...s, today: { day: today, comfort: s.today?.comfort ?? "quiet", offset: 1 } };
    const current = s.today;
    return { ...s, today: { ...current, offset: current.offset + 1 } };
  });
}

// Called once per page load. Moves the last visit day into `previous` when
// the day changes, so Today can say "Welcome back" with when you were last here.
export function recordVisit() {
  const today = dayKey();
  const visits = getSnapshot().visits;
  if (visits?.current === today) return;
  update((s) => ({ ...s, visits: { current: today, previous: s.visits?.current } }));
}
