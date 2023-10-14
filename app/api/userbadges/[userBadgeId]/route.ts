import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userBadgeId: string } }
) {
  try {
    if (!params.userBadgeId) {
      return new NextResponse("User Badge ID missing", { status: 400 });
    }

    const ret = await db.userBadge.findUnique({
      where: {
        id: params.userBadgeId,
      },
      include: {
        badge: true,
        profile: true,
      },
    });
    return NextResponse.json(ret);
  } catch (error) {
    console.error("[USER_BADGE_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userBadgeId } }
) {
  try {
    const profile: Profile | null = await currentProfile();
    const { badgeId, profileId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userBadgeId) {
      return new NextResponse("User Badge ID missing", { status: 400 });
    }

    if (profile.role != Profile_role.COACH) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateData: any = {};

    if (badgeId) {
      const badge = await db.badge.findUnique({
        where: {
          id: badgeId,
        },
      });
      if (!badge) {
        return new NextResponse("Badge ID invalid", { status: 400 });
      }
			updateData.badgeId = badgeId;
      updateData.badgeLevel = badge.level;
      updateData.badge = badge;
    }
    if (profileId) {
      const profile = await db.profile.findUnique({
        where: {
          id: profileId,
        },
      });
      if (!profile) {
        return new NextResponse("Profile ID invalid", { status: 400 });
      }
			updateData.profileId = profileId;
      updateData.profile = profile;
    }

    const updatedUserBadge = await db.userBadge.update({
      where: {
        id: params.userBadgeId,
      },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json(updatedUserBadge);
  } catch (error) {
    console.error("[USER_BADGE_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
