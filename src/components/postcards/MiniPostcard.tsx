import type { CSSProperties } from "react";
import { edge, focusRing, font } from "@/components/ui/styles";
import { shortDate } from "@/lib/dates";
import type { Postcard as PostcardData } from "@/lib/store";
import { tapes } from "./Postcard";
import { MiniStamp } from "./Stamp";

// A small postcard pinned to the corkboard. It's a button: the first lines in
// handwriting, a tiny stamp, and who it was to. Opening it shows the full card.
// The board sets --card-w / --card-h; `layer` stacks newer cards on top, and
// hover or focus brings a card to the front.
export function MiniPostcard({
  postcard,
  layer,
  badge,
  fresh = false,
  onOpen,
}: {
  postcard: PostcardData;
  layer: number;
  badge?: string;
  fresh?: boolean;
  onOpen: () => void;
}) {
  const spot = postcard.spot ?? { x: 0, y: 0, tilt: 0 };
  const tape = tapes[Math.abs(hash(postcard.id)) % tapes.length];

  return (
    <button
      type="button"
      id={`card-${postcard.id}`}
      onClick={onOpen}
      aria-label={`${badge ? `${badge}: ` : ""}Postcard${postcard.to ? ` to ${postcard.to}` : ""}, ${shortDate(postcard.day)}: ${postcard.what}`}
      style={
        {
          ...edge,
          "--x": spot.x,
          "--y": spot.y,
          "--z": layer,
          rotate: `${spot.tilt}deg`,
          left: "calc(var(--x) * (100% - var(--card-w)))",
          top: "calc(var(--y) * (100% - var(--card-h)))",
        } as CSSProperties
      }
      className={`group absolute z-(--z) flex h-(--card-h) w-(--card-w) cursor-pointer flex-col bg-(--cp-surface) p-2 pt-3 text-left [--d:3px] [--w:2px] hover:z-[999] focus-visible:z-[999] motion-safe:transition-[scale] motion-safe:duration-150 hover:scale-110 focus-visible:scale-110 ${
        fresh ? "[--e:var(--cp-text)] motion-safe:animate-[pin-drop_400ms_ease-out]" : "[--e:var(--cp-wood)]"
      } ${focusRing} focus-visible:-translate-y-1 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:[--d:6px]`}
    >
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-3.5 w-12 -translate-x-1/2 -rotate-3 opacity-85 sm:w-14"
        style={{ backgroundColor: tape }}
      />
      {badge ? (
        <span
          aria-hidden
          className={`${font.display} absolute -top-3 -left-2 z-10 px-1.5 text-xs leading-5 ${
            fresh ? "bg-(--cp-success) text-(--cp-text)" : "bg-(--cp-text) text-(--cp-surface)"
          }`}
        >
          {badge}
        </span>
      ) : null}
      <MiniStamp postcard={postcard} />
      <span
        aria-hidden
        className={`${font.hand} line-clamp-3 pr-7 text-sm leading-tight break-words text-(--cp-ink) sm:pr-9 sm:text-base`}
      >
        {postcard.what}
      </span>
      <span aria-hidden className={`${font.hand} mt-auto max-w-full truncate self-end text-xs text-(--cp-ink) sm:text-sm`}>
        <span className={`${font.body} text-(--cp-muted)`}>To </span>
        {postcard.to ?? "someone"}
      </span>
    </button>
  );
}

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h;
}
