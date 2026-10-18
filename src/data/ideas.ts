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
  { id: "c-explain", group: "compliment", comfort: "in-person", text: "When someone explains something well today, tell them it was clear, and which part made it click." },
  { id: "c-own", group: "compliment", comfort: "in-person", text: "Notice something someone has made their own, like a desk, a garden, or a bookshelf, and tell them what you like about it." },
  { id: "c-kid", group: "compliment", comfort: "in-person", text: "Tell a parent one specific, good thing you noticed about their kid." },
  { id: "c-patient", group: "compliment", comfort: "in-person", text: "Watch for someone being patient today, with a child, a customer, or a slow line, and tell them you noticed." },
  { id: "c-better", group: "compliment", comfort: "in-person", text: "Notice someone who's gotten better at something, like a sport, a language, or a part of their job, and tell them you can see the difference." },
  { id: "c-host", group: "compliment", comfort: "in-person", text: "When someone hosts or organizes something, find them before you leave and name one detail they got right." },
  { id: "c-made", group: "compliment", comfort: "quiet", text: "Find something a friend made or posted that you liked but scrolled past. Go back and tell them which part you liked." },
  { id: "c-work", group: "compliment", comfort: "quiet", text: "Think of a project someone shared recently, at work, school, or online. Message them about the one part that impressed you most." },
  { id: "c-role", group: "compliment", comfort: "quiet", text: "Notice something a friend does well as a parent, partner, or roommate, and send them a text that names it." },
  { id: "c-grown", group: "compliment", comfort: "quiet", text: "Think of someone who's changed for the better since you met them. Write and tell them what you've seen grow." },
  { id: "c-meal", group: "compliment", comfort: "quiet", text: "Remember a meal someone cooked for you, even years ago. Tell them what you still remember about it." },
  { id: "c-clear", group: "compliment", comfort: "quiet", text: "Reply to a message or email that was unusually clear or warm, and tell the sender what made it good to read." },
  { id: "c-calm", group: "compliment", comfort: "quiet", text: "Think of someone who stays steady when things go wrong. Send them a note about a time it helped you." },

  // Thanks
  { id: "t-unsaid", group: "thanks", comfort: "quiet", text: "Pick something someone did for you a while ago that you never mentioned. Tell them what it changed for you." },
  { id: "t-teacher", group: "thanks", comfort: "quiet", text: "Write a few lines to a teacher, coach, or old boss about one thing they taught you that you still use." },
  { id: "t-family", group: "thanks", comfort: "quiet", text: "Tell a family member about one ordinary thing they do that you've started to appreciate." },
  { id: "t-by-name", group: "thanks", comfort: "in-person", text: "Learn the name of someone who helps you often, at a café, a front desk, or a bus, and thank them by name." },
  { id: "t-exact", group: "thanks", comfort: "in-person", text: "Next time someone helps you, thank them for the exact thing: \"Thanks for waiting for me,\" not just \"thanks.\"" },
  { id: "t-meal", group: "thanks", comfort: "in-person", text: "Thank whoever made your food today, at home or behind a counter, and mention one thing you liked about it." },
  { id: "t-unseen", group: "thanks", comfort: "in-person", text: "Thank someone whose work usually goes unnoticed, like a custodian or the person restocking shelves, and say what it makes easier for you." },
  { id: "t-listened", group: "thanks", comfort: "in-person", text: "After someone listens to you vent, thank them for listening, not just for the advice." },
  { id: "t-favor", group: "thanks", comfort: "in-person", text: "Thank someone for a favor while you're still together, and tell them what it saved you, like time, stress, or a long walk." },
  { id: "t-asked", group: "thanks", comfort: "in-person", text: "When someone asks the question you were wondering about in a class or meeting, thank them for asking afterwards." },
  { id: "t-teaching", group: "thanks", comfort: "in-person", text: "Thank someone who's teaching you something right now, like a coach, a tutor, or a coworker showing you the ropes, and tell them what's clicked so far." },
  { id: "t-came", group: "thanks", comfort: "in-person", text: "Thank someone for showing up, to a game, a party, or a hard appointment, and tell them it mattered that they came." },
  { id: "t-honest", group: "thanks", comfort: "in-person", text: "Thank someone who gave you honest feedback or caught a mistake, and tell them what you changed because of it." },
  { id: "t-tip", group: "thanks", comfort: "quiet", text: "Think of a recommendation that ended up mattering to you, like a book, a doctor, or a shortcut. Tell the person who gave it how it turned out." },
  { id: "t-stuck", group: "thanks", comfort: "quiet", text: "Write to a friend who stuck with you through a rough patch, and name one thing they did that helped." },
  { id: "t-maker", group: "thanks", comfort: "quiet", text: "Send a short note to the maker of something you use all the time, like a podcast, a small shop, or a free app, about what it does for you." },
  { id: "t-neighbor", group: "thanks", comfort: "quiet", text: "Leave a note for a neighbor about something small they do, like keeping up a garden or taking in a parcel, and thank them for it." },
  { id: "t-manager", group: "thanks", comfort: "quiet", text: "Thank someone at work in writing, copy their manager, and say exactly what they did." },
  { id: "t-advice", group: "thanks", comfort: "quiet", text: "Think of advice someone gave you that turned out to be right. Tell them when it proved true." },
  { id: "t-start", group: "thanks", comfort: "quiet", text: "Think of someone who helped you get started, at a first job, a new school, or a new city. Tell them where you are now, and that they're part of it." },

  // Reach out
  { id: "r-reminded", group: "reach-out", comfort: "quiet", text: "Message someone you haven't talked to in months: \"Something reminded me of you today,\" and say what it was." },
  { id: "r-photo", group: "reach-out", comfort: "quiet", text: "Send someone an old photo of the two of you with one line about that day." },
  { id: "r-voice", group: "reach-out", comfort: "quiet", text: "Leave a short voice memo instead of a text for someone who'd smile hearing your voice." },
  { id: "r-follow-up", group: "reach-out", comfort: "quiet", text: "Follow up on something a friend mentioned last time, like an interview, a trip, or a hard week, and ask how it went." },
  { id: "r-really", group: "reach-out", comfort: "in-person", text: "Ask someone how they're really doing, then keep listening a little longer than feels natural." },
  { id: "r-new", group: "reach-out", comfort: "in-person", text: "Say hi to someone who seems new around you, and ask them one question about themselves." },
  { id: "r-neighbor", group: "reach-out", comfort: "in-person", text: "Introduce yourself to a neighbor you've only ever nodded at, and remember their name." },
  { id: "r-sit", group: "reach-out", comfort: "in-person", text: "If someone is eating or waiting alone and seems open to company, sit with them and ask how their day is going." },
  { id: "r-visit", group: "reach-out", comfort: "in-person", text: "Go see someone in person who you usually only text." },
  { id: "r-walk", group: "reach-out", comfort: "in-person", text: "Ask a coworker or classmate you don't know well to get coffee or take a short walk." },
  { id: "r-elder", group: "reach-out", comfort: "in-person", text: "Spend time with an older relative or neighbor, and ask them about their life, like their first job or how they met someone." },
  { id: "r-edge", group: "reach-out", comfort: "in-person", text: "If you see someone at the edge of a group, bring them into the conversation with a question." },
  { id: "r-quiet", group: "reach-out", comfort: "in-person", text: "Notice when someone seems quieter than usual, and ask if they're okay once it's just the two of you." },
  { id: "r-invite", group: "reach-out", comfort: "in-person", text: "Invite someone along to something you're already doing, like a walk, an errand, or a meal." },
  { id: "r-news", group: "reach-out", comfort: "quiet", text: "Look back for good news someone shared lately, like a new job, a move, or a finished project, and send them a message about it." },
  { id: "r-alone", group: "reach-out", comfort: "quiet", text: "Think of someone who might be spending a lot of time alone right now, and send them something small that made you think of them." },
  { id: "r-mail", group: "reach-out", comfort: "quiet", text: "Mail a real card or letter to someone far away, even if it's only a few lines." },
  { id: "r-date", group: "reach-out", comfort: "quiet", text: "Check in with someone on a hard day for them, like the anniversary of a loss, and tell them you're thinking of them." },
  { id: "r-group", group: "reach-out", comfort: "quiet", text: "Wake up a quiet group chat with a question everyone can answer, like the best thing they ate this week." },
  { id: "r-plan", group: "reach-out", comfort: "quiet", text: "Message a friend with a real plan, a day and a place, instead of \"we should hang out sometime.\"" },

  // Small acts
  { id: "s-finish", group: "small-act", comfort: "in-person", text: "Let someone finish their story without steering it back to yours. Ask one follow-up question." },
  { id: "s-credit", group: "small-act", comfort: "in-person", text: "Give someone credit out loud for work you saw them do." },
  { id: "s-hand", group: "small-act", comfort: "in-person", text: "Offer a hand with something heavy, awkward, or boring, like carrying, moving, or proofreading." },
  { id: "s-review", group: "small-act", comfort: "quiet", text: "Write a review for a small place you love, and mention a person or a detail by name." },
  { id: "s-introduce", group: "small-act", comfort: "quiet", text: "Introduce two people who'd get along, and tell each one why you thought of them." },
  { id: "s-note", group: "small-act", comfort: "quiet", text: "Write a short note to someone you live or work with about something they did this week, and leave it where they'll see it." },
  { id: "s-ahead", group: "small-act", comfort: "in-person", text: "Let someone go ahead of you in line when they're clearly in a hurry." },
  { id: "s-phone", group: "small-act", comfort: "in-person", text: "Put your phone away for a whole conversation, and give someone your full attention." },
  { id: "s-seat", group: "small-act", comfort: "in-person", text: "Save a seat or a spot for someone who's running late." },
  { id: "s-photo", group: "small-act", comfort: "in-person", text: "Offer to take a photo for a group trying to squeeze everyone into a selfie." },
  { id: "s-lost", group: "small-act", comfort: "in-person", text: "If someone looks lost, ask if they need directions, and walk them part of the way if you can." },
  { id: "s-extra", group: "small-act", comfort: "in-person", text: "Bring a little extra of something, like fruit, snacks, or coffee, to share with the people around you." },
  { id: "s-shortcut", group: "small-act", comfort: "in-person", text: "Show someone a small shortcut you know, at work or at home, without making it feel like a lesson." },
  { id: "s-recommend", group: "small-act", comfort: "quiet", text: "Put someone forward for something, like a job, a project, or a club, and let them know you did." },
  { id: "s-share", group: "small-act", comfort: "quiet", text: "Share a friend's work, like their art, shop, or writing, with a line about why you like it." },
  { id: "s-luck", group: "small-act", comfort: "quiet", text: "Note a date someone mentioned, like a test, a move, or an interview, and message them good luck that morning." },
  { id: "s-pass", group: "small-act", comfort: "quiet", text: "When someone says something kind about a friend who isn't there, pass it along to that friend in a message." },
  { id: "s-answer", group: "small-act", comfort: "quiet", text: "Answer a question someone asked online that you happen to know well, fully and kindly." },
  { id: "s-chore", group: "small-act", comfort: "quiet", text: "Do a shared chore before anyone asks, like the dishes, the trash, or refilling the printer, and don't mention it." },
  { id: "s-playlist", group: "small-act", comfort: "quiet", text: "Make a short playlist for someone, with one line on why each song made the cut." },

  // For you: leads on Sundays only, outside the Quiet / In person filter
  { id: "y-well", group: "for-you", comfort: "quiet", text: "Write down one thing you did well this week, the way you'd tell a friend about it." },
  { id: "y-replay", group: "for-you", comfort: "quiet", text: "Think of a mistake you keep replaying. Write yourself the note you'd write a friend who made it." },
  { id: "y-rest", group: "for-you", comfort: "quiet", text: "Do one thing today only because it's good for you, and don't explain it to anyone." },
];

export function getIdea(id: string | undefined): Idea | undefined {
  return id ? ideas.find((idea) => idea.id === id) : undefined;
}
