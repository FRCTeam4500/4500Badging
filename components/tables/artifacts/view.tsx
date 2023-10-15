import { Member, columns } from "./columns";
import { DataTable } from "./data-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";
import { Profile } from "@prisma/client";
import { Badge } from "lucide-react";

/**
 * Returns all data for the table at specific page. Page number starts at 1, pages are 10 items long.
 * @param page page number starting at 1
 * @returns IM GONNA DO DUM DUM AND RETRIEVE EVERYTHING AT ONCE TODO: FIX!!!!
 */
async function getData(): Promise<Member[]> {
  const profiles: Profile[] = await db.profile.findMany({});

  /* Processing Chosen Profiles */
  const send: any = [];

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const badges = await db.userBadge.findMany({
      where: {
        profileId: profile.id,
      },
      select: {
        badge: true,
      },
      orderBy: {
        badge: {
          level: "desc",
        },
      },
    });
    const numBadges = badges.length;
    const iterBadges = numBadges > 5 ? badges.slice(0, 5) : badges;
    const accBadge = (
      <div className="flex justify-center">
        <TooltipProvider>
          {iterBadges.map((badge) => {
            return (
              <Tooltip key={badge.badge.id}>
                <TooltipTrigger asChild>
                  <Avatar>
                    <AvatarImage src={badge.badge.imageUrl} />
                    <AvatarFallback>
                      <Badge />
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{badge.badge.name}</TooltipContent>
              </Tooltip>
            );
          })}
          {numBadges > 5 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="select-none">
                  <AvatarFallback>+{numBadges - 5}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>View Profile For More</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    );
    send.push({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      numBadges: numBadges,
      badges: accBadge,
      role: profile.role,
      isRegistered: profile.isRegistered,
      isTravelCertified: profile.isTravelCertified,
    });
  }

  // Fetch data from your API here.
  return send;
}

export default async function ProfileTable() {
  const data = await getData();

  return (
    <div>
      <div className="container mx-auto pt-20">
        <p className="text-lg font-semibold text-center">Team View</p>
      </div>
      <div className="container mx-auto py-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
