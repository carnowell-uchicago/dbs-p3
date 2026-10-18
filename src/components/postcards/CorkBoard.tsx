import type { CSSProperties, ReactNode, Ref } from "react";
import { edge } from "@/components/ui/styles";
import { colors } from "@/lib/tokens";

// A pixel corkboard in a wood frame, wider than the page column and tall
// enough to fill most of the window. On phones it grows with the number of
// cards instead, so one or two cards aren't lost in empty cork. Postcards sit inside the pinning area
// (the ref), placed by their spot. It sets --card-w / --card-h for them.
const flecks: [number, number, "d" | "l"][] = [
  [1, 1, "d"], [5, 0, "l"], [9, 2, "d"], [3, 4, "l"], [7, 5, "d"], [11, 6, "l"], [0, 7, "l"], [4, 8, "d"],
  [8, 9, "l"], [2, 10, "d"], [10, 10, "d"], [6, 11, "l"], [9, 7, "l"], [3, 6, "d"], [11, 1, "l"], [6, 3, "d"],
];
const tile = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" shape-rendering="crispEdges"><rect width="12" height="12" fill="${colors.cork}"/>${flecks
    .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="${c === "d" ? 1 : 2}" height="1" fill="${c === "d" ? colors["cork-dark"] : colors["cork-light"]}"/>`)
    .join("")}</svg>`,
)}")`;

export function CorkBoard({
  label,
  count,
  ref,
  children,
}: {
  label: string;
  count: number;
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      style={edge}
      className="w-[min(calc(100vw-2rem),72rem)] max-w-none self-center bg-(--cp-wood) p-2 [--d:4px] [--e:var(--cp-text)] [--w:3px] sm:p-3"
    >
      <div
        style={{ backgroundImage: tile, backgroundSize: "48px 48px", "--count": count } as CSSProperties}
        className="relative h-[clamp(16rem,calc(var(--count)*5rem+6rem),calc(100svh-12rem))] sm:h-[clamp(26rem,calc(100svh-18rem),46rem)] border-2 border-(--cp-bevel) shadow-[inset_0_4px_0_rgb(0_0_0/0.15)] [--card-h:6.25rem] [--card-w:8.75rem] sm:[--card-h:7rem] sm:[--card-w:10rem]"
      >
        <div ref={ref} className="absolute inset-3 sm:inset-5">
          {children}
        </div>
      </div>
    </section>
  );
}
