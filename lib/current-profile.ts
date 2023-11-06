import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

/**
 * If the user is not signed in, redirect them to the sign in page.
 * 
 * If the user is signed in, return the profile for the user.
 * 
 * @returns the current profile for the user
 */
export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
    }
  });

  return profile;
}