"use client"

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
          <button className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8"
            onClick={() => router.push("/coach/profiles")}>
            <div className="flex-1">
              <h3 className="scroll-m-20 text-purple-400 text-2xl font-semibold tracking-tight">
                Manage Profiles
              </h3>
            </div>
            <div>
              <div className="w-24 h-6 rounded-lg bg-purple-300"></div>
            </div>
          </button>
          <button className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8"
            onClick={() => router.push("/badges")}>
            <div className="flex-1">
              <h3 className="scroll-m-20 text-red-400 text-2xl font-semibold tracking-tight">
                Manage Badges
              </h3>
            </div>
            <div>
              <div className="w-28 h-6 rounded-lg bg-pink-300"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}