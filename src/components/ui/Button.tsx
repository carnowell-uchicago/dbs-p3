import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { edge, focusRing, font } from "./styles";

export type Variant = "primary" | "secondary" | "quiet";
type Size = "md" | "sm";

const base = `inline-flex items-center justify-center gap-2 max-w-full text-center font-semibold select-none motion-safe:transition-[translate,background-color] motion-safe:duration-75 ${font.display} ${focusRing}`;

// Pressed sinks the face into its drop shadow; disabled goes flat and pale.
const raised =
  "[--w:3px] [--e:var(--cp-wood)] [--d:3px] active:translate-y-[3px] active:[--d:0px] aria-disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-(--cp-bg) disabled:text-(--cp-muted) disabled:[--e:var(--cp-bevel)] disabled:[--d:0px]";

const variants: Record<Variant, string> = {
  // Pumpkin is reserved for this variant: the one main action in a view.
  primary: `${raised} bg-(--cp-accent) text-(--cp-text) hover:bg-(--cp-accent-hover) active:bg-(--cp-accent-pressed)`,
  secondary: `${raised} bg-(--cp-surface) text-(--cp-text) hover:bg-(--cp-hover) active:bg-(--cp-pressed)`,
  // Text-weight action for small, repeated controls (Edit, Delete on cards).
  quiet:
    "text-(--cp-text) underline decoration-2 underline-offset-4 decoration-(--cp-wood) hover:decoration-4 hover:text-(--cp-wood) focus-visible:outline-offset-2",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-lg",
  sm: "h-9 px-3 text-base",
};

const quietSizes: Record<Size, string> = { md: "min-h-11 px-1 text-lg", sm: "min-h-9 px-1 text-base" };

function classes(variant: Variant, size: Size, className: string) {
  return `${base} ${variants[variant]} ${variant === "quiet" ? quietSizes[size] : sizes[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant = "secondary", size = "md", className = "", type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      style={variant === "quiet" ? undefined : edge}
      className={classes(variant, size, className)}
      {...rest}
    />
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

// A link that looks like a button, for actions that go to another page.
export function LinkButton({ variant = "secondary", size = "md", className = "", ...rest }: LinkButtonProps) {
  return (
    <Link
      style={variant === "quiet" ? undefined : edge}
      className={classes(variant, size, className)}
      {...rest}
    />
  );
}
