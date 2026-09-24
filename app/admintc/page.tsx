import { overview } from "@/lib/admin-db";

/** The shape of things. Numbers only — nothing here can name a person. */
export default async function AdminOverviewPage() {
  const o = await overview();

  const groups: { heading: string; rows: [string, number][] }[] = [
    {
      heading: "People",
      rows: [
        ["Accounts", o.users],
        ["New in the last 7 days", o.newUsers7],
        ["New in the last 30 days", o.newUsers30],
        ["Memberships", o.memberships],
      ],
    },
    {
      heading: "Journeys",
      rows: [
        ["Journeys", o.journeys],
        ["With an entry in the last 7 days", o.activeJourneys7],
        ["Registries", o.registries],
        ["Diary entries in total", o.posts],
      ],
    },
    {
      heading: "This centre",
      rows: [["Admins added here", o.admins]],
    },
  ];

  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g.heading}>
          <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
            {g.heading}
          </h2>
          <dl className="mt-3 grid gap-px overflow-hidden rounded border border-white/10 bg-white/10 sm:grid-cols-2">
            {g.rows.map(([label, n]) => (
              <div key={label} className="bg-[#141416] px-4 py-3">
                <dt className="font-mono text-[0.58rem] uppercase tracking-widest text-white/40">
                  {label}
                </dt>
                <dd className="mt-1 font-mono text-2xl tabular-nums text-white">
                  {n.toLocaleString("en-GB")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
