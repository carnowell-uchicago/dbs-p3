"use client";

import { useEffect, useState } from "react";
import { PixelSprite } from "@/components/ui/PixelSprite";
import { focusRing, font } from "@/components/ui/styles";
import { getIdea, groupLabels, type Group } from "@/data/ideas";
import type { Postcard } from "@/lib/store";

// Tiny pixel pictures for the stamp, one per idea group.
const stampArt: Record<Group | "own", string[]> = {
  compliment: ["..x..x..", ".xxxxxx.", "..xxxx..", "...xx...", "........", ".x....x.", "..xxxx..", "........"],
  thanks: [".xx..xx.", "xxxxxxxx", "xxxxxxxx", ".xxxxxx.", "..xxxx..", "...xx...", "........", "........"],
  "reach-out": ["........", "xxxxxxxx", "xx....xx", "x.x..x.x", "x..xx..x", "x......x", "xxxxxxxx", "........"],
  "small-act": ["...x....", "..xxx...", ".xxxxx..", "...x....", "...x..x.", "...xxxx.", "....xx..", "........"],
  "for-you": ["...xx...", "..x..x..", ".x....x.", "x..xx..x", ".x....x.", "..x..x..", "...xx...", "........"],
  own: [".xx..xx.", "x..xx..x", "x......x", "x......x", ".x....x.", "..x..x..", "...xx...", "........"],
};

// What a postcard's stamp means, shown when you hover over it (or focus or
// tap it on a full-size postcard).
export function stampNote(postcard: Postcard): { label: string; note: string } {
  const idea = getIdea(postcard.ideaId);
  if (!idea) return { label: "My own", note: "My own: a kindness you came up with yourself, not from the daily idea." };
  const label = groupLabels[idea.group];
  return { label, note: `${label}: this came from one of the daily ideas.` };
}

const tip = `${font.body} pointer-events-auto absolute right-0 z-20 hidden bg-(--cp-text) px-3 py-2 text-left text-sm leading-snug font-normal text-(--cp-surface) normal-case`;

// Escape hides a stamp's note without moving the pointer or focus (WCAG
// 1.4.13); it shows again the next time you hover over or focus the stamp.
function useDismissable() {
  const [active, setActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (!active || dismissed) return;
    // The first Escape only hides the note (so it doesn't also close the
    // postcard's dialog); the next one works as usual.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setDismissed(true);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [active, dismissed]);
  const start = () => {
    setActive(true);
    setDismissed(false);
  };
  const end = () => setActive(false);
  return { dismissed, start, end };
}

// The full-size stamp: focusable, so the note also works by keyboard and
// touch. Escape hides it again.
export function Stamp({ postcard }: { postcard: Postcard }) {
  const { label, note } = stampNote(postcard);
  const tipId = `stamp-tip-${postcard.id}`;
  const group = getIdea(postcard.ideaId)?.group ?? "own";
  const { dismissed, start, end } = useDismissable();
  return (
    <span
      tabIndex={0}
      aria-describedby={tipId}
      onMouseEnter={start}
      onMouseLeave={end}
      onFocus={start}
      onBlur={end}
      className={`group/stamp relative flex h-16 w-22 shrink-0 cursor-help flex-col items-center justify-center gap-1 bg-(--cp-tape-gold) text-(--cp-text) outline-2 outline-offset-2 outline-(--cp-bevel) outline-dashed ${focusRing} focus-visible:outline-offset-4`}
    >
      <PixelSprite rows={stampArt[group]} colors={{ x: "var(--cp-text)" }} className="size-6" />
      <span className={`${font.display} text-xs leading-none`}>{label}</span>
      <span id={tipId} role="tooltip" className={`${tip} top-0 right-full mr-3 w-52 ${dismissed ? "" : "group-hover/stamp:block group-focus/stamp:block"}`}>
        {note}
      </span>
    </span>
  );
}

// The small stamp on a corkboard card. It sits inside the card's button, so
// the note shows on hover; the full postcard has the focusable one.
export function MiniStamp({ postcard }: { postcard: Postcard }) {
  const { note } = stampNote(postcard);
  const group = getIdea(postcard.ideaId)?.group ?? "own";
  const { dismissed, start, end } = useDismissable();
  return (
    <span className="group/stamp absolute top-2 right-2 z-10" onMouseEnter={start} onMouseLeave={end}>
      <span
        aria-hidden
        className="grid size-6 place-items-center bg-(--cp-tape-gold) outline-1 outline-offset-1 outline-(--cp-bevel) outline-dashed sm:size-8"
      >
        <PixelSprite rows={stampArt[group]} colors={{ x: "var(--cp-text)" }} className="size-4 sm:size-5" />
      </span>
      <span aria-hidden className={`${tip} top-full mt-2 w-44 text-xs ${dismissed ? "" : "group-hover/stamp:block"}`}>
        {note}
      </span>
    </span>
  );
}
