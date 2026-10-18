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
import { dayKey } from "@/lib/dates";
import { people, todaysIdea } from "@/lib/derive";
import { addPostcard, saveDraft, updatePostcard, useKindRegards, type Draft, type State } from "@/lib/store";

export const limits = { what: 280, to: 40, reaction: 140, feeling: 60 } as const;

type Values = Omit<Draft, "editId">;
type Errors = Partial<Record<keyof typeof limits, string>>;

const feelingPicks = ["Warm", "Lighter", "Nervous, then glad", "Proud", "Not sure yet"];

const over = (n: number) => `${n} ${n === 1 ? "character" : "characters"} over`;

// Errors say what to do next, and never clear what was typed.
export function validate(values: Values): Errors {
  const errors: Errors = {};
  const what = values.what.trim();
  if (!what) errors.what = "Write what you did or noticed. A few words is enough, like “told Sam the talk was clear.”";
  else if (what.length > limits.what) errors.what = `Keep it postcard-sized: ${over(what.length - limits.what)}.`;
  if (values.to.trim().length > limits.to) errors.to = `Shorten the name to ${limits.to} characters, or use a nickname.`;
  const reaction = values.reaction.trim().length;
  if (reaction > limits.reaction) errors.reaction = `Keep it to ${limits.reaction} characters: ${over(reaction - limits.reaction)}.`;
  const feeling = values.feeling.trim().length;
  if (feeling > limits.feeling) errors.feeling = `Keep it to ${limits.feeling} characters: ${over(feeling - limits.feeling)}.`;
  return errors;
}

export function WriteForm() {
  const state = useKindRegards();
  const params = useSearchParams();
  // Pages stay mounted (hidden) between navigations, so a fresh visit gets a
  // fresh form (reloaded from the saved draft); back/forward keeps it as is.
  const { bfcacheId } = useRouter();
  if (!state) return <Skeleton label="Getting your postcard ready" />;

  const editId = params.get("edit") ?? undefined;
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
  return <Form key={`${editId ?? "new"}-${bfcacheId}`} state={state} editId={editing?.id} presetTo={params.get("to") ?? undefined} />;
}

function startingValues(state: State, editId: string | undefined, presetTo: string | undefined) {
  const draft = state.draft;
  if (editId) {
    if (draft?.editId === editId) return { values: draft, restored: true };
    const p = state.postcards.find((x) => x.id === editId)!;
    return {
      values: { what: p.what, to: p.to ?? "", reaction: p.reaction ?? "", feeling: p.feeling ?? "", ideaId: p.ideaId },
      restored: false,
    };
  }
  if (draft && !draft.editId && (draft.what || draft.to || draft.reaction || draft.feeling)) {
    return { values: { ...draft, to: draft.to || presetTo || "" }, restored: true };
  }
  return { values: { what: "", to: presetTo ?? "", reaction: "", feeling: "", ideaId: undefined }, restored: false };
}

function Form({ state, editId, presetTo }: { state: State; editId?: string; presetTo?: string }) {
  const router = useRouter();
  const [{ values: initial, restored }] = useState(() => startingValues(state, editId, presetTo));
  const [values, setValues] = useState<Values>(initial);
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted ? validate(values) : {};
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
    const found = validate(values);
    const first = (Object.keys(limits) as (keyof typeof limits)[]).find((k) => found[k]);
    if (first) {
      // Field ids match the keys; focusing reads out the error tied to it.
      document.getElementById(first)?.focus();
      return;
    }
    pinned.current = true;
    const input = { what: values.what, to: values.to, reaction: values.reaction, feeling: values.feeling, ideaId: values.ideaId };
    if (editId) {
      updatePostcard(editId, input);
      router.push(`/wall?pinned=${editId}&edited=1`);
    } else {
      const id = addPostcard(input);
      router.push(`/wall?pinned=${id}`);
    }
  }

  function discard() {
    pinned.current = true;
    saveDraft(undefined);
    router.push(editId ? "/wall" : "/");
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
          hint="Name the detail, like “the green coat” or “how calm you were in the meeting.”"
          error={errors.what}
          count={{ value: what, max: limits.what }}
          value={values.what}
          onChange={(e) => set("what", e.target.value)}
        />
        <TextField
          id="to"
          label="Who was it for?"
          optional
          hint="A name or nickname. Leave it blank for a stranger."
          error={errors.to}
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
        <TextField
          id="reaction"
          label="How did they react?"
          optional
          hint="A smile, a reply, or nothing yet. All fine."
          error={errors.reaction}
          value={values.reaction}
          onChange={(e) => set("reaction", e.target.value)}
        />
        <div className="flex flex-col gap-3">
          <TextField
            id="feeling"
            label="How did you feel after?"
            optional
            error={errors.feeling}
            value={values.feeling}
            onChange={(e) => set("feeling", e.target.value)}
          />
          <ChipGroup
            label="Quick picks for how you felt"
            labelId="feeling-picks"
            hideLabel
            options={feelingPicks.map((f) => ({ value: f, label: f }))}
            value={feelingPicks.includes(values.feeling) ? values.feeling : undefined}
            onChange={(v) => set("feeling", v ?? "")}
            clearable
          />
        </div>
        <CheckboxField
          id="idea"
          label={editId ? "This was one of the daily ideas" : "This was today’s idea"}
          hint={<span className="italic">&ldquo;{ideaForCheckbox.text}&rdquo;</span>}
          checked={Boolean(values.ideaId)}
          onChange={(e) => set("ideaId", e.target.checked ? ideaForCheckbox.id : undefined)}
        />
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
