import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { Subteams } from "@prisma/client";

/**
 * If the user is not signed in, redirect them to the sign in page.
 * 
 * If the user is signed in, check if they have a profile in the database.
 * 
 * If they do, update the profile with any new information from Clerk.
 * 
 * If they don't, create a new profile with the information from Clerk.
 * 
 * If the userId from Clerk is not yet in the database, but the email is, update the profile with the userId.
 * 
 * @returns a new or existing profile for the current user
 */
export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  function updateDifferencesToClerkUser(user, profile) {
    const differences: any = {};
    if (user.firstName + " " + user.lastName != profile.name)
      differences.name = user.firstName + " " + user.lastName;

    if (user.imageUrl != profile.imageUrl) differences.imageUrl = user.imageUrl;

    if (user.emailAddresses[0].emailAddress != profile.email)
      differences.email = user.emailAddresses[0].emailAddress;

    const updated = db.profile.update({
      where: {
        userId: user.id,
        id: profile.id,
      },
      data: {
        ...differences,
      },
    });

    return updated;
  }

  const profileFromUser = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      badges: true,
    },
  });

  const profileFromEmail = await db.profile.findFirst({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      badges: true,
    },
  });

  if (profileFromUser) {
    const t = updateDifferencesToClerkUser(user, profileFromUser);
    return t;
  }

  if (profileFromEmail) {
    const updatedProfile = await db.profile.update({
      where: {
        id: profileFromEmail.id,
      },
      data: {
        userId: user.id,
      },
      include: {
        badges: true,
      },
    });
    return updatedProfile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      graduationYear: 0,
      grade: 0,
      isRegistered: false,
      isTravelCertified: false,
      phoneNumber: "",
      mainSubteam: Subteams.NONE,
    },
    include: {
      badges: true,
    },
  });

  return newProfile;
};
