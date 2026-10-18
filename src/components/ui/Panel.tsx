import type { ReactNode } from "react";
import { bevelEdge } from "./styles";

// Wood-framed paper panel: 4px wood edge with stepped corners, light bevel
// inside, hard shadow. `tone` swaps the paper for the golden-hour peach.
export function Panel({
  children,
  className = "",
  as: Tag = "div",
  tone = "paper",
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
  tone?: "paper" | "sky";
  labelledBy?: string;
}) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      style={bevelEdge}
      className={`${tone === "sky" ? "bg-(--cp-sky-1)" : "bg-(--cp-surface)"} [--w:4px] [--e:var(--cp-wood)] [--d:4px] ${className}`}
    >
      {children}
    </Tag>
  );
}
