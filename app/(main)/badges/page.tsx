/**
 *  This file will contain the public badge system.
 */

import { AddBadgeButton } from "@/components/add-badge-button";
import BadgeButton from "@/components/badges/badge-button"
import { BadgeCard } from "@/components/badges/badge-card";
import { EditProfileSelfButton } from "@/components/edit-profile-self-button";
import { HomeButtonIcon } from "@/components/home-button-icon";
import { ModeToggle } from "@/components/mode-toggle";
import { BackToHome } from "@/components/sidebar/back-to-home";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { Profile_role, Subteams } from "@prisma/client";
import { Badge } from "lucide-react";

export default async function Page() {
  const badges = await db.badge.findMany();
  const profile = await currentProfile();
  const subteams = [
    {
      id: Subteams.Programming,
      label: "Programming Team"
    },
    {
      id: Subteams.Cad,
      label: "CAD Team"
    },
    {
      id: Subteams.Mechanical,
      label: "Mechanical Team"
    },
    {
      id: Subteams.NONE,
      label: "Unsorted"
    },
    {
      id: Subteams.Pit,
      label: "Pit Team"
    },
    {
      id: Subteams.Strategy,
      label: "Strategy Team"
    },
    {
      id: Subteams.BusinessOutreachMedia,
      label: "Business, Outreach, Media Team"
    }
  ]

  return (
    <div>
      <div className="flex mt-3 items-center justify-center">
        <HomeButtonIcon className="mr-2" />
        <UserButton />
        <ModeToggle className="ml-2" />
        {profile?.role == Profile_role.COACH
          || profile?.role == Profile_role.LEAD
          || profile?.role == Profile_role.CAPTAIN
          ? <AddBadgeButton /> : null}
      </div>

      <h1 className="scroll-m-20 text-4xl text-center my-4 font-extrabold tracking-tight lg:text-5xl">
        Badges
      </h1>

      <div className="grid grid-cols-1 p-12 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
        <TooltipProvider>
          {subteams.map((subteam) => (
            <div className="mb-12" key={subteam.id}>
              <h2 className="scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">{subteam.label}</h2>
              {
                badges.map((badge) => (
                  badge.subteamType === subteam.id ?
                    <div key={badge.id} className="px-8 py-4">
                      <div className="grid gap-8 items-start justify-center">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                          <Tooltip>
                            <BadgeButton badge={badge} />
                            <TooltipContent>
                              <div className="flex flex-col p-2 max-w-sm items-center justify-center">
                                {badge.subteamType}&apos;s Level{" "}
                                {badge.level} Badge
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    : null
                ))
              }
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
