"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ACTIVE_JOURNEY_COOKIE } from "@/lib/data";

/** Switch which journey a supporter is viewing (persists in a cookie). */
export async function switchJourney(journeyId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const member = await prisma.membership.findFirst({
    where: { journeyId, userId: session.user.id },
    select: { id: true },
  });
  if (!member) return;

  cookies().set(ACTIVE_JOURNEY_COOKIE, journeyId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/journey");
}
