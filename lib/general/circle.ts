/**
 * Guidance for the circle walking with an expectant or new mother — a close
 * friend, a relative, whoever she has asked to be alongside her — for people
 * who chose "without religious content". Stands in for the DAILY and WEEKLY
 * practices in lib/accountability.ts.
 *
 * Each stage keeps exactly the same number of practices, in the same order,
 * as the original: the rotation is by index, so the two voices stay in step.
 * The practical substance is unchanged. Where the original asked for
 * devotional practice, these ask for the real-world equivalent — a message she
 * can read at 3am, remembering the scan date, holding her in mind, turning up.
 * Where it pointed the family to a congregation, these point to their wider
 * community: other friends, family, local parent groups. `why` sits where the
 * verse sat.
 */
import type { GeneralPractice } from "./types";
import type { WalkStage } from "@/lib/accountability";

// ── Day by day ─────────────────────────────────────────────────────────────
export const GENERAL_CIRCLE_DAILY: Record<WalkStage, GeneralPractice[]> = {
  first: [
    {
      text: "She may be exhausted and unwell while the world sees nothing at all. Ask how she truly is, and let the answer be enough.",
      why: "The early weeks are often the hardest and the least seen, so being asked — and believed — matters.",
    },
    {
      text: "This news may still be hers to tell. Don’t pass on what isn’t yours to share.",
      why: "Choosing when and whom to tell is one of the few things she can control right now.",
    },
    {
      text: "Fear of loss is common now, and rarely said out loud. Make it safe to say, without brushing the fear aside.",
      why: "A fear that can be spoken is lighter than one carried alone, and reassurance offered too quickly can close the conversation.",
    },
    {
      text: "Offer one concrete kindness — a meal, an errand — rather than a vague “let me know”.",
      why: "A specific offer is easy to accept; a general one leaves her to do the asking.",
    },
    {
      text: "Ask about her, not only about the baby. She is a person, not a vessel.",
      why: "Being seen as herself, not only as a pregnancy, helps her keep hold of who she is.",
    },
    {
      text: "So much is happening out of sight. Find out when her scan is, and send a message that morning to say you’re thinking of her.",
      why: "Remembering the date tells her she isn’t carrying the waiting on her own.",
    },
  ],
  second: [
    {
      text: "Celebrate out loud. Tell her plainly what you admire in her.",
      why: "Appreciation is easy to forget to give and hard to forget receiving.",
    },
    {
      text: "If she has a partner, think of them as a couple, not only as a pregnancy — and help them find time for each other.",
      why: "These months can draw two people closer, and a little time alone together helps that happen.",
    },
    {
      text: "Encourage her hope. She has been carrying this since long before there was anything to show.",
      why: "Hope held over long months is quiet work, and it helps to have it noticed.",
    },
    {
      text: "Build her up in front of others, not only to her face.",
      why: "Hearing that she was spoken well of when she wasn’t there is a quieter, deeper encouragement.",
    },
    {
      text: "Remember her partner, if she has one. They are carrying a weight nobody thinks to ask about.",
      why: "Partners often keep their worries to themselves, believing all the attention should stay with her.",
    },
    {
      text: "Remember that this child is a gift, never an achievement. Don’t compare her pregnancy with anyone else’s.",
      why: "Comparison turns something precious into a performance, and every pregnancy is its own.",
    },
  ],
  third: [
    {
      text: "She is tired in a way that sleep doesn’t fix. Carry one real thing for her this week.",
      why: "The last months are physically draining, and one task lifted can make a real difference.",
    },
    {
      text: "Fear of labour is real. Don’t argue her out of it — stay alongside her through it.",
      why: "Fear that is listened to tends to settle; fear that is argued with tends to dig in.",
    },
    {
      text: "Ask about the appointments, and remember what she tells you.",
      why: "Being remembered shows her that what she is going through matters to someone else too.",
    },
    {
      text: "Waiting is its own work. Help her find a little rest each day, rather than hoping to store it up for later.",
      why: "Small, regular breathing spaces sustain people better than a long rest that never quite arrives.",
    },
    {
      text: "Be a shelter for her — but not the only one. Encourage the other people around her who can be there too.",
      why: "No single person can hold everything, and a wider circle means she is never relying on just one.",
    },
  ],
  nearly: [
    {
      text: "Be reachable without being intrusive. “Thinking of you today” is enough.",
      why: "A short message tells her you’re there without asking anything of her.",
    },
    {
      text: "Let her know you’re holding her in mind for the birth, and for courage in the hours she cannot plan.",
      why: "Birth rarely goes exactly to plan, and knowing someone is on her side steadies her for the unexpected.",
    },
    {
      text: "Remind her where this is going. The hard hours give way to meeting her baby.",
      why: "Keeping the end in sight can make the last weeks feel less endless.",
    },
    {
      text: "Tell this family, out loud and by name, what you hope for them.",
      why: "Hearing someone’s hopes for them spoken aloud is something people remember for years.",
    },
    {
      text: "Have your practical help ready before it is needed, not after.",
      why: "In the first days after a birth nobody has the energy to organise help, so it needs to be ready already.",
    },
  ],
  newborn: [
    {
      text: "Visit briefly, bring food, wash something, and leave early.",
      why: "Visits that ask nothing of her are the ones that truly help.",
    },
    {
      text: "Don’t ask about the baby first. Ask how she is.",
      why: "After a birth, every eye moves to the baby, and she can feel as though she has disappeared.",
    },
    {
      text: "The nights are long. Send a word she can read at 3am, not only in daylight.",
      why: "A message waiting in the middle of the night reminds her she isn’t the only one awake.",
    },
    {
      text: "She is learning everything at once. Be gentle with her — in your words, your advice, and your expectations.",
      why: "These days are tender, and advice nobody asked for can land as criticism.",
    },
    {
      text: "If she is low, stay near and resist the urge to fix it. If it lasts, gently encourage her to talk to her midwife or doctor.",
      why: "Being stayed with matters more than being fixed, and low mood that lingers deserves proper support.",
    },
    {
      text: "When you are together, be fully there — phone away, time unhurried.",
      why: "Undivided attention is rare in these weeks, and worth more than any gift you could bring.",
    },
  ],
  infancy: [
    {
      text: "The meals stopped months ago; the tiredness didn’t. Keep showing up.",
      why: "Support tends to fade just as the long tiredness sets in.",
    },
    {
      text: "Celebrate the small things. They are not small to her.",
      why: "Shared delight in a first laugh or a better night makes it bigger.",
    },
    {
      text: "Help them stay connected to their wider community — other friends, family, a local parent group. You are one part of their support, never the whole of it.",
      why: "Every family needs more than one person to lean on, and other parents can offer what a friend alone cannot.",
    },
    {
      text: "Ask gently what she still does just for herself. Motherhood can crowd out the quiet.",
      why: "A little time and space of her own helps her remain herself as well as a mother.",
    },
    {
      text: "Follow up on what she told you last time. Being remembered is a quiet gift.",
      why: "It shows her that your care carries on between visits, not only during them.",
    },
  ],
};

// ── Week by week — a bigger rhythm than a single day ───────────────────────
export const GENERAL_CIRCLE_WEEKLY: Record<WalkStage, GeneralPractice[]> = {
  first: [
    {
      text: "This week, send a short message each day for the hidden months — for a child growing unseen, and a body doing quiet, costly work.",
      why: "Steady small contact tells her she is remembered while nothing yet shows.",
    },
    {
      text: "This week, guard her privacy. Let her tell her own news, in her own time.",
      why: "Her news is hers, and protecting it is a form of care.",
    },
    {
      text: "This week, take one thing off her plate without being asked.",
      why: "Help that arrives unasked spares her the effort of asking.",
    },
    {
      text: "This week, take her fears as seriously as her joys.",
      why: "She needs room to be worried as well as happy, without either being waved away.",
    },
  ],
  second: [
    {
      text: "This week, write down what you appreciate in her — then actually tell her.",
      why: "Encouragement put into words lasts far longer than the moment it is given.",
    },
    {
      text: "This week, if she has a partner, give them a chance to be a couple: an evening off, a meal, a walk together.",
      why: "Small moments together help these months draw them closer, not apart.",
    },
    {
      text: "This week, ask her partner how they are, and listen properly to the answer.",
      why: "Partners are rarely asked, and being asked can open up worries they have been keeping quiet.",
    },
    {
      text: "This week, remember that this child is a gift, not a project.",
      why: "Gratitude keeps the focus on the child rather than on getting everything right.",
    },
  ],
  third: [
    {
      text: "This week, decide the help you will give after the birth — and tell them what it is.",
      why: "Knowing exactly what is coming lets them plan, and spares them having to ask later.",
    },
    {
      text: "This week, tell her specifically what you are hoping for: a safe delivery and a steady heart.",
      why: "Hearing someone else’s hope for her can steady her own.",
    },
    {
      text: "This week, ask what she is dreading, and carry it with her.",
      why: "Fears that are named and shared tend to shrink; fears kept alone tend to grow.",
    },
    {
      text: "This week, help her find small ways to rest and get her strength back.",
      why: "In the final weeks, rest has to be taken in small pieces wherever it can be found.",
    },
  ],
  nearly: [
    {
      text: "This week, be ready: phone near, plans loose, thoughts with her.",
      why: "Being on hand without fuss means she can reach you the moment she needs to.",
    },
    {
      text: "This week, tell this household out loud what you wish for them.",
      why: "Good wishes spoken aloud become something they can hold on to in the days ahead.",
    },
    {
      text: "This week, hold her in mind for the hours she can neither plan nor control — and let her know you are.",
      why: "Knowing others are thinking of her makes the unknown feel less lonely.",
    },
    {
      text: "This week, remind her where the pain is going — to meeting her baby.",
      why: "Keeping the end in view helps her through the hardest stretch.",
    },
  ],
  newborn: [
    {
      text: "This week, bring a meal and ask nothing in return — not even a visit.",
      why: "Food with no strings attached is one of the most useful gifts of the first weeks.",
    },
    {
      text: "This week, ask what keeps her awake at night besides the baby, and see what you can take off her mind.",
      why: "Worries grow in the dark, and sharing one can make the nights less lonely.",
    },
    {
      text: "This week, ask how she is in herself, not how the baby is feeding.",
      why: "Questions about feeding can feel like a test; questions about her feel like care.",
    },
    {
      text: "This week, watch for signs she is sinking — stay close if she is, and encourage her to talk to her midwife or doctor.",
      why: "Low mood after a birth is common and support helps, and a friend is often the first to notice.",
    },
  ],
  infancy: [
    {
      text: "This week, keep the promise you made months ago. Steadiness outlasts enthusiasm.",
      why: "Long-term help matters most once everyone else has moved on.",
    },
    {
      text: "This week, encourage them towards their wider community — other friends, family, a local parent group — not only towards you.",
      why: "A wider circle means no single person has to carry everything, you included.",
    },
    {
      text: "This week, celebrate with them over something small and ordinary.",
      why: "Ordinary joys, shared, are part of what makes the long road bearable.",
    },
    {
      text: "This week, check in with yourself: are you being steady, humble, and unhurried?",
      why: "You help best when you are rested and not trying to be everything to them.",
    },
  ],
};
