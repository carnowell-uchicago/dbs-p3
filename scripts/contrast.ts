// Checks WCAG contrast for every color pair the UI uses (src/lib/tokens.ts).
// Text needs 4.5:1 (AA, normal size); non-text UI needs 3:1.
// Run: node scripts/contrast.ts
import { colors, pairs } from "../src/lib/tokens.ts";

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = 0;
console.log("| Use | Foreground | Background | Ratio | Needs | Result |");
console.log("|---|---|---|---|---|---|");
for (const p of pairs) {
  const r = ratio(colors[p.fg], colors[p.bg]);
  const need = p.kind === "text" ? 4.5 : 3;
  const ok = r >= need;
  if (!ok) failed++;
  console.log(`| ${p.use} | ${p.fg} ${colors[p.fg]} | ${p.bg} ${colors[p.bg]} | ${r.toFixed(2)}:1 | ${need}:1 | ${ok ? "Pass" : "**Fail**"} |`);
}
console.log(`\n${pairs.length - failed} of ${pairs.length} pairs pass.`);
process.exitCode = failed ? 1 : 0;
