"use client";

import { useEffect, useRef, type ReactNode } from "react";

// A modal window on the native <dialog>: it traps focus, closes on Escape,
// and hands focus back to whatever opened it. A click on the dimmed backdrop
// closes it too. It also closes when the page is hidden (Cache Components
// keeps pages mounted but runs effect cleanups), so it can't linger over
// another page.
export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(calc(100vw-2rem),42rem)] max-w-none overflow-y-auto overscroll-contain bg-transparent p-3 text-(--cp-text) backdrop:bg-(--cp-text)/70 motion-safe:open:animate-[zoom-in_180ms_ease-out] sm:p-5"
    >
      {open ? children : null}
    </dialog>
  );
}
