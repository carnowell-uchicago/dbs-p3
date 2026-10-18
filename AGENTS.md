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
- 2026-10-18: scaffolded. Idea chosen: a kindness log/jar with a daily kindness prompt (for example, "Genuinely compliment someone on…"), to help the user appreciate others every day and fill their jar.

## Decisions (made by the student)
- **Tool:** a kindness log/jar. Each day it suggests one small kind act. Doing it and logging it fills your jar. The goal is to help the user thoughtfully appreciate others every day.
- **Prompt groups (keep all):** compliments (the seed: "Genuinely compliment someone on [their hair, their sense of style, …]"), gratitude, reaching out, small acts, and kindness to yourself (optional, about once a week).
- **Onboarding research tools:** Duolingo, Happyfeed, and the Random Acts of Kindness Foundation.
- **Must be substantially different** from all three (and any other existing kindness jar or kindness app): no copied names, terms, mechanics, visuals, or prompt wording. Having something that makes it better is a secondary goal.
