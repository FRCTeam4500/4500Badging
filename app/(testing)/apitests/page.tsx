import { initialProfile } from "@/lib/initial-profile";
import { ClientA } from "./client";

export default async function Page() {
  const profile = await initialProfile();
  return <ClientA profile={profile} />;
}
