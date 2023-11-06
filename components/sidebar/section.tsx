"use client";

import { Profile_role } from "@prisma/client";
import { Plus, Settings } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface SubteamSectionProps {
  label: string;
  role?: Profile_role;
  sectionType: "members";
}

export const Section = ({ label }: SubteamSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
    </div>
  );
};
