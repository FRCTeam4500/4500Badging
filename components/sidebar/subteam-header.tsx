"use client";

import { Profile_role } from "@prisma/client";
import { ChevronDown, LogOut, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface SubteamHeaderProps {
  role?: Profile_role;
}

export const SubteamHeader = ({ role }: SubteamHeaderProps) => {
  const { onOpen } = useModal();

  const isCoach = role === Profile_role.COACH;
  const isLeadOrMentor =
    isCoach || role === Profile_role.LEAD || role === Profile_role.MENTOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition boujee-text">
          Navigation
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isCoach && (
          <DropdownMenuItem
            onClick={() => {
              location.href = "/coach/profiles";
            }}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isCoach && <DropdownMenuSeparator />}
        <DropdownMenuItem
          onClick={() => {
            location.href = "/coach/badges";
          }}
          className="px-3 py-2 text-sm cursor-pointer"
        >
          Manage Badges
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
