import type { CSSProperties, ReactNode } from "react";
import { PixelSprite } from "@/components/ui/PixelSprite";
import { edge, font } from "@/components/ui/styles";
import { getIdea, groupLabels, type Group } from "@/data/ideas";
import { fromDayKey, shortDate } from "@/lib/dates";
import type { Postcard as PostcardData } from "@/lib/store";

const tapes = ["var(--cp-tape-rose)", "var(--cp-tape-sky)", "var(--cp-tape-gold)"];
const tilts = [-1.2, 0.8, -0.5, 1.4, -0.9, 0.4];

// Tiny pixel pictures for the stamp, one per idea group.
const stampArt: Record<Group | "own", string[]> = {
  compliment: ["..x..x..", ".xxxxxx.", "..xxxx..", "...xx...", "........", ".x....x.", "..xxxx..", "........"],
  thanks: [".xx..xx.", "xxxxxxxx", "xxxxxxxx", ".xxxxxx.", "..xxxx..", "...xx...", "........", "........"],
  "reach-out": ["........", "xxxxxxxx", "xx....xx", "x.x..x.x", "x..xx..x", "x......x", "xxxxxxxx", "........"],
  "small-act": ["...x....", "..xxx...", ".xxxxx..", "...x....", "...x..x.", "...xxxx.", "....xx..", "........"],
  "for-you": ["...xx...", "..x..x..", ".x....x.", "x..xx..x", ".x....x.", "..x..x..", "...xx...", "........"],
  own: [".xx..xx.", "x..xx..x", "x......x", "x......x", ".x....x.", "..x..x..", "...xx...", "........"],
};

// A postcard pinned to the wall: tape on top, a slight tilt, the message in
// handwriting on the left, and the stamp, postmark, and "To" line on the right.
export function Postcard({
  postcard,
  index = 0,
  highlight = false,
  highlightLabel = "Just pinned",
  example = false,
  headingLevel = "h2",
  actions,
}: {
  postcard: PostcardData;
  index?: number;
  highlight?: boolean;
  highlightLabel?: string;
  example?: boolean;
  headingLevel?: "h2" | "h3";
  actions?: ReactNode;
}) {
  const idea = getIdea(postcard.ideaId);
  const group = idea?.group ?? "own";
  const Heading = headingLevel;
  const headingId = `postcard-${postcard.id}`;
  const date = fromDayKey(postcard.day);
  const tilt = tilts[index % tilts.length];

  return (
    <article
      aria-labelledby={headingId}
      style={{ ...edge, "--tilt": `${tilt}deg`, transform: `rotate(${tilt}deg)` } as CSSProperties}
      className={`relative bg-(--cp-surface) pt-6 [--w:3px] [--d:4px] ${
        highlight ? "[--e:var(--cp-text)] motion-safe:animate-[pin-in_400ms_ease-out]" : "[--e:var(--cp-wood)]"
      }`}
    >
      {/* tape */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 opacity-85"
        style={{ backgroundColor: tapes[index % tapes.length] }}
      />
      <Heading id={headingId} className="sr-only">
        {example ? "Example postcard" : `Postcard${postcard.to ? ` to ${postcard.to}` : ""}, ${shortDate(postcard.day)}`}
      </Heading>
      {example ? (
        <p className={`${font.display} absolute top-2 left-3 bg-(--cp-text) px-2 text-sm text-(--cp-surface)`}>Example</p>
      ) : null}
      {highlight ? (
        <p className={`${font.display} absolute top-2 left-3 bg-(--cp-success) px-2 text-sm text-(--cp-text)`}>{highlightLabel}</p>
      ) : null}

      <div className="grid gap-4 px-5 pb-5 sm:grid-cols-[1fr_auto] sm:gap-0">
        {/* message side */}
        <div className="flex flex-col gap-3 sm:border-r-2 sm:border-dashed sm:border-(--cp-bevel) sm:pr-5">
          <p className={`${font.hand} text-2xl leading-snug break-words text-(--cp-ink)`}>{postcard.what}</p>
          {postcard.reaction || postcard.feeling ? (
            <dl className={`${font.body} grid gap-1 text-base`}>
              {postcard.reaction ? (
                <div>
                  <dt className="inline text-(--cp-muted)">They: </dt>
                  <dd className="inline text-(--cp-text)">{postcard.reaction}</dd>
                </div>
              ) : null}
              {postcard.feeling ? (
                <div>
                  <dt className="inline text-(--cp-muted)">I felt: </dt>
                  <dd className="inline text-(--cp-text)">{postcard.feeling}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>

        {/* address side */}
        <div className="flex flex-row-reverse items-start justify-between gap-4 sm:w-44 sm:flex-col sm:items-end sm:pl-5">
          <div
            className="flex h-16 w-22 shrink-0 flex-col items-center justify-center gap-1 bg-(--cp-tape-gold) text-(--cp-text) outline-2 outline-offset-2 outline-(--cp-bevel) outline-dashed"
            title={idea ? groupLabels[idea.group] : "Your own"}
          >
            <PixelSprite rows={stampArt[group]} colors={{ x: "var(--cp-text)" }} className="size-6" />
            <span className={`${font.display} text-xs leading-none`}>{idea ? groupLabels[idea.group] : "My own"}</span>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <time
              dateTime={postcard.day}
              className={`${font.display} -rotate-6 border-2 border-(--cp-ink) px-2 py-0.5 text-sm tracking-wider text-(--cp-ink) uppercase`}
            >
              {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              {" · "}
              {date.getFullYear()}
            </time>
            <p className={`${font.body} text-base`}>
              <span className="text-(--cp-muted)">To </span>
              <span className={`${font.hand} text-xl text-(--cp-ink)`}>{postcard.to ?? "someone"}</span>
            </p>
          </div>
        </div>
      </div>

      {actions ? <div className="flex gap-4 border-t-2 border-dashed border-(--cp-bevel) px-5 py-2">{actions}</div> : null}
    </article>
  );
}
