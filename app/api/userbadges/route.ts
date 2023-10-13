import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (
      profile.role != Profile_role.COACH &&
      profile.role != Profile_role.LEAD
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ret = await db.userBadge.findMany({
      include: {
        badge: true,
        profile: true,
      },
    });
    return NextResponse.json(ret);
  } catch (error) {
    console.error("[USER_BADGE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile: Profile | null = await currentProfile();

    const { badgeIds, profileId } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (
      profile.role != Profile_role.COACH &&
      profile.role != Profile_role.LEAD
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!badgeIds) {
      return new NextResponse("Badge IDs invalid", { status: 400 });
    }

    if (!profileId) {
      return new NextResponse("Profile ID invalid", { status: 400 });
    }

    const postProfile = await db.profile.findUnique({
      where: {
        id: profileId,
      },
    });
    if (!profile) {
      return new NextResponse("Profile ID invalid", { status: 400 });
    }

    const updates: any = [];

    const existingUserBadges = await db.userBadge.findMany({
      where: {
        profileId,
      },
      select: {
        badgeId: true,
        id: true,
      },
    });

    existingUserBadges.forEach(async (ub) => {
      if (!badgeIds.includes(ub.badgeId)) {
        const up = await db.userBadge.delete({
          where: {
            id: ub.id,
          },
        });
        updates.push(up);
      }
    });

    badgeIds.forEach(async (badgeId) => {
      const badge = await db.badge.findUnique({
        where: {
          id: badgeId,
        },
      });
      if (!badge) {
        return new NextResponse("Badge ID invalid", { status: 400 });
      }
      let b = existingUserBadges.find((ub) => ub.badgeId == badgeId);
      if (!b) {
        const up = await db.profile.update({
          where: {
            id: profileId,
          },
          data: {
            badges: {
              create: {
                badgeId,
              },
            },
          },
          include: {
            badges: true,
          },
        });

        updates.push(up);
      }
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error("[USER_BADGE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
