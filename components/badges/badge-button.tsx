"use client"

import { Badge as BD } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"

interface BadgeProps {
	innerRef?: React.Ref<HTMLButtonElement>,
	badge: BD
}

export const BadgeButton = React.forwardRef(({ badge }: BadgeProps, ref: React.Ref<HTMLButtonElement>) => {
	const router = useRouter()
	return (
		<button ref={ref} onClick={() => { router.push(`/badges/${badge.id}`) }} className="relative px-7 py-4 bg-secondary rounded-lg leading-none flex felx-col items-center divide-x divide-gray-600">
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
	)
})

export default BadgeButton;