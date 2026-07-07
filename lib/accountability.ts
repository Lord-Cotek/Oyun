/**
 * Guidance for an accountability partner — distinct from a husband. An
 * accountability partner is a spiritual friend or mentor (often from the local
 * church), not a spouse or co-parent. Their calling is to pray, check in,
 * encourage, and point the family to Christ and His church — never to overstep
 * into the intimacy of the marriage or home. Rotates by the calendar day.
 */
export const ACCOUNTABILITY_PRACTICES: string[] = [
  "Ask a real question and then just listen — “How are you, truly?” Don't rush to fix it.",
  "Pray for their marriage, not only the pregnancy. Ask God to knit the two of them closer.",
  "Check in on the husband too. Fathers carry unseen weight and are rarely asked.",
  "Point them to their local church. You are a help, never a substitute for the Body of Christ.",
  "Send a verse you actually prayed over them today — and tell them you did.",
  "Don't disappear if the road turns hard. That is precisely when your presence matters most.",
  "Guard your words. Speak life and truth; resist gossip about their season, even framed as concern.",
  "Follow up on what they told you last time. Being remembered is a quiet gift.",
  "Keep pointing past yourself to Christ. Encourage them toward the Lord, not toward you.",
  "Rejoice with them at good news as genuinely as you would grieve with them at hard news.",
  "Offer one concrete thing, not a vague “let me know.” Name what you will actually do.",
  "Pray for yourself, too — that you would be faithful, humble, and steady in walking with them.",
];

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
}

export function dailyAccountabilityPractice(date: Date = new Date()): string {
  return ACCOUNTABILITY_PRACTICES[dayNumber(date) % ACCOUNTABILITY_PRACTICES.length];
}
