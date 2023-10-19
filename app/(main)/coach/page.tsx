import { EditProfileButton } from "@/components/edit-profile-button";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { Profile_role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const profile = await initialProfile();

  if (profile.role != Profile_role.COACH) {
    redirect("/");
  }

  return (
    <div>
      <div className="flex mt-3 mx-3 items-center justify-center">
        <UserButton />
        <ModeToggle className="ml-2" />
        <EditProfileButton profile={profile} />
      </div>
      <h1 className="text-2xl lg:text-4xl md:text-4xl p-4 mb-4 xl:text-4xl 2xl:text4xl font-bold text-center">
        Hello, {profile.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
        <Link href="/coach/profiles">
          <div className="rounded-2xl p-4 mx-1 shadow-xl">
            <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
              Member Profiles
            </h2>
          </div>
        </Link>
        <Link href="/badges">
          <div className="rounded-2xl p-4 mx-1 shadow-xl">
            <h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
              Badges
            </h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
