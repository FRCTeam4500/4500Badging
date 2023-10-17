import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { Profile_role, Subteams } from "@prisma/client";
import { Badge } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const profile = await initialProfile();

  const subteams = Object.values(Subteams);

  const badges = await db.badge.findMany({
    orderBy: {
      subteamType: "asc",
    },
  });

  if (
    profile.role != Profile_role.COACH &&
    profile.role != Profile_role.LEAD &&
    profile.role != Profile_role.MENTOR &&
    profile.role != Profile_role.CAPTAIN
  ) {
    redirect("/");
  }

  return (
    <div>
      <div className="text-2xl font-sans my-4 text-center">Badges</div>
      <div className="grid grid-cols-2 justify-center items-center">
        {subteams.map((subteam) => (
          <div className="flex flex-col justify-center items-center">
            <div className="text-xl font-sans my-4 text-center">
              {subteam} Badges
            </div>
            <div className="grid grid-cols-2 justify-center items-center">
              {badges
                .filter((badge) => badge.subteamType == subteam)
                .map((badge) => (
                  <div className="flex flex-col justify-center items-center m-4">
                    <Avatar>
                      <AvatarImage src={badge.imageUrl} />
                      <AvatarFallback>
                        <Badge />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
