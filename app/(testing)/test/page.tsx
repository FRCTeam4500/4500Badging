"use client"

import { useIsVisible } from "@/hooks/use-is-visible";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

export default function Loading() {
	return (
		<div className="h-screen flex items-center justify-center">
			<Loader2 className="h-4 w-4 animate-spin" />
		</div>
	)
}