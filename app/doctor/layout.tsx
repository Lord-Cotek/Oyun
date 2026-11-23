import type { Metadata } from "next";
import { ClinicianHeader } from "@/components/doctor/ClinicianHeader";

export const metadata: Metadata = {
  title: { default: "For clinicians", template: "%s · Oyun for clinicians" },
  robots: { index: false, follow: false },
};

/**
 * The clinician's room has its own frame — not the family's header and tab
 * bar: a doctor is not in anybody's circle, and the rooms in that menu are
 * not theirs to be offered. See components/doctor/ClinicianHeader.tsx.
 */
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClinicianHeader />
      {children}
    </>
  );
}
