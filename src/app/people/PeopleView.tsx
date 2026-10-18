"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/Skeleton";
import { focusRing, font, type } from "@/components/ui/styles";
import { daysBetween, dayKey, relativeDay } from "@/lib/dates";
import { people } from "@/lib/derive";
import { useKindRegards } from "@/lib/store";

const link = `font-semibold underline decoration-2 underline-offset-4 decoration-(--cp-wood) hover:decoration-4 ${focusRing} focus-visible:outline-offset-2`;

export function PeopleView() {
  const state = useKindRegards();
  if (!state) return <Skeleton label="Loading your people" />;

  const today = dayKey();
  const list = people(state.postcards);
  const unnamed = state.postcards.filter((p) => !p.to).length;

  if (list.length === 0) {
    return (
      <>
        <PageHeader
          title="Your people"
          lead="When you put a name on a postcard, that person shows up here, with when you last wrote to them. It's an easy way to see who you haven't appreciated in a while."
        />
        {unnamed ? (
          <p className={type.body}>
            You have {unnamed} {unnamed === 1 ? "postcard" : "postcards"} for strangers or someone unnamed. Those count too.
          </p>
        ) : null}
        <LinkButton href="/write" variant="primary" className="self-start">
          Write a postcard to someone
        </LinkButton>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Your people"
        lead={`${list.length} ${list.length === 1 ? "person" : "people"} you've appreciated. Anyone you haven't written to in a week is marked, in case they come to mind.`}
      />
      <ul className="flex flex-col gap-6">
        {list.map((person) => {
          const days = daysBetween(person.lastDay, today);
          const due = days >= 7;
          const to = encodeURIComponent(person.name);
          return (
            <li key={person.key}>
              <Panel as="article" labelledBy={`person-${person.key}`} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-4">
                <div className="flex flex-col gap-1">
                  <h2 id={`person-${person.key}`} className={`${font.hand} text-2xl text-(--cp-ink)`}>
                    {person.name}
                  </h2>
                  <p className={type.meta}>
                    {person.count} {person.count === 1 ? "postcard" : "postcards"} · last {relativeDay(person.lastDay, today)}
                    {due ? (
                      <span className={`${font.display} ml-2 bg-(--cp-sky-1) px-2 py-0.5 text-sm text-(--cp-text)`}>
                        {days} days ago
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Link href={`/wall?to=${to}`} className={link}>
                    See postcards<span className="sr-only"> to {person.name}</span>
                  </Link>
                  <Link href={`/write?to=${to}`} className={`${link} inline-flex items-center gap-2`}>
                    Write again<span className="sr-only"> to {person.name}</span>
                    <Icon name="arrow" />
                  </Link>
                </div>
              </Panel>
            </li>
          );
        })}
      </ul>
      {unnamed ? (
        <p className={type.body}>
          Plus {unnamed} {unnamed === 1 ? "postcard" : "postcards"} for strangers or someone unnamed.
        </p>
      ) : null}
    </>
  );
}
