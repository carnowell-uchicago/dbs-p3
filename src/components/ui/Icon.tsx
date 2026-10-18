import { PixelSprite } from "./PixelSprite";

// Small pixel icons drawn in currentColor, so they follow their control's text.
const shapes = {
  check: ["........", ".......x", "......xx", "x....xx.", "xx..xx..", ".xxxx...", "..xx....", "........"],
  close: ["x......x", ".x....x.", "..x..x..", "...xx...", "...xx...", "..x..x..", ".x....x.", "x......x"],
  arrow: ["........", "....x...", "....xx..", "xxxxxxx.", "xxxxxxx.", "....xx..", "....x...", "........"],
  back: ["........", "...x....", "..xx....", ".xxxxxxx", ".xxxxxxx", "..xx....", "...x....", "........"],
  bang: ["...xx...", "...xx...", "...xx...", "...xx...", "...xx...", "........", "...xx...", "...xx..."],
  plus: ["...xx...", "...xx...", "...xx...", "xxxxxxxx", "xxxxxxxx", "...xx...", "...xx...", "...xx..."],
  pencil: ["......xx", ".....x.x", "....x.x.", "...x.x..", "..x.x...", ".x.x....", "xxx.....", "xx......"],
  trash: ["..xxxx..", "xxxxxxxx", ".x....x.", ".x.x.x..", ".x.x.x..", ".x.x.x..", ".x....x.", "..xxxx.."],
  skip: ["........", "x..x...x", "xx.xx..x", "xxxxxx.x", "xxxxxx.x", "xx.xx..x", "x..x...x", "........"],
  shuffle: ["......x.", "xx...xxx", "..x.x.x.", "...x....", "...x....", "..x.x.x.", "xx...xxx", "......x."],
};

export type IconName = keyof typeof shapes;

export function Icon({ name, className = "size-4" }: { name: IconName; className?: string }) {
  return <PixelSprite rows={shapes[name]} colors={{ x: "currentColor" }} className={`shrink-0 ${className}`} />;
}

const heartRows = [
  ".ttt.ttt.",
  "thhhthhht",
  "thchhhhht",
  "thhhhhhht",
  ".thhhhht.",
  "..thhht..",
  "...tht...",
  "....t....",
];

// The Kind Regards mark: a cocoa-outlined rose heart.
export function Heart({ className = "size-5" }: { className?: string }) {
  return (
    <PixelSprite
      rows={heartRows}
      colors={{ t: "var(--cp-text)", h: "var(--cp-tape-rose)", c: "var(--cp-surface)" }}
      className={`shrink-0 ${className}`}
    />
  );
}
