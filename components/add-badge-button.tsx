"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

/**
 * Add badge button. Opens the add badge modal.
 */
export const AddBadgeButton = () => {
	const { onOpen } = useModal();
	return (
		<Button onClick={() => onOpen("addBadge")} variant="ghost" size="icon">
			<Plus className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
		</Button>
	);
};
