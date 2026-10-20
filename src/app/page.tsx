import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { TodayView } from "./TodayView";

export default function TodayPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <TodayView />
    </Suspense>
  );
}
