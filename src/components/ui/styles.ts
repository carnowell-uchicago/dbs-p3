import type { CSSProperties } from "react";

// Pixel edge with two-step rounded corners (ported from Assignment 2's Cozy
// Pixel). Four box-shadows draw the edge bars outside the box; four background
// squares fill the corner pixels with the edge color, so the outline steps in
// twice per corner. The drop shadow is the same outline moved down by --d.
// Set all three on the element itself: --w edge width, --e edge color,
// --d drop depth (0px = flat). An element with `edge` must not set its own
// background-image; background-color is free.
const w = "var(--w)";
const bar = (x: string, y: string, color: string) => `${x} ${y} 0 calc(-1 * ${w}) ${color}`;
const two = `calc(2 * ${w})`;
const minusTwo = `calc(-2 * ${w})`;

const shadows = [
  bar("0", minusTwo, "var(--e)"),
  bar("0", two, "var(--e)"),
  bar(minusTwo, "0", "var(--e)"),
  bar(two, "0", "var(--e)"),
  bar("0", `calc(2 * ${w} + var(--d))`, "var(--cp-text)"),
  bar(minusTwo, "var(--d)", "var(--cp-text)"),
  bar(two, "var(--d)", "var(--cp-text)"),
  "0 var(--d) 0 0 var(--cp-text)",
].join(", ");

const fill = (color: string) => `linear-gradient(${color}, ${color})`;
const corners = {
  image: Array(4).fill(fill("var(--e)")),
  size: Array(4).fill(`${w} ${w}`),
  position: ["top left", "top right", "bottom left", "bottom right"],
};

export const edge: CSSProperties = {
  boxShadow: shadows,
  backgroundImage: corners.image.join(", "),
  backgroundSize: corners.size.join(", "),
  backgroundPosition: corners.position.join(", "),
  backgroundRepeat: "no-repeat",
};

// Edge plus a 2px light-wood bevel just inside it, for panels.
export const bevelEdge: CSSProperties = {
  ...edge,
  backgroundImage: [...corners.image, ...Array(4).fill(fill("var(--cp-bevel)"))].join(", "),
  backgroundSize: [...corners.size, "100% 2px", "100% 2px", "2px 100%", "2px 100%"].join(", "),
  backgroundPosition: [...corners.position, "top", "bottom", "left", "right"].join(", "),
};

export const font = {
  // Ligatures off: Pixelify's joined "fi" reads as a capital A.
  display: "font-(family-name:--cp-display) [font-variant-ligatures:none]",
  body: "font-(family-name:--cp-body)",
  hand: "font-(family-name:--cp-hand)",
};

// Square cocoa outline, held clear of the pixel edge and drop shadow.
export const focusRing =
  "outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[7px] focus-visible:outline-(--cp-text)";

// Text roles.
export const type = {
  display: `${font.display} text-4xl leading-none font-bold sm:text-5xl`,
  heading: `${font.display} text-2xl leading-tight font-bold`,
  title: `${font.display} text-lg leading-snug font-semibold`,
  body: `${font.body} text-base leading-relaxed`,
  label: `${font.display} text-base leading-6 font-medium`,
  meta: `${font.body} text-sm leading-5 text-(--cp-muted)`,
};
