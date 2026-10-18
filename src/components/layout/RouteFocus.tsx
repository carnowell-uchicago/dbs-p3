"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { focusPageHeading } from "@/lib/focus";

// After each client-side page change, move focus to the new page's h1, so
// keyboard and screen-reader users start at the top of the content instead
// of back at the skip link. Skipped on the first load (the browser handles
// it) and when the page has already placed focus itself (like the wall
// focusing a just-pinned postcard).
export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      // If the new page already focused something visible, leave it. (The link
      // that was clicked stays focused inside the now-hidden previous page.)
      const active = document.activeElement as HTMLElement | null;
      const main = document.getElementById("main");
      if (active && active !== main && main?.contains(active) && active.offsetParent !== null) return;
      focusPageHeading();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
