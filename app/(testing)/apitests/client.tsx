"use client";

import { UserBadgeGrid } from "@/components/badges/badge-grid";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { initialProfile } from "@/lib/initial-profile";
import { Profile, Subteams } from "@prisma/client";
import { useState } from "react";

export function ClientA({ profile }: { profile: Profile }) {
  const { onOpen } = useModal();

  const a = async () => {
    try {
      (async () => {
        console.log(profile?.id);
        const rawResponse = await fetch(`/api/badges`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "tefdsgst",
            level: 1,
            description: "tsfdgest",
            imageUrl: "tesdgst",
            subteamType: Subteams.Pit,
          }),
        });
        const content = await rawResponse.json();
        console.log(content); // TODO: DO SOMETHING ELSE WITH IT
      })();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Button
        onClick={() => {
          onOpen("editProfile", { profile: profile });
        }}
      >
        Update User
      </Button>
      <ModeToggle />
      <Button onClick={() => a()}>Add Badge</Button>
      {/* <UserBadgeGrid modalType="editProfile" /> */}
    </div>
  );
}
