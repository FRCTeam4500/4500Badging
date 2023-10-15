"use client";

import { Profile, Profile_role } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface SubteamMemberProps {
  profile: Profile;
}

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

export const SubteamMember = ({ profile }: SubteamMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[profile.role];

  return (
    <button
      onClick={() => router.push(`/coach/profiles/${profile.id}`)}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === profile.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar src={profile.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />
      <p
        className={cn(
          "font-semibold text-sm w-32 text-left overflow-x-hidden py-1 whitespace-nowrap overflow-ellipsis text-zinc-500 truncate group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === profile.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
          profile.role === Profile_role.COACH && "admin-text",
          profile.role === Profile_role.LEAD && "lead-text",
          profile.role === Profile_role.CAPTAIN && "lead-text",
          profile.role === Profile_role.LEADERSHIP && "leadership-text",
          profile.role === Profile_role.MENTOR && "mentor-text"
        )}
      >
        {profile.name}
      </p>
      <div>{icon}</div>
    </button>
  );
};
