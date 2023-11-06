import { EditProfileButton } from "@/components/edit-profile-button";
import { ModeToggle } from "@/components/mode-toggle";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { Profile_role } from "@prisma/client";
import { redirect } from "next/navigation";
import { GradButtons } from "./grad-buttons";

export default async function Page() {
  const profile = await initialProfile();

  if (profile.role != Profile_role.COACH) {
    redirect("/");
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex mt-3 mx-3 items-center justify-center">
        <UserButton />
        <ModeToggle className="ml-2" />
        <EditProfileButton profile={profile} />
      </div>
      <h1 className="scroll-m-20 mt-4 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Hello, {profile.name}
      </h1>
      <div className="flex justify-center items-center flex-grow"> {/* Use flex-grow */}
        <GradButtons />
      </div>
    </div>

  );
}
