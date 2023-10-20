import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    if (
      profile.role == Profile_role.COACH ||
      profile.role == Profile_role.LEAD ||
      profile.role == Profile_role.CAPTAIN
    ) {
      const ret = await db.badge.findMany({
        include: {
          userBadge: true,
        },
      });
      return NextResponse.json(ret);
    } else {
      const ret = await db.badge.findMany({
        include: {
          userBadge: {
            where: {
              profileId: profile.id,
            },
          },
        },
        orderBy: {
          level: "asc",
        }
      });
      return NextResponse.json(ret);
    }
  } catch (error) {
    console.error("[BADGE_GET]", error);
    return NextResponse.json({ type: "Internal Error", status: 500, error });
  }
}

export async function POST(request: Request) {
  try {
    const req = request.clone();

    const profile: Profile | null = await currentProfile();

    const {
      name,
      level,
      description,
      deliverable,
      imageUrl,
      subteamType,
    } = await req.json(); // Subteams are subteam types (ENUMS)

    if (!profile) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    if (
      profile.role != Profile_role.COACH &&
      profile.role != Profile_role.LEAD
    ) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    const updatedBadge = await db.badge.create({
      data: {
        name,
        level,
        description,
        deliverable,
        imageUrl,
        subteamType,
      },
    });

    return NextResponse.json(updatedBadge);
  } catch (error) {
    console.log("[BADGE_POST]", error);
    return NextResponse.json({ err: error, status: 500 });
  }
}
