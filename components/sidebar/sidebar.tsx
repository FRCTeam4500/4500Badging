import { Profile_role } from "@prisma/client";
import { redirect } from "next/navigation";
import { ShieldAlert, ShieldCheck } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { Header } from "./header";
import { Search } from "./search";
import { Section } from "./section";
import { Member } from "./member";
import { BackToHome } from "./back-to-home";

const roleIconMap = {
  [Profile_role.MEMBER]: null,
  [Profile_role.LEAD]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [Profile_role.COACH]: <ShieldCheck className="h-4 w-4 mr-2 text-rose-500" />,
  [Profile_role.LEADERSHIP]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-yellow-400" />
  ),
  [Profile_role.MENTOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
  ),
};

/**
 * Sidebar, used in the coach dashboard
 */
export const Sidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const profiles = await db.profile.findMany();

  const role = profiles.find((user) => user.id === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full transition-transform ease-in">
      <Header role={role} />
      <ScrollArea className="flex-1 px-3 pb-10 h-screen">
        <div className="mt-2 flex flex-col">
          <BackToHome />
          <Search
            data={[
              {
                label: "Members",
                type: "member",
                data: profiles?.map((member) => ({
                  id: member.id,
                  name: member.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!profiles?.length && (
          <div className="mb-2">
            <Section sectionType="members" role={role} label="Members" />
            <div className="space-y-[2px]">
              {profiles.map((member) => (
                <Member key={member.id} profile={member} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
