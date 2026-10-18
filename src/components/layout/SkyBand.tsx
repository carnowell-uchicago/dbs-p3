import { PixelSprite } from "@/components/ui/PixelSprite";

// Decorative golden-hour sky over the header: hard-banded pixel gradient,
// a low sun, a power line with a few birds resting on it.
const bands = ["sky-1", "sky-2", "sky-3", "sky-4", "sky-5"];
const sky = `linear-gradient(to top, ${bands
  .map((b, i) => `var(--cp-${b}) ${i * 20}% ${(i + 1) * 20}%`)
  .join(", ")})`;

const sun = [
  "...yyyy...",
  ".yyyyyyyy.",
  "yyyyyyyyyy",
  "yyyyyyyyyy",
  "..........",
  "yyyyyyyyyy",
  "..........",
  ".yyyyyyyy.",
];

const bird = [".d..", "dddd", ".dd."];

export function SkyBand() {
  return (
    <div aria-hidden className="relative h-20 overflow-hidden sm:h-24" style={{ backgroundImage: sky }}>
      <PixelSprite
        rows={sun}
        colors={{ y: "var(--cp-tape-gold)" }}
        className="absolute bottom-0 left-[62%] h-12 w-15 sm:h-16 sm:w-20"
      />
      {/* power line and pole */}
      <div className="absolute top-7 right-0 left-0 h-0.5 bg-(--cp-text) opacity-70 sm:top-9" />
      <div className="absolute top-4 bottom-0 left-[18%] w-1.5 bg-(--cp-text) opacity-80 sm:top-5" />
      <div className="absolute top-5 left-[calc(18%-12px)] h-1 w-[30px] bg-(--cp-text) opacity-80 sm:top-6" />
      {[30, 34, 71].map((left) => (
        <span key={left} className="absolute top-[18px] opacity-90 sm:top-[26px]" style={{ left: `${left}%` }}>
          <PixelSprite rows={bird} colors={{ d: "var(--cp-text)" }} className="block h-2.5 w-3.5" />
        </span>
      ))}
    </div>
  );
}
