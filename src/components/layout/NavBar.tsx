"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { edge, focusRing, font } from "@/components/ui/styles";

// `nudge` lifts a label whose letters sit low (People is mostly short letters
// with descenders), so it looks centered next to the others.
export const navItems: { href: string; label: string; nudge?: string }[] = [
  { href: "/", label: "Today" },
  { href: "/write", label: "Write" },
  { href: "/wall", label: "Wall" },
  { href: "/people", label: "People", nudge: "-translate-y-px" },
  { href: "/look-back", label: "Look back" },
];

// Shared navigation. The current page is a wood tab with paper text and
// aria-current, so where you are never rests on color alone (it's also sunk in).
export function NavBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="pt-1 pb-3">
      <ul className="flex flex-wrap gap-x-3 gap-y-4">
        {navItems.map((item) => {
          const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                style={edge}
                className={`inline-flex h-9 items-center px-2 text-sm font-semibold sm:px-3 sm:text-base [--w:3px] [--e:var(--cp-wood)] ${font.display} ${focusRing} ${
                  current
                    ? "translate-y-[3px] bg-(--cp-wood) text-(--cp-surface) [--d:0px]"
                    : "bg-(--cp-surface) text-(--cp-text) [--d:3px] hover:bg-(--cp-hover) active:translate-y-[3px] active:[--d:0px]"
                }`}
              >
                <span className={item.nudge}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
