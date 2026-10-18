import type { ReactNode } from "react";
import { type } from "@/components/ui/styles";

// Every page opens the same way: one h1 and an optional line under it.
export function PageHeader({ title, lead, children }: { title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3">
      <h1 className={type.display}>{title}</h1>
      {lead ? <p className={`${type.body} max-w-prose text-lg text-(--cp-muted)`}>{lead}</p> : null}
      {children}
    </header>
  );
}
