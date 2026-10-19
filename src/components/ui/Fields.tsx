"use client";

import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from "react";
import { Icon } from "./Icon";
import { edge, focusRing, font, type } from "./styles";

// One field wrapper for the whole app: label on top, hint under it, the
// control, then the error (which says what to do next) and an optional
// character count. The control is described by the hint, error, and count.
type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  count?: { value: number; max: number };
  children: (describedBy: string | undefined, invalid: boolean) => ReactNode;
};

export function Field({ id, label, optional, hint, error, count, children }: FieldProps) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`, count && `${id}-count`].filter(Boolean);
  const over = count ? count.value - count.max : 0;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={`${type.label} self-start text-(--cp-text)`}>
        {label}
        {optional ? <span className={`${font.body} ml-1 text-sm font-normal text-(--cp-muted)`}> optional</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={`${type.meta} -mt-1`}>
          {hint}
        </p>
      ) : null}
      {children(ids.length ? ids.join(" ") : undefined, Boolean(error))}
      <div className="flex items-start justify-between gap-4">
        {error ? (
          <p id={`${id}-error`} className={`${font.body} flex items-start gap-2 text-base font-semibold text-(--cp-error)`}>
            <Icon name="bang" className="mt-1 size-4" />
            <span>{error}</span>
          </p>
        ) : (
          <span />
        )}
        {count ? (
          <p
            id={`${id}-count`}
            className={`${font.body} shrink-0 text-sm tabular-nums ${over > 0 ? "font-semibold text-(--cp-error)" : "text-(--cp-muted)"}`}
          >
            {over > 0 ? (
              <>
                {over}
                <span className="sr-only">{over === 1 ? " character" : " characters"}</span> over
              </>
            ) : (
              <>
                {count.value} / {count.max}
                <span className="sr-only"> characters</span>
              </>
            )}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// Fields sit close under their hints, so their focus outline sits nearer the
// edge than the shared ring (written out in full so Tailwind generates it).
const wellRing =
  "outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[4px] focus-visible:outline-(--cp-text)";

// Paper well with a 3px wood edge; cocoa on hover, berry when invalid.
const well = `w-full bg-(--cp-surface) text-base text-(--cp-text) placeholder:text-(--cp-muted) [--w:3px] [--d:0px] [--e:var(--cp-wood)] hover:[--e:var(--cp-text)] aria-invalid:[--e:var(--cp-error)] ${font.body} ${wellRing}`;

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> &
  Omit<FieldProps, "children"> & { inputRef?: Ref<HTMLInputElement> };

export function TextField({ id, label, optional, hint, error, count, inputRef, className = "", ...rest }: InputProps) {
  return (
    <Field id={id} label={label} optional={optional} hint={hint} error={error} count={count}>
      {(describedBy, invalid) => (
        <input
          ref={inputRef}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          style={edge}
          className={`${well} h-11 px-3 ${className}`}
          {...rest}
        />
      )}
    </Field>
  );
}

type AreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> &
  Omit<FieldProps, "children"> & { inputRef?: Ref<HTMLTextAreaElement> };

export function TextAreaField({ id, label, optional, hint, error, count, inputRef, className = "", ...rest }: AreaProps) {
  return (
    <Field id={id} label={label} optional={optional} hint={hint} error={error} count={count}>
      {(describedBy, invalid) => (
        <textarea
          ref={inputRef}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          style={edge}
          className={`${well} min-h-28 resize-y px-3 py-2 leading-relaxed ${className}`}
          {...rest}
        />
      )}
    </Field>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> & {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
};

// Checkbox with its label to the right and an optional hint below.
export function CheckboxField({ id, label, hint, ...rest }: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`mt-0.5 size-6 shrink-0 cursor-pointer accent-(--cp-wood) ${focusRing} focus-visible:outline-offset-2`}
          {...rest}
        />
        <label htmlFor={id} className={`${type.label} cursor-pointer`}>
          {label}
        </label>
      </div>
      {hint ? (
        <div id={`${id}-hint`} className={`${type.meta} pl-9`}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
