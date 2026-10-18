// Placeholder while the page reads this device's saved postcards. It only
// shows for a moment on load (the server can't see localStorage).
export function Skeleton({ label = "Loading your postcards" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col gap-4" aria-label={label}>
      <div className="h-10 w-3/4 bg-(--cp-sunken) motion-safe:animate-pulse" />
      <div className="h-5 w-1/2 bg-(--cp-sunken) motion-safe:animate-pulse" />
      <div className="h-40 w-full bg-(--cp-sunken) motion-safe:animate-pulse" />
    </div>
  );
}
