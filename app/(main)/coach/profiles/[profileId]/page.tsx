import { EditProfileButton } from "@/components/edit-profile-button";
import { MobileToggle } from "@/components/mobile-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { Profile_role } from "@prisma/client";
import { Badge } from "lucide-react";
import { redirect } from "next/navigation";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  };
}

const ProfileIdPage = async ({ params }: ProfileIdPageProps) => {
  const accessor = await currentProfile();
  const profile = await db.profile.findUnique({
    where: {
      id: params.profileId,
    },
  });
  if (!accessor) {
    redirectToSignIn();
  }
  if (accessor?.role != Profile_role.COACH) {
    redirect("/");
  }
  if (!profile) {
    redirect("/coach/");
  }
  const badges = await db.userBadge.findMany({
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
  return (
    <div>
      <div className="text-md sticky top-0 font-semibold px-3 flex items-center h-12 bg-background border-neutral-200 dark:border-neutral-800 border-b-2">
        <MobileToggle />
        <p className="font-semibold text-md text-black dark:text-white">
          Profile View
        </p>
        <EditProfileButton profile={profile} />
      </div>
      <div className="flex flex-col items-center mt-4 mx-14 p-4 justify-center">
        <div>
          <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
            Profile Info
          </h2>
          <h3 className="text-md text-foreground text-left">
            NAME: {profile.name}
          </h3>
          <h3 className="text-md text-foreground text-left">
            EMAIL: {profile.email}
          </h3>
          <h3 className="text-md text-foreground text-left">
            ROLE: {profile.role}
          </h3>
          <h3 className="text-md text-foreground text-left">
            GRADE: {profile.grade}
          </h3>
          <h3 className="text-md text-foreground text-left">
            GRADUATION YEAR: {profile.graduationYear}
          </h3>
          <h3 className="text-md text-foreground text-left">
            IS REGISTERED: {profile.isRegistered.toString()}
          </h3>
          <h3 className="text-md text-foreground text-left">
            IS TRAVEL CERTIFIED: {profile.isTravelCertified.toString()}
          </h3>
          <h3 className="text-md text-foreground text-left">
            MAIN SUBTEAM: {profile.mainSubteam}
          </h3>
          <h3 className="text-md text-foreground text-left">
            PHONE NUMBER {profile.phoneNumber}
          </h3>
        </div>
      </div>
      <div className="flex flex-col mt-4 items-center justify-center">
        <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
          Profile Badges
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2 rounded-2xl shadow-2xl p-12 gap-3">
          <TooltipProvider>
            {badges.map((badge) => (
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
    </div>
  );
};

export default ProfileIdPage;
