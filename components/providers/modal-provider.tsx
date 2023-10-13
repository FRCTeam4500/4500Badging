"use client";

import { useEffect, useState } from "react";
import { EditProfileSelfModal } from "../modals/edit-profile-self-modal";

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
    </>
  );
};
