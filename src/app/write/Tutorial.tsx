"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { TextAreaField, TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { font, type } from "@/components/ui/styles";
import { examplePostcard } from "@/data/example";
import { addDays, dayKey, longDate } from "@/lib/dates";
import { addPostcard, pinPractice, saveDraft, skipTutorial, type State } from "@/lib/store";
import {
  chosenDay,
  feelingPicks,
  limits,
  OTHER,
  startingValues,
  validate,
  whenOptions,
  type Values,
} from "./form";

// The first visit: writing the first postcard, one box at a time, with a note
// beside each box on what it's for. Every box offers the example's answer so
// nobody stalls on "I don't have anything good yet". Using the example's
// sentence makes it a practice postcard: shown on the wall, never saved.

type Step = "what" | "to" | "when" | "reaction" | "feeling";
const steps: Step[] = ["what", "to", "when", "reaction", "feeling"];

// Which error key (and field id) belongs to each step.
const fieldFor: Record<Step, keyof ReturnType<typeof validate>> = {
  what: "what",
  to: "to",
  when: "day",
  reaction: "reaction",
  feeling: "feeling",
};

const notes: Record<Step, { title: string; text: string }> = {
  what: {
    title: "The postcard itself",
    text: "A kind thing you did or noticed, in a sentence or two. A small detail makes it worth rereading later.",
  },
  to: {
    title: "Who it was for",
    text: "Names fill your People page, so you can see who you haven't appreciated in a while. Leave it blank for a stranger.",
  },
  when: {
    title: "When it happened",
    text: "Usually today. Your Sunday look-back uses it to gather the week.",
  },
  reaction: {
    title: "How they took it",
    text: "A smile, a reply, or nothing yet. It's nice to remember when you look back.",
  },
  feeling: {
    title: "How it felt for you",
    text: "Noticing that it felt good makes the next one easier.",
  },
};

const example = examplePostcard;

export function Tutorial({ state, presetTo }: { state: State; presetTo?: string }) {
  const router = useRouter();
  const [initial] = useState(() => startingValues(state, undefined, presetTo).values);
  const [values, setValues] = useState<Values>(initial);
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState<Step[]>([]);
  const [otherFeeling, setOtherFeeling] = useState(() => Boolean(initial.feeling) && !feelingPicks.includes(initial.feeling));
  const moved = useRef(false);
  const pinned = useRef(false);

  const step = steps[index];
  const today = dayKey();
  const last = index === steps.length - 1;
  // The example's own sentence makes this a practice postcard.
  const practice = values.what.trim() === example.what;
  const all = validate(values, today);
  const error = checked.includes(step) ? all[fieldFor[step]] : undefined;

  // Keep a real draft on the device as you type (never the practice one).
  useEffect(() => {
    if (pinned.current || practice) return;
    const changed = (Object.keys(initial) as (keyof Values)[]).some((k) => values[k] !== initial[k]);
    if (changed) saveDraft({ ...values });
  }, [values, initial, practice]);

  // A new step: put focus on its box (not on the first load, where the page
  // heading gets it).
  useEffect(() => {
    if (!moved.current) return;
    focusStep(step);
  }, [step]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  // Check this step; stay on it (with focus on the box) if it has an error.
  function passes(): boolean {
    setChecked((c) => (c.includes(step) ? c : [...c, step]));
    if (all[fieldFor[step]]) {
      document.getElementById(fieldFor[step])?.focus();
      return false;
    }
    return true;
  }

  function go(to: number) {
    moved.current = true;
    setIndex(to);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!passes()) return;
    if (last) pin();
    else go(index + 1);
  }

  // Pin it now: everything after the first box is optional.
  function pin() {
    const errorStep = steps.find((s) => all[fieldFor[s]]);
    if (errorStep) {
      setChecked((c) => [...new Set([...c, errorStep])]);
      go(steps.indexOf(errorStep));
      return;
    }
    pinned.current = true;
    const input = {
      what: values.what,
      to: values.to,
      day: chosenDay(values, today),
      reaction: values.reaction,
      feeling: values.feeling,
    };
    if (practice) {
      if (state.draft) saveDraft(undefined);
      pinPractice(input);
      router.push("/wall?pinned=practice");
    } else {
      const id = addPostcard(input);
      router.push(`/wall?pinned=${id}`);
    }
  }

  // Skip: go to the wall, where the example postcard waits on the empty board.
  // Anything typed stays as a draft for the full form.
  function skip() {
    skipTutorial();
    router.push("/wall");
  }

  // The example's answer for this step, and how to fill it in. It's offered
  // only while the box is empty, so it can never replace what you typed.
  const offers: Record<Step, { show: string; use: () => void; open: boolean }> = {
    what: { show: `“${example.what}”`, use: () => set("what", example.what), open: !values.what.trim() },
    to: { show: example.to!, use: () => set("to", example.to!), open: !values.to.trim() },
    // When starts on Today, the example's answer, so there's usually nothing to offer.
    when: { show: "Today", use: () => set("when", "today"), open: values.when !== "today" },
    reaction: {
      show: `“${example.reaction}”`,
      use: () => set("reaction", example.reaction!),
      open: !values.reaction.trim(),
    },
    feeling: {
      show: example.feeling!,
      use: () => {
        setOtherFeeling(false);
        set("feeling", example.feeling!);
      },
      open: !values.feeling.trim() && !otherFeeling,
    },
  };
  const offer = offers[step];

  return (
    <>
      <PageHeader title="Write your first postcard" />
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6" aria-labelledby="step-label">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p id="step-label" className={`${font.display} text-base text-(--cp-muted)`}>
            Step {index + 1} of {steps.length}
            <span className="sr-only">: {notes[step].title}</span>
          </p>
          <Button variant="primary" size="sm" onClick={skip}>
            Skip the tutorial
            <Icon name="skip" />
          </Button>
        </div>

        <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-8">
          <div className="flex min-w-0 flex-col gap-4">{field(step)}</div>
          <Panel as="aside" tone="sky" labelledBy="step-note" className="order-first flex flex-col gap-1 p-4 sm:order-none">
            <h2 id="step-note" className={type.title}>
              {notes[step].title}
            </h2>
            <p className={type.body}>{notes[step].text}</p>
          </Panel>
        </div>

        {offer.open ? (
          <div className="flex flex-col items-start gap-2">
            <p className={type.meta}>
              {step === "what" ? "Or use this example (it won't be saved):" : "Or use the example's answer:"}
            </p>
            <p className={`${font.hand} text-xl text-(--cp-ink)`}>{offer.show}</p>
            <Button size="sm" onClick={offer.use}>
              <Icon name="plus" className="size-3" />
              Use this example
            </Button>
          </div>
        ) : null}
        {practice ? (
          <p className={type.meta}>This is a practice postcard: you&rsquo;ll see it on your wall, but it won&rsquo;t be saved.</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-2">
          {index > 0 ? (
            <Button onClick={() => go(index - 1)}>
              <Icon name="back" />
              Back
            </Button>
          ) : null}
          <Button type="submit" variant="primary">
            {last ? "Pin it to my wall" : "Next"}
            {last ? null : <Icon name="arrow" />}
          </Button>
          {index > 0 && !last ? (
            <Button variant="quiet" onClick={() => passes() && pin()}>
              Pin it now
            </Button>
          ) : null}
        </div>
        <p className={type.meta}>The other tabs open once you finish or skip.</p>
      </form>
    </>
  );

  // The box (or choice) for each step, built from the shared fields.
  function field(s: Step): ReactNode {
    switch (s) {
      case "what":
        return (
          <TextAreaField
            id="what"
            label="What did you do or notice?"
            hint="Name the detail, like “their green coat” or “how calm they were in the meeting.”"
            error={error}
            count={{ value: values.what.length, max: limits.what }}
            value={values.what}
            onChange={(e) => set("what", e.target.value)}
          />
        );
      case "to":
        return (
          <TextField
            id="to"
            label="Who was it for?"
            optional
            hint="A name or nickname."
            error={error}
            value={values.to}
            onChange={(e) => set("to", e.target.value)}
            autoComplete="off"
          />
        );
      case "when":
        return (
          <>
            <ChipGroup
              label="When was it?"
              labelId="when-label"
              options={whenOptions}
              value={values.when}
              onChange={(v) => {
                if (!v) return;
                setValues((cur) => ({ ...cur, when: v, day: v === "earlier" && !cur.day ? addDays(today, -2) : cur.day }));
              }}
            />
            {values.when === "earlier" ? (
              <TextField
                id="day"
                type="date"
                label="Date"
                max={today}
                hint={values.day && !error ? longDate(values.day) : undefined}
                error={error}
                value={values.day}
                onChange={(e) => set("day", e.target.value)}
              />
            ) : null}
          </>
        );
      case "reaction":
        return (
          <TextField
            id="reaction"
            label="How did they react?"
            optional
            error={error}
            count={{ value: values.reaction.length, max: limits.reaction }}
            value={values.reaction}
            onChange={(e) => set("reaction", e.target.value)}
          />
        );
      case "feeling":
        return (
          <>
            <ChipGroup
              label="How did you feel after?"
              labelId="feeling-label"
              optional
              options={[...feelingPicks.map((f) => ({ value: f, label: f })), { value: OTHER, label: "Other…" }]}
              value={otherFeeling ? OTHER : feelingPicks.includes(values.feeling) ? values.feeling : undefined}
              onChange={(v) => {
                if (v === OTHER) {
                  setOtherFeeling(true);
                  set("feeling", "");
                  requestAnimationFrame(() => document.getElementById("feeling")?.focus());
                } else {
                  setOtherFeeling(false);
                  set("feeling", v ?? "");
                }
              }}
              clearable
            />
            {otherFeeling ? (
              <TextField
                id="feeling"
                label="In your own words"
                error={error}
                count={{ value: values.feeling.length, max: limits.feeling }}
                value={values.feeling}
                onChange={(e) => set("feeling", e.target.value)}
              />
            ) : null}
          </>
        );
    }
  }
}

// Where focus goes when a step opens: its box, or the first choice in its group.
function focusStep(step: Step) {
  const group = step === "when" ? "when-label" : step === "feeling" ? "feeling-label" : undefined;
  const target = group
    ? document.querySelector<HTMLElement>(`[aria-labelledby="${group}"] button`)
    : document.getElementById(step);
  target?.focus();
}
