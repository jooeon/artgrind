"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";

type Pin = {
    id: string;
    title: string;
    media: {
        images: {
            "150x150": { width: number; height: number; url: string };
            "400x300": { width: number; height: number; url: string };
            "600x": { width: number; height: number; url: string };
            "1200x": { width: number; height: number; url: string };
        };
    };
};

type Props = {
    pins: Pin[];
    rounds: number;
    timePerImage: number; // in seconds
    warnIntervals: number[];
};

function getRandomOrder(pins: Pin[], rounds: number): Pin[] {
    const shuffled = [...pins].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, rounds);
}

// format time in seconds to mm:ss
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function PracticeSession({ pins, rounds, timePerImage, warnIntervals }: Props) {
    const [queue] = useState<Pin[]>(() => getRandomOrder(pins, rounds));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timePerImage);
    const [isPaused, setIsPaused] = useState(false);
    const [isSessionOver, setIsSessionOver] = useState(false);
    const [stopClicked, setStopClicked] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        if (warnIntervals.includes(timeLeft)) {
            const audio = new Audio("/audio/chime.mp3");
            audio.volume = 0.5;
            audio.play();
        }

        if (timeLeft === 0) {
            if (currentIndex < queue.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setTimeLeft(timePerImage);
            } else {
                setIsSessionOver(true);
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, currentIndex, isPaused]);

    const currentPin = queue[currentIndex];

    return (
        <div className="min-h-[100vh] relative flex justify-center">
            <div className="relative h-fit">
                <img src={currentPin.media.images["1200x"].url} alt="current_practice_image"
                     className={`object-cover xl:h-screen xl:max-h-screen ${isPaused ? 'opacity-70' : 'opacity-100'}`} />
                <p className="absolute right-[1vh] xl:bottom-[0.25vw] top-full xl:top-auto xl:right-full xl:pr-[0.6vw] text-gray-dark font-semibold text-[2vh] xl:text-[1.25vw]">
                    {currentIndex+1}/{rounds}
                </p>
            </div>
            <div className="flex gap-[1vh] xl:gap-[2vw] absolute bottom-0 xl:top-0 left-0 pl-[0.75vw] text-white font-bold text-[3.5vh] xl:text-[3vw]">
                <p className={`${isPaused ? 'text-gray-light' : ''}`}>{formatTime(timeLeft)}</p>
                {isPaused && (
                    <p className="">PAUSED</p>
                )}
            </div>
            {/* Controls UI */}
            <div
                className="flex flex-col justify-center items-center gap-[1vw] absolute right-0 h-[100vh] w-[3vw] bg-white">
                {/* Play/Pause */}
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="cursor-pointer"
                >
                    <div className="w-6 h-6 xl:w-[1vw] xl:h-[1vw] flex items-center justify-center">
                        {isPaused ?
                            <svg viewBox="0 0 20 23" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.5 10.5278C20.1667 10.9127 20.1667 11.8749 19.5 12.2598L1.5 22.6521C0.833331 23.037 -1.09987e-06 22.5559 -1.06622e-06 21.7861L-1.57697e-07 1.00149C-1.24048e-07 0.231692 0.833334 -0.249432 1.5 0.135468L19.5 10.5278Z"
                                    fill="#131313"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"
                                 fill="none">
                                <path d="M7 1H2V15H7V1Z" fill="#131313"/>
                                <path d="M14 1H9V15H14V1Z" fill="#131313"/>
                            </svg>
                        }
                    </div>
                </button>
                {/* Forward */}
                <button
                    onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                        setTimeLeft(timePerImage);
                    }}
                    disabled={currentIndex === rounds - 1}
                    className="cursor-pointer"
                >
                    <div className="w-6 h-6 xl:w-[1vw] xl:h-[1vw] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_40_130)">
                                <path
                                    d="M10.6848 1.61016C10.8501 1.52924 11.0413 1.55269 11.1832 1.66176L23.8217 11.6312C23.9308 11.7226 24 11.8563 24 11.9982C24 12.1401 23.9308 12.2797 23.8217 12.3688L11.1844 22.3371C11.0988 22.4039 10.9932 22.4379 10.8924 22.4379L10.686 22.391C10.5241 22.3159 10.4221 22.1506 10.4221 21.9688V2.03234C10.4221 1.85526 10.5241 1.68638 10.6848 1.61016Z"
                                    fill="#131313"/>
                                <path
                                    d="M0.261732 1.61016C0.428261 1.52924 0.619417 1.55269 0.761317 1.66176L13.3999 11.6312C13.5101 11.7226 13.5781 11.8563 13.5781 11.9982C13.5781 12.1401 13.5089 12.2797 13.3999 12.3688L0.761317 22.3371C0.676881 22.4039 0.571336 22.4379 0.470481 22.4379L0.261732 22.391C0.101068 22.3159 0.000213623 22.1506 0.000213623 21.9688V2.03234C0.000213623 1.85526 0.101068 1.68638 0.261732 1.61016Z"
                                    fill="#131313"/>
                            </g>
                        </svg>
                    </div>
                </button>
                {/* Backward */}
                <button
                    onClick={() => {
                        setCurrentIndex(currentIndex - 1);
                        setTimeLeft(timePerImage);
                    }}
                    disabled={currentIndex == 0}
                    className="cursor-pointer"
                >
                    <div className="w-6 h-6 xl:w-[1vw] xl:h-[1vw] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_40_124)">
                                <path
                                    d="M13.3152 1.61016C13.1499 1.52924 12.9587 1.55269 12.8168 1.66176L0.178256 11.6312C0.0691913 11.7226 0 11.8563 0 11.9982C0 12.1401 0.0691913 12.2797 0.178256 12.3688L12.8156 22.3371C12.9012 22.4039 13.0068 22.4379 13.1076 22.4379L13.314 22.391C13.4759 22.3159 13.5779 22.1506 13.5779 21.9688V2.03234C13.5779 1.85526 13.4759 1.68638 13.3152 1.61016Z"
                                    fill="#131313"/>
                                <path
                                    d="M23.7383 1.61016C23.5717 1.52924 23.3806 1.55269 23.2387 1.66176L10.6001 11.6312C10.4899 11.7226 10.4219 11.8563 10.4219 11.9982C10.4219 12.1401 10.4911 12.2797 10.6001 12.3688L23.2387 22.3371C23.3231 22.4039 23.4287 22.4379 23.5295 22.4379L23.7383 22.391C23.8989 22.3159 23.9998 22.1506 23.9998 21.9688V2.03234C23.9998 1.85526 23.8989 1.68638 23.7383 1.61016Z"
                                    fill="#131313"/>
                            </g>
                        </svg>

                    </div>
                </button>
                {/* Stop */}
                <button
                    onClick={() => {
                        setStopClicked(true);
                        setIsPaused(true)
                    }}
                    disabled={stopClicked}
                    className="cursor-pointer"
                >
                    <div className="w-6 h-6 xl:w-[1vw] xl:h-[1vw] flex items-center justify-center">
                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="16" height="16" rx="1" fill="#131313"/>
                        </svg>
                    </div>
                </button>
            </div>
            {stopClicked && (
                <motion.div
                    className="fixed w-full h-full flex justify-center items-center"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{
                        duration: 0.3,
                        ease: "easeIn",
                    }}
                    onClick={() => setStopClicked(false)}
                >
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-60"/>
                    <motion.div
                        className="relative w-[80vw] xl:w-[50vw] h-fit flex flex-col gap-[3vh] xl:gap-[1.5vw]
                            px-[3vh] py-[3vh] xl:p-[1.5vw] xl:text-[1vw] text-white"
                        initial={{opacity: 0, y: 40}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                            delay: 0.1,
                            duration: 0.4,
                            ease: [0.76, 0, 0.24, 1],
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* X button */}
                        <button
                            onClick={() => setStopClicked(false)}
                            className="absolute top-[0.75vw] right-[1vw] z-20 text-white cursor-pointer"
                        >
                            ✕
                        </button>

                        <p className="z-10 text-center text-[4vw] font-fornire leading-none lowercase">Would you really like to quit?</p>
                        <div className="z-10 m-auto">
                            <Link href="/setup" className="button button-white w-fit">
                                Quit
                            </Link>
                        </div>
                        {/* shadow box */}
                        <div className="absolute inset-0 translate-y-4 rounded-xl bg-white"></div>
                        {/* main box */}
                        <div className="absolute inset-0 border-3 border-white rounded-xl bg-black"></div>
                    </motion.div>
                </motion.div>
            )}
            {isSessionOver &&
                <motion.div
                    className="fixed w-full h-full flex justify-center items-center"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{
                        duration: 1.3,
                        ease: "easeIn",
                    }}
                >
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-60">
                    </div>
                    <motion.div
                        className="relative w-[80vw] xl:w-[50vw] h-fit flex flex-col gap-[3vh] xl:gap-[1.5vw]
                        px-[3vh] py-[3vh] xl:p-[1.5vw] xl:text-[1vw] text-white"
                        initial={{opacity: 0, y: 10, filter: "blur(10px)"}}
                        animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                        transition={{
                            duration: 0.4,
                            delay: 1.4,
                            ease: "easeOut",
                        }}
                    >
                        <p className="z-10 text-center text-[4vw] font-fornire leading-none lowercase">Practice session
                            complete.</p>
                        <p className="z-10 text-center text-[1.35vw] font-semibold">Congratulations! You&#39;ve completed the
                            practice session you&#39;ve committed to.</p>
                        <div className="z-10 m-auto">
                            <Link href="/setup" className="button button-white w-fit">
                                Finish
                            </Link>
                        </div>
                        {/* shadow box */}
                        <div className="absolute inset-0 translate-y-4 rounded-xl bg-white"></div>
                        {/* main box */}
                        <div className="absolute inset-0 border-3 border-white rounded-xl bg-black"></div>
                    </motion.div>
                </motion.div>
            }
        </div>
    );
}