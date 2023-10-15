import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { page: string } }
) {
  try {
    const profile: Profile | null = await currentProfile();
    const prams = params.page.split("&");
    const page = prams[0].split("=")[1];
    const pageSize = prams[1].split("=")[1];

    console.log("[PROFILES_GET]", profile, params);

    const req = request.clone();

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
      skip: (+page - 1) * +pageSize,
      take: +pageSize,
    });
    return NextResponse.json(ret);
  } catch (error) {
    console.log("[PROFILES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
