# First-Run Check

Step 8 of the brief. On 2026-10-18 a subagent used the **live site** (https://dbs-p3.vercel.app) as a brand-new user, with the goal "Write postcards for three kind things you did this week." It went through the first visit, the main task (including deliberate mistakes), the wall, People, and Look back, a keyboard-only pass, and a return visit 8 days later. It used a phone (390×844) and a laptop (1280×800), and looked at screenshots rather than only the DOM.

## What it said worked
- **Understood it fast:** clear within about 5 seconds, and something useful done in about 40 seconds. "No sign-up" reassured it.
- **Forms:** error messages "excellent": specific, next to the field, and they keep your text. Only one required field, and friendly hints.
- **Drafts** survive leaving and reloading ("a pleasant surprise").
- **Coming back** felt gentle, not guilt-trippy. "Thinking of Jordan?" with "Write to Jordan" pre-fills the name.
- **Keyboard:** the focus ring is always visible, the skip link works, and a postcard could be done keyboard-only.

## Usability feedback (as reported)

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

## What the student chose to fix
- **Fix:** #1 (Undo timing), #2 (optional "When?"), #3 (Look back opens last week if this week is empty), #4 (reword "Done for today"), #5 (focus on page change), #6 (retag ideas; keep "For you" on Sundays, labeled, outside the Quiet/In person filter), #7 (phone nav on one row), #8, #9, #14 (edit fixes), #10, #11 (screen reader text and toast placement), #15 (feelings as chips plus "Other…").
- **Not fixed (the student's choice):** #12, #13, #16 (Look back wording).

## What changed
_Filled in as the fixes land._
