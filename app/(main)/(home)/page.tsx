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
import { Profile, Profile_role } from "@prisma/client";
import { Badge } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const profile: Profile = await initialProfile();

  if (profile.role === Profile_role.COACH) {
    redirect("/coach");
  }

  if (
    profile.role === Profile_role.LEAD ||
    profile.role === Profile_role.CAPTAIN
  ) {
    redirect("/lead");
  }

  /* TODO: ADD CHECKS FOR OTHER ROLES, If we need different views */

  const profileBadges = await db.userBadge.findMany({
    where: {
      profileId: profile.id,
    },
    include: {
      badge: true,
    },
  });

  console.log(profile);

  return (
    <div>
      <div className="flex items-center justify-center">
        <UserButton />
        <ModeToggle className="mt-2 ml-2" />
      </div>
      <h1 className="text-2xl lg:text-4xl md:text-4xl p-4 mb-4 xl:text-4xl 2xl:text4xl font-bold text-center">
        Hello, {profile.name}
      </h1>

      <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
        Your Badges
      </h2>

      {profileBadges.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 rounded-2xl shadow-2xl dark:shadow-white p-12 gap-3">
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
                              <Avatar>
                                <AvatarImage
                                  src={badge.badge.imageUrl}
                                  alt={badge.badge.name}
                                />
                                <AvatarFallback>
                                  <Badge size={48} />
                                </AvatarFallback>
                              </Avatar>
                              <span className="pr-2 overflow-x-hidden py-1 whitespace-nowrap overflow-ellipsis">
                                {badge.badge.name}
                              </span>
                            </span>
                            <div className="pl-6 text-indigo-400 group-hover:text-primary transition duration-200">
                              See Desc.{" "}
                              <div className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                -&gt;
                              </div>
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex flex-col p-3 max-w-sm items-center justify-center">
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
        <Card className="grid grid-cols-1 shadow-2xl p-12 gap-3">
          <TooltipProvider>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl lg:text-4xl md:text-4xl xl:text-4xl 2xl:text4xl p-10 font-bold text-center">
                You have no badges yet!
              </h1>
            </div>
          </TooltipProvider>
        </Card>
      )}
    </div>
  );
}
