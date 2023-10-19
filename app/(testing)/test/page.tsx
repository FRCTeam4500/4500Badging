"use client"

import { useIsVisible } from "@/hooks/use-is-visible";
import { useRef } from "react";

export default function Page() {
    const ref1 = useRef(null);
    const isVisible1 = useIsVisible(ref1);

    const ref2 = useRef(null);
    const isVisible2 = useIsVisible(ref2);

    const ref3 = useRef(null);
    const isVisible3 = useIsVisible(ref3);

    return (
        <>
            <div ref={ref1} className={`transition-opacity ease-in duration-700 ${isVisible1 ? "opacity-100" : "opacity-0"}`}>
                <>...your custom component here...</>
            </div>
            <div ref={ref2} className={`transition-opacity ease-in duration-700 ${isVisible2 ? "opacity-100" : "opacity-0"}`}>
                <>...your custom component here...</>
            </div>
            <div ref={ref3} className={`transition-opacity ease-in duration-700 ${isVisible3 ? "opacity-100" : "opacity-0"}`}>
                <>...your custom component here...</>
            </div>
        </>
    )
}