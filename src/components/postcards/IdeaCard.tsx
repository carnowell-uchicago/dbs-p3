"use client";

import { Button } from "@/components/ui/Button";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { font, type } from "@/components/ui/styles";
import { comfortLabels, groupLabels, type Comfort, type Idea } from "@/data/ideas";
import { setComfort, showAnotherIdea } from "@/lib/store";

const comfortOptions = (Object.keys(comfortLabels) as Comfort[]).map((value) => ({ value, label: comfortLabels[value] }));

// Today's idea, with the comfort level (quiet = a message or note, in person
// = face to face) and a way to swap it. It's only a suggestion: there's one
// way to log anything (Write a postcard), where the idea can be ticked.
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Button variant="secondary" size="sm" onClick={showAnotherIdea}>
          <Icon name="shuffle" />
          Show me another
        </Button>
        <p className={type.meta}>
          {forYou
            ? "Pick Quiet or In person for an idea for someone else."
            : "Did it? Write it down, and tick \u201cThis was today\u2019s idea.\u201d"}
        </p>
      </div>
    </Panel>
  );
}
