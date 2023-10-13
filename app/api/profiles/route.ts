import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile: Profile | null = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (profile.role != Profile_role.COACH) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ret = await db.profile.findMany({
      include: {
        badges: true,
      },
    });
    return NextResponse.json(ret);
  } catch (error) {
    console.error("[PROFILES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
