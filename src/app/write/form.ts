import { addDays, dayKey } from "@/lib/dates";
import type { Draft, State, When } from "@/lib/store";

// Shared by the full postcard form and the first-visit tutorial: limits, the
// choices, starting values, and validation.

export const limits = { what: 280, to: 40, reaction: 140, feeling: 60 } as const;

export type Values = Omit<Draft, "editId">;
// Field ids, in the order they appear (the first with an error gets focus).
export const fieldOrder = ["what", "to", "day", "reaction", "feeling"] as const;
type Errors = Partial<Record<(typeof fieldOrder)[number], string>>;

export const feelingPicks = ["Warm", "Lighter", "Nervous, then glad", "Proud", "Not sure yet"];
export const OTHER = "__other";
export const whenOptions: { value: When; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "earlier", label: "Earlier" },
];

// The day a postcard is for, from the When choice.
export function chosenDay(values: Values, today: string): string {
  if (values.when === "yesterday") return addDays(today, -1);
  if (values.when === "earlier") return values.day;
  return today;
}

const over = (n: number) => `${n} ${n === 1 ? "character" : "characters"} over`;

// Errors say what to do next, and never clear what was typed.
export function validate(values: Values, today: string = dayKey()): Errors {
  const errors: Errors = {};
  // Limits count every character typed, spaces included, so the counter and
  // the error always agree with what's in the box.
  const what = values.what.length;
  if (!values.what.trim()) errors.what = "Write what you did or noticed. A few words is enough, like “told Sam the talk was clear.”";
  else if (what > limits.what) errors.what = `Keep it postcard-sized: ${over(what - limits.what)}.`;
  if (values.to.length > limits.to) errors.to = `Shorten the name to ${limits.to} characters, or use a nickname.`;
  if (values.when === "earlier") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.day)) errors.day = "Pick the date it happened, or choose Today.";
    else if (values.day > today) errors.day = "Pick today or an earlier date. Postcards are for things that already happened.";
  }
  const reaction = values.reaction.length;
  if (reaction > limits.reaction) errors.reaction = `Keep it to ${limits.reaction} characters: ${over(reaction - limits.reaction)}.`;
  const feeling = values.feeling.length;
  if (feeling > limits.feeling) errors.feeling = `Keep it to ${limits.feeling} characters: ${over(feeling - limits.feeling)}.`;
  return errors;
}

export function startingValues(state: State, editId: string | undefined, presetTo: string | undefined) {
  const draft = state.draft;
  const today = dayKey();
  // Older drafts (before the When field) lack when/day.
  const withWhen = (d: Draft): Values => ({ ...d, when: d.when ?? "today", day: d.day ?? "" });
  if (editId) {
    if (draft?.editId === editId) return { values: withWhen(draft), restored: true };
    const p = state.postcards.find((x) => x.id === editId)!;
    const when: When = p.day === today ? "today" : p.day === addDays(today, -1) ? "yesterday" : "earlier";
    return {
      values: { what: p.what, to: p.to ?? "", when, day: p.day, reaction: p.reaction ?? "", feeling: p.feeling ?? "", ideaId: p.ideaId },
      restored: false,
    };
  }
  if (draft && !draft.editId && (draft.what || draft.to || draft.reaction || draft.feeling)) {
    return { values: { ...withWhen(draft), to: draft.to || presetTo || "" }, restored: true };
  }
  return {
    values: { what: "", to: presetTo ?? "", when: "today" as When, day: "", reaction: "", feeling: "", ideaId: undefined },
    restored: false,
  };
}
