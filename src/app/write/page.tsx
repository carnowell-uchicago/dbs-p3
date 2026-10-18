import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { WriteForm } from "./WriteForm";

export const metadata: Metadata = { title: "Write a postcard" };

export default function WritePage() {
  return (
    <Suspense fallback={<Skeleton label="Getting your postcard ready" />}>
      <WriteForm />
    </Suspense>
  );
}
