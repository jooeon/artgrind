"use client";
import React, {useEffect, useRef, useState} from "react";
import Character from "@/app/components/Character";
import { motion } from "motion/react";

export default function ProfilePanel({ username }: { username: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="absolute top-0 right-0 flex flex-col items-end
                        px-[0.5vh] xl:px-[0.25vw] py-[0.5vh] xl:py-[0.25vw] text-[1.5vh] xl:text-[1vw]">
            <div className="group flex items-start pointer-events-none">
                {/* text bubble */}
                <motion.div
                    className="relative w-fit px-4 py-2 bg-black text-white rounded-2xl rounded-br-none xl:mt-1 3xl:mt-2"
                    initial="rest"
                    variants={{
                        rest: {opacity: 0, pointerEvents: "none"},
                        hover: {opacity: 1, pointerEvents: "none"},
                    }}
                    animate={isOpen ? "hover" : "rest"}
                    transition={{
                        delay: 0,
                        duration: 0.4,
                        ease: "easeIn"
                    }}
                >
                    <p className="text-[2vh] xl:text-[0.9vw] leading-none">Hi, {username}.</p>
                    {/* tail */}
                    <div className="absolute bottom-0 -right-2 w-0 h-0
                            border-l-[10px] border-l-black
                            border-t-[10px] border-t-transparent">
                    </div>
                </motion.div>
                <motion.div
                    ref={containerRef}
                    className="flex flex-col items-end pointer-events-auto"
                    onHoverStart={() => setIsOpen(true)}
                    onHoverEnd={() => setIsOpen(false)}
                >
                    {/* character icon */}
                    <motion.button onClick={() => setIsOpen(prev => !prev)}
                                   className="h-[5vh] w-[5vh] xl:h-[2.5vw] xl:w-[2.5vw]"
                                   variants={{
                                       rest: {rotate: 0},
                                       hover: {rotate: -5},
                                   }}
                                   animate={isOpen ? "hover" : "rest"}
                                   transition={{
                                       delay: 0,
                                       duration: 0.1,
                                       ease: "easeIn"
                                   }}
                    >
                        <Character/>
                    </motion.button>
                    <motion.a
                        href="/api/auth/logout"
                        className="font-bold hover:underline xl:pb-[1vw] text-[2vh] xl:text-[1vw]"
                        initial="rest"
                        variants={{
                            rest: {opacity: 0, y: 0},
                            hover: {opacity: 1, y: 6},
                        }}
                        animate={isOpen ? "hover" : "rest"}
                        transition={{
                            delay: 0,
                            duration: 0.1,
                            ease: "easeIn"
                        }}
                    >
                        [Logout]
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
}