// Draws pixel art from rows of characters, one character per pixel.
// `colors` maps each character to a CSS color (hex or var()); any unmapped
// character (use ".") is transparent. Horizontal runs merge into one rect.
// Fills go through `style` so CSS variables resolve.
export function PixelSprite({
  rows,
  colors,
  className,
}: {
  rows: string[];
  colors: Record<string, string>;
  className?: string;
}) {
  const width = Math.max(...rows.map((row) => row.length));
  const rects = [];
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (colors[ch]) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={end - x}
            height={1}
            style={{ fill: colors[ch] }}
          />,
        );
      }
      x = end;
    }
  }
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      className={className}
    >
      {rects}
    </svg>
  );
}
