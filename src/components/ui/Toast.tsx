"use client";

import { useEffect } from "react";
import { edge, focusRing, font } from "./styles";

// A short message pinned to the bottom of the screen, announced politely.
// The live region is always in the DOM so screen readers catch new text.
// With an action (Undo), it stays until dismissed or until `duration` ends.
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
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {message ? (
        <div
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
            onClick={onDismiss}
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
