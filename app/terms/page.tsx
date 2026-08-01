import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using Oyun.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms &amp; Conditions" updated="1 August 2026">
      <p className="font-mono text-sm leading-relaxed text-muted">
        These terms govern your use of Oyun (the &ldquo;app&rdquo;), owned and
        operated by <span className="text-ink">cotek app FZ-LLC</span>{" "}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or using the
        app, you agree to them.
      </p>

      <LegalSection heading="Who can use Oyun">
        <p>
          You must be at least 18 years old and able to enter a binding
          agreement. You are responsible for your account and for keeping your
          password confidential.
        </p>
      </LegalSection>

      <LegalSection heading="Not medical, legal, or professional advice">
        <p>
          Oyun and the Agbebi guide offer spiritual companionship, Scripture, and
          encouragement — they are <span className="text-ink">not</span> medical,
          clinical, legal, or professional advice, and are not a substitute for
          your doctor or midwife. Always seek qualified care for health
          decisions, and call your local emergency services in an emergency.
        </p>
        <p>
          Agbebi is an AI companion. Its replies may be imperfect or inaccurate;
          use discernment, and weigh everything against Scripture and wise
          counsel.
        </p>
      </LegalSection>

      <LegalSection heading="Your content">
        <p>
          What you create in Oyun is yours. You grant us a limited licence to
          store, display, and process it only as needed to operate the app and
          to share it with the circle you invite. You are responsible for the
          content you add and for having the right to share it.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Please use Oyun lawfully and kindly. Don&rsquo;t misuse the service,
          attempt to disrupt it, access others&rsquo; accounts, or upload
          unlawful or harmful content. We may suspend or end access that breaks
          these terms.
        </p>
      </LegalSection>

      <LegalSection heading="Availability">
        <p>
          We work to keep Oyun available and dependable, but we provide it
          &ldquo;as is&rdquo; and cannot guarantee it will always be
          uninterrupted or error-free. Features may change over time.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, cotek app FZ-LLC is not liable
          for any indirect, incidental, or consequential loss arising from your
          use of the app. Nothing in these terms excludes liability that cannot
          be excluded by law.
        </p>
      </LegalSection>

      <LegalSection heading="Termination">
        <p>
          You may stop using Oyun and request deletion of your account at any
          time by emailing{" "}
          <a href="mailto:support@cotek.live" className="text-accent underline underline-offset-4">
            support@cotek.live
          </a>
          . We may suspend or terminate accounts that violate these terms.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These terms are governed by the laws of the United Arab Emirates,
          without regard to conflict-of-law rules.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update these terms; we&rsquo;ll revise the date above and note
          significant changes in the app. Continued use means you accept the
          updated terms.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          cotek app FZ-LLC ·{" "}
          <a href="mailto:support@cotek.live" className="text-accent underline underline-offset-4">
            support@cotek.live
          </a>
        </p>
      </LegalSection>
    </LegalShell>
  );
}
