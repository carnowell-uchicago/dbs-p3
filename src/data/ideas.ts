// Ideas for today. Written for Kind Regards in a "notice, then say" voice:
// look for something specific about a person, then tell them. Checked against
// the RAK wordings in research.md so none of them repeat.

export type Comfort = "quiet" | "in-person";
export type Group = "compliment" | "thanks" | "reach-out" | "small-act" | "for-you";

export type Idea = { id: string; group: Group; comfort: Comfort; text: string };

export const groupLabels: Record<Group, string> = {
  compliment: "Compliment",
  thanks: "Thanks",
  "reach-out": "Reach out",
  "small-act": "Small act",
  "for-you": "For you",
};

export const comfortLabels: Record<Comfort, string> = {
  quiet: "Quiet",
  "in-person": "In person",
};

export const ideas: Idea[] = [
  // Compliments
  { id: "c-hair", group: "compliment", comfort: "in-person", text: "Notice someone's hair today, like a new cut or a style that suits them, and tell them what works about it." },
  { id: "c-style", group: "compliment", comfort: "in-person", text: "Notice one thing about someone's style, like a jacket, a color, or how it all goes together, and tell them what caught your eye." },
  { id: "c-handled", group: "compliment", comfort: "in-person", text: "Next time you see someone who handled something hard this week, tell them what you saw them do." },
  { id: "c-laugh", group: "compliment", comfort: "in-person", text: "Tell someone what their sense of humor does for the people around them." },
  { id: "c-skill", group: "compliment", comfort: "quiet", text: "Think of something a friend is quietly good at. Text them about the moment you noticed it." },
  { id: "c-idea", group: "compliment", comfort: "quiet", text: "Remember an idea someone shared that you're still thinking about. Let them know it stuck with you." },
  { id: "c-taste", group: "compliment", comfort: "quiet", text: "Go back to a song, book, or show someone recommended. Tell them the part you liked." },

  // Thanks
  { id: "t-unsaid", group: "thanks", comfort: "quiet", text: "Pick something someone did for you a while ago that you never mentioned. Tell them what it changed for you." },
  { id: "t-teacher", group: "thanks", comfort: "quiet", text: "Write a few lines to a teacher, coach, or old boss about one thing they taught you that you still use." },
  { id: "t-family", group: "thanks", comfort: "quiet", text: "Tell a family member about one ordinary thing they do that you've started to appreciate." },
  { id: "t-by-name", group: "thanks", comfort: "in-person", text: "Learn the name of someone who helps you often, at a café, a front desk, or a bus, and thank them by name." },
  { id: "t-exact", group: "thanks", comfort: "in-person", text: "Next time someone helps you, thank them for the exact thing: \"Thanks for waiting for me,\" not just \"thanks.\"" },

  // Reach out
  { id: "r-reminded", group: "reach-out", comfort: "quiet", text: "Message someone you haven't talked to in months: \"Something reminded me of you today,\" and say what it was." },
  { id: "r-photo", group: "reach-out", comfort: "quiet", text: "Send someone an old photo of the two of you with one line about that day." },
  { id: "r-voice", group: "reach-out", comfort: "quiet", text: "Leave a short voice memo instead of a text for someone who'd smile hearing your voice." },
  { id: "r-follow-up", group: "reach-out", comfort: "quiet", text: "Follow up on something a friend mentioned last time, like an interview, a trip, or a hard week, and ask how it went." },
  { id: "r-really", group: "reach-out", comfort: "in-person", text: "Ask someone how they're really doing, then keep listening a little longer than feels natural." },
  { id: "r-new", group: "reach-out", comfort: "in-person", text: "Say hi to someone who seems new around you, and ask them one question about themselves." },

  // Small acts
  { id: "s-finish", group: "small-act", comfort: "in-person", text: "Let someone finish their story without steering it back to yours. Ask one follow-up question." },
  { id: "s-credit", group: "small-act", comfort: "in-person", text: "Give someone credit out loud for work you saw them do." },
  { id: "s-hand", group: "small-act", comfort: "in-person", text: "Offer a hand with something heavy, awkward, or boring, like carrying, moving, or proofreading." },
  { id: "s-review", group: "small-act", comfort: "quiet", text: "Write a review for a small place you love, and mention a person or a detail by name." },
  { id: "s-introduce", group: "small-act", comfort: "quiet", text: "Introduce two people who'd get along, and tell each one why you thought of them." },
  { id: "s-note", group: "small-act", comfort: "quiet", text: "Write a short note to someone you live or work with about something they did this week, and leave it where they'll see it." },

  // For you: leads on Sundays only, outside the Quiet / In person filter
  { id: "y-well", group: "for-you", comfort: "quiet", text: "Write down one thing you did well this week, the way you'd tell a friend about it." },
  { id: "y-replay", group: "for-you", comfort: "quiet", text: "Think of a mistake you keep replaying. Write yourself the note you'd write a friend who made it." },
  { id: "y-rest", group: "for-you", comfort: "quiet", text: "Do one thing today only because it's good for you, and don't explain it to anyone." },
];

export function getIdea(id: string | undefined): Idea | undefined {
  return id ? ideas.find((idea) => idea.id === id) : undefined;
}
