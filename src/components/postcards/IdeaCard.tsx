"use client";

import { ChipGroup } from "@/components/ui/ChipGroup";
import { Panel } from "@/components/ui/Panel";
import { font, type } from "@/components/ui/styles";
import { comfortLabels, groupLabels, type Comfort, type Idea } from "@/data/ideas";
import { setComfort } from "@/lib/store";

const comfortOptions = (Object.keys(comfortLabels) as Comfort[]).map((value) => ({ value, label: comfortLabels[value] }));

// Today's idea, with the comfort level (quiet = a message or note, in person
// = face to face). One a day, and only a suggestion: there's no swapping it,
// since nothing has to come from it. Any kind thing goes on a postcard, where
// the idea can be ticked if you used it.
export function IdeaCard({
  idea,
  comfort,
  title = "Need an idea?",
}: {
  idea: Idea;
  comfort: Comfort | undefined;
  title?: string;
}) {
  const forYou = idea.group === "for-you";
  return (
    <Panel as="section" labelledBy="idea-title" className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="idea-title" className={type.heading}>
          {title}
        </h2>
        <p className={type.meta}>A new one every day</p>
      </div>
      <ChipGroup
        label="How do you feel like connecting today?"
        labelId="comfort-label"
        options={comfortOptions}
        value={comfort}
        onChange={(value) => value && setComfort(value)}
      />
      <div className="flex flex-col gap-2" aria-live="polite">
        <p className={`${font.display} text-sm text-(--cp-muted)`}>
          {forYou ? "For you · Sundays start with one for yourself" : groupLabels[idea.group]}
        </p>
        <p className={`${font.body} text-xl leading-relaxed`}>{idea.text}</p>
      </div>
      <p className={type.meta}>
        {forYou
          ? "Pick Quiet or In person for an idea for someone else."
          : "Did it? Write it down, and tick \u201cThis was today\u2019s idea.\u201d"}
      </p>
    </Panel>
  );
}
