"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// After each client-side page change, move focus to the new page's h1, so
// keyboard and screen-reader users start at the top of the content instead
// of back at the skip link. Skipped on the first load (the browser handles
// it). Pages may show a skeleton first, so it waits (up to about a second)
// for a visible h1, and gives up if the page or the person focuses
// something visible in the meantime (like the wall focusing a new postcard).
export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    let frame = 0;
    let tries = 0;
    const attempt = () => {
      const active = document.activeElement as HTMLElement | null;
      const main = document.getElementById("main");
      // Only a visible element inside the page content counts as placed: a
      // clicked nav link is outside main, and a clicked in-page link stays
      // "focused" inside the now-hidden previous page.
      const placed = active && active !== main && main?.contains(active) && active.offsetParent !== null;
      if (placed) return;
      const heading = [...document.querySelectorAll<HTMLElement>("main h1")].find((h) => h.offsetParent !== null);
      if (heading) heading.focus({ preventScroll: true });
      else if (tries++ < 60) frame = window.requestAnimationFrame(attempt);
    };
    frame = window.requestAnimationFrame(attempt);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
