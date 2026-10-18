# Kind Regards: User Flows

**Main task:** I do something kind → I write it on a postcard → it's pinned to my wall → I come back tomorrow for a new idea, and on Sunday I look back at everyone I appreciated.

Each box with a route in brackets is a page. Every page shares the same nav: Today · Write · Wall · People · Look back.

### 1 · First visit: useful right away

```mermaid
flowchart LR
    A["Today [/]<br/>Who did you notice today?<br/>(nothing saved yet)"] --> I["Idea for today<br/>a compliment to try"]
    I -->|"Quiet / In person,<br/>Show me another"| I
    A --> X["Example postcard<br/>(labeled Example, not an empty wall)"]
    A -->|"Write a postcard"| W["Write [/write]"]
    I -->|"did it"| W
```

### 2 · Main task: write it down and pin it

```mermaid
flowchart TD
    W["Write [/write]<br/>What did you do or notice? (required)<br/>Who? · When? · How did they react? · How did you feel? (optional)<br/>☐ This was today's idea"]
    W -->|"Pin it to my wall"| V{"Valid?"}
    V -->|"empty or only spaces"| E1["Under the field:<br/>'Write what you did or noticed.<br/>A few words is enough…'"]
    V -->|"too long / future date"| E2["Under the field:<br/>'Keep it postcard-sized: N characters over'<br/>'Shorten the name to 40 characters…'<br/>'Pick today or an earlier date…'"]
    E1 & E2 -->|"text kept, focus on the first error"| W
    W -.->|"leave mid-way"| D[("Draft saved on this device")]
    D -.->|"'We kept what you were writing.'"| W
    V -->|"yes"| P["Wall [/wall]<br/>the new postcard lands in an empty spot on the corkboard,<br/>highlighted: 'Pinned to your wall.'"]
    P -->|"open a postcard"| O["The postcard, full size"]
    O -->|"Edit"| W
    O -->|"Delete"| U["'Postcard taken down.' + Undo"]
    U -->|"Undo, back in the same spot"| P
```

### 3 · Coming back: it remembers

```mermaid
flowchart TD
    R["Today [/]<br/>Welcome back: last here Tuesday,<br/>N postcards, M this week,<br/>and a new idea for today"]
    R -->|"wrote one today"| DONE["One postcard today. Nice.<br/>today's postcard + another idea, no limit"]
    R -->|"someone not written to in 7+ days"| N["'Thinking of Sam?'"]
    N -->|"Write to Sam"| W["Write [/write?to=Sam]"]
    R -->|"on Sunday"| L["Look back [/look-back]<br/>this week (or last week, if this one is empty):<br/>who you noticed, how it landed, how you felt"]
    L -->|"quiet week, no guilt"| W
    PE["People [/people]<br/>everyone you've written to, and when"] -->|"Write again"| W
    PE -->|"See postcards"| PF["Wall [/wall?to=Sam]"]
    R -->|"Show me a memory"| M["Wall [/wall]<br/>a random postcard from before today, full size"]
    M -->|"Show me another"| M
```

## States each page handles

| Page | States |
|---|---|
| Today | Loading (a brief skeleton while localStorage is read) · first visit · returning · wrote one today · Sunday ("For you" idea; links to last week if this week is empty) · person to revisit |
| Write | New · prefilled name (`?to=`) · edit (`?edit=`) · edit of a deleted postcard · draft restored · errors · Earlier date · Other feeling |
| Wall | Empty (an example postcard on the board, labeled) · board · full board (cards overlap, newest on top) · postcard opened · a memory · just pinned · updated · deleted with Undo · filtered by person |
| People | No names yet (only strangers, or none) · list, with "7+ days" marked |
| Look back | This week · last week · a quiet week (no guilt) · edited (back on that postcard's week) · deleted with Undo |
| Every page | The browser won't save (private mode): a notice that postcards won't be kept |
