"use client";

import { useEffect, useState } from "react";
import { EditProfileSelfModal } from "@/components/modals/edit-profile-self-modal";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { AddBadgeModal } from "@/components/modals/add-badge-modal";

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
      <EditProfileSelfModal />
      <EditProfileModal />
      <AddBadgeModal />
    </>
  );
};
