"use client"

import { BadgeCent, BadgeIcon, BadgeRussianRuble, User } from "lucide-react";
import { useRouter } from "next/navigation";


export function GradButtons() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center px-16">
      <div className="relative w-full max-w-lg">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="m-8 relative space-y-4">
          <button className="p-5 bg-white rounded-lg text-purple-400 flex items-center justify-between space-x-8 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-200 hover:text-blue-600"
            onClick={() => router.push("/coach/profiles")}>
            <div className="flex-1">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Manage Profiles
              </h3>
            </div>
            <div>
              <div className="h-6 rounded-lg">
                <User />
              </div>
            </div>
          </button>
          <button className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-200 duration-200 text-red-400 hover:text-blue-600"
            onClick={() => router.push("/badges")}>
            <div className="flex-1">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Manage Badges
              </h3>
            </div>
            <div>
              <div className="h-6 rounded-lg">
                <BadgeRussianRuble />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}