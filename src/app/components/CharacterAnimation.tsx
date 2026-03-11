"use client";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Character from "@/app/components/Character";
import {AnimatePresence, motion} from "motion/react";
import {inkPathsBRtT} from "@/app/lib/inkPaths";

gsap.registerPlugin(MorphSVGPlugin);

export default function CharacterAnimation() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            gsap.to("#ink-path", {
                morphSVG: inkPathsBRtT.visible,
                duration: 2.5,
                ease: "power1.inOut",
            });
        } else {
            gsap.to("#ink-path", {
                morphSVG: inkPathsBRtT.hidden,
                duration: 1.5,
                ease: "power1.inOut",
            });
        }
    }, [isOpen]);

    return (
        <>
            {/* Full screen SVG overlay */}
            <svg
                className="fixed inset-0 w-full h-full z-[100] pointer-events-none"
                viewBox="80 30 180 200"
                preserveAspectRatio="none"
                style={{pointerEvents: isOpen ? "auto" : "none"}}
                onClick={() => setIsOpen(false)}
            >
                <path
                    id="ink-path"
                    d={inkPathsBRtT.hidden}
                    fill="black"
                />
            </svg>

            {/* overlay content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-start gap-[2vh] xl:gap-[1.5vw] z-[101] p-[2vh] xl:p-[2vw] pointer-events-none
                        text-white text-[2vh] xl:text-[1.5vw] font-light [&_p]:w-full"
                        initial={{opacity: 0}}
                        animate={{ opacity: 1, transition: { duration: 1, delay: 1.2, ease: "easeOut" } }}
                        exit={{ opacity: 0, transition: { duration: 0.5, delay: 0, ease: "easeIn" } }}
                    >
                        <article className="flex flex-col items-center gap-[2vh] xl:gap-[1.5vw] w-11/12 xl:w-9/12">
                            <h2 className="font-fornire lowercase font-normal text-[5.5vh] xl:text-[5vw]">Why timed drawing?</h2>
                            <p>Timed drawing is one of the best ways to improve at figure drawing. Since there’s no time to get hung up on mistakes, you simply <span className="font-semibold">draw more</span>—and the more you draw, the faster you improve.</p>
                            <p>It forces you to focus on the main shapes and proportions rather than getting lost in the details.</p>
                            <p className="hidden xl:inline">It also gives you the skills to sketch in the real world. When you can capture the essentials in 30 or 60 seconds, you can draw people at the park or on the subway who won&#39;t sit still for you.</p>
                            <p className="">Tips to keep it fun:</p>
                            <ul className="flex flex-col gap-[1vh] xl:gap-[0.5vw] [&_li]:flex [&_li]:gap-[1vh] [&_li]:xl:gap-[0.5vw]">
                                <li>
                                    <span>&#9671;</span>
                                    <div><span className="font-semibold">Reset your goal.</span> Gesture drawings
                                        aren&#39;t meant to look good. Focus on finishing the drawing in the given time
                                        and fill the page with shapes that loosely capture the gesture. <span
                                            className="hidden xl:inline">If it helps, toss the drawings after so you don’t have to look at them.</span>
                                    </div>
                                </li>
                                <li>
                                    <span>&#9671;</span>
                                    <div><span className="font-semibold">Start Fast.</span> Always begin with your
                                        shortest poses (1 to 2 minutes). It loosens you up so that by the time you hit a
                                        5-minute pose, you feel like you have all the time in the world.
                                    </div>
                                </li>
                                <li>
                                    <span>&#9671;</span>
                                    <div><span className="font-semibold">Don’t Overdo It.</span> Start with 30-minute
                                        sessions so you don&#39;t burn out. <span className="hidden xl:inline">It’s a great high-intensity warm-up before you move on to more relaxed art.</span>
                                    </div>
                                </li>
                            </ul>
                            <p>Happy drawing!</p>
                        </article>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* character */}
            <div className="fixed bottom-[-5vw] right-0 h-[15vw] w-[15vw] z-[102] mix-blend-difference">
                <motion.div
                    initial={{y: 200}}
                    animate={{y: 0}}
                    transition={{duration: 2, delay: 1.4, ease: "easeInOut"}}
                    onClick={() => setIsOpen(prev => !prev)}
                    data-clickable="true"
                    className="cursor-pointer"
                >
                    <Character/>
                </motion.div>
            </div>
        </>
    );
}