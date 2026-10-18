"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { IdeaCard } from "@/components/postcards/IdeaCard";
import { Postcard } from "@/components/postcards/Postcard";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/Skeleton";
import { focusRing, font, type } from "@/components/ui/styles";
import { examplePostcard } from "@/data/example";
import { addDays, dayKey, isSunday, relativeDay, weekStart } from "@/lib/dates";
import { personToRevisit, postcardsInWeek, todaysIdea } from "@/lib/derive";
import { useKindRegards } from "@/lib/store";

const linkClass = `font-semibold underline decoration-2 underline-offset-4 decoration-(--cp-wood) hover:decoration-4 ${focusRing} focus-visible:outline-offset-2`;

export function TodayView() {
  const state = useKindRegards();
  if (!state) return <Skeleton />;

  const today = dayKey();
  const { idea, comfort } = todaysIdea(state, today);
  const total = state.postcards.length;
  const writtenToday = state.postcards.filter((p) => p.day === today);
  const lastVisit = state.visits?.current !== today ? state.visits?.current : state.visits?.previous;
  const sunday = isSunday(today);

  // First visit: nothing saved yet. Useful right away: an idea to act on and
  // the one button to write it down. No tour, no empty wall.
  if (total === 0) {
    return (
      <>
        <PageHeader
          title="Who did you notice today?"
          lead="Do one kind thing for someone, big or small. Then write it on a postcard and pin it to your wall."
        >
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <LinkButton href="/write" variant="primary">
              Write a postcard
            </LinkButton>
            <p className={type.meta}>Takes under a minute. No sign-up; it stays on this device.</p>
          </div>
        </PageHeader>
        <IdeaCard idea={idea} comfort={comfort} />
        <section aria-labelledby="looks-like" className="flex flex-col gap-4">
          <h2 id="looks-like" className={type.heading}>
            What a postcard looks like
          </h2>
          <Postcard postcard={examplePostcard} example headingLevel="h3" />
        </section>
      </>
    );
  }

  const thisWeek = postcardsInWeek(state.postcards, weekStart(today)).length;
  const lastWeek = postcardsInWeek(state.postcards, addDays(weekStart(today), -7)).length;
  const revisit = personToRevisit(state.postcards, today);
  const done = writtenToday.length > 0;

  return (
    <>
      {lastVisit && lastVisit !== today ? (
        <Panel as="section" tone="sky" labelledBy="welcome" className="flex flex-col gap-2 p-5">
          <h2 id="welcome" className={type.heading}>
            Welcome back.
          </h2>
          <p className={type.body}>
            You were last here {relativeDay(lastVisit, today)}. Your wall has {total} {total === 1 ? "postcard" : "postcards"}
            {thisWeek ? `, ${thisWeek} from this week` : ""}. Here&rsquo;s a new idea for today.
          </p>
          {sunday && (thisWeek || lastWeek) ? (
            <p className={type.body}>
              It&rsquo;s Sunday.{" "}
              {/* An empty week isn't worth the trip; Look back opens on last week then. */}
              <Link href="/look-back" className={linkClass}>
                {thisWeek
                  ? "Look back at your week"
                  : `Look back at last week (${lastWeek} ${lastWeek === 1 ? "kindness" : "kindnesses"})`}
              </Link>
            </p>
          ) : null}
        </Panel>
      ) : null}

      {done ? (
        <PageHeader
          title={writtenToday.length === 1 ? "One postcard today. Nice." : `${writtenToday.length} postcards today. Nice.`}
          lead={`That's ${total} ${total === 1 ? "kindness" : "kindnesses"} on your wall. Notice someone else? There's no limit, write that one down too.`}
        >
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <LinkButton href="/write" variant="primary">
              Write a postcard
            </LinkButton>
            <LinkButton href="/wall" variant="secondary">
              See your wall
            </LinkButton>
          </div>
        </PageHeader>
      ) : (
        <PageHeader
          title="Who did you notice today?"
          lead={`${total} ${total === 1 ? "kindness" : "kindnesses"} on your wall so far. Any kind thing counts, the idea below is just a nudge.`}
        >
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <LinkButton href="/write" variant="primary">
              Write a postcard
            </LinkButton>
            <LinkButton href="/wall" variant="secondary">
              See your wall
            </LinkButton>
          </div>
        </PageHeader>
      )}

      {done ? (
        <section aria-labelledby="today-postcard" className="flex flex-col gap-4">
          <h2 id="today-postcard" className={type.heading}>
            Today&rsquo;s postcard
          </h2>
          <Postcard postcard={writtenToday[0]} headingLevel="h3" />
        </section>
      ) : null}

      {revisit ? (
        <Panel as="aside" labelledBy="revisit" className="flex flex-col gap-3 p-5">
          <h2 id="revisit" className={type.title}>
            Thinking of {revisit.name}?
          </h2>
          <p className={type.body}>
            Your last postcard to {revisit.name} was {revisit.days} days ago. Noticed anything about them lately?
          </p>
          <Link href={`/write?to=${encodeURIComponent(revisit.name)}`} className={`${linkClass} ${font.display} inline-flex items-center gap-2 self-start text-lg`}>
            Write to {revisit.name}
            <Icon name="arrow" />
          </Link>
        </Panel>
      ) : null}

      <IdeaCard idea={idea} comfort={comfort} title={done ? "Another idea" : "Idea for today"} />
    </>
  );
}
