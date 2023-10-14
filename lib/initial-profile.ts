import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  const profileFromUser = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  const profileFromEmail = await db.profile.findFirst({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  if (profileFromUser) {
    return profileFromUser;
  }

  if (profileFromEmail) {
    const updatedProfile = await db.profile.update({
      where: {
        id: profileFromEmail.id,
      },
      data: {
        userId: user.id,
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
    },
  });

  return newProfile;
};
