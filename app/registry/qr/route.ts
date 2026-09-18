import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { canKeepRegistry, TITLE_MAX } from "@/lib/registry";
import { registryUrl } from "@/lib/registry-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The QR code as a file, to keep or to send.
 *
 * On the page it is an inline SVG, which is right for looking at and useless
 * for everything people actually do with a QR code: put it on a shower
 * invitation, print it for the church noticeboard, send it to whoever is
 * making the cards. Those need a file.
 *
 * PNG by default because it is what every printer, every phone gallery and
 * every chat app accepts without argument; `?format=svg` for whoever is
 * designing the invitation and wants it to stay sharp at A3.
 *
 * ── What it encodes, and what it does not ────────────────────────────────
 * The registry's own address and nothing else. No name, no baby, no text a
 * person typed — which also means nothing user-supplied reaches the encoder.
 *
 * ── Why it is behind a sign-in ───────────────────────────────────────────
 * The address inside it is a link anybody may hold, so the code is not a
 * secret. But this endpoint exists for the two who keep the journey, and an
 * open one would let anybody turn a guessed journey into a QR code generator.
 * It costs nothing to ask.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Sign in first.", { status: 401 });

  const active = await getActiveMembership(session.user.id);
  if (!active) return new Response("No journey.", { status: 404 });
  if (!canKeepRegistry(active.role)) {
    return new Response("Not yours.", { status: 403 });
  }

  const registry = await prisma.registry.findUnique({
    where: { journeyId: active.journey.id },
    select: { slug: true, title: true },
  });
  if (!registry) return new Response("No registry yet.", { status: 404 });

  const url = registryUrl(registry.slug);
  const svg = new URL(request.url).searchParams.get("format") === "svg";
  const name = `${fileName(registry.title)}-registry.${svg ? "svg" : "png"}`;

  const body = svg
    ? Buffer.from(
        await QRCode.toString(url, {
          type: "svg",
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#1b1714", light: "#ffffff" },
        }),
        "utf8",
      )
    : await QRCode.toBuffer(url, {
        type: "png",
        // Big enough to print at a sensible size without going soft, and a
        // margin, because a QR code with no quiet zone around it is one many
        // phone cameras will not read at all.
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#1b1714", light: "#ffffff" },
      });

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": svg ? "image/svg+xml" : "image/png",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Content-Length": String(body.length),
      // Her own registry, behind her own sign-in. Nothing in between should
      // keep a copy.
      "Cache-Control": "no-store, private",
    },
  });
}

/**
 * A filename from the registry's own title.
 *
 * Reduced to letters, numbers and hyphens: this string goes into a header,
 * and a title with a quotation mark or a newline in it would otherwise end
 * the header early — which is header injection, from a field she typed.
 */
function fileName(title: string): string {
  const slugged = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, Math.min(40, TITLE_MAX));
  return slugged || "oyun";
}
