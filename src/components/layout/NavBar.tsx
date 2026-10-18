"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { edge, focusRing, font } from "@/components/ui/styles";

export const navItems = [
  { href: "/", label: "Today" },
  { href: "/write", label: "Write" },
  { href: "/wall", label: "Wall" },
  { href: "/people", label: "People" },
  { href: "/look-back", label: "Look back" },
] as const;

// Shared navigation. The current page is a wood tab with paper text and
// aria-current, so where you are never rests on color alone (it's also sunk in).
export function NavBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="-mx-1 overflow-x-auto px-1 pt-1 pb-3">
      <ul className="flex min-w-max gap-3">
        {navItems.map((item) => {
          const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                style={edge}
                className={`inline-flex h-9 items-center px-3 text-base font-semibold [--w:3px] [--e:var(--cp-wood)] ${font.display} ${focusRing} ${
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
