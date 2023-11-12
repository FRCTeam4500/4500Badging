import { EditBadgeButton } from "@/components/edit-badge-button";
import { HomeButtonIcon } from "@/components/home-button-icon";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton, redirectToSignIn } from "@clerk/nextjs";
import { Profile_role } from "@prisma/client";
import { Badge } from "lucide-react";
import Link from "next/link";

interface ProfileIdPageProps {
    params: {
        badgeId: string;
    };
}

const ProfileIdPage = async ({ params }: ProfileIdPageProps) => {
    const profile = await currentProfile();
    if (!profile) {
        redirectToSignIn();
    }
    const badge = await db.badge.findUnique({
        where: {
            id: params.badgeId,
        },
        include: {
            userBadge: true
        }
    });
    return (
        <div>
            <div className="flex mt-3 items-center justify-center">
                <HomeButtonIcon className="mr-2" />
                <UserButton />
                <ModeToggle className="ml-2" />
                {profile?.role == Profile_role.COACH
                    || profile?.role == Profile_role.LEAD
                    || profile?.role == Profile_role.CAPTAIN
                    ? <EditBadgeButton badge={badge!} /> : null}
            </div>

            <h1 className="scroll-m-20 text-4xl text-center my-4 font-extrabold tracking-tight lg:text-5xl">
                {badge?.name} Badge
            </h1>

            <div className="flex justify-center items-center">
                <Avatar className="w-32 h-32">
                    <AvatarImage
                        src={badge?.imageUrl}
                    />
                    <AvatarFallback>
                        <Badge size={64} />
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex flex-col items-center mx-14 p-4 justify-center">
                <div>
                    <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
                        Profile Info
                    </h2>
                    <h3 className="text-md text-foreground text-left">
                        Level: {badge?.level}
                    </h3>
                    <h3 className="text-md text-foreground text-left">
                        Subteam Type: {badge?.subteamType}
                    </h3>
                    <h3 className="text-md text-foreground text-left">
                        Updated At: {badge?.updatedAt.toDateString()}
                    </h3>
                </div>
            </div>
            <div className="flex flex-col items-center mt-4 mx-14 p-4 justify-center">
                {badge?.description ?
                    <div className="flex flex-col w-96 mt-4 items-center justify-center">
                        <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
                            Description
                        </h2>
                        <h2>
                            {badge?.description}
                        </h2>
                    </div>
                :
                    null
                }
                {badge?.deliverable ?
                    <div className="flex flex-col w-96 mt-4 items-center justify-center">
                        <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
                            Deliverable
                        </h2>
                        <h2>
                            {badge?.deliverable}
                        </h2>
                    </div>
                :
                    null
                }
                {badge?.deliverableUrl ?
                    <div className="flex flex-col w-96 mt-4 items-center justify-center">
                        <Link href={badge?.deliverableUrl} className="p-4 rounded-md bg-secondary">
                            See Deliverable
                        </Link>
                    </div>
                :
                    null
                }
            </div>
        </div>
    );
};

export default ProfileIdPage;
