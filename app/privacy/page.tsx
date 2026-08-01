import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Oyun handles your information.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="1 August 2026">
      <p className="font-mono text-sm leading-relaxed text-muted">
        Oyun (&ldquo;Oyun&rdquo;, the &ldquo;app&rdquo;) is owned and operated by{" "}
        <span className="text-ink">cotek app FZ-LLC</span> (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;our&rdquo;). This policy explains what we
        collect, why, and the choices you have. Questions? Email{" "}
        <a href="mailto:support@cotek.live" className="text-accent underline underline-offset-4">
          support@cotek.live
        </a>
        .
      </p>

      <LegalSection heading="Information we collect">
        <p>
          <span className="text-ink">Account details</span> — your name, email
          address, and a securely hashed password.
        </p>
        <p>
          <span className="text-ink">What you create</span> — the content you
          add in the app: check-ins and moods, letters, milestones and photos,
          prayer requests and encouragements, your due date, and details you
          choose to enter about your pregnancy and children.
        </p>
        <p>
          <span className="text-ink">Your circle</span> — the people you invite
          (partner, accountability partner) and the roles you give them.
        </p>
        <p>
          <span className="text-ink">Technical data</span> — device push tokens
          (if you enable notifications) and basic logs needed to run the service
          securely.
        </p>
        <p>
          Because Oyun accompanies pregnancy and a child&rsquo;s earliest years,
          some of what you enter may be sensitive. You decide what to share, and
          we treat it with care.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          To provide and maintain the app: to save your journey, sync it with
          the circle you invite, send the notifications and weekly digest you
          opt into, and keep your account secure. We do not sell your personal
          information, and we do not use it for advertising.
        </p>
      </LegalSection>

      <LegalSection heading="Sharing within your circle">
        <p>
          Oyun is built to be shared. Content is visible to the people you
          invite, according to their role. Private notes are kept private to
          you; your mood check-ins may be shared with the one supporting you, as
          the app describes. You control who is in your circle and can remove
          them at any time.
        </p>
      </LegalSection>

      <LegalSection heading="Service providers">
        <p>
          We use trusted providers to run the app, who process data on our
          behalf: hosting (Vercel), database (Neon), transactional email
          (Resend), and push notifications (web push and, in the installed apps,
          Google Firebase Cloud Messaging). When you talk with the Agbebi guide,
          your messages are sent to Anthropic to generate a reply — please
          don&rsquo;t include information you wouldn&rsquo;t want processed for
          that purpose.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          Oyun accounts are for adults (18+). Any information about a child is
          entered by a parent or guardian who is responsible for it. We do not
          knowingly allow children to create their own accounts.
        </p>
      </LegalSection>

      <LegalSection heading="Retention and deletion">
        <p>
          We keep your information for as long as your account is active. You can
          ask us to delete your account and associated data at any time by
          emailing{" "}
          <a href="mailto:support@cotek.live" className="text-accent underline underline-offset-4">
            support@cotek.live
          </a>
          . Some records may be retained where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          Depending on where you live, you may have the right to access,
          correct, export, or delete your personal data, and to object to
          certain processing. To exercise these, contact us at{" "}
          <a href="mailto:support@cotek.live" className="text-accent underline underline-offset-4">
            support@cotek.live
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>
          We take reasonable technical and organisational measures to protect
          your information. No online service can be perfectly secure, but we
          work to keep your data safe and to limit access to it.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          We may update this policy from time to time. When we do, we&rsquo;ll
          revise the &ldquo;last updated&rdquo; date above, and significant
          changes will be communicated in the app.
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
