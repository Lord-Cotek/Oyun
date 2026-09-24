import { listAdmins } from "@/lib/admin-db";
import { requireAdmin, superAdminEmails } from "@/lib/admin";
import { AdminList } from "@/components/admin/AdminList";

const when = (d: Date) => d.toLocaleDateString("en-GB", { dateStyle: "medium" });

/** Who may open this centre. Super admins come from the environment. */
export default async function AdminAdminsPage() {
  const me = await requireAdmin();
  const rows = await listAdmins();
  const supers = superAdminEmails();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
          Super admins
        </h2>
        <p className="mt-2 font-mono text-[0.62rem] leading-relaxed text-white/40">
          From OYUN_SUPER_ADMINS in the environment. They cannot be added or
          removed here — the list that lets you in should not be editable by
          somebody who is already in, and a centre that can lock out the owner
          of the deployment is one mistake from nobody getting back.
        </p>
        <ul className="mt-3 rounded border border-white/10">
          {supers.length === 0 ? (
            <li className="px-4 py-3 font-mono text-xs text-amber-300">
              None set. Nobody can reach this centre except through an
              AdminUser row.
            </li>
          ) : (
            supers.map((e) => (
              <li key={e} className="border-b border-white/10 px-4 py-3 last:border-0">
                <span className="font-mono text-xs text-white">{e}</span>
                {e === me.email && (
                  <span className="ml-2 font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
                    you
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      </section>

      <AdminList
        canManage={me.isSuper}
        rows={rows.map((r) => ({
          id: r.id,
          email: r.email,
          label: r.label,
          addedBy: r.addedBy,
          when: when(r.createdAt),
        }))}
      />
    </div>
  );
}
