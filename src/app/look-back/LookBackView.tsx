"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Postcard } from "@/components/postcards/Postcard";
import { PostcardActions, useTakeDown } from "@/components/postcards/PostcardActions";
import { LinkButton } from "@/components/ui/Button";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/Skeleton";
import { font, type } from "@/components/ui/styles";
import { addDays, dayKey, isSunday, shortDate, weekStart } from "@/lib/dates";
import { people, postcardsInWeek } from "@/lib/derive";
import { useKindRegards } from "@/lib/store";

type Which = "this" | "last";

// The weekly look-back: who you noticed, what you said, how it landed.
// Highlighted on Sundays from Today, but open any day. Each postcard can be
// edited (the form comes back here) or deleted with Undo.
// Keyed on bfcacheId like the wall, so a fresh visit re-reads "?edited=".
export function LookBackView() {
  const { bfcacheId } = useRouter();
  return <LookBack key={bfcacheId} />;
}

function LookBack() {
  const state = useKindRegards();
  const params = useSearchParams();
  const router = useRouter();
  const [edited] = useState(() => params.get("edited"));
  const [picked, setWhich] = useState<Which>();
  const focused = useRef(false);
  const { takeDown, toastEl } = useTakeDown(edited ? "Postcard updated." : null, focusPostcard);

  // Drop the one-time "?edited=" so a reload doesn't repeat the message.
  useEffect(() => {
    if (params.has("edited")) router.replace("/look-back", { scroll: false });
  }, [params, router]);

  // Back from an edit: bring that postcard into view and focus it.
  useEffect(() => {
    if (!edited || !state || focused.current) return;
    focused.current = true;
    const card = document.getElementById(`look-${edited}`);
    card?.scrollIntoView({ block: "center" });
    card?.focus({ preventScroll: true });
  }, [edited, state]);

  if (!state) return <Skeleton label="Gathering your week" />;

  const today = dayKey();
  // Back from an edit, open on the week that postcard is in.
  const editedDay = edited ? state.postcards.find((p) => p.id === edited)?.day : undefined;
  const editedWeek: Which | undefined = editedDay
    ? editedDay >= weekStart(today)
      ? "this"
      : editedDay >= addDays(weekStart(today), -7)
        ? "last"
        : undefined
    : undefined;
  // Open on last week when this week has nothing yet, so coming back to
  // look back never lands on an empty page.
  const thisEmpty = postcardsInWeek(state.postcards, weekStart(today)).length === 0;
  const lastHas = postcardsInWeek(state.postcards, addDays(weekStart(today), -7)).length > 0;
  const which: Which = picked ?? editedWeek ?? (thisEmpty && lastHas ? "last" : "this");
  const start = which === "this" ? weekStart(today) : addDays(weekStart(today), -7);
  const end = addDays(start, 6);
  const week = postcardsInWeek(state.postcards, start);
  const names = people(week);
  const unnamed = week.filter((p) => !p.to).length;
  const felt = week.filter((p) => p.feeling).map((p) => p.feeling!);
  const landed = week.filter((p) => p.reaction).length;

  const title = which === "this" ? (isSunday(today) ? "Your week, on a Sunday" : "Your week so far") : "Last week";

  return (
    <>
      <PageHeader title={title} lead={`${shortDate(start)} to ${shortDate(end)}.`}>
        <ChipGroup
          label="Which week"
          labelId="which-week"
          hideLabel
          options={[
            { value: "this", label: "This week" },
            { value: "last", label: "Last week" },
          ]}
          value={which}
          onChange={(v) => v && setWhich(v)}
        />
      </PageHeader>

      {week.length === 0 ? (
        <Panel as="section" labelledBy="quiet-week" className="flex flex-col gap-3 p-5">
          <h2 id="quiet-week" className={type.heading}>
            {which === "this" ? "Nothing pinned this week yet." : "Last week was quiet."}
          </h2>
          <p className={type.body}>
            That&rsquo;s okay, there&rsquo;s nothing to catch up on. One small thing today is enough to start this week&rsquo;s
            look-back.
          </p>
          <LinkButton href="/write" variant="primary" className="self-start">
            Write a postcard
          </LinkButton>
        </Panel>
      ) : (
        <>
          <Panel as="section" tone="sky" labelledBy="week-summary" className="flex flex-col gap-3 p-5">
            <h2 id="week-summary" className={type.heading}>
              You noticed {names.length + unnamed} {names.length + unnamed === 1 ? "person" : "people"}.
            </h2>
            <p className={type.body}>
              {week.length} {week.length === 1 ? "kindness" : "kindnesses"}
              {names.length ? (
                <>
                  , for <span className={`${font.hand} text-xl text-(--cp-text)`}>{listNames(names.map((n) => n.name), unnamed)}</span>
                </>
              ) : unnamed ? ", all for strangers or someone unnamed" : ""}
              .
              {landed ? ` You noted how ${landed === 1 ? "one" : landed} landed.` : ""}
            </p>
            {felt.length ? (
              <p className={type.body}>
                Afterwards you felt: <span className={`${font.hand} text-xl text-(--cp-text)`}>{[...new Set(felt)].join(", ")}</span>.
              </p>
            ) : null}
          </Panel>
          <section aria-labelledby="week-postcards" className="flex flex-col gap-8">
            <h2 id="week-postcards" className={type.heading}>
              The postcards
            </h2>
            <ol className="flex flex-col gap-10">
              {week.map((p, i) => (
                <li key={p.id} id={`look-${p.id}`} tabIndex={-1} className="scroll-mt-24 outline-none">
                  <Postcard
                    postcard={p}
                    index={i}
                    headingLevel="h3"
                    actions={
                      <PostcardActions
                        postcard={p}
                        editHref={`/write?edit=${p.id}&from=look-back`}
                        onDelete={() => {
                          // Stay on this week even if it's now empty.
                          setWhich(which);
                          takeDown(p.id);
                        }}
                      />
                    }
                  />
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
      {toastEl}
    </>
  );
}

// After Undo, the postcard is back in the list: focus it.
function focusPostcard(id: string) {
  document.getElementById(`look-${id}`)?.focus();
}

function listNames(names: string[], unnamed: number): string {
  const all = unnamed ? [...names, unnamed === 1 ? "one stranger" : `${unnamed} others`] : names;
  if (all.length <= 1) return all.join("");
  return `${all.slice(0, -1).join(", ")} and ${all[all.length - 1]}`;
}
