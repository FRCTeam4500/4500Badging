import { initialProfile } from "@/lib/initial-profile";
import { Profile_role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page() {
  const profile = await initialProfile();

  if (profile.id != Profile_role.COACH) {
    redirect("/");
  }

  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}
