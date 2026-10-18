"use client";

import { useEffect } from "react";
import { Notice } from "@/components/ui/Notice";
import { recordVisit, useCanSave } from "@/lib/store";

// Shown on every page when the browser won't keep data (some private modes).
// Also records today's visit, which drives "Welcome back" on Today.
export function StorageNotice() {
  const canSave = useCanSave();
  useEffect(() => {
    recordVisit();
  }, []);
  if (canSave) return null;
  return (
    <Notice title="This browser isn't saving.">
      Your postcards will disappear when you close this tab. To keep them, open Kind Regards in a regular (not private)
      window.
    </Notice>
  );
}
