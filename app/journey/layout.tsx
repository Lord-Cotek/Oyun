import { Suspense, type ReactNode } from "react";
import { WelcomeNote } from "@/components/journey/WelcomeNote";

/** The journey's pages, plus the one-time hello onboarding points at. */
export default function JourneyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <WelcomeNote />
      </Suspense>
    </>
  );
}
