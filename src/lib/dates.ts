// All dates are local to the person's device. A "day key" is YYYY-MM-DD.

export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Whole days between two day keys (b - a), safe across daylight-saving changes.
export function daysBetween(a: string, b: string): number {
  const ms = Date.UTC(...ymd(b)) - Date.UTC(...ymd(a));
  return Math.round(ms / 86_400_000);
}

function ymd(key: string): [number, number, number] {
  const [y, m, d] = key.split("-").map(Number);
  return [y, m - 1, d];
}

// Days since 2026-01-01; used to pick today's idea.
export function dayNumber(key: string): number {
  return daysBetween("2026-01-01", key);
}

export function isSunday(key: string): boolean {
  return fromDayKey(key).getDay() === 0;
}

// The Monday that starts the week containing `key` (weeks run Mon–Sun).
export function weekStart(key: string): string {
  const date = fromDayKey(key);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return dayKey(date);
}

export function addDays(key: string, days: number): string {
  const date = fromDayKey(key);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

// "Today", "Yesterday", "Tuesday" (within a week), else "Oct 3".
export function relativeDay(key: string, today: string = dayKey()): string {
  const diff = daysBetween(key, today);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff > 1 && diff < 7) return fromDayKey(key).toLocaleDateString(undefined, { weekday: "long" });
  return shortDate(key);
}

export function shortDate(key: string): string {
  return fromDayKey(key).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function longDate(key: string): string {
  return fromDayKey(key).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
