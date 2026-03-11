"use client";
import {gsap} from "gsap";
import {MorphSVGPlugin} from "gsap/MorphSVGPlugin";
import {useEffect} from "react";
import {inkPathsTtB} from "@/app/lib/inkPaths";

gsap.registerPlugin(MorphSVGPlugin);

export default function PageTransition({ playing }: { playing: boolean }) {
    useEffect(() => {
        if (playing) {
            gsap.to("#transition-ink-path", {
                morphSVG: inkPathsTtB.visible,
                duration: 2,
                ease: "power1.inOut",
            });
        }
    }, [playing]);

    return (
        <>
            {/* Full screen SVG overlay */}
            <svg
                className="fixed inset-0 w-full h-full z-[100] pointer-events-none"
                viewBox="80 30 180 200"
                preserveAspectRatio="none"
            >
                <path
                    id="transition-ink-path"
                    d={inkPathsTtB.hidden}
                    fill="#101010"
                />
            </svg>
        </>
    );
}