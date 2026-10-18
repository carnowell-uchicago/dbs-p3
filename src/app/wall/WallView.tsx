"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Postcard } from "@/components/postcards/Postcard";
import { Button, LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { focusRing, type } from "@/components/ui/styles";
import { examplePostcard } from "@/data/example";
import { personKey } from "@/lib/derive";
import { deletePostcard, restorePostcard, useKindRegards, type Postcard as PostcardData } from "@/lib/store";

type ToastState = { message: string; undo?: { postcard: PostcardData; index: number } } | null;

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

  // Read the one-time "just pinned" signal from the URL, then drop it so a
  // reload doesn't celebrate twice.
  const [pinned] = useState(() => params.get("pinned"));
  const [toast, setToast] = useState<ToastState>(() =>
    params.get("pinned") ? { message: params.get("edited") ? "Postcard updated." : "Pinned to your wall." } : null,
  );
  const filter = params.get("to");

  useEffect(() => {
    if (params.get("pinned")) {
      const next = new URLSearchParams(params);
      next.delete("pinned");
      next.delete("edited");
      router.replace(next.size ? `/wall?${next}` : "/wall", { scroll: false });
    }
  }, [params, router]);

  useEffect(() => {
    if (pinned && state) document.getElementById(`card-${pinned}`)?.scrollIntoView({ block: "center" });
  }, [pinned, state]);

  const dismiss = useCallback(() => setToast(null), []);

  if (!state) return <Skeleton />;

  const total = state.postcards.length;
  const shown = filter ? state.postcards.filter((p) => p.to && personKey(p.to) === personKey(filter)) : state.postcards;

  function remove(id: string) {
    const removed = deletePostcard(id);
    if (!removed) return;
    setToast({ message: "Postcard taken down.", undo: removed });
    // The card is gone; put focus on the page heading (after the re-render).
    afterRender(() => document.querySelector<HTMLElement>("main h1")?.focus());
  }

  function undo() {
    if (toast?.undo) {
      restorePostcard(toast.undo.postcard, toast.undo.index);
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

  if (total === 0) {
    return (
      <>
        <PageHeader
          title="Your wall"
          lead="Every kind thing you write down gets pinned here. Here's what the first one could look like."
        />
        <Postcard postcard={examplePostcard} example />
        <LinkButton href="/write" variant="primary" className="self-start">
          Write your first postcard
        </LinkButton>
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
            : `${total} ${total === 1 ? "kindness" : "kindnesses"} so far, newest first.`}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <LinkButton href={filter ? `/write?to=${encodeURIComponent(filter)}` : "/write"} variant="primary">
            {filter ? `Write to ${shown[0]?.to ?? filter}` : "Write a postcard"}
          </LinkButton>
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
        <ol className="flex flex-col gap-10 pt-4" aria-label="Postcards">
          {shown.map((postcard, i) => (
            <li key={postcard.id} id={`card-${postcard.id}`} tabIndex={-1} className="scroll-mt-24 outline-none">
              <Postcard
                postcard={postcard}
                index={i}
                highlight={postcard.id === pinned}
                actions={
                  <>
                    <LinkButton href={`/write?edit=${postcard.id}`} variant="quiet" size="sm">
                      <Icon name="pencil" />
                      Edit<span className="sr-only"> postcard{postcard.to ? ` to ${postcard.to}` : ""}</span>
                    </LinkButton>
                    <Button variant="quiet" size="sm" onClick={() => remove(postcard.id)}>
                      <Icon name="trash" />
                      Delete<span className="sr-only"> postcard{postcard.to ? ` to ${postcard.to}` : ""}</span>
                    </Button>
                  </>
                }
              />
            </li>
          ))}
        </ol>
      )}

      {toastEl}
    </>
  );
}

function afterRender(fn: () => void) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
}
