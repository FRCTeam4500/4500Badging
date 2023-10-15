"use client";

import { LucideHome } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const BackToHome = () => {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <button
      onClick={() => {
        router.push("/");
      }}
      className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
    >
      <LucideHome className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
        Back To Home
      </p>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
        <span className="text-xs">⌘</span>C
      </kbd>
    </button>
  );
};
