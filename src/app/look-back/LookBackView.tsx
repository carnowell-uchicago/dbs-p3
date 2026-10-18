"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Postcard } from "@/components/postcards/Postcard";
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
// Highlighted on Sundays from Today, but open any day.
export function LookBackView() {
  const state = useKindRegards();
  const [which, setWhich] = useState<Which>("this");
  if (!state) return <Skeleton label="Gathering your week" />;

  const today = dayKey();
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
                  , for <span className={`${font.hand} text-xl text-(--cp-ink)`}>{listNames(names.map((n) => n.name), unnamed)}</span>
                </>
              ) : unnamed ? ", all for strangers or someone unnamed" : ""}
              .
              {landed ? ` You noted how ${landed === 1 ? "one" : landed} landed.` : ""}
            </p>
            {felt.length ? (
              <p className={type.body}>
                Afterwards you felt: <span className={`${font.hand} text-xl text-(--cp-ink)`}>{[...new Set(felt)].join(", ")}</span>.
              </p>
            ) : null}
          </Panel>
          <section aria-labelledby="week-postcards" className="flex flex-col gap-8">
            <h2 id="week-postcards" className={type.heading}>
              The postcards
            </h2>
            <ol className="flex flex-col gap-10">
              {week.map((p, i) => (
                <li key={p.id}>
                  <Postcard postcard={p} index={i} headingLevel="h3" />
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </>
  );
}

function listNames(names: string[], unnamed: number): string {
  const all = unnamed ? [...names, unnamed === 1 ? "one stranger" : `${unnamed} others`] : names;
  if (all.length <= 1) return all.join("");
  return `${all.slice(0, -1).join(", ")} and ${all[all.length - 1]}`;
}
