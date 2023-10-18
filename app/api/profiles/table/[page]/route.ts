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

    const req = request.clone();

    if (!profile) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    if (profile.role != Profile_role.COACH) {
      return NextResponse.json({ type: "Unauthorized", status: 401 });
    }

    const retProf = await db.profile.findMany({
      skip: (+page - 1) * +pageSize, // If page 1, skip 0, if page 2, skip 10, etc.
      take: +pageSize, // Take 1 page
      select: {
        badges: {
          select: {
            badge: true,
          },
          orderBy: {
            badge: {
              level: "desc",
            },
          },
        },
        id: true,
        name: true,
        role: true,
        mainSubteam: true,
        grade: true,
        graduationYear: true,
        phoneNumber: true,
        email: true,
        imageUrl: true,
      },
    });
    return NextResponse.json(retProf);
  } catch (error) {
    console.log("[PROFILES_GET]", error);
    return NextResponse.json({ type: "Internal Error", status: 500, error });
  }
}
