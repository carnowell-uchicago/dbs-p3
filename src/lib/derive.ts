import { ideas, type Comfort, type Idea } from "@/data/ideas";
import { daysBetween, dayNumber, isSunday, weekStart, addDays } from "./dates";
import type { Postcard, State } from "./store";

// Today's idea: picked from the date, so it's the same all day and new
// tomorrow. "Show me another" moves the offset along. On Sundays the day
// opens on one for yourself, until you pick Quiet / In person or ask for
// another; then it's ideas for someone else (comfort is undefined while the
// "For you" idea shows, so neither chip reads as selected).
export function todaysIdea(state: State, today: string): { idea: Idea; comfort: Comfort | undefined } {
  const sameDay = state.today?.day === today;
  const comfort = state.today?.comfort ?? "quiet";
  const offset = sameDay ? state.today!.offset : 0;
  const n = dayNumber(today);

  // Before the first postcard, open on a compliment: it shows what the tool
  // is for (noticing someone else) better than any explanation would.
  if (state.postcards.length === 0 && offset === 0) {
    const compliments = ideas.filter((i) => i.group === "compliment" && i.comfort === comfort);
    return { idea: compliments[mod(n, compliments.length)], comfort };
  }
  if (isSunday(today) && !sameDay) {
    const forYou = ideas.filter((i) => i.group === "for-you");
    return { idea: forYou[Math.floor(n / 7) % forYou.length], comfort: undefined };
  }
  const pool = ideas.filter((i) => i.group !== "for-you" && i.comfort === comfort);
  return { idea: pool[mod(n * 5 + offset, pool.length)], comfort };
}

function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

export type Person = { key: string; name: string; count: number; lastDay: string };

export function personKey(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

// Everyone named on a postcard, most recent first. The newest spelling wins.
export function people(postcards: Postcard[]): Person[] {
  const map = new Map<string, Person>();
  for (const p of postcards) {
    if (!p.to) continue;
    const key = personKey(p.to);
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      if (p.day > existing.lastDay) existing.lastDay = p.day;
    } else {
      map.set(key, { key, name: p.to, count: 1, lastDay: p.day });
    }
  }
  return [...map.values()].sort((a, b) => (a.lastDay < b.lastDay ? 1 : a.lastDay > b.lastDay ? -1 : b.count - a.count));
}

// Someone you haven't written to in a week or more, longest first.
export function personToRevisit(postcards: Postcard[], today: string): (Person & { days: number }) | undefined {
  const quiet = people(postcards)
    .map((p) => ({ ...p, days: daysBetween(p.lastDay, today) }))
    .filter((p) => p.days >= 7)
    .sort((a, b) => b.days - a.days);
  return quiet[0];
}

export function postcardsInWeek(postcards: Postcard[], start: string): Postcard[] {
  const end = addDays(start, 7);
  return postcards.filter((p) => p.day >= start && p.day < end);
}

export function thisWeek(today: string) {
  return weekStart(today);
}
