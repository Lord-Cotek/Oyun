"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { createReportLink, revokeReportLink } from "@/app/health/report/actions";
import { isNativeShell } from "@/lib/shell";

export type LinkRow = { id: string; label: string | null; period: string; expires: string; views: number; lastView: string | null; live: boolean; photos: boolean };

/**
 * Getting the report out: print it (or save it as a PDF from the same
 * window), download the raw numbers, or — hers alone — make a view-only link
 * for the doctor, with a QR code that prints at the top of the report.
 *
 * Inside the installed app none of print, download or the share sheet
 * reaches the page (WKWebView and Android's WebView give it none of them),
 * and the phone's browser is not signed in. So there, for her, one button
 * makes a two-hour link and opens it in the phone's browser, where Print,
 * Save to Files and the CSVs all work. Her partner is told to use a browser.
 */
export function ReportActions({
  period,
  withPhotos,
  isMother,
  links,
}: {
  period: { from: string; to: string };
  withPhotos: boolean;
  isMother: boolean;
  links: LinkRow[];
}) {
  const router = useRouter();
  const [made, setMade] = useState<{ url: string; qr: string; expires: string } | null>(null);
  const [label, setLabel] = useState("");
  const [days, setDays] = useState(7);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const q = `from=${period.from}&to=${period.to}`;
  const [inShell, setInShell] = useState(false);
  // After mounting: the server cannot know which shell this is.
  useEffect(() => setInShell(isNativeShell()), []);

  function openInBrowser() {
    setError(null);
    start(async () => {
      const r = await createReportLink({ ...period, withPhotos, forPrinting: true });
      if (!r.ok) return setError(r.error);
      // Our own host is in the shell's allowNavigation, but a new window is
      // handed to the system browser — which is the point.
      window.open(`${window.location.origin}${r.path}`, "_blank", "noopener");
      router.refresh();
    });
  }

  function make() {
    setError(null);
    start(async () => {
      const r = await createReportLink({ ...period, withPhotos, label, days });
      if (!r.ok) return setError(r.error);
      const url = `${window.location.origin}${r.path}`;
      const qr = await QRCode.toDataURL(url, { margin: 1, width: 220, errorCorrectionLevel: "M" });
      setMade({ url, qr, expires: new Date(r.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" }) });
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {inShell && (
        <div className="rounded-2xl border border-border bg-surface p-4 print:hidden">
          {isMother ? (
            <>
              <button type="button" onClick={openInBrowser} disabled={pending} className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent disabled:opacity-60">
                {pending ? "Opening…" : "Save as PDF or print ↗"}
              </button>
              <p className="mt-2 prose-serif-xs text-muted">
                Opens this report in your phone&rsquo;s browser, where you can print it, save it to Files as a PDF, or download the numbers. It uses a private link of yours that stops working in two hours.
              </p>
            </>
          ) : (
            <p className="prose-serif-xs text-muted">To print or save this report as a PDF, open Oyun in your phone&rsquo;s browser and sign in there — the app itself cannot print.</p>
          )}
          {error && <p role="alert" className="mt-2 font-mono text-xs text-negative">{error}</p>}
        </div>
      )}
      <div className={`flex-wrap gap-2 print:hidden ${inShell ? "hidden" : "flex"}`}>
        <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep">
          Print, or save as PDF
        </button>
        <a href={`/api/health/csv?kind=readings&${q}`} className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
          Readings (CSV)
        </a>
        <a href={`/api/health/csv?kind=doses&${q}`} className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
          Doses (CSV)
        </a>
      </div>

      {isMother && (
        <section className="rounded-2xl border border-border bg-surface p-5 print:hidden">
          <p className="eyebrow mb-1 text-muted">Share with your doctor</p>
          <p className="prose-serif-xs text-muted">
            A view-only link to this report — this period only, nothing else in the app. No login needed, never listed by search engines, and it stops working when it expires or you close it. You can see each time it was opened.
          </p>
          {made ? (
            <div className="mt-3 rounded-xl border border-accent/40 bg-accent/[0.05] p-4">
              <p className="font-mono text-[0.66rem] text-accent">Copy it now — for your privacy it is shown only once. Works until {made.expires}.</p>
              <p className="mt-1 break-all font-mono text-xs text-ink">{made.url}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(made.url);
                      setCopied(true);
                    } catch {
                      setCopied(false);
                    }
                  }}
                  className="min-h-10 rounded-lg border border-border px-3 font-mono text-xs"
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button type="button" onClick={() => navigator.share({ title: "Health report", url: made.url }).catch(() => {})} className="min-h-10 rounded-lg border border-border px-3 font-mono text-xs">
                    Share…
                  </button>
                )}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={made.qr} alt="QR code for the report link" className="mt-3 h-36 w-36 rounded border border-border bg-white p-1" />
              <p className="mt-1 font-mono text-[0.62rem] text-muted">The QR code prints at the top of the report, so the doctor can open the live version.</p>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">For (optional)</span>
                <input id="rl-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Dr Okafor" className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink" />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">Works for</span>
                <select id="rl-days" value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink">
                  {[3, 7, 14, 30].map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={make} disabled={pending} className="min-h-11 rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent disabled:opacity-60">
                {pending ? "Making…" : "Make a link"}
              </button>
            </div>
          )}
          {error && <p role="alert" className="mt-2 font-mono text-xs text-negative">{error}</p>}
          {links.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted">Your links</p>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 font-mono text-[0.68rem]">
                    <span className={l.live ? "text-ink" : "text-muted line-through"}>
                      {l.label ? `${l.label} · ` : ""}
                      {l.period}
                      {l.photos ? " · with photos" : ""} · {l.live ? `until ${l.expires}` : "closed"} · opened {l.views}×{l.lastView ? ` (last ${l.lastView})` : ""}
                    </span>
                    {l.live && (
                      <button type="button" onClick={() => start(async () => { await revokeReportLink(l.id); router.refresh(); })} className="min-h-9 text-negative">
                        Close it
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {made && (
        <div className="hidden items-center gap-3 border border-black bg-white p-2 print:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={made.qr} alt="" className="h-20 w-20" />
          <p className="text-[11px] text-black">Scan to open this report online (view-only, until {made.expires}).</p>
        </div>
      )}
    </div>
  );
}
