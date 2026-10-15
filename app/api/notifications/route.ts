import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { freshHref } from "@/lib/notify-href";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [], unread: 0 });
  }

  const [items, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.notification.count({
      where: { userId: session.user.id, readAt: null },
    }),
  ]);

  return NextResponse.json({
    unread,
    items: items.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      // Rewritten on the way out, not in the table — see freshHref. A
      // notification written before posts had pages of their own still
      // says so, and those are the ones already sitting in the bell.
      href: freshHref(n.href),
      read: !!n.readAt,
      createdAt: n.createdAt.toISOString(),
    })),
  });
}
