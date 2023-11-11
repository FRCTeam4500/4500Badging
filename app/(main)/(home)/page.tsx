
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { Profile, Profile_role, Subteams } from "@prisma/client";
import { redirect } from "next/navigation";
import HomeComp from "./home-comp";

export default async function Home() {
  const profile: Profile = await initialProfile();

  let show = true;
  if (profile.role === Profile_role.COACH) {
    show = false;
    redirect("/coach");
  }

  // In case we need to add a lead page for whatever reason
  // if (
  //   profile.role === Profile_role.LEAD ||
  //   profile.role === Profile_role.CAPTAIN ||
  //   profile.role === Profile_role.MENTOR
  // ) {
  //   redirect("/lead");
  // }

  const profileBadges = await db.userBadge.findMany({
    where: {
      profileId: profile.id,
    },
    include: {
      badge: true,
    },
    orderBy: {
      badge: {
        level: "desc",
      },
    },
  });

  let lv3Subteam: string = Subteams.NONE;
  let lv3Recieved: boolean = false;
  let blueRecieved: boolean = false;
  let scoutingRecieved: boolean = false;
  let outreachRecieved: boolean = false;
  let registrationRecieved: boolean = false;
  let travelRecieved: boolean = false;

  function checkAllComplete() {
    for (let i = 0; i < profileBadges.length; i++) {
      if (profileBadges[i].badge.name === "Outreach") {
        outreachRecieved = true;
        continue;
      }
      if (profileBadges[i].badge.name === "Scouting") {
        scoutingRecieved = true;
        continue;
      }
      if (profile.isRegistered) {
        registrationRecieved = true;
      }
      if (profileBadges[i].badge.level === 3 && lv3Subteam === Subteams.NONE) {
        lv3Recieved = true;
        lv3Subteam = profileBadges[i].badge.subteamType;
        continue;
      }
      if (
        lv3Subteam != Subteams.NONE &&
        profileBadges[i].badge.subteamType != lv3Subteam
      ) {
        blueRecieved = true;
      }
    }
  }

  checkAllComplete();

  /** Update Prof */
  if (
    lv3Recieved &&
    blueRecieved &&
    scoutingRecieved &&
    outreachRecieved &&
    registrationRecieved
  ) {
    travelRecieved = true;
    if (!profile.isTravelCertified) {
      await db.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          isTravelCertified: true,
        },
      });
    }
  }

  return (
    <div>
      {!show ? <div></div> : <HomeComp userBadges={profileBadges} profile={profile} requirements={{ lv3Recieved, blueRecieved, scoutingRecieved, outreachRecieved, registrationRecieved, travelRecieved }} /> }
    </div>
  );
}
