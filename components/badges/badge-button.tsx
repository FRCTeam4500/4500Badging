"use client"

import { Badge as BD } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { Ref } from "react"
import { TooltipTrigger } from "@/components/ui/tooltip"

export const BadgeButton = React.forwardRef(({ badge, className }: { badge: BD, className?: string }, ref) => {
	const router = useRouter()
	return (
		<TooltipTrigger asChild>
			<button onClick={() => { router.push(`/badges/${badge.id}`) }} className="relative px-7 py-4 bg-secondary rounded-lg leading-none flex felx-col items-center divide-x divide-gray-600">
				<span className="flex w-60 items-center space-x-5">
					<div>{" " + badge.level}</div>
					<Avatar>
						<AvatarImage
							src={badge.imageUrl}
							alt={badge.name}
						/>
						<AvatarFallback>
							<Badge size={48} />
						</AvatarFallback>
					</Avatar>
					<span className="pr-2 w-36 text-left overflow-x-hidden py-1 whitespace-nowrap overflow-ellipsis">
						{badge.name}
					</span>
				</span>
				<div className="pl-6 text-indigo-400 group-hover:text-primary transition duration-200">
					See Desc.{" "}
					<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
						-&gt;
					</span>
				</div>
			</button>
		</TooltipTrigger>
	)
})

BadgeButton.displayName = 'BadgeButton';
export default BadgeButton;