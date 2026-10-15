import { allFlags } from "@/lib/flags";
import { FlagList } from "@/components/admin/FlagList";

const when = (d: Date) =>
  d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * Switches that can be thrown without waiting for a deploy.
 *
 * Deliberately a short list. A flag is a branch somebody has to come back and
 * delete, and the only thing that makes that happen is being able to see the
 * whole list at once and notice one has been on for a year.
 */
export default async function AdminFlagsPage() {
  const flags = await allFlags();
  return (
    <div>
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        What can be turned on and off
      </h2>
      <div className="mt-3">
        <FlagList
          rows={flags.map((f) => ({
            key: f.key,
            label: f.label,
            what: f.what,
            on: f.on,
            stored: f.stored,
            changedBy: f.changedBy,
            changed: f.changedAt ? when(f.changedAt) : null,
          }))}
        />
      </div>
    </div>
  );
}
