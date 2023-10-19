"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Badge as BD } from "@prisma/client";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export const EditBadgeButton = ({ badge, className }: { badge: BD, className?: string }) => {
    const { onOpen } = useModal();
    return (
        <Button
            onClick={() => onOpen("editBadge", { badge })}
            className={cn("", className)}
            variant="ghost"
            size="icon"
        >
            <Edit className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
        </Button>
    );
};
