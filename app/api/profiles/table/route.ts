import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const profile: Profile | null = await currentProfile();

    const req = request.clone();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const retProf = await db.profile.aggregate({
      _count: {
        email: true,
      },
    });

    return NextResponse.json(retProf);
  } catch (error) {
    console.log("[PROFILES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
