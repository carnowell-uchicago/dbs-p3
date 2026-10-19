"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTutorial } from "@/lib/store";

// With nothing saved, every page leads to the Write tutorial, so opening or
// reloading any tab on a first visit starts there.
export function TutorialGate({ children }: { children: ReactNode }) {
  const tutorial = useTutorial();
  const pathname = usePathname();
  const router = useRouter();
  const away = tutorial && pathname !== "/write";

  useEffect(() => {
    if (away) router.replace("/write");
  }, [away, router]);

  return away ? <Skeleton label="Getting your first postcard ready" /> : children;
}
