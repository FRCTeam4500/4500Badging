"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Profile } from "@prisma/client";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";

/**
 * Edit profile button. Opens the edit profile modal.
 * 
 * @param profile The profile to edit.
 */
export const EditProfileButton = ({ profile }: { profile: Profile }) => {
  const { onOpen } = useModal();
  return (
    <Button
      onClick={() => onOpen("editProfile", { profile })}
      className="ml-auto"
      variant="ghost"
      size="icon"
    >
      <Edit className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
    </Button>
  );
};
