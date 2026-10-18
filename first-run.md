# First-Run Check

Step 8 of the brief. On 2026-10-18 a subagent used the **live site** (https://dbs-p3.vercel.app) as a brand-new user, with the goal "Write postcards for three kind things you did this week." It went through the first visit, the main task (including deliberate mistakes), the wall, People, and Look back, a keyboard-only pass, and a return visit 8 days later. It used a phone (390×844) and a laptop (1280×800), and looked at screenshots rather than only the DOM.

## Round 1: the first build

### What it said worked
- **Understood it fast:** clear within about 5 seconds, and something useful done in about 40 seconds. "No sign-up" reassured it.
- **Forms:** error messages "excellent": specific, next to the field, and they keep your text. Only one required field, and friendly hints.
- **Drafts** survive leaving and reloading ("a pleasant surprise").
- **Coming back** felt gentle, not guilt-trippy. "Thinking of Jordan?" with "Write to Jordan" pre-fills the name.
- **Keyboard:** the focus ring is always visible, the skip link works, and a postcard could be done keyboard-only.

### Usability feedback (as reported)

**High**
1. **Undo toast:** vanishes about 10 s after Delete, even while focused. It deletes for good and drops focus (WCAG 2.2.1).
2. **No date:** no way to log something from earlier in the week, which affects Look back.
3. **Empty week on return:** "Look back at your week" on return opens an empty *this week*. The postcards are under Last week.

**Medium**
4. **"Done for today."** after one postcard implies a quota.
5. **Focus:** after navigating it lands on the body. It takes 9 Tabs to reach the form, and focus is lost after pinning.
6. **Idea tags:** some "In person" ideas aren't in person, and a self-care idea showed under "In person."
7. **Phone nav:** wraps to two rows ("Look back" alone), which looks broken.
8. **Edit:** offers today's idea on postcards that never used one.

**Low**
9. **"Just pinned"** shows after an edit.
10. **The toast** covers card content.
11. **Screen-reader text** runs together ("last Oct 108 days ago", "159 over characters"). Edit/Delete labels for unnamed postcards are vague.
12. **Counts:** Look back says "3 people" where People says 2 (a stranger was counted).
13. **Feelings:** the list with commas is ambiguous ("Nervous, then glad").
14. **"Who was it for?"** looks like a select box when editing (datalist arrow).
15. **Feelings again:** the text box and the quick-pick chips repeat each other.
16. **"Your week, on a Sunday"** reads oddly.

### What the student chose to fix
- **Fix:** #1 (Undo timing), #2 (optional "When?"), #3 (Look back opens last week if this week is empty), #4 (reword "Done for today"), #5 (focus on page change), #6 (retag ideas; keep "For you" on Sundays, labeled, outside the Quiet/In person filter), #7 (phone nav on one row), #8, #9, #14 (edit fixes), #10, #11 (screen reader text and toast placement), #15 (feelings as chips plus "Other…").
- **Not fixed (the student's choice):** #12, #13, #16 (Look back wording).

### What changed
| # | Feedback | Change |
|---|---|---|
| 1 | Undo toast vanished while focused | The toast pauses while hovered or focused, Undo stays 30 s, and Escape closes it. If it closes while focused, focus goes to the heading. |
| 2 | No way to log past days | Optional **When was it?** (Today / Yesterday / Earlier, with a date). Future or missing dates get an error next to the field. The wall sorts by the day it happened. |
| 3 | Look back opened an empty week on return | On Sunday the link says "Look back at last week (N kindnesses)" when this week is empty, and Look back opens on last week. |
| 4 | "Done for today." felt like a quota | Now "One postcard today. Nice." plus "There's no limit." Write a postcard stays the main button. |
| 5 | Focus lost after page changes | Focus moves to the new page's heading after every navigation. After pinning, the new postcard gets focus. |
| 6 | Mis-tagged ideas | "For you" ideas lead only on Sundays, labeled, with neither Quiet nor In person selected; picking one switches to ideas for someone else. An In person idea that worked remotely was reworded. |
| 7 | Phone nav wrapped | All five pills fit on one row at 390 px. |
| 8 | Edit offered today's idea on old postcards | The checkbox only shows on an edit if that postcard had an idea. |
| 9 | "Just pinned" after an edit | Now says "Updated". |
| 10 | Toast covered postcards | The toast sits bottom right on wide screens, and the page has extra bottom space. |
| 11 | Screen-reader text ran together | Separators added, the counter reads "N characters over", and Edit/Delete on unnamed postcards name the first words and date. Fixed heading ids for names with spaces. |
| 14 | Name field looked like a select | Arrow hidden; the hint says "Type a name, or pick someone you've written to." |
| 15 | Feeling text box repeated the chips | One chip group with **Other…**, which opens a text field. |

Two bugs were found while making these fixes, and fixed: "Show me another" didn't change the first-visit idea, and focus after navigation could get stuck on the hidden previous page.

**Verified:** a 61-check end-to-end browser run (laptop and phone) passes, including every fix above. Contrast is still 24 of 24.

**Since then:** the first visit became the Write tutorial, so the first-visit idea (and "Show me another") is gone; see Round 2 below and the README.

## Round 2: after the corkboard and the new first visit

Later on 2026-10-18, after the wall became a corkboard and the first visit became "write right here", a fresh subagent ran the check again on the live site: same goal ("Write postcards for three kind things you did this week, then come back later"), phone (390×844) and laptop (1280×900), starting from empty storage and without reading the code. It covered the first visit, the form with deliberate mistakes, the corkboard (open, close, delete and Undo, edit, Show me a memory), People and Look back (including edits there), a keyboard-only pass, and a return 8 days later.

**Timings:** about 5–10 s to see what to do; first postcard saved in about 20–30 s (tap a starter, type one sentence, tap Pin).

### What it said worked
- **The first visit gets you doing something right away:** one question, one box, four starters, and Pin, with about 25 words to read. "Oh, I just type the nice thing. Got it."
- **Form errors** sit under their field, focus jumps to the first one, and nothing typed is lost. "It tells me exactly what to fix."
- **Pinning feels rewarding:** "Just pinned", focus on the new card, "Updated" after edits, and one-tap Undo. "Cute, and I'm not scared to delete."
- **Coming back:** "Welcome back", the Sunday look-back link, and "Thinking of Raj?". "That actually makes me want to text Raj."
- **Look back reads like a short letter**, and a quiet week says "That's okay."
- **Accessibility basics:** skip link, labelled nav, real labels, a named postcard dialog that Escape closes with focus returned, no sideways scrolling at 390.

### Usability feedback (as reported)
**High:** none.

**Medium**
1. **Wall, phone:** previews cut to 3–5 words, and with 1–2 cards the tall board is mostly empty cork (one card sat about 1,100 px down).
2. **Show me a memory, phone:** the memory label and Close pile up over the page's "Your wall" heading.
3. **Today, return visit, phone:** the daily idea is about 1,400 px down, though the welcome box says "Here's a new idea for today."
4. **Postcard dialog, keyboard:** after Close, Edit, and Delete, the next Tab left the dialog before cycling back.

**Low**
5. Screen-reader names run "optional" into the label ("Who was it for?optional").
6. A name in the sentence but not in Who shows "To someone" and isn't in People; on the first visit Who was behind "Add who, when, or how it felt".
7. The "My own" stamp is never explained.
8. On the first visit, nothing says what the tool is for until after the first pin.
9. On phones, the main box's focus outline overlaps the hint above it.
10. On the corkboard, a focused card's thin outline is the least obvious focus state.
11. Only the main box shows a character count; Reaction (140) and "In your own words" don't.
12. Names on People and Look back are blue handwriting, so they look like links.
13. A stray space on People: "last Oct 10 , 8 days ago".
14. After pinning, the wall's heading and total are scrolled out of view.
15. On a phone, with 4 cards, one covered part of another.

### What the student chose to fix
- **Fix:** #1, #2, #3, #5, #6, #7 (a short explanation when you hover over a stamp), #9, #10, #11, #12, #13, #15.
- **Not fixed (the student's choice):** #4 (that's the browser's normal behavior for a modal dialog: Tab passes through the browser's own controls), #8, #14.

### What changed
| # | Feedback | Change |
|---|---|---|
| 1 | Phone board mostly empty, previews cut short | On phones the board grows with the number of cards instead of filling the screen, and mini cards are a little bigger with three lines of text. |
| 2 | Memory label piled over the heading | The memory label and Close sit on their own solid sky strip. |
| 3 | Daily idea far down on return | Until you've written one today, the idea comes right after the buttons. |
| 5 | "optional" ran into labels | A real space before "optional" on every field and chip group. |
| 6 | Names typed into the sentence only | The first visit has an optional **Who was it for?** box, so People picks the name up. The link is now "Add when or how it felt". |
| 7 | "My own" never explained | Hovering over a stamp explains it ("My own: a kindness you came up with yourself, not from the daily idea." or "Compliment: this came from one of the daily ideas."). On a full postcard the stamp can also be focused or tapped, and Escape hides the note. |
| 9 | Focus outline over the hint | Text fields use a tighter outline that clears the hint. |
| 10 | Faint card focus on cork | A focused card gets a thicker outline and lifts. |
| 11 | No count on Reaction or "In your own words" | Both show a character count. |
| 12 | Names looked like links | Names on People and Look back are cocoa handwriting. |
| 13 | Stray space before the comma | The "N days ago" badge now follows a " · " separator, read naturally by screen readers. |
| 15 | Cards overlapped on a small board | New cards take free slots on a loose, randomly nudged grid, favoring the emptiest; they only overlap once the board is full. |

**Verified:** the first-visit, form, wall, Look back, and keyboard checks pass in a browser at 390 and 1280 wide; every page at 360 and 390 has no sideways scrolling; 12 of 12 four-card phone boards had no overlaps. Contrast is 25 of 25 (the blue-on-sky pair is no longer used).

**Since then:** at the student's request, the first visit moved from Today to a step-by-step Write tutorial (one box at a time, with an example offered and a practice postcard that isn't saved), and the daily idea can no longer be swapped. Fix #6 now lives in the tutorial's Who step.
