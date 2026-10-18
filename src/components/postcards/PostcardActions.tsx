"use client";

import { useCallback, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Toast } from "@/components/ui/Toast";
import { shortDate } from "@/lib/dates";
import { focusPageHeading } from "@/lib/focus";
import { deletePostcard, removePractice, restorePostcard, type Postcard } from "@/lib/store";
import { type } from "@/components/ui/styles";

// Edit and Delete under a postcard, used on the wall and in Look back.
export function PostcardActions({
  postcard,
  editHref,
  onEdit,
  onDelete,
}: {
  postcard: Postcard;
  editHref: string;
  onEdit?: () => void;
  onDelete: () => void;
}) {
  // The practice postcard can't be edited (edits are saved), only removed.
  if (postcard.practice) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className={type.meta}>Practice: not saved, and gone when you leave or reload.</p>
        <Button variant="quiet" size="sm" onClick={onDelete}>
          <Icon name="trash" />
          Remove<span className="sr-only"> practice postcard</span>
        </Button>
      </div>
    );
  }
  return (
    <>
      <LinkButton href={editHref} variant="quiet" size="sm" onClick={onEdit}>
        <Icon name="pencil" />
        Edit<span className="sr-only"> postcard: {describe(postcard)}</span>
      </LinkButton>
      <Button variant="quiet" size="sm" onClick={onDelete}>
        <Icon name="trash" />
        Delete<span className="sr-only"> postcard: {describe(postcard)}</span>
      </Button>
    </>
  );
}

type ToastState = { message: string; undo?: Postcard } | null;

// Deleting with Undo, plus the page's toast. Deleting moves focus to the page
// heading (the postcard is gone); Undo puts it back and hands focus to
// `focusRestored`, which finds the postcard on that page.
export function useTakeDown(initialMessage: string | null, focusRestored: (id: string) => void) {
  const [toast, setToast] = useState<ToastState>(() => (initialMessage ? { message: initialMessage } : null));
  const dismiss = useCallback(() => setToast(null), []);

  function takeDown(id: string) {
    if (id === "practice") {
      removePractice();
      setToast({ message: "Practice postcard removed." });
      afterRender(focusPageHeading);
      return;
    }
    const removed = deletePostcard(id);
    if (!removed) return;
    setToast({ message: "Postcard taken down.", undo: removed.postcard });
    afterRender(focusPageHeading);
  }

  function undo() {
    if (!toast?.undo) return;
    const id = toast.undo.id;
    restorePostcard(toast.undo);
    setToast({ message: "Postcard put back." });
    afterRender(() => focusRestored(id));
  }

  const toastEl = (
    <Toast
      message={toast?.message ?? null}
      action={toast?.undo ? { label: "Undo", onClick: undo } : undefined}
      onDismiss={dismiss}
      duration={toast?.undo ? 30000 : 5000}
    />
  );

  return { takeDown, toastEl };
}

// "to Maya, Oct 3" or, with no name, the first few words: "“Returned a dropped glove…”, Oct 3".
function describe(p: Postcard): string {
  const words = p.what.split(/\s+/).slice(0, 5).join(" ");
  const who = p.to ? `to ${p.to}` : `“${words}${p.what.split(/\s+/).length > 5 ? "…" : ""}”`;
  return `${who}, ${shortDate(p.day)}`;
}

export function afterRender(fn: () => void) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
}
