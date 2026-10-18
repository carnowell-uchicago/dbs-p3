"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { limits, validate } from "@/app/write/WriteForm";
import { Button } from "@/components/ui/Button";
import { TextAreaField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { focusRing, font, type } from "@/components/ui/styles";
import { addPostcard, saveDraft, type State } from "@/lib/store";

// Openings you finish yourself: one per kind of kindness in the ideas.
const starters = ["Complimented ", "Thanked ", "Checked in on ", "Helped "];

// The first visit: the postcard's one required box, right on Today. Tap a
// starter to begin the sentence, finish it, and pin it. The optional fields
// are one link away on /write, which picks up what's typed here.
export function QuickWrite({ state }: { state: State }) {
  const router = useRouter();
  const box = useRef<HTMLTextAreaElement>(null);
  const [what, setWhat] = useState(() => (state.draft && !state.draft.editId ? state.draft.what : ""));
  const [submitted, setSubmitted] = useState(false);

  const onlyStarter = starters.some((s) => what.trim() === s.trim());
  const error = submitted
    ? onlyStarter
      ? "Finish the sentence: who was it, and what did you notice?"
      : validate({ what, to: "", when: "today", day: "", reaction: "", feeling: "" }).what
    : undefined;

  function start(starter: string) {
    setWhat(starter);
    // Put the cursor at the end, ready to finish the sentence.
    requestAnimationFrame(() => {
      const el = box.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(starter.length, starter.length);
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const trimmed = what.trim();
    if (!trimmed || onlyStarter || trimmed.length > limits.what) {
      box.current?.focus();
      return;
    }
    const id = addPostcard({ what });
    router.push(`/wall?pinned=${id}`);
  }

  // Carry what's typed over to the full form.
  function addMore() {
    saveDraft({ what, to: "", when: "today", day: "", reaction: "", feeling: "" });
    router.push("/write");
  }

  const empty = !what.trim() || onlyStarter;

  return (
    <form noValidate onSubmit={onSubmit} className="flex max-w-xl flex-col gap-5">
      <TextAreaField
        id="quick-what"
        inputRef={box}
        label="What did you do or notice?"
        hint="Name the detail, like “their green coat” or “how calm you were in the meeting.”"
        error={error}
        count={{ value: what.trim().length, max: limits.what }}
        value={what}
        onChange={(e) => setWhat(e.target.value)}
      />
      {empty ? (
        <div role="group" aria-labelledby="starters-label" className="flex flex-col gap-2">
          <p id="starters-label" className={type.label}>
            Or start with:
          </p>
          <div className="flex flex-wrap gap-3">
            {starters.map((s) => (
              <Button key={s} size="sm" onClick={() => start(s)}>
                <Icon name="plus" className="size-3" />
                {s.trim()}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <Button type="submit" variant="primary">
          Pin it to my wall
        </Button>
        <button
          type="button"
          onClick={addMore}
          className={`${font.body} inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-2 underline-offset-4 decoration-(--cp-wood) hover:decoration-4 ${focusRing} focus-visible:outline-offset-2`}
        >
          Add who, when, or how it felt
          <Icon name="arrow" />
        </button>
      </div>
    </form>
  );
}
