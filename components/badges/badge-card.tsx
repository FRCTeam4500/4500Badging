import { Badge } from "@prisma/client";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
	badge: Badge;
	className: string;
}

export function BadgeCard({ badge, className }: BadgeCardProps) {
	return (
		<div className={cn("bg-white shadow overflow-hidden", className)}>
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg leading-6 font-medium text-gray-900">{badge.name}</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">{badge.description}</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-4 sm:px-6">
				<dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
					<div className="sm:col-span-1">
						<dt className="text-sm font-medium text-gray-500">Subteam</dt>
						<dd className="mt-1 text-sm text-gray-900">{badge.subteamType}</dd>
					</div>
					<div className="sm:col-span-1">
						<dt className="text-sm font-medium text-gray-500">Level</dt>
						<dd className="mt-1 text-sm text-gray-900">{badge.level}</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
