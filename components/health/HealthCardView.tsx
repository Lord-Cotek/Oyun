"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { saveHealthCard } from "@/app/health/actions";
import { BLOOD_GROUPS, GENOTYPES, hasAnyHealth, type HealthFields } from "@/lib/health-card";

export type HealthPersonView = {
  target: string;
  kind: "mother" | "partner" | "child";
  name: string;
  sub: string;
  fields: HealthFields;
  saved: boolean;
  canEdit: boolean;
  prefill: HealthFields | null;
  updatedLabel: string | null;
  /** The printable card's address. */
  printHref: string;
  /** Her medicines list, when the viewer may see the health log. */
  planLines?: string[];
};

const PLACEHOLDER: Record<HealthPersonView["kind"], Partial<Record<keyof HealthFields, string>>> = {
  mother: {
    allergies: "e.g. penicillin, latex — or “none known”",
    conditions: "e.g. asthma, high blood pressure, gestational diabetes",
    medicines: "e.g. folic acid and iron daily",
    careProvider: "Hospital or clinic, and the midwife or doctor",
    emergencyContact: "Name and phone number",
    notes: "Anything a nurse should know on arrival",
  },
  partner: {
    allergies: "e.g. penicillin — or “none known”",
    conditions: "e.g. asthma, sickle cell",
    medicines: "Anything taken regularly",
    careProvider: "Clinic or doctor",
    emergencyContact: "Name and phone number",
    notes: "Anything else worth knowing",
  },
  child: {
    allergies: "e.g. peanuts, egg — or “none known”",
    conditions: "e.g. eczema, jaundice at birth",
    medicines: "e.g. vitamin D drops, 1 a day",
    careProvider: "Clinic, paediatrician or health visitor",
    emergencyContact: "Who to call — name and number",
    notes: "Feeds, sleep, anything a minder should know",
  },
};

export function HealthCardView({ person }: { person: HealthPersonView }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const f = person.fields;
  const filled = hasAnyHealth(f) || (person.planLines?.length ?? 0) > 0;
  // An empty card of your own, with one from an earlier journey: start from that.
  const start_with = !person.saved && person.prefill && hasAnyHealth(person.prefill) ? person.prefill : f;
  const ph = PLACEHOLDER[person.kind];

  function submit(fd: FormData) {
    const raw: Record<string, unknown> = {};
    fd.forEach((v, k) => {
      raw[k] = typeof v === "string" ? v : "";
    });
    setError(null);
    start(async () => {
      const r = await saveHealthCard(person.target, raw);
      if (r.ok) {
        setEditing(false);
        router.refresh();
      } else setError(r.error);
    });
  }

  return (
    <section
      id={`card-${person.target}`}
      className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
      aria-label={`${person.name}’s health card`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={person.name} tone={person.kind === "child" ? "accent2" : "accent"} size={42} />
          <div className="min-w-0">
            <p className="truncate font-serif text-xl leading-tight text-ink">{person.name}</p>
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">{person.sub}</p>
          </div>
        </div>
        {!editing && person.canEdit && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-h-11 shrink-0 rounded-lg border border-accent/50 px-3.5 font-mono text-xs text-accent hover:bg-accent/[0.06]"
          >
            {filled ? "Edit" : "Add details"}
          </button>
        )}
      </div>

      {editing ? (
        <form action={submit} className="mt-5 space-y-3">
          {start_with !== f && (
            <p className="rounded-lg border border-accent/30 bg-accent/[0.05] px-3 py-2 prose-serif-xs text-ink">
              Filled in from your card on an earlier journey. Check it is still right, then save.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Blood group" htmlFor={`bg-${person.target}`}>
              <select id={`bg-${person.target}`} name="bloodGroup" defaultValue={start_with.bloodGroup ?? ""} className={inputCls}>
                <option value="">Not known</option>
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Genotype" htmlFor={`gt-${person.target}`}>
              <select id={`gt-${person.target}`} name="genotype" defaultValue={start_with.genotype ?? ""} className={inputCls}>
                <option value="">Not known</option>
                {GENOTYPES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Area id={`al-${person.target}`} name="allergies" label="Allergies" value={start_with.allergies} placeholder={ph.allergies} />
          <Area id={`co-${person.target}`} name="conditions" label="Conditions" value={start_with.conditions} placeholder={ph.conditions} />
          <Area id={`me-${person.target}`} name="medicines" label="Medicines and supplements" value={start_with.medicines} placeholder={ph.medicines} />
          <Line id={`cp-${person.target}`} name="careProvider" label={person.kind === "child" ? "Clinic or doctor" : "Hospital, midwife or doctor"} value={start_with.careProvider} placeholder={ph.careProvider} />
          <Line id={`ec-${person.target}`} name="emergencyContact" label="In an emergency, call" value={start_with.emergencyContact} placeholder={ph.emergencyContact} />
          <Area id={`no-${person.target}`} name="notes" label="Good to know" value={start_with.notes} placeholder={ph.notes} />
          {error && (
            <p role="alert" className="font-mono text-xs text-negative">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 rounded-lg bg-accent px-5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className="min-h-11 rounded-lg px-4 font-mono text-sm text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : filled ? (
        <div className="mt-4 space-y-3">
          {(f.bloodGroup || f.genotype) && (
            <div className="flex flex-wrap gap-2">
              {f.bloodGroup && <Chip label="Blood" value={f.bloodGroup} />}
              {f.genotype && <Chip label="Genotype" value={f.genotype} />}
            </div>
          )}
          {f.allergies && <Row label="Allergies" value={f.allergies} loud />}
          {f.conditions && <Row label="Conditions" value={f.conditions} />}
          {f.medicines && <Row label="Medicines" value={f.medicines} />}
          {person.planLines && person.planLines.length > 0 && <Row label="Medicines list" value={person.planLines.join("\n")} />}
          {f.careProvider && <Row label={person.kind === "child" ? "Clinic or doctor" : "Hospital, midwife or doctor"} value={f.careProvider} />}
          {f.emergencyContact && <Row label="In an emergency, call" value={f.emergencyContact} />}
          {f.notes && <Row label="Good to know" value={f.notes} />}
        </div>
      ) : (
        <p className="mt-4 prose-serif-xs text-muted">
          Nothing yet. Blood group, genotype, allergies and who to call are the ones that matter most in a hurry.
        </p>
      )}

      {!editing && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 font-mono text-[0.68rem] text-muted">
          {filled && (
            <Link href={person.printHref} className="text-accent underline-offset-4 hover:underline">
              {person.kind === "child" ? "Emergency card" : "Card to print"}
            </Link>
          )}
          {person.updatedLabel && <span>Updated {person.updatedLabel}</span>}
        </div>
      )}
    </section>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink placeholder:text-muted/80 focus:border-accent focus:outline-none";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function Area({ id, name, label, value, placeholder }: { id: string; name: string; label: string; value: string | null; placeholder?: string }) {
  return (
    <Field label={label} htmlFor={id}>
      <textarea id={id} name={name} rows={2} defaultValue={value ?? ""} placeholder={placeholder} className={`${inputCls} resize-y leading-relaxed`} />
    </Field>
  );
}

function Line({ id, name, label, value, placeholder }: { id: string; name: string; label: string; value: string | null; placeholder?: string }) {
  return (
    <Field label={label} htmlFor={id}>
      <input id={id} name={name} defaultValue={value ?? ""} placeholder={placeholder} className={inputCls} />
    </Field>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full border border-border bg-bg px-3 py-1 text-ink">
      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted">{label}</span>
      <span className="font-serif text-base">{value}</span>
    </span>
  );
}

function Row({ label, value, loud = false }: { label: string; value: string; loud?: boolean }) {
  return (
    <div className={loud ? "rounded-lg border border-negative/40 bg-negative/[0.05] px-3 py-2" : ""}>
      <p className={`font-mono text-[0.6rem] uppercase tracking-widest ${loud ? "text-negative" : "text-muted"}`}>{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap prose-serif-sm text-ink">{value}</p>
    </div>
  );
}
