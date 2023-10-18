import { updateProfile } from "./../../../../lib/update-profile";
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
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    if (!params.profileId) {
      return NextResponse.json({ type: "Profile ID missing", status: 400 });
    }

    if (profile.id != params.profileId && profile.role != Profile_role.COACH) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
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
    return NextResponse.json({ type: "Internal Error", status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const profile: Profile | null = await currentProfile();

    if (!profile) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    if (!params.profileId) {
      return NextResponse.json({ type: "Profile ID missing", status: 400 });
    }

    if (profile.role != Profile_role.COACH) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    const ret = await db.profile.delete({
      where: {
        id: params.profileId,
      },
    });

    return NextResponse.json(ret);
  } catch (error) {
    console.error("[PROFILE_ID_DELETE]", error);
    return NextResponse.json({ type: "Internal Error", status: 500, error });
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
      imageUrl,
      grade,
      phoneNumber,
      email,
      mainSubteam,
      graduationYear,
      isRegistered,
      isTravelCertified,
      userBadges,
      role,
      isSelf,
    } = await req.json(); // Subteams are subteam types

    if (!profile) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    if (!params.profileId) {
      return NextResponse.json({ type: "Profile ID missing", status: 400 });
    }

    if (!isSelf && profile.role != Profile_role.COACH) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (grade) updateData.grade = +grade;
    if (email) updateData.email = email;
    if (graduationYear) updateData.graduationYear = +graduationYear;
    if (isRegistered) updateData.isRegistered = isRegistered == "true";
    if (isTravelCertified)
      updateData.isTravelCertified = isTravelCertified == "true";
    if (userBadges) {
      updateData.userBadges = {
        create: userBadges.map((bad: UserBadge) => ({ badgeId: bad.badgeId })),
      };
    }
    if (role) updateData.role = role;
    if (mainSubteam) updateData.mainSubteam = mainSubteam;

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
    return NextResponse.json({
      type: "Internal Error",
      status: 500,
      error,
    });
  }
}
