"use client";

import { ConfirmButton } from "@/components/ui/Confirm";
import { endLinkAsClinician } from "@/app/doctor/actions";

/** Take a patient off the list — confirmed, because it ends her sharing. */
export function EndLinkButton({ linkId, name }: { linkId: string; name: string }) {
  return (
    <ConfirmButton
      describe={`${name} from your list — you will no longer see her records`}
      word="Remove from my list"
      sure="Remove — sure?"
      press="none"
      onConfirm={async () => {
        await endLinkAsClinician(linkId);
        window.location.href = "/doctor";
      }}
      className="font-mono text-[0.7rem] text-muted underline-offset-2 hover:text-negative hover:underline"
    />
  );
}
