import type { CSSProperties } from "react";

// Cozy Pixel palette from Assignment 2, plus golden-hour journal colors.
// One job per color. The CSS variables on <html> and the contrast check
// (scripts/contrast.mjs) both read from here.
export const colors = {
  // Cozy Pixel core
  bg: "#f7ecd6", // Parchment: the page
  surface: "#fff8ea", // Paper: cards, postcards, inputs
  text: "#3b2a20", // Cocoa: text and the focus outline
  muted: "#6e5644", // Bark: hints, meta lines
  wood: "#8a4a24", // Wood: edges; selected fill with paper text
  accent: "#f08a24", // Pumpkin: the one main action in a view
  "accent-hover": "#f5ab5f",
  "accent-pressed": "#e18024",
  hover: "#f2d9bc",
  pressed: "#e8c39b",
  sunken: "#efdcb6", // Wheat: wells, skeletons, toggle shelf
  bevel: "#d9a066", // Light wood: inner bevel, disabled edges. Never text.
  success: "#6aa84f", // Clover: success fill, cocoa text
  error: "#b3361f", // Berry: error edge and error text
  // Journal additions
  ink: "#3a3f6b", // Fountain-pen blue: handwriting and postmarks
  "sky-1": "#ffd9a0", // Golden hour, top to bottom of the sky band
  "sky-2": "#f9b58a",
  "sky-3": "#ec8f8f",
  "sky-4": "#b77a9f",
  "sky-5": "#6e5f93",
  "tape-rose": "#f4a7b9",
  "tape-sky": "#8fd3f4",
  "tape-gold": "#f6c945",
  cork: "#d6a771", // Corkboard on the wall, with darker and lighter flecks
  "cork-dark": "#b9854e",
  "cork-light": "#e6c08f",
} as const;

export type ColorName = keyof typeof colors;

export const cssVars = Object.fromEntries(
  Object.entries(colors).map(([name, hex]) => [`--cp-${name}`, hex]),
) as CSSProperties;

// Every text pair (needs 4.5:1) and non-text pair (needs 3:1) the UI uses.
export const pairs: { fg: ColorName; bg: ColorName; use: string; kind: "text" | "ui" }[] = [
  { fg: "text", bg: "bg", use: "Body text on the page", kind: "text" },
  { fg: "text", bg: "surface", use: "Text on cards and in inputs", kind: "text" },
  { fg: "muted", bg: "bg", use: "Hints and meta on the page", kind: "text" },
  { fg: "muted", bg: "surface", use: "Hints and meta on cards", kind: "text" },
  { fg: "muted", bg: "sunken", use: "Skeleton and shelf labels", kind: "text" },
  { fg: "text", bg: "accent", use: "Main button label", kind: "text" },
  { fg: "text", bg: "accent-hover", use: "Main button, hover", kind: "text" },
  { fg: "text", bg: "accent-pressed", use: "Main button, pressed", kind: "text" },
  { fg: "text", bg: "hover", use: "Secondary button, hover", kind: "text" },
  { fg: "text", bg: "pressed", use: "Secondary button, pressed", kind: "text" },
  { fg: "surface", bg: "wood", use: "Selected chip and current nav tab", kind: "text" },
  { fg: "text", bg: "success", use: "Success notice", kind: "text" },
  { fg: "error", bg: "surface", use: "Field error text on cards", kind: "text" },
  { fg: "error", bg: "bg", use: "Field error text on the page", kind: "text" },
  { fg: "ink", bg: "surface", use: "Handwriting and postmark on postcards", kind: "text" },
  { fg: "text", bg: "tape-gold", use: "Idea stamp label", kind: "text" },
  { fg: "text", bg: "sky-1", use: "Welcome banner, look-back summary and its names, 'days ago' badge, memory label", kind: "text" },
  { fg: "surface", bg: "text", use: "Toast text", kind: "text" },
  { fg: "wood", bg: "bg", use: "Control edges on the page", kind: "ui" },
  { fg: "wood", bg: "surface", use: "Control edges on cards", kind: "ui" },
  { fg: "error", bg: "surface", use: "Error edge on inputs", kind: "ui" },
  { fg: "text", bg: "bg", use: "Focus outline", kind: "ui" },
  { fg: "accent", bg: "text", use: "Toast action focus", kind: "ui" },
  { fg: "wood", bg: "cork", use: "Postcard edges on the corkboard", kind: "ui" },
  { fg: "text", bg: "cork", use: "Focus outline on the corkboard", kind: "ui" },
];
