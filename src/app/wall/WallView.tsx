"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CorkBoard } from "@/components/postcards/CorkBoard";
import { MiniPostcard } from "@/components/postcards/MiniPostcard";
import { Postcard } from "@/components/postcards/Postcard";
import { afterRender, PostcardActions, useTakeDown } from "@/components/postcards/PostcardActions";
import { Button, LinkButton } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { edge, focusRing, font, type } from "@/components/ui/styles";
import { examplePostcard } from "@/data/example";
import { placeNew } from "@/lib/board";
import { dayKey, daysBetween } from "@/lib/dates";
import { personKey, pickMemory } from "@/lib/derive";
import { focusPageHeading } from "@/lib/focus";
import { placePostcards, useKindRegards, type Postcard as PostcardData } from "@/lib/store";

type Opened = { id: string; memory?: boolean } | null;

// Where the example sits on an empty board.
const example: PostcardData = { ...examplePostcard, spot: { x: 0.3, y: 0.25, tilt: -3 } };

// Pages stay mounted (hidden) between navigations under Cache Components, so
// key on bfcacheId: a fresh visit re-reads "just pinned" from the URL, while
// back/forward keeps the view as it was.
export function WallView() {
  const { bfcacheId } = useRouter();
  return <Wall key={bfcacheId} />;
}

function Wall() {
  const state = useKindRegards();
  const params = useSearchParams();
  const router = useRouter();
  const board = useRef<HTMLDivElement>(null);

  // Read the one-time signals from the URL ("just pinned", or "show me a
  // memory" from Today), then drop them so a reload doesn't repeat them.
  const [pinned] = useState(() => params.get("pinned"));
  const [edited] = useState(() => Boolean(params.get("edited")));
  const [wantsMemory, setWantsMemory] = useState(() => params.has("memory"));
  const [welcome] = useState(() =>
    params.get("pinned") === "practice"
      ? "Practice postcard pinned. It isn't saved."
      : params.get("pinned")
        ? params.get("edited")
          ? "Postcard updated."
          : "Pinned to your wall."
        : null,
  );
  const { takeDown, toastEl } = useTakeDown(welcome, (id) => document.getElementById(`card-${id}`)?.focus());
  const [opened, setOpened] = useState<Opened>(null);
  const focusedPinned = useRef(false);
  const filter = params.get("to");
  const today = dayKey();

  useEffect(() => {
    if (params.has("pinned") || params.has("memory")) {
      const next = new URLSearchParams(params);
      next.delete("pinned");
      next.delete("edited");
      next.delete("memory");
      router.replace(next.size ? `/wall?${next}` : "/wall", { scroll: false });
    }
  }, [params, router]);

  // Give any postcard without a spot its place on the board, measured from
  // the board as it's shown now.
  useEffect(() => {
    const area = board.current;
    if (!state || !area || state.postcards.every((p) => p.spot)) return;
    const style = getComputedStyle(area);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const cardW = parseFloat(style.getPropertyValue("--card-w")) * rem;
    const cardH = parseFloat(style.getPropertyValue("--card-h")) * rem;
    const { width, height } = area.getBoundingClientRect();
    placePostcards(
      placeNew(state.postcards, {
        across: Math.max(width - cardW, 0) / cardW,
        down: Math.max(height - cardH, 0) / cardH,
      }),
    );
  }, [state]);

  // Bring the just-pinned card into view and focus it, once it has a spot.
  useEffect(() => {
    if (!pinned || focusedPinned.current) return;
    const card = document.getElementById(`card-${pinned}`);
    if (!card) return;
    focusedPinned.current = true;
    card.scrollIntoView({ block: "center" });
    card.focus({ preventScroll: true });
  }, [pinned, state]);

  const close = useCallback(() => {
    setOpened(null);
    // Opened from Today, there's no card to return to: go to the heading.
    afterRender(() => {
      if (document.activeElement === document.body) focusPageHeading();
    });
  }, []);

  if (!state) return <Skeleton />;

  // Coming from Today's "Show me a memory": open one as soon as the wall
  // has loaded (adjusting state during render, once).
  if (wantsMemory) {
    const memory = pickMemory(state.postcards, today);
    setWantsMemory(false);
    if (memory) setOpened({ id: memory.id, memory: true });
  }

  const total = state.postcards.length;
  const shown = filter ? state.postcards.filter((p) => p.to && personKey(p.to) === personKey(filter)) : state.postcards;
  const placed = shown.filter((p) => p.spot);
  // Stack by when each was written: the newest lies on top.
  const layers = new Map([...placed].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)).map((p, i) => [p.id, i + 1]));
  const hasPast = state.postcards.some((p) => p.day < today);
  const current = opened
    ? opened.id === example.id && total === 0
      ? example
      : state.postcards.find((p) => p.id === opened.id)
    : undefined;

  function showMemory() {
    const memory = pickMemory(state!.postcards, today, opened?.id);
    if (memory) setOpened({ id: memory.id, memory: true });
  }

  function remove(id: string) {
    setOpened(null);
    takeDown(id);
  }

  const memoryAge = current ? daysBetween(current.day, today) : 0;
  const dialog = (
    <Dialog
      open={Boolean(current)}
      onClose={close}
      labelledBy={opened?.memory ? "memory-title" : `postcard-${current?.id}`}
    >
      {current ? (
        <div className="flex flex-col gap-6">
          {opened?.memory ? (
            // A solid strip, so the label never reads as part of the page behind.
            <div
              style={edge}
              className="flex items-center justify-between gap-3 bg-(--cp-sky-1) py-2 pr-2 pl-4 [--d:3px] [--e:var(--cp-wood)] [--w:3px]"
            >
              <p id="memory-title" className={`${font.display} text-base text-(--cp-text) sm:text-lg`}>
                A memory from {memoryAge === 1 ? "yesterday" : `${memoryAge} days ago`}
              </p>
              <Button size="sm" onClick={close} className="shrink-0">
                <Icon name="close" />
                Close
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={close} className="self-end">
              <Icon name="close" />
              Close
            </Button>
          )}
          <Postcard
            postcard={current}
            example={current.id === example.id && total === 0}
            actions={
              current.id === example.id && total === 0 ? undefined : (
                <PostcardActions
                  postcard={current}
                  editHref={`/write?edit=${current.id}`}
                  onEdit={() => setOpened(null)}
                  onDelete={() => remove(current.id)}
                />
              )
            }
          />
          {opened?.memory ? (
            <Button onClick={showMemory} className="self-start">
              <Icon name="shuffle" />
              Show me another
            </Button>
          ) : null}
        </div>
      ) : null}
    </Dialog>
  );

  if (total === 0) {
    return (
      <>
        <PageHeader
          title="Your wall"
          lead="Every kind thing you write down gets pinned to this board. Here's what the first one could look like: open it to read it."
        >
          <LinkButton href="/write" variant="primary" className="self-start">
            Write your first postcard
          </LinkButton>
        </PageHeader>
        <CorkBoard label="Your corkboard" count={1} ref={board}>
          <MiniPostcard postcard={example} layer={1} badge="Example" onOpen={() => setOpened({ id: example.id })} />
        </CorkBoard>
        {dialog}
        {toastEl}
      </>
    );
  }

  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 tabIndex={-1} className={`${type.display} outline-none`}>
          {filter ? `Postcards to ${shown[0]?.to ?? filter}` : "Your wall"}
        </h1>
        <p className={`${type.body} text-lg text-(--cp-muted)`}>
          {filter
            ? `${shown.length} of your ${total} ${total === 1 ? "kindness" : "kindnesses"}.`
            : `${total} ${total === 1 ? "kindness" : "kindnesses"} so far. Open any postcard to read it.`}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <LinkButton href={filter ? `/write?to=${encodeURIComponent(filter)}` : "/write"} variant="primary">
            {filter ? `Write to ${shown[0]?.to ?? filter}` : "Write a postcard"}
          </LinkButton>
          {!filter && hasPast ? (
            <Button onClick={showMemory}>
              <Icon name="shuffle" />
              Show me a memory
            </Button>
          ) : null}
          {filter ? (
            <Link
              href="/wall"
              className={`inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4 decoration-(--cp-wood) ${focusRing} focus-visible:outline-offset-2`}
            >
              <Icon name="back" />
              Show all postcards
            </Link>
          ) : null}
        </div>
      </header>

      {shown.length === 0 ? (
        <p className={type.body}>No postcards to {filter} yet.</p>
      ) : (
        <CorkBoard label="Your corkboard" count={placed.length} ref={board}>
          {placed.map((postcard) => (
            <MiniPostcard
              key={postcard.id}
              postcard={postcard}
              layer={layers.get(postcard.id) ?? 1}
              badge={
                postcard.practice
                  ? "Practice, not saved"
                  : postcard.id === pinned
                    ? edited
                      ? "Updated"
                      : "Just pinned"
                    : undefined
              }
              fresh={postcard.id === pinned}
              onOpen={() => setOpened({ id: postcard.id })}
            />
          ))}
        </CorkBoard>
      )}

      {dialog}
      {toastEl}
    </>
  );
}
