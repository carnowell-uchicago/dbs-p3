<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kind Regards: Design, Build, Ship, Assignment 3

A daily kindness log kept as a wall of postcards. MPCS 51238, Autumn 2026. **Due Tuesday, October 20, 5:30 PM.**
- **Live:** https://dbs-p3.vercel.app (Vercel auto-deploys `main`)
- **Repo:** github.com/carnowell-uchicago/dbs-p3. Plain `git push` over HTTPS works.
- **Brief:** the PDF in the repo root (gitignored; read it with the Read tool).

## Starting a new session
1. Read this file, then `README.md` for the overview. `plan.md` is the approved plan, and `first-run.md` has the usability feedback and fixes.
2. **The build is complete.** Expect small requested edits, not new features. Don't redo finished work.
3. If the student asks whether `AGENTS.md` loaded: it shows under "Memory files" in `/context`. There must be **no `CLAUDE.md`** (the brief requires `AGENTS.md` as the context file).

## Working rules (agreed with the student)
- **The student decides; the agent builds.** The brief marks one-shot work incomplete, so design choices come from the student. Ask about anything that changes the tool's scope, flows, wording the student chose, or the visual style. Routine code, fixes, docs, and tests don't need asking.
- **Small commits pushed straight to `main`** (approved), each ending with the co-author line. Never force-push or rewrite history.
- **No new dependencies** beyond Next.js/Tailwind without asking. Test tooling stays outside the repo (see Verifying).
- **Left to the student; don't write these:** the reflection (the student writes it separately, outside the repo; don't add a section for it), submitting in Google Classroom, and the in-class explanation.

## The assignment
A small everyday tool built around three flows: the **first visit**, the **main task**, and **coming back**. There's one route per flow step, with shared navigation. The flows are drawn in Mermaid in `flows.md` and embedded in `README.md`; keep the two in sync.

- **Graded on:** the live URL; a first visit that's useful right away (no dead-end empty screen); a one-column form with a label on every field, errors next to the field that say what to do next, and input kept on error; a reason to come back, plus memory between visits; shared components; clear navigation; keyboard access, real labels, and contrast checked; the first-run usability feedback in `README.md`; and commits that show progress.
- **Hard constraints:** Next.js + Tailwind only. Data lives in `localStorage`: no backend, database, accounts, or external APIs. Vercel Hobby plan.

## Status (2026-10-18)
- **Done:** all 5 routes, all 4 student checkpoints, research (`research.md`), flows, README, and the first-run check. The student chose 14 of 16 fixes; all are shipped. Not fixed, by the student's choice: #12, #13, #16 (Look back wording).
- **Later small edits from the student:** the example postcard now says "orange coat" (`src/data/example.ts`), and the form hint says "their green coat" (`WriteForm.tsx`).
- **Corkboard wall (2026-10-18, student's request):** `/wall` is a pixel corkboard of small postcards; opening one shows it full size in a `<dialog>`. Student's choices: mini cards show the first lines + stamp + name; spots stay put (saved as `spot` on each postcard); a full board overlaps (newest on top); **Show me a memory** on Wall and Today (Today links to `/wall?memory=1`). Also: the page is always `100vw` wide so short pages don't shift when the scrollbar goes, and every page was checked at 360/390 wide.
- **Second first-run check (2026-10-18):** in `first-run.md` (Round 2) and the README. The student fixed #1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15 and skipped #4, 8, 14. Stamp notes live in `postcards/Stamp.tsx`; placement uses free slots on a loose grid (`board.ts`); on phones the board's height follows the card count.
- **Look back edits (2026-10-18):** each postcard there has Edit and Delete (with Undo); `/write?edit=…&from=look-back` returns to Look back on that postcard's week. `PostcardActions.tsx` holds the shared Edit/Delete buttons and `useTakeDown()` (delete, Undo, toast) for Wall and Look back.
- **First visit = the Write tutorial (2026-10-18, student's choice):** with nothing saved, `/` redirects to `/write`, which shows `write/Tutorial.tsx`: one box per step (What, Who, When, Reaction, Feeling), a sky note beside each on what it's for, and the example's answer offered per box while it's empty ("Or use this example (it won't be saved)"). Using the example's sentence makes it a **practice postcard**: `pinPractice()` keeps it in memory only (never localStorage), merged into `useKindRegards()` while nothing real is saved, labeled "Practice, not saved", removable, not editable. **Skip the tutorial** (`skipTutorial()`) goes to `/wall`, where the example sits on the empty board; a typed draft is kept. While the tutorial runs, `NavBar` turns the other tabs into `aria-disabled` spans (student's choice). `useTutorial()` is true until a postcard (real or practice) is pinned, or the tutorial is skipped, in this page session, so leaving or reloading brings the tutorial back. Shared form logic (limits, validate, choices, starting values) lives in `write/form.ts`.
- **One daily idea (2026-10-18, student's choice):** no "Show me another" on the idea card (`showAnotherIdea` and the offset are gone); `today` in state only remembers the day and comfort level. The ideas grew to 83 (10 per group × comfort).
- **WCAG 2.2 AA audit (2026-10-18):** axe-core passes on every page and state at 1280 and 320. Fixed from it: corkboard card names start with their visible text (2.5.3), buttons wrap instead of overflowing (1.4.10), Escape hides stamp notes without moving focus and without closing the dialog (1.4.13), and focus scrolls clear of the toast (2.4.11).
- **Verified:** a 62-check end-to-end run passed before the corkboard. The corkboard had its own browser run (open, memory from Wall and Today, delete and Undo, edit, pin, keyboard, 360/390/1280 wide). Contrast is 25 of 25 (two cork pairs added; blue-on-sky retired). The tutorial, practice postcard, Look back edits, and one-idea Today were each checked in the browser and on the live site.
- **Still with the student:** confirm `AGENTS.md` loads in `/context` (in a new session), write the reflection (separately), submit, and the class talk.

## Code map
- `src/app/<route>/page.tsx` is a thin server file with metadata; the client UI sits next to it (`TodayView.tsx`, `write/WriteForm.tsx`, `wall/WallView.tsx`, `people/PeopleView.tsx`, `look-back/LookBackView.tsx`). There's also `not-found.tsx` and the pixel-heart `icon.svg`.
- **Form (`/write`):** What (required, 280 max), Who (optional, 40 max, suggests past names), When (Today / Yesterday / Earlier with a date; no future dates), Reaction (140), Feeling (chips + Other…, 60), and the "This was today's idea" checkbox (on edits, only if the postcard had an idea). Field ids double as error keys (`fieldOrder`); the first error gets focus. The draft autosaves.
- `src/lib/store.ts`: the single localStorage entry `kind-regards:v1`, `useKindRegards()` (null on the server, so pages show `Skeleton`), and actions. Postcards are sorted by `day`, then `createdAt`. `derive.ts`: today's idea (first visit → a compliment; Sunday → "For you" until a comfort level is picked), people, nudges (7+ days), weeks. `dates.ts`: local day keys (YYYY-MM-DD); weeks run Mon–Sun.
- **Wall:** `src/lib/board.ts` places new cards (in card sizes): a random pick among the roomiest free slots on a loose, nudged grid (slots 1.25 apart; a slot is free 1.12 from every card, tilt included); once none is free, the emptiest of 150 random tries, so cards overlap. `WallView` assigns spots on load for any postcard without one. `CorkBoard` sets `--card-w`/`--card-h`; `MiniPostcard` positions itself from its spot. `ui/Dialog` closes itself when the page is hidden (effect cleanup), so it can't linger over another page. `pickMemory()` in `derive.ts` only picks postcards from before today.
- `src/data/ideas.ts`: 83 original ideas: 10 in each group × comfort (compliment, thanks, reach out, small act; quiet = messages and notes, in person = face to face), plus 3 "For you" for Sundays. "Notice, then say" voice. Never reuse the RAK wordings listed in `research.md`. `todaysIdea()` steps through each 40-idea pool by a stride coprime to its size, so all 40 come up before a repeat.
- `src/components/ui/`: shared Button/LinkButton, Fields (Field, TextField, TextAreaField, CheckboxField), ChipGroup, Panel, Notice, Toast (pauses while hovered or focused), Skeleton, Icon, and styles (pixel `edge`, `focusRing`, `type`). **Use these everywhere.** Layout lives in `src/components/layout/` (NavBar, SkyBand, PageHeader, StorageNotice, RouteFocus); postcards in `src/components/postcards/`.
- `src/lib/tokens.ts`: colors (CSS vars `--cp-*` on `<html>`) and the contrast pairs. Add a pair whenever a new color combination appears, run `npm run contrast`, and update the README table.
- **Gotchas:**
  - Cache Components keeps up to 3 pages mounted (hidden, still in the DOM). Use `focusPageHeading()` (`src/lib/focus.ts`) instead of querying `main h1`. `RouteFocus` waits for the new page's visible h1 after navigation.
  - Wall and Write key their content on `useRouter().bfcacheId`, so a fresh visit resets local state.
  - Pages that use `useSearchParams` sit inside `<Suspense>`.

## Verifying changes
- `npm run build`, `npm run lint`, `npm run contrast`.
- **Browser tests:** install `playwright-core` in the session scratchpad (not the repo) and launch with `chromium.launch({ channel: "chrome" })`, which uses the installed Google Chrome. Check the first visit with empty storage, each form error (text kept, focus), save and reload, edit, delete and Undo, and a return visit (shift `day`, `createdAt`, and `visits.current` back in `kind-regards:v1`). Run at 1280 and 390 wide, and keyboard-only. Look at the screenshots. For WCAG, also install `axe-core` in the scratchpad, inject `axe.min.js` with `page.addScriptTag`, and run it with the tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa` at 1280 and 320 wide (the skip link's clipping under text spacing is expected: it's hidden until focused).
- After pushing, check the live URL once Vercel redeploys (about 1 minute).

## Decisions (made by the student)
- **Tool:** a kindness log that helps the user thoughtfully appreciate others every day. Built for the student.
- **Prompt groups (all kept):** compliments (seeded by the student's "compliment someone on their hair, their style…" idea), thanks, reaching out, small acts, and for you (Sundays).
- **Research:** Duolingo, Happyfeed, and the RAK Foundation. The app must be **substantially different** from them and from other kindness apps (no jars, streaks, mascots, or growing plants, and none of RAK's wording or terms). Being better is secondary.
- **Collection:** a postcard wall (jars are taken). **One log action** for any kindness; the daily idea is secondary.
- **Extras:** people-first prompts, a specificity nudge, optional reaction and feeling fields, Quiet / In person, and optional names (blank is fine for strangers).
- **Return:** a new idea daily (one a day, no "Show me another": ideas are optional), the Sunday look-back, people you haven't written to lately, and a running total (never a streak).
- **Style:** Cozy Pixel (from Assignment 2, `~/projects/p2`) plus Life is Strange-inspired journal touches (golden-hour sky, tape, handwriting, postmarks). No butterflies, Polaroids, or game names.
- **Name:** "Kind Regards" (proposed by the agent; kept by the student).
