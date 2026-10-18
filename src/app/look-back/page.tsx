import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { LookBackView } from "./LookBackView";

export const metadata: Metadata = { title: "Look back" };

export default function LookBackPage() {
  return (
    <Suspense fallback={<Skeleton label="Gathering your week" />}>
      <LookBackView />
    </Suspense>
  );
}
