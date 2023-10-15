"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { Badge, Profile } from "@prisma/client";
import { Edit2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileIdPageProps {
  params: {
    profileId: string;
  };
}

const ProfileIdPage = ({ params }: ProfileIdPageProps) => {
  const { onOpen } = useModal();
  const [accessor, setAccessor] = useState<Profile | undefined>();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [userBadges, setUserBadges] = useState<Badge[] | undefined>();

  useEffect(() => {
    const getAccessor = async () => {
      return await fetch(`/api/profiles/self`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
    };

    const getProfile = async () => {
      return await fetch(`/api/profiles/${params.profileId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    };

    const getUserBadges = async () => {
      return await fetch(`/api/userbadges/${profile?.id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    };

    getAccessor()
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setAccessor(data);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    getProfile()
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setProfile(data);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    getUserBadges()
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUserBadges(data);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <div className="text-md sticky top-0 font-semibold px-3 flex items-center h-12 bg-background border-neutral-200 dark:border-neutral-800 border-b-2">
        <p className="font-semibold text-md text-black dark:text-white">
          {profile?.name}
        </p>
        <Button
          className="ml-auto"
          variant={"ghost"}
          onClick={() => {
            onOpen("editProfile", { profile: profile });
          }}
        >
          <Edit2 />
        </Button>
      </div>
      <div className="m-5">You are on {profile?.name + "'s page! :)"}</div>
      <div className="m-5"></div>
    </div>
  );
};

export default ProfileIdPage;
