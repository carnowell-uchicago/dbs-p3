import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { edge, font } from "./styles";

// Inline message: `warning` for problems the person should know about,
// `success` for confirmations that stay on the page.
export function Notice({
  tone = "warning",
  title,
  children,
}: {
  tone?: "warning" | "success";
  title: string;
  children?: ReactNode;
}) {
  const colors =
    tone === "success" ? "bg-(--cp-success) [--e:var(--cp-wood)]" : "bg-(--cp-surface) [--e:var(--cp-error)]";
  return (
    <div
      role={tone === "warning" ? "alert" : "status"}
      style={edge}
      className={`flex gap-3 px-4 py-3 text-(--cp-text) [--w:3px] [--d:0px] ${colors}`}
    >
      <Icon name={tone === "success" ? "check" : "bang"} className="mt-1 size-4" />
      <div className="flex flex-col gap-1">
        <p className={`${font.display} text-base font-semibold`}>{title}</p>
        {children ? <div className={`${font.body} text-sm leading-6`}>{children}</div> : null}
      </div>
    </div>
  );
}
