import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { WallView } from "./WallView";

export const metadata: Metadata = { title: "Your wall" };

export default function WallPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <WallView />
    </Suspense>
  );
}
