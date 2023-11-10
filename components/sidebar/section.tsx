"use client";

import { Profile_role } from "@prisma/client";

interface SubteamSectionProps {
  label: string;
  role?: Profile_role;
  sectionType: "members";
}

/**
 * A section in the sidebar.
 */
export const Section = ({ label }: SubteamSectionProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
    </div>
  );
};
