"use client";

import { UserBadgeGrid } from "@/components/badges/badge-grid";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { initialProfile } from "@/lib/initial-profile";
import { Profile } from "@prisma/client";
import { useState } from "react";

export function ClientA({ profile }: { profile: Profile }) {
  const { onOpen } = useModal();

  return (
    <div className="h-screen flex items-center justify-center">
      <Button
        onClick={() => {
          onOpen("editProfileSelf", { profile: profile });
        }}
      >
        Update User
      </Button>
      <ModeToggle />
      <UserBadgeGrid modalType="editProfile" />
    </div>
  );
}
