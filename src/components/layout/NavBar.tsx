"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { edge, focusRing, font } from "@/components/ui/styles";
import { useTutorial } from "@/lib/store";

export const navItems = [
  { href: "/", label: "Today’s idea" },
  { href: "/write", label: "Write" },
  { href: "/wall", label: "Wall" },
  { href: "/people", label: "People" },
  { href: "/look-back", label: "Look back" },
] as const;

// Shared navigation. The current page is a wood tab with paper text and
// aria-current, so where you are never rests on color alone (it's also sunk in).
// During the first-visit tutorial the other tabs are switched off (flat and
// pale) until it's finished or skipped.
export function NavBar() {
  const pathname = usePathname();
  const tutorial = useTutorial();
  return (
    <nav aria-label="Main" className="pt-1 pb-3">
      <ul className="flex flex-wrap gap-x-2 gap-y-4 sm:gap-x-3">
        {navItems.map((item) => {
          const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          if (tutorial && !current) {
            return (
              <li key={item.href}>
                <span
                  aria-disabled="true"
                  title="Finish or skip the tutorial first"
                  style={edge}
                  className={`inline-flex h-9 cursor-not-allowed items-center bg-(--cp-bg) px-1.5 text-sm font-semibold text-(--cp-muted) sm:px-3 sm:text-base [--w:3px] [--e:var(--cp-bevel)] [--d:0px] ${font.display}`}
                >
                  {item.label}
                </span>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                style={edge}
                className={`inline-flex h-9 items-center px-1.5 text-sm font-semibold sm:px-3 sm:text-base [--w:3px] [--e:var(--cp-wood)] ${font.display} ${focusRing} ${
                  current
                    ? "translate-y-[3px] bg-(--cp-wood) text-(--cp-surface) [--d:0px]"
                    : "bg-(--cp-surface) text-(--cp-text) [--d:3px] hover:bg-(--cp-hover) active:translate-y-[3px] active:[--d:0px]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
