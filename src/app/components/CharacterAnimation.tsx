"use client";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Character from "@/app/components/Character";
import {AnimatePresence, motion} from "motion/react";

gsap.registerPlugin(MorphSVGPlugin);

const inkPaths = {
    hidden: "M200,300 C314,500 315,299 275,235 Z",
    visible: "M302.2 149.637C301.59 161.817 311.64 171.687 307.66 182.847C303.54 194.407 308.92 208.787 301.74 218.877C294.47 229.137 289.23 242.657 279.38 250.987C269.54 259.337 255.901 266.337 244.021 272.297C232.321 278.207 219.648 276.537 206.478 279.687C193.758 282.737 177.691 279.727 164.011 279.687C150.321 279.657 136.331 285.657 123.811 282.557C110.851 279.337 97.9406 274.627 86.6606 268.517C75.2106 262.297 63.4106 255.097 54.1706 246.357C44.9206 237.597 42.3506 223.907 35.8306 213.107C29.3906 202.437 10.1989 198.304 6.91888 186.144C3.73888 174.384 -0.220424 167.558 0.00957592 154.848C0.319138 137.747 7.731 129.243 17.8927 105.67C32.1179 84.677 33.6728 88.0057 40.6528 77.6257C47.7428 67.1257 49.4599 47.6368 59.0806 39.387C68.7013 31.1372 79.4006 24.247 91.4706 18.537C103.391 12.927 117.88 6.53191 133.311 11.027C152.444 16.6008 159.001 23.897 173.051 24.437C187.101 24.977 206.171 -3.28298 219.051 0.317015C232.371 4.02702 243.971 17.647 255.461 24.057C267.101 30.537 264.58 51.107 273.83 59.867C283.06 68.607 293.41 74.117 299.76 84.677C306 95.067 309.45 104.737 312.41 116.457C315.26 127.767 302.82 137.457 302.2 149.637Z",
};

export default function CharacterAnimation() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            gsap.to("#ink-path", {
                morphSVG: inkPaths.visible,
                duration: 2.5,
                ease: "power1.inOut",
            });
        } else {
            gsap.to("#ink-path", {
                morphSVG: inkPaths.hidden,
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
                    d={inkPaths.hidden}
                    fill="black"
                />
            </svg>

            {/* overlay content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-start gap-[2vh] xl:gap-[1.5vw] z-[101] p-[2vh] xl:p-[2vw] pointer-events-none
                        text-white text-[2vh] xl:text-[1.5vw] font-medium [&_p]:w-full"
                        initial={{opacity: 0}}
                        animate={{ opacity: 1, transition: { duration: 1, delay: 1.2, ease: "easeOut" } }}
                        exit={{ opacity: 0, transition: { duration: 0.5, delay: 0, ease: "easeIn" } }}
                    >
                        <article className="flex flex-col items-center gap-[2vh] xl:gap-[1.5vw] w-11/12 xl:w-9/12">
                            <h2 className="font-fornire font-normal text-[5.5vh] xl:text-[5vw]">Why timed drawing?</h2>
                            <p>Timed drawing is one of the best ways to improve at figure drawing. Since there’s no time to get hung up on mistakes, you simply <span className="font-bold">draw more</span>—and the more you draw, the faster you improve.</p>
                            <p>It forces you to focus on the big shapes and proportions rather than getting lost in the details.</p>
                            <p className="hidden xl:inline">It also gives you the skills to sketch in the real world. When you can capture the essentials in 30 or 60 seconds, you can draw people at the park or on the subway who won&#39;t sit still for you.</p>
                            <p className="">Tips to keep it fun:</p>
                            <ul className="flex flex-col gap-[1vh] xl:gap-[0.5vw] [&_li]:flex [&_li]:gap-[1vh] [&_li]:xl:gap-[0.5vw]">
                                <li>
                                    <span>&#9671;</span>
                                    <div><span className="font-bold">Reset your goal.</span> Gesture drawings aren&#39;t meant to look good—focus on finishing the drawing in the given time and fill the page with shapes that even loosely capture the gesture. <span className="hidden xl:inline">If it helps, toss the drawings after so you don’t have to look at them.</span></div>
                                </li>
                                <li>
                                    <span>&#9671;</span>
                                    <div><span className="font-bold">Don’t Overdo It.</span> Start with 30-minute sessions so you don&#39;t burn out. <span className="hidden xl:inline">It’s a great high-intensity warm-up before you move on to more relaxed art.</span></div>
                                </li>
                                <li>
                                    <span>&#9671;</span>
                                    <div><span className="font-bold">Start Fast.</span> Always begin with your shortest poses (1 to 2 minutes). It loosens you up so that by the time you hit a 5-minute pose, you feel like you have all the time in the world.</div>
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