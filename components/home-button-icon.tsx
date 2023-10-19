"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Profile } from "@prisma/client";
import { Edit2Icon, Home } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const HomeButtonIcon = ({ className }: { className?: string }) => {
    const router = useRouter()
    return (
        <Button className={cn("", className)} onClick={() => router.push("/")} variant="ghost" size="icon">
            <Home className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
        </Button>
    );
};
