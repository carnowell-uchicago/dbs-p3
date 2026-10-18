// Pages hidden by Next's Activity stay in the DOM (display: none), so pick
// the h1 that's actually showing.
export function focusPageHeading() {
  const heading = [...document.querySelectorAll<HTMLElement>("main h1")].find((h) => h.offsetParent !== null);
  heading?.focus({ preventScroll: true });
}
