import { Badge, Profile } from "@prisma/client";
import { create } from "zustand";

/**
 * The type of modal that can be opened.
 */
export type ModalType =
  | "editBadge"
  | "editProfile"
  | "editProfileSelf"
  | "addBadge"
  | "addProfile";

/**
 * The data that can be passed to the modal.
 */
interface ModalData {
  badge?: Badge;
  accessor?: Profile;
  profile?: Profile;
  apiUrl?: string;
  query?: Record<string, any>;
}

/**
 * The modal store.
 */
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

/**
 * A store for managing the modal state.
 */
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
