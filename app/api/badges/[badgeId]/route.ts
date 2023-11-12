import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { badgeId: string } }
) {
  try {
    if (!params.badgeId) {
      return NextResponse.json({ type: "Badge ID missing", status: 400 });
    }

    const ret = await db.badge.findUnique({
      where: {
        id: params.badgeId,
      },
      include: {
        userBadge: true,
      },
    });
    return NextResponse.json(ret);
  } catch (error) {
    console.error("[BADGE_ID_GET]", error);
    return NextResponse.json({ type: "Internal Error", status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { badgeId } }
) {
  try {
    const req = request.clone();
    const profile: Profile | null = await currentProfile();
    const {
      name,
      level,
      description,
      deliverable,
      deliverableUrl,
      imageUrl,
      subteamType,
    } = await req.json(); // Subteams are subteam types

    if (!profile) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    if (!params.badgeId) {
      return NextResponse.json({ type: "Badge ID missing", status: 400 });
    }

    if (
      profile.role != Profile_role.COACH &&
      profile.role != Profile_role.LEAD
    ) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (level) updateData.level = level;
    if (description) updateData.description = description;
    if (deliverable) updateData.deliverable = deliverable;
    if (subteamType) updateData.subteamType = subteamType;
    if (deliverableUrl) updateData.deliverableUrl = deliverableUrl;

    const updatedProfile = await db.badge.update({
      where: {
        id: params.badgeId,
      },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[BADGE_ID_PATCH]", error);
    return NextResponse.json({ type: "Internal Error", status: 500, error });
  }
}
