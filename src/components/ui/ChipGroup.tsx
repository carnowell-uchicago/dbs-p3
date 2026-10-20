"use client";

import { Icon } from "./Icon";
import { edge, focusRing, font } from "./styles";

type Option<T extends string> = { value: T; label: string };

// A toggle chip's look (also used on its own, with aria-pressed).
export const chip = `inline-flex h-9 items-center gap-2 px-3 text-base font-semibold select-none [--w:3px] [--e:var(--cp-wood)] [--d:3px] ${font.display} ${focusRing}
                bg-(--cp-surface) text-(--cp-text) not-aria-pressed:hover:bg-(--cp-hover)
                active:translate-y-[3px] active:[--d:0px] not-aria-pressed:active:bg-(--cp-pressed)
                aria-pressed:bg-(--cp-wood) aria-pressed:text-(--cp-surface) aria-pressed:[--e:var(--cp-text)] aria-pressed:[--d:0px] aria-pressed:translate-y-[3px]
                motion-safe:transition-[translate] motion-safe:duration-75`;

// A row of toggle chips that act as one choice. Selected fills with wood and
// shows a check, so the state never rests on color alone. Pressing the
// selected chip again clears it when `clearable` is set.
export function ChipGroup<T extends string>({
  label,
  labelId,
  options,
  value,
  onChange,
  clearable = false,
  hideLabel = false,
  optional = false,
  describedBy,
}: {
  label: string;
  labelId: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  clearable?: boolean;
  hideLabel?: boolean;
  optional?: boolean;
  describedBy?: string;
}) {
  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={describedBy} className="flex flex-col gap-2">
      <span id={labelId} className={hideLabel ? "sr-only" : `${font.display} text-base font-medium`}>
        {label}
        {optional ? <span className={`${font.body} ml-1 text-sm font-normal text-(--cp-muted)`}> (optional)</span> : null}
      </span>
      <div className="flex flex-wrap gap-x-3 gap-y-4 pt-1 pb-1">
        {options.map((option) => {
          const on = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on && clearable ? undefined : option.value)}
              style={edge}
              className={chip}
            >
              {on ? <Icon name="check" /> : null}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
