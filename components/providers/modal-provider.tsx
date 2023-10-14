"use client";

import { useEffect, useState } from "react";
import { EditPhoneSelfModal } from "@/components/modals/edit-phone-self-modal";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { AddBadgeModal } from "@/components/modals/add-badge-modal";
import { EditBadgeModal } from "../modals/edit-badge-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <EditPhoneSelfModal />
      <EditProfileModal />
      <AddBadgeModal />
      <EditBadgeModal />
    </>
  );
};
