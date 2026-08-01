import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "How to reach the Oyun team.",
};

export default function ContactPage() {
  return (
    <LegalShell title="Contact &amp; Support" updated="1 August 2026">
      <p className="font-mono text-sm leading-relaxed text-muted">
        We&rsquo;d love to hear from you — a question, a problem, a word of
        thanks, or a request to delete your account.
      </p>

      <LegalSection heading="Email us">
        <p>
          <a
            href="mailto:support@cotek.live"
            className="text-accent underline underline-offset-4"
          >
            support@cotek.live
          </a>
        </p>
        <p>
          We read every message and aim to reply within a few business days.
        </p>
      </LegalSection>

      <LegalSection heading="Account deletion">
        <p>
          To delete your account and associated data, email us from your account
          address and we&rsquo;ll take care of it.
        </p>
      </LegalSection>

      <LegalSection heading="Who we are">
        <p>
          Oyun is owned and operated by{" "}
          <span className="text-ink">cotek app FZ-LLC</span>.
        </p>
      </LegalSection>

      <LegalSection heading="A note on urgent care">
        <p>
          Oyun is not for emergencies. If you have a medical concern, contact
          your doctor or midwife; in an emergency, call your local emergency
          services right away.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
