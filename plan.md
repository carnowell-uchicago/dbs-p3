# Plan: "Kind Regards", a kindness postcard wall (Assignment 3)

> **Later changes (2026-10-18, the student's choices).** This is the plan as approved; the README and `AGENTS.md` describe the tool as it is now. Since then: the first visit is a step-by-step Write tutorial with a practice example (not the Today screen below), the wall is a pixel corkboard with **Show me a memory**, Look back can edit and delete, and there's one daily idea with no "Show me another" (83 ideas in all).

## Context
Assignment 3 asks for an everyday tool built around three flows: the first visit, the main task, and coming back. It must use Next.js, Tailwind, and localStorage, and deploy on Vercel. The brief requires the student to make the decisions, so everything below reflects choices the student made in this planning session:

- **Tool:** a kindness log.
- **Collection:** a postcard wall (chosen over a jar after research showed Happyfeed and "Gratitude Jar" already use jars).
- **One action:** a single "Write a postcard" action for *any* kindness. The daily idea is secondary.
- **Extras:**
  - People-first prompts.
  - A specificity nudge ("What exactly did you notice?").
  - Optional "How did they react?" and "How did you feel after?" fields.
  - A comfort level for the day: Quiet or In person.
  - The name is optional (for strangers).
- **Return:**
  - A new idea each day.
  - A Sunday look-back.
  - "People you haven't written to lately."
  - A running total, never a streak.
- **Wording:** prompts use "notice-then-say" wording, so they don't echo RAK.
- **Style:** Cozy Pixel from Assignment 2, plus inspiration from Life is Strange.

The name "Kind Regards" is the agent's proposal (a postcard sign-off), and the student can change it.

**Main task:** I do something kind → I write it on a postcard → it's pinned to my wall → I come back tomorrow for a new idea, and on Sunday I look back at everyone I appreciated.

**Must differ from Duolingo, Happyfeed, RAK, and other kindness apps** (see `research.md`). We avoid:
- streaks, flames, mascots, XP;
- jars and shake-for-a-random-memory;
- "3 good things";
- RAK terms, a one-act-per-day calendar grid, and RAK prompt wording;
- growing plants or pets and tile grids that fill up.

**We borrow:**
- value before any setup (Duolingo, RAK);
- nothing asked up front;
- scheduled look-backs (Happyfeed);
- no penalty for a missed day.

## Routes (one per flow step; shared top nav: Today · Write · Wall · People · Look back; `aria-current` on the active link)
| Route | Purpose |
|---|---|
| `/` **Today** | **First visit:** "Who did you notice today?" with a one-line explanation, the main **Write a postcard** button, and an **Idea for today** card (Quiet / In person toggle, "Show me another", "Use this idea"). Not an empty screen.<br>**Returning:** "Welcome back" with what has changed since your last visit, a nudge about someone you haven't written to lately, a Sunday banner linking to Look back, and a **done-for-today** state showing today's postcard plus "Want another idea?" |
| `/write` | The postcard form, one column. `?idea=<id>` attaches the idea, `?to=<name>` prefills the person, and `?edit=<id>` edits a postcard. |
| `/wall` | The postcard wall, newest first, with the running total ("12 kindnesses"). `?pinned=<id>` highlights the new card and shows "Pinned to your wall." Each card has Edit and Delete (Delete offers Undo). When empty: one card labeled "Example" and the Write button. |
| `/people` | Everyone named on your postcards: how many, and when you last wrote. Each has a "Write to them again" link. Unnamed postcards are counted as "Strangers & unnamed." When empty: a short explanation and the Write button. |
| `/look-back` | This week (Mon–Sun) and the week before: the count, the people, and each postcard with how they reacted and how you felt. It's highlighted on Sundays. |

## Form (`/write`), one column, every field labeled
1. **What did you do or notice?** Required. It shows the specificity hint "Name the detail, like 'their green coat' or 'how calm you were in the meeting'." It has a live 0/280 counter.
   - **Empty or only spaces:** "Write what you did or noticed. A few words is enough, like 'told Sam the talk was clear.'"
   - **Over 280 characters:** "Keep it postcard-sized: 12 characters over."
2. **Who was it for? (optional)** A text input that suggests past names. The hint says "Leave blank for a stranger."
   - **Over 40 characters:** "Shorten the name to 40 characters, or use a nickname."
3. **How did they react? (optional)** Maximum 140 characters, with the same over-limit error pattern.
4. **How did you feel after? (optional)** Quick-pick chips (Warm, Lighter, Nervous then glad, Not sure) plus a short text field.
5. **Attached idea:** shown as the postcard's "stamp," with a Remove button.

**Behavior:**
- Errors sit under the field and are linked to it with `aria-describedby` and `aria-invalid`.
- On submit, focus moves to the first error. What you typed is never cleared.
- An unsent draft auto-saves to localStorage and comes back on return. It's cleared on save.
- Saving goes to `/wall?pinned=id`.

## Data (`localStorage` key `kind-regards:v1`, one JSON object)
`{ postcards: Postcard[], today: { date, ideaId, comfort, swaps }, draft?, lastVisit }`

`Postcard = { id, createdAt, what, to?, reaction?, feeling?, ideaId? }`

- **Store:** `src/lib/store.ts` uses `useSyncExternalStore`. The server snapshot is `null`, so pages show a short skeleton. It listens for `storage` events so open tabs stay in sync.
- **Storage unavailable:** a test write at startup. If it fails, a notice says "This browser isn't saving. Your postcards will disappear when you close it."
- **Today's idea:** chosen from the date. Each swap moves to the next idea of the chosen comfort level. Self-kindness ideas appear about once a week.
- **Week:** Monday–Sunday in local time. People are grouped by name, ignoring case and spaces.

## Ideas (`src/data/ideas.ts`, about 30 original lines across 5 groups, each tagged quiet or in person)
**Groups:** Compliments ("notice-then-say", including the hair and style seeds), Gratitude, Reaching out, Small acts, Kindness to yourself. I'll check the wording against the RAK lines in `research.md` so none are reused.

## Visual style: Cozy Pixel meets a Life is Strange-style journal
- **Ported from p2:** `~/projects/p2/src/components/ds/cozy-pixel/`
  - `tokens.ts` (parchment, paper, cocoa, bark, wood, pumpkin accent reserved for the main action, clover, berry, wheat);
  - `styles.ts` (`edge`, `bevelEdge`, `smallEdge`, `focusRing`, `type`);
  - fonts (Pixelify Sans and Lora through `next/font/google`);
  - the patterns of `Button`, `Fields`, `Chip`, `Panel`, and `TextLink`. The `force` state-preview props are left out.
- **Life is Strange-style journal touches** (inspired, not copied):
  - a pixel golden-hour sky band behind the header (peach to rose to dusk);
  - postcards held on with pixel tape strips and slightly tilted;
  - a postmark showing the date;
  - a handwriting font for the postcard text, Patrick Hand through `next/font`, so no new package;
  - small pixel doodles in the margins.
- **Avoid:** butterflies, an instant camera or Polaroid frames, rewind or time icons, and any of the game's names or logos.

## Shared components (`src/components/`)
- `ui/`: `Button`, `LinkButton`, `Field` (label, hint, error, counter), `TextInput`, `TextArea`, `ChipGroup`, `Panel`, `Notice`, and `Toast` (`role="status"`).
- **Layout:** `NavBar`, `PageHeader`, `SkyBand`.
- **Postcards:** `Postcard`, `IdeaCard`, `ComfortToggle`.

All pages use only these components.

## Accessibility
- **Keyboard and focus:** everything works by keyboard. There's a skip link, a visible cocoa focus ring, and focus is managed after saving and deleting.
- **Forms:** every field has a real `<label>`. The chips use `aria-pressed`.
- **Motion:** `prefers-reduced-motion` turns off the tilt and slide animations.
- **Contrast:** checked with a script over every text and background pair the app actually uses, including the sky band and tape. Results go in the README.

## Docs
- `flows.md`: a Mermaid diagram of the first visit, the main task with its error branches, and coming back.
- `README.md`: the main sentence, the embedded flows diagram, the decisions and research summary, the contrast results, and the **first-run check** feedback with the fixes made. It also has a placeholder section for the student's own reflection.
- `AGENTS.md`: kept up to date.

## Build order (small commit and push after each)
1. Tokens, fonts, global styles, and the shared components.
2. Store and ideas.
3. Today, then Write (with validation and the draft), then Wall (pin, edit, delete, undo), then People, then Look back.
4. `flows.md` and the README.
5. Accessibility and contrast pass.

## Verification
- Run `npm run build` and `npm run lint`.
- In the dev server, test with a browser (claude-in-chrome or Playwright run from the scratchpad, not added to `package.json`):
  1. First visit with storage cleared.
  2. Submit an empty form, a whitespace-only form, and one with 281 characters, and check each message and that the text is kept.
  3. Save, then reload, and check that it's still there.
  4. Edit, delete, and undo.
  5. Change the date (by editing `today` and `createdAt` in localStorage) to test Welcome back, the people nudge, the Sunday banner, and the look-back.
  6. Keyboard-only run-through.
- **Deploy:** the student creates the Vercel project and sends the URL.
- **First-run check:** a subagent on the live URL with the goal "Write postcards for three kind things you did this week." It goes through the first visit and the main task, then comes back later.
- **Checkpoint 4:** the student picks which feedback to fix. Then I fix, redeploy, and record it in the README.
- **Final check:** go through the brief's assessment list item by item.
