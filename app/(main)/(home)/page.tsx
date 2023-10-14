import { EditProfileSelfButton } from "@/components/edit-profile-self-button";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { Profile, Profile_role, Subteams } from "@prisma/client";
import { Badge } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ActionTooltip } from "@/components/action-tooltip";

export default async function Home() {
  const profile: Profile = await initialProfile();

  // if (profile.role === Profile_role.COACH) {
  //   redirect("/coach");
  // }

  // if (
  //   profile.role === Profile_role.LEAD ||
  //   profile.role === Profile_role.CAPTAIN
  // ) {
  //   redirect("/lead");
  // }

  /* TODO: ADD CHECKS FOR OTHER ROLES, If we need different views */

  const profileBadges = await db.userBadge.findMany({
    where: {
      profileId: profile.id,
    },
    include: {
      badge: true,
    },
    orderBy: {
      badge: {
        level: "desc",
      },
    },
  });

  let lv3Subteam: Subteams = Subteams.NONE;
  let lv3Recieved: boolean = false;
  let blueRecieved: boolean = false;
  let scoutingRecieved: boolean = false;
  let outreachRecieved: boolean = false;
  let registrationRecieved: boolean = false;
  let travelRecieved: boolean = false;

  function checkAllComplete() {
    for (let i = 0; i < profileBadges.length; i++) {
      if (profileBadges[i].badge.name === "Outreach") {
        outreachRecieved = true;
        continue;
      }
      if (profileBadges[i].badge.name === "Scouting") {
        scoutingRecieved = true;
        continue;
      }
      if (profile.isRegistered) {
        registrationRecieved = true;
      }
      if (profileBadges[i].badge.level === 3 && lv3Subteam === Subteams.NONE) {
        lv3Recieved = true;
        lv3Subteam = profileBadges[i].badge.subteamType;
        continue;
      }
      if (
        lv3Subteam != Subteams.NONE &&
        profileBadges[i].badge.subteamType != lv3Subteam
      ) {
        blueRecieved = true;
      }
    }
  }

  checkAllComplete();

  /** Update Prof */
  if (
    lv3Recieved &&
    blueRecieved &&
    scoutingRecieved &&
    outreachRecieved &&
    registrationRecieved
  ) {
    travelRecieved = true;
    if (!profile.isTravelCertified) {
      db.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          isTravelCertified: true,
        },
      });
    }
  }

  return (
    <div>
      <div className="flex mt-3 items-center justify-center">
        <UserButton />
        <ModeToggle className="ml-2" />
        <EditProfileSelfButton profile={profile} />
      </div>
      <h1 className="text-2xl lg:text-4xl md:text-4xl p-4 mb-4 xl:text-4xl 2xl:text4xl font-bold text-center">
        Hello, {profile.name}
      </h1>

      {/* Requirements :D */}
      <div className="flex flex-col items-center justify-center mb-4">
        <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
          Your Requirements
        </h2>

        <TooltipProvider>
          <div className="flex flex-col select-none justify-center md:flex-row lg:flex-row xl:flex-row 2xl:flex-row 3xl:flex-row rounded-2xl shadow-2xl dark:shadow-white p-12 gap-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={
                    registrationRecieved
                      ? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
                      : "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
                  }
                  alt="IsRegistered"
                  width={75}
                  height={100}
                />
              </TooltipTrigger>
              <TooltipContent>
                {registrationRecieved
                  ? "You have Registered With FIRST"
                  : "You have not registered with FIRST"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={
                    lv3Recieved
                      ? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
                      : "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
                  }
                  alt="IsLv3"
                  width={75}
                  height={100}
                />
              </TooltipTrigger>
              <TooltipContent>
                {lv3Recieved
                  ? "You have recieved Level 3 in at least one subteam"
                  : "You have not recieved a Level 3 in one subteam"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={
                    blueRecieved
                      ? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
                      : "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
                  }
                  alt="IsBlue"
                  width={75}
                  height={100}
                />
              </TooltipTrigger>
              <TooltipContent>
                {blueRecieved
                  ? "You have at least one level outside your subteam"
                  : "You have not recieved a badge outside your subteam"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={
                    scoutingRecieved
                      ? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
                      : "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
                  }
                  alt="IsScouting"
                  width={75}
                  height={100}
                />
              </TooltipTrigger>
              <TooltipContent>
                {scoutingRecieved
                  ? "You have recieved your Scouting badge"
                  : "You have not recieved your Scouting badge"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={
                    outreachRecieved
                      ? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
                      : "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
                  }
                  alt="IsOutreach"
                  width={75}
                  height={100}
                />
              </TooltipTrigger>
              <TooltipContent>
                {outreachRecieved
                  ? "You have recieved your Outreach badge"
                  : "You have not recieved your Outreach badge"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  src={
                    travelRecieved
                      ? "/prepared-to-travel-true.png"
                      : "/prepared-to-travel-false.png"
                  }
                  alt="IsTravel"
                  width={100}
                  height={100}
                />
              </TooltipTrigger>
              <TooltipContent>
                {travelRecieved
                  ? "You are eligible to travel to competition"
                  : "You are not eligible to travel to competition"}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {profileBadges.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
            Your Badges
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2 rounded-2xl shadow-2xl dark:shadow-white p-12 gap-3">
            <TooltipProvider>
              {profileBadges.map((badge) => (
                <div key={badge.id} className="px-8 py-4">
                  <div className="grid gap-8 items-start justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="relative px-7 py-4 bg-secondary rounded-lg leading-none flex felx-col items-center divide-x divide-gray-600">
                            <span className="flex w-60 items-center space-x-5">
                              <div>{" " + badge.badge.level}</div>
                              <Avatar>
                                <AvatarImage
                                  src={badge.badge.imageUrl}
                                  alt={badge.badge.name}
                                />
                                <AvatarFallback>
                                  <Badge size={48} />
                                </AvatarFallback>
                              </Avatar>
                              <span className="pr-2 w-36 text-left overflow-x-hidden py-1 whitespace-nowrap overflow-ellipsis">
                                {badge.badge.name}
                              </span>
                            </span>
                            <div className="pl-6 text-indigo-400 group-hover:text-primary transition duration-200">
                              See Desc.{" "}
                              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                -&gt;
                              </span>
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex flex-col p-2 max-w-sm items-center justify-center">
                            {badge.badge.subteamType}&apos;s Level{" "}
                            {badge.badge.level} Badge
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 shadow-2xl mt-14 p-12 gap-3">
          <TooltipProvider>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl lg:text-4xl md:text-4xl xl:text-4xl 2xl:text4xl p-10 font-bold text-center">
                You have no badges yet!
              </h1>
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
