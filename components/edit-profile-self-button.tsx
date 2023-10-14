"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Profile } from "@prisma/client";
import { Edit2Icon } from "lucide-react";
import { Button } from "./ui/button";

export const EditProfileSelfButton = ({profile}: {profile: Profile}) => {
    const {onOpen} = useModal();
  return (
    <Button onClick={() => onOpen("editProfileSelf", {profile})} variant="ghost" size="icon">
      <Edit2Icon className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
    </Button>
  );
};
