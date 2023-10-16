/**
 *  This file will contain the public badge system.
 */

import { EditProfileSelfButton } from "@/components/edit-profile-self-button";
import { ModeToggle } from "@/components/mode-toggle";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";

export default async function Page() {
  const badges = await db.badge.findMany();
  const profile = await currentProfile();

  return (
    <div>
      <div className="flex mt-3 items-center justify-center">
        <UserButton />
        <ModeToggle className="ml-2" />
        <EditProfileSelfButton profile={profile!} />
      </div>
    </div>
  );
}
