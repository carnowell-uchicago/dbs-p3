"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, LinkButton } from "@/components/ui/Button";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { CheckboxField, TextAreaField, TextField } from "@/components/ui/Fields";
import { Notice } from "@/components/ui/Notice";
import { Skeleton } from "@/components/ui/Skeleton";
import { focusRing, type } from "@/components/ui/styles";
import { getIdea } from "@/data/ideas";
import { addDays, dayKey, longDate } from "@/lib/dates";
import { people, todaysIdea } from "@/lib/derive";
import {
  addPostcard,
  saveDraft,
  updatePostcard,
  useKindRegards,
  useTutorial,
  type State,
} from "@/lib/store";
import {
  chosenDay,
  feelingPicks,
  fieldOrder,
  limits,
  OTHER,
  startingValues,
  validate,
  whenOptions,
  type Values,
} from "./form";
import { Tutorial } from "./Tutorial";

export function WriteForm() {
  const state = useKindRegards();
  const params = useSearchParams();
  // Pages stay mounted (hidden) between navigations, so a fresh visit gets a
  // fresh form (reloaded from the saved draft); back/forward keeps it as is.
  const { bfcacheId } = useRouter();
  const tutorial = useTutorial();
  if (!state) return <Skeleton label="Getting your postcard ready" />;

  const editId = params.get("edit") ?? undefined;
  // First visit: the onboarding is this page, one box at a time.
  if (tutorial && !editId) return <Tutorial key={bfcacheId} state={state} presetTo={params.get("to") ?? undefined} />;
  const editing = editId ? state.postcards.find((p) => p.id === editId) : undefined;

  if (editId && !editing) {
    return (
      <>
        <PageHeader title="Edit postcard" />
        <Notice title="That postcard isn't on your wall anymore.">
          It may have been deleted.{" "}
          <Link href="/wall" className={`underline ${focusRing} focus-visible:outline-offset-2`}>
            Go to your wall
          </Link>{" "}
          or write a new one.
        </Notice>
        <LinkButton href="/write" variant="primary" className="self-start">
          Write a postcard
        </LinkButton>
      </>
    );
  }

  // Remount when switching between new and edit, so the fields start fresh.
  // An edit started on Look back returns there; everything else goes to the wall.
  const fromLookBack = params.get("from") === "look-back";
  return (
    <Form
      key={`${editId ?? "new"}-${bfcacheId}`}
      state={state}
      editId={editing?.id}
      presetTo={params.get("to") ?? undefined}
      fromLookBack={fromLookBack}
    />
  );
}

function Form({
  state,
  editId,
  presetTo,
  fromLookBack = false,
}: {
  state: State;
  editId?: string;
  presetTo?: string;
  fromLookBack?: boolean;
}) {
  const router = useRouter();
  const [{ values: initial, restored }] = useState(() => startingValues(state, editId, presetTo));
  const [values, setValues] = useState<Values>(initial);
  const [submitted, setSubmitted] = useState(false);
  // "Other…" is open when the saved feeling isn't one of the quick picks.
  const [otherFeeling, setOtherFeeling] = useState(() => Boolean(initial.feeling) && !feelingPicks.includes(initial.feeling));
  // Only offer the idea checkbox on an edit if that postcard had one, and not
  // before the first postcard (the first visit doesn't show an idea yet).
  const [offerIdea] = useState(() => (editId ? Boolean(initial.ideaId) : state.postcards.length > 0));

  const today = dayKey();
  const errors = submitted ? validate(values, today) : {};
  const ideaForCheckbox = getIdea(values.ideaId) ?? todaysIdea(state, dayKey()).idea;
  const names = people(state.postcards).map((p) => p.name);

  // Keep an unsent draft on this device, so leaving and coming back loses nothing.
  const pinned = useRef(false);
  useEffect(() => {
    if (pinned.current) return;
    const changed = (Object.keys(initial) as (keyof Values)[]).some((k) => values[k] !== initial[k]);
    if (changed || restored) saveDraft({ ...values, editId });
  }, [values, initial, restored, editId]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values, today);
    const first = fieldOrder.find((k) => found[k]);
    if (first) {
      // Field ids match the keys; focusing reads out the error tied to it.
      document.getElementById(first)?.focus();
      return;
    }
    pinned.current = true;
    const input = {
      what: values.what,
      to: values.to,
      day: chosenDay(values, today),
      reaction: values.reaction,
      feeling: values.feeling,
      ideaId: values.ideaId,
    };
    if (editId) {
      updatePostcard(editId, input);
      router.push(fromLookBack ? `/look-back?edited=${editId}` : `/wall?pinned=${editId}&edited=1`);
    } else {
      const id = addPostcard(input);
      router.push(`/wall?pinned=${id}`);
    }
  }

  function discard() {
    pinned.current = true;
    saveDraft(undefined);
    router.push(editId ? (fromLookBack ? "/look-back" : "/wall") : "/");
  }

  const what = values.what.trim().length;

  return (
    <>
      <PageHeader
        title={editId ? "Edit postcard" : "Write a postcard"}
        lead={editId ? "Change anything, then save." : "Something kind you did, or something you noticed and said. Only the first box is needed."}
      />
      {restored ? (
        <Notice tone="success" title="We kept what you were writing.">
          Your draft was saved on this device.
        </Notice>
      ) : null}
      <form noValidate onSubmit={onSubmit} className="flex max-w-xl flex-col gap-7">
        <TextAreaField
          id="what"
          label="What did you do or notice?"
          hint="Name the detail, like “their green coat” or “how calm you were in the meeting.”"
          error={errors.what}
          count={{ value: what, max: limits.what }}
          value={values.what}
          onChange={(e) => set("what", e.target.value)}
        />
        <TextField
          id="to"
          label="Who was it for?"
          optional
          hint={
            names.length
              ? "Type a name, or pick someone you've written to. Leave it blank for a stranger."
              : "A name or nickname. Leave it blank for a stranger."
          }
          error={errors.to}
          className="[&::-webkit-calendar-picker-indicator]:hidden"
          value={values.to}
          onChange={(e) => set("to", e.target.value)}
          list={names.length ? "people-list" : undefined}
          autoComplete="off"
        />
        {names.length ? (
          <datalist id="people-list">
            {names.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        ) : null}
        <div className="flex flex-col gap-3">
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
              hint={values.day && !errors.day ? longDate(values.day) : undefined}
              error={errors.day}
              value={values.day}
              onChange={(e) => set("day", e.target.value)}
              className="max-w-56"
            />
          ) : null}
        </div>
        <TextField
          id="reaction"
          label="How did they react?"
          optional
          hint="A smile, a reply, or nothing yet. All fine."
          error={errors.reaction}
          count={{ value: values.reaction.trim().length, max: limits.reaction }}
          value={values.reaction}
          onChange={(e) => set("reaction", e.target.value)}
        />
        <div className="flex flex-col gap-3">
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
                afterRender(() => document.getElementById("feeling")?.focus());
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
              error={errors.feeling}
              count={{ value: values.feeling.trim().length, max: limits.feeling }}
              value={values.feeling}
              onChange={(e) => set("feeling", e.target.value)}
            />
          ) : null}
        </div>
        {offerIdea ? (
          <CheckboxField
            id="idea"
            label={editId ? "This was one of the daily ideas" : "This was today’s idea"}
            hint={<span className="italic">&ldquo;{ideaForCheckbox.text}&rdquo;</span>}
            checked={Boolean(values.ideaId)}
            onChange={(e) => set("ideaId", e.target.checked ? ideaForCheckbox.id : undefined)}
          />
        ) : null}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
          <Button type="submit" variant="primary">
            {editId ? "Save changes" : "Pin it to my wall"}
          </Button>
          <Button variant="quiet" onClick={discard}>
            {editId ? "Cancel" : "Discard draft"}
          </Button>
        </div>
        <p className={type.meta}>Saved only in this browser.</p>
      </form>
    </>
  );
}

function afterRender(fn: () => void) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
}
