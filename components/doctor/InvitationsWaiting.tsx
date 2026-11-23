import { clinicianOf } from "@/lib/clinician";
import { invitesWaitingFor } from "@/lib/clinician-invite";
import { prisma } from "@/lib/prisma";
import { InAppInvite } from "@/components/doctor/ClinicianForms";

/**
 * Invitations from patients, waiting for this person — lib/clinician-invite.ts,
 * rule 6. Shown on the patients page and on /doctor/invitations (where the
 * bell leads). Renders nothing when there are none, and there are none for
 * an account whose address is not confirmed.
 */
export async function InvitationsWaiting({ userId, heading = true }: { userId: string; heading?: boolean }) {
  const invites = await invitesWaitingFor(userId);
  if (!invites.length) return null;
  const [clinician, me] = await Promise.all([
    clinicianOf(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return (
    <section aria-labelledby="invites-h" className="space-y-3">
      {heading && (
        <h2 id="invites-h" className="font-serif text-2xl text-ink">
          {invites.length === 1 ? "An invitation is waiting" : `${invites.length} invitations are waiting`}
        </h2>
      )}
      {invites.map((i) => (
        <InAppInvite
          key={i.id}
          inviteId={i.id}
          patient={i.journey.owner.name?.trim() || "A patient"}
          note={i.note}
          sent={day(i.sentAt)}
          until={day(i.expiresAt)}
          sees={`her home readings, symptoms and notes, medicines and doses, tests${i.withAppointments ? ", appointments and scans" : ""}${i.withPhotos ? ", and the photographs attached to them" : ""}`}
          needsProfile={!clinician}
          name={me?.name ?? ""}
        />
      ))}
    </section>
  );
}
