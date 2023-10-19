"use client"

import { EditProfileSelfButton } from "@/components/edit-profile-self-button";
import { ModeToggle } from "@/components/mode-toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserButton } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import Image from "next/image";
import { BadgeButton } from "@/components/badges/badge-button";
import { useRef } from "react";
import { useIsVisible } from "@/hooks/use-is-visible";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface HomeCompProps {
	userBadges: any,
	profile: Profile,
	requirements: any
}

export default function HomeComp({ userBadges, profile, requirements }: HomeCompProps) {

	const router = useRouter()
	const a = useRef(null)
	const aVis = useIsVisible(a)

	return (
		<div ref={a} className={`transition-opacity ease-in duration-700 ${aVis ? "opacity-100" : "opacity-0"}`}>
			<div className="flex mt-3 items-center justify-center">
				<UserButton />
				<ModeToggle className="ml-2" />
				<EditProfileSelfButton profile={profile} />
			</div>
			<h1 className="text-2xl lg:text-4xl md:text-4xl p-4 mb-4 xl:text-4xl 2xl:text4xl font-bold text-center">
				Hello, {profile.name}
			</h1>

			{/* Requirements :D */}
			<div className="flex flex-col items-center justify-center mb-4">
				<h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
					Your Requirements
				</h2>

				<TooltipProvider>
					<div className="flex flex-col select-none justify-center md:flex-row lg:flex-row xl:flex-row 2xl:flex-row 3xl:flex-row rounded-2xl shadow-2xl p-12 gap-5">
						<Tooltip>
							<TooltipTrigger asChild>
								<Image
									src={
										requirements.registrationRecieved
											? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
											: "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
									}
									alt="IsRegistered"
									width={75}
									height={100}
								/>
							</TooltipTrigger>
							<TooltipContent>
								{requirements.registrationRecieved
									? "You have Registered With FIRST"
									: "You have not registered with FIRST"}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Image
									src={
										requirements.lv3Recieved
											? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
											: "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
									}
									alt="IsLv3"
									width={75}
									height={100}
								/>
							</TooltipTrigger>
							<TooltipContent>
								{requirements.lv3Recieved
									? "You have recieved Level 3 in at least one subteam"
									: "You have not recieved a Level 3 in one subteam"}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Image
									src={
										requirements.blueRecieved
											? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
											: "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
									}
									alt="IsBlue"
									width={75}
									height={100}
								/>
							</TooltipTrigger>
							<TooltipContent>
								{requirements.blueRecieved
									? "You have at least one level outside your subteam"
									: "You have not recieved a badge outside your subteam"}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Image
									src={
										requirements.scoutingRecieved
											? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
											: "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
									}
									alt="IsScouting"
									width={75}
									height={100}
								/>
							</TooltipTrigger>
							<TooltipContent>
								{requirements.scoutingRecieved
									? "You have recieved your Scouting badge"
									: "You have not recieved your Scouting badge"}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Image
									src={
										requirements.outreachRecieved
											? "https://docs.google.com/drawings/d/e/2PACX-1vRmP_HkWIgWetZb4osHvPxHHonjQ0ZvIo9yvma0a88kK7pN997AM9w87nzbhV37ssOXFwf4c0-p6EVX/pub?w=708&h=708"
											: "https://docs.google.com/drawings/d/e/2PACX-1vTK2icWGhuAt7ZtnMNdm69sHTQmZO2LOVWXn7GcVaNuTApgI_aObwCYh7eWdn5KDPA_p_i0ufmLygXK/pub?w=708&h=708"
									}
									alt="IsOutreach"
									width={75}
									height={100}
								/>
							</TooltipTrigger>
							<TooltipContent>
								{requirements.outreachRecieved
									? "You have recieved your Outreach badge"
									: "You have not recieved your Outreach badge"}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Image
									src={
										requirements.travelRecieved
											? "/prepared-to-travel-true.png"
											: "/prepared-to-travel-false.png"
									}
									alt="IsTravel"
									width={100}
									height={100}
								/>
							</TooltipTrigger>
							<TooltipContent>
								{requirements.travelRecieved
									? "You are eligible to travel to competition"
									: "You are not eligible to travel to competition"}
							</TooltipContent>
						</Tooltip>
					</div>
				</TooltipProvider>
			</div>

			{userBadges.length > 0 ? (
				<div className="flex flex-col items-center justify-center">
					<Button className="my-6" onClick={() => router.push("/badges")}>View All Badges</Button>
					<h2 className="text-xl text-muted-foreground lg:text-2xl md:text-2xl p-4 mb-4 xl:text-2xl 2xl:text2xl font-bold text-center">
						Your Badges
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2 rounded-2xl shadow-2xl p-12 gap-3">
						<TooltipProvider>
							{userBadges.map((badge) => (
								<div key={badge.id} className="px-8 py-4">
									<div className="grid gap-8 items-start justify-center">
										<div className="relative group">
											<div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
											<Tooltip>
												<BadgeButton badge={badge?.badge} />
												<TooltipContent>
													<div className="flex flex-col p-2 max-w-sm items-center justify-center">
														{badge.badge.subteamType}&apos;s Level{" "}
														{badge.badge.level} Badge
													</div>
												</TooltipContent>
											</Tooltip>
										</div>
									</div>
								</div>
							))}
						</TooltipProvider>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 shadow-2xl mt-14 p-12 gap-3">
					<TooltipProvider>
						<div className="flex flex-col items-center justify-center">
							<Button onClick={() => router.push("/badges")}>View All Badges</Button>
							<h1 className="text-2xl lg:text-4xl md:text-4xl xl:text-4xl 2xl:text4xl p-10 font-bold text-center">
								You have no badges yet!
							</h1>
						</div>
					</TooltipProvider>
				</div>
			)}
		</div>
	)
}