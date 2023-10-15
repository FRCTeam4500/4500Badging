import { currentProfile } from "@/lib/current-profile";
import { Profile } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile: Profile | null = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[SELF_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
