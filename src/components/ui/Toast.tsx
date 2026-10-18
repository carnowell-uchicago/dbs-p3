"use client";

import { useEffect, useRef, useState } from "react";
import { focusPageHeading } from "@/lib/focus";
import { edge, focusRing, font } from "./styles";

// A short message pinned to the bottom of the screen, announced politely.
// The live region is always in the DOM so screen readers catch new text.
// The timer pauses while the toast is hovered or has focus (so Undo never
// disappears from under you), and if it closes while focused, focus goes to
// the page heading instead of being dropped.
export function Toast({
  message,
  action,
  onDismiss,
  duration = 6000,
}: {
  message: string | null;
  action?: { label: string; onClick: () => void };
  onDismiss: () => void;
  duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message || paused) return;
    const timer = window.setTimeout(close, duration);
    return () => window.clearTimeout(timer);
    // close only reads refs and onDismiss
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration, paused, onDismiss]);

  function close() {
    const hadFocus = box.current?.contains(document.activeElement);
    setPaused(false);
    onDismiss();
    if (hadFocus) focusPageHeading();
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:justify-end sm:px-6"
    >
      {message ? (
        <div
          ref={box}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
          onKeyDown={(e) => e.key === "Escape" && close()}
          style={edge}
          className={`pointer-events-auto flex items-center gap-4 bg-(--cp-text) px-4 py-3 text-(--cp-surface) [--w:3px] [--e:var(--cp-text)] [--d:0px] ${font.display} text-base`}
        >
          <span>{message}</span>
          {action ? (
            <button
              type="button"
              onClick={action.onClick}
              className={`min-h-9 px-2 font-semibold text-(--cp-surface) underline decoration-2 underline-offset-4 decoration-(--cp-accent) ${focusRing} focus-visible:outline-(--cp-accent) focus-visible:outline-offset-2`}
            >
              {action.label}
            </button>
          ) : null}
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss"
            className={`grid size-9 place-items-center ${focusRing} focus-visible:outline-(--cp-accent) focus-visible:outline-offset-0`}
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
