import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { clinicianOf } from "@/lib/clinician";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_DEFAULT = "https://oyun.cotek.app";

/**
 * The clinician's own QR code — to print for a consulting-room wall or a
 * leaflet. It opens /doctor/c/<code>, which tells a patient who this is and
 * how to share with them; scanning it shares nothing by itself. Only the
 * clinician can make it, and only for their own code.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Sign in first.", { status: 401 });
  const c = await clinicianOf(session.user.id);
  if (!c) return new Response("No clinician account.", { status: 404 });
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_DEFAULT;
  const url = `${site}/doctor/c/${c.code}`;
  const download = new URL(request.url).searchParams.get("download") === "1";
  const png = await QRCode.toBuffer(url, { type: "png", width: 1024, margin: 2, errorCorrectionLevel: "M", color: { dark: "#1b1714", light: "#ffffff" } });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, no-store",
      ...(download ? { "Content-Disposition": `attachment; filename="oyun-clinic-${c.code}.png"` } : {}),
    },
  });
}
