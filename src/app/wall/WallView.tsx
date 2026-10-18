"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CorkBoard } from "@/components/postcards/CorkBoard";
import { MiniPostcard } from "@/components/postcards/MiniPostcard";
import { Postcard } from "@/components/postcards/Postcard";
import { Button, LinkButton } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { focusRing, font, type } from "@/components/ui/styles";
import { examplePostcard } from "@/data/example";
import { placeNew } from "@/lib/board";
import { dayKey, daysBetween, shortDate } from "@/lib/dates";
import { personKey, pickMemory } from "@/lib/derive";
import { focusPageHeading } from "@/lib/focus";
import {
  deletePostcard,
  placePostcards,
  restorePostcard,
  useKindRegards,
  type Postcard as PostcardData,
} from "@/lib/store";

type ToastState = { message: string; undo?: { postcard: PostcardData; index: number } } | null;
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
  const [toast, setToast] = useState<ToastState>(() =>
    params.get("pinned") ? { message: params.get("edited") ? "Postcard updated." : "Pinned to your wall." } : null,
  );
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

  const dismiss = useCallback(() => setToast(null), []);

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
    const removed = deletePostcard(id);
    if (!removed) return;
    setToast({ message: "Postcard taken down.", undo: removed });
    // The card is gone; put focus on the page heading (after the re-render).
    afterRender(focusPageHeading);
  }

  function undo() {
    if (toast?.undo) {
      restorePostcard(toast.undo.postcard);
      const id = toast.undo.postcard.id;
      setToast({ message: "Postcard put back." });
      afterRender(() => document.getElementById(`card-${id}`)?.focus());
    }
  }

  const toastEl = (
    <Toast
      message={toast?.message ?? null}
      action={toast?.undo ? { label: "Undo", onClick: undo } : undefined}
      onDismiss={dismiss}
      duration={toast?.undo ? 30000 : 5000}
    />
  );

  const memoryAge = current ? daysBetween(current.day, today) : 0;
  const dialog = (
    <Dialog
      open={Boolean(current)}
      onClose={close}
      labelledBy={opened?.memory ? "memory-title" : `postcard-${current?.id}`}
    >
      {current ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {opened?.memory ? (
              <p id="memory-title" className={`${font.display} bg-(--cp-sky-1) px-3 py-1 text-lg text-(--cp-text)`}>
                A memory from {memoryAge === 1 ? "yesterday" : `${memoryAge} days ago`}
              </p>
            ) : (
              <span />
            )}
            <Button size="sm" onClick={close}>
              <Icon name="close" />
              Close
            </Button>
          </div>
          <Postcard
            postcard={current}
            example={current.id === example.id && total === 0}
            actions={
              current.id === example.id && total === 0 ? undefined : (
                <>
                  <LinkButton href={`/write?edit=${current.id}`} variant="quiet" size="sm" onClick={() => setOpened(null)}>
                    <Icon name="pencil" />
                    Edit<span className="sr-only"> postcard: {describe(current)}</span>
                  </LinkButton>
                  <Button variant="quiet" size="sm" onClick={() => remove(current.id)}>
                    <Icon name="trash" />
                    Delete<span className="sr-only"> postcard: {describe(current)}</span>
                  </Button>
                </>
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
        <CorkBoard label="Your corkboard" ref={board}>
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
        <CorkBoard label="Your corkboard" ref={board}>
          {placed.map((postcard) => (
            <MiniPostcard
              key={postcard.id}
              postcard={postcard}
              layer={layers.get(postcard.id) ?? 1}
              badge={postcard.id === pinned ? (edited ? "Updated" : "Just pinned") : undefined}
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

// "to Maya, Oct 3" or, with no name, the first few words: "“Returned a dropped glove…”, Oct 3".
function describe(p: PostcardData): string {
  const words = p.what.split(/\s+/).slice(0, 5).join(" ");
  const who = p.to ? `to ${p.to}` : `“${words}${p.what.split(/\s+/).length > 5 ? "…" : ""}”`;
  return `${who}, ${shortDate(p.day)}`;
}

function afterRender(fn: () => void) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
}
