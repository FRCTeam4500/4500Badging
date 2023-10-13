"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Profile } from "@prisma/client";

export function ClientA({ profile }: { profile: Profile }) {
  const { onOpen } = useModal();

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <Button
          onClick={() => {
            onOpen("editProfile", { profile: profile });
          }}
        >
          Update User
        </Button>
        <ModeToggle />
        {/* <UserBadgeGrid modalType="editProfile" />  */}
        <Button
          onClick={() => {
            onOpen("addBadge", { profile: profile });
          }}
        >
          Add Badge
        </Button>
      </div>
    </>
  );
}
