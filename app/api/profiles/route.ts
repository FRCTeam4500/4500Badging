import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Profile, Profile_role, Subteams } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

export async function POST(request: Request) {
  try {
    const profile: Profile | null = await currentProfile();

    const req = request.clone();
    const {
      name,
      role,
      email,
      phoneNumber,
      grade,
      graduationYear,
      imageUrl,
      mainSubteam,
      isRegistered,
    } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (profile.role != Profile_role.COACH) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!email) {
      return new NextResponse("Email missing", { status: 400 });
    }

    const updates: any = {};

    updates.userId = uuidv4(); // Nothing For Now

    if (email) updates.email = email;

    if (name) updates.name = name;
    else updates.name = "";

    if (role) updates.role = role;
    else updates.role = Profile_role.MEMBER;

    if (phoneNumber) updates.phoneNumber = phoneNumber;
    else updates.phoneNumber = "";

    if (grade) updates.grade = +grade;
    else updates.grade = 9;

    if (graduationYear) updates.graduationYear = +graduationYear;
    else updates.graduationYear = 2025;

    if (imageUrl) updates.imageUrl = imageUrl;
    else updates.imageUrl = "";

    if (isRegistered) updates.isRegistered = isRegistered == "true";
    else updates.isRegistered = false;

    if (mainSubteam) updates.mainSubteam = Subteams[mainSubteam];
    else updates.mainSubteam = Subteams.NONE;

    updates.isTravelCertified = false;

    const ret = await db.profile.create({
      data: {
        ...updates,
      },
    });
    return NextResponse.json(ret);
  } catch (error) {
    console.error("[PROFILES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
