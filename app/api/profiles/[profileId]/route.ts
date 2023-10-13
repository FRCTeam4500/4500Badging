import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { Profile, Profile_role, Subteams, UserBadge } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {

    const profile: Profile | null = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.profileId) {
      return new NextResponse("Profile ID missing", { status: 400 });
    }

    if (profile.id != params.profileId && profile.role != Profile_role.COACH) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ret = await db.profile.findUnique({
      where: {
        id: params.profileId,
      },
      include: {
        badges: true,
      },
    });
    return NextResponse.json(ret);
  } catch (error) {
    console.error("[PROFILE_ID_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const profile: Profile | null = await currentProfile();
    const {
      name,
      bio,
      imageUrl,
      grade,
      phoneNumber,
      email,
      graduationYear,
      isRegistered,
      isTravelCertified,
      userBadges,
      subteams,
      role,
    } = await req.json(); // Subteams are subteam types

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.profileId) {
      return new NextResponse("Profile ID missing", { status: 400 });
    }

    if (profile.id != params.profileId && profile.role != Profile_role.COACH) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (grade) updateData.grade = grade;
    if (email) updateData.email = email;
    if (graduationYear) updateData.graduationYear = graduationYear;
    if (isRegistered) updateData.isRegistered = isRegistered;
    if (isTravelCertified) updateData.isTravelCertified = isTravelCertified;
    if (userBadges) {
      updateData.userBadges = {
        create: userBadges.map((bad: UserBadge) => ({ badgeId: bad.badgeId })),
      };
    }

    const updatedProfile = await db.profile.update({
      where: {
        id: params.profileId,
      },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PROFILE_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
