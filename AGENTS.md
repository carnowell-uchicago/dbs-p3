<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kindness Log: Design, Build, Ship, Assignment 3

MPCS 51238, Autumn 2026. **Due Tuesday, October 20, 5:30 PM.** The brief PDF is in the repo root (gitignored).

## The assignment
A small everyday tool built around three flows: the **first visit**, the **main task**, and **coming back**. There's one route per flow step, with shared navigation. The flows are drawn in Mermaid in `flows.md` and shown in `README.md`.

- **Graded on:** the live Vercel URL; a first visit that's useful right away (no dead-end empty screen); a one-column form with a label on every field, errors next to the field that say what to do next, and input kept on error; a reason to come back, plus memory between visits; shared components; clear navigation; keyboard access, real labels, and contrast checked; the agent's first-run usability feedback in `README.md`; and commits that show progress.
- **One-shot work is marked incomplete.** The student makes the design decisions at checkpoints: flows (in plan mode), onboarding research takeaways, the reason to come back, and which first-run fixes to make. The agent builds everything else.

## Hard constraints
- Next.js + Tailwind only. Data lives in the browser in `localStorage`: no backend, database, accounts, or external APIs.
- Push back on any package we don't need.
- Deploy on Vercel's Hobby plan from `main`.

## Status
- 2026-10-18: all five routes built and tested at 1280 and 390 wide in headless Chrome (a 42-check end-to-end script; no console errors). Contrast is 24 of 24. `flows.md` and the README are written.
- **Waiting on:** the Vercel URL (the student is creating the project). After that: the first-run check by a subagent on the live URL, then **checkpoint 4**, where the student picks which fixes to make. Then record it in the README and do a final pass against the brief.
- **Left for the student:** running `/context`, the README "My reflection" section, submitting, and explaining in class.

## Code map
- `src/app/<route>/page.tsx` is a thin server file with metadata; the `*View.tsx` / `WriteForm.tsx` next to it is the client UI. Routes: `/` (TodayView), `/write`, `/wall`, `/people`, `/look-back`.
- `src/lib/store.ts`: the single localStorage entry `kind-regards:v1`, `useKindRegards()` (null on the server, so pages show `Skeleton`), and actions. `derive.ts`: today's idea, people, nudges, weeks. `dates.ts`: local day keys (YYYY-MM-DD); weeks run Mon–Sun.
- `src/data/ideas.ts`: 27 ideas (5 groups, quiet or in person). `example.ts`: the labeled example postcard.
- `src/components/ui/`: shared Button/LinkButton, Fields (Field, TextField, TextAreaField, CheckboxField), ChipGroup, Panel, Notice, Toast, Skeleton, Icon, styles (pixel `edge`, `focusRing`, `type`). **Use these everywhere.**
- `src/lib/tokens.ts`: colors (CSS vars `--cp-*` on `<html>`) and the contrast pairs. Add a pair whenever a new color combination appears; `npm run contrast`.
- **Gotcha:** Cache Components keeps up to 3 pages mounted (hidden). Wall and Write key their content on `useRouter().bfcacheId` so a fresh visit resets local state. Pages using `useSearchParams` sit inside `<Suspense>`.

## Decisions (made by the student)
- **Tool:** a kindness log/jar. Each day it suggests one small kind act. Doing it and logging it fills your jar. The goal is to help the user thoughtfully appreciate others every day.
- **Prompt groups (keep all):** compliments (the seed: "Genuinely compliment someone on [their hair, their sense of style, …]"), gratitude, reaching out, small acts, and kindness to yourself (optional, about once a week).
- **Onboarding research tools:** Duolingo, Happyfeed, and the Random Acts of Kindness Foundation.
- **Collection:** a postcard wall, not a jar (jars are taken). **One log action** for any kindness; the daily idea is secondary ("This was today's idea" checkbox).
- **Extras:** people-first prompts, a specificity nudge, optional "How did they react?" and "How did you feel after?", a Quiet / In person comfort level, optional names (for strangers).
- **Return:** a new idea daily, the Sunday look-back, people you haven't reached lately, a running total (no streaks).
- **Prompt voice:** "notice, then say." **Style:** Cozy Pixel (from p2) plus Life is Strange-inspired journal touches. The name "Kind Regards" was proposed by the agent and can be changed.
- **Must be substantially different** from all three (and any other existing kindness jar or kindness app): no copied names, terms, mechanics, visuals, or prompt wording. Having something that makes it better is a secondary goal.
