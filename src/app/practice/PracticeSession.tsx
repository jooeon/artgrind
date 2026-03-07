"use client";
import React, {useState, useEffect, useRef} from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {formatTime} from "@/app/Utils";

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
    timePerImage: number | null;
    warnIntervals: number[];
    boardId: string;
};

function getRandomOrder(pins: Pin[], rounds: number): Pin[] {
    const shuffled = [...pins].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, rounds);
}

export default function PracticeSession({ pins, rounds, timePerImage, warnIntervals, boardId }: Props) {
    // NOTE: if timePerImage is null, that means time is unlimited
    const [queue] = useState<Pin[]>(() => {
        const excludedMap = JSON.parse(localStorage.getItem("artgrind_excluded_pins") ?? "{}");
        const excluded: string[] = excludedMap[boardId] ?? [];
        const availablePins = pins.filter(p => !excluded.includes(p.id));
        return getRandomOrder(availablePins, rounds);
    });
    // const [queue] = useState<Pin[]>(() => getRandomOrder(pins, rounds));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(timePerImage ?? 0);
    const [isPaused, setIsPaused] = useState(true);
    const [isSessionOver, setIsSessionOver] = useState(false);
    const currentPin = queue[currentIndex];
    const [stopClicked, setStopClicked] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);
    const [started, setStarted] = useState(false);
    // Audio locked on iOS until first user interaction, bypass this by adding a touch event that unlocks it
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    const handleStart = () => {
        audioContextRef.current = new AudioContext();
        audioContextRef.current.resume();
        setStarted(true);
        setIsPaused(false);
    };

    // Control UI hide after certain time
    const resetHideTimer = () => {
        setControlsVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    };

    // reveal control UI when clicking on screen
    useEffect(() => {
        resetHideTimer();
        // window.addEventListener("mousemove", resetHideTimer);
        window.addEventListener("click", resetHideTimer);

        return () => {
            // window.removeEventListener("mousemove", resetHideTimer);
            window.removeEventListener("click", resetHideTimer);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, []);

    // setStarted(true) on desktop, only have "tap to begin" happen on mobile
    useEffect(() => {
        const mobile = window.matchMedia("(hover: none)").matches;
        setIsMobileDevice(mobile);
        if (!mobile) {
            handleStart();
        }
    }, []);

    const playChime = async () => {
        try {
            if (!audioContextRef.current) {
                console.log("no audio context");
                return;
            }

            if (!audioBufferRef.current) {
                const response = await fetch("/audio/chime.mp3");
                const arrayBuffer = await response.arrayBuffer();
                audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
            }

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(audioContextRef.current.destination);
            source.start(0);
        } catch (e) {
            console.log("playChime error:", e);
        }
    };

    // play chime at intervals and tick down timer
    useEffect(() => {
        if (isPaused || timePerImage === null) return;

        if (warnIntervals.includes(timeLeft)) {
            playChime();
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
    }, [timeLeft, currentIndex, isPaused, timePerImage]);

    if (isMobileDevice === null) return null;

    // "tap to begin" overlay for mobile (on desktop started is set to true above)
    if (!started) {
        return (
            <div
                className="w-full h-[100dvh] flex items-center justify-center bg-black"
                onClick={handleStart}
            >
                <p className="text-white font-fornire lowercase text-[5vh] xl:text-[5vw] leading-none">Tap to begin!</p>
            </div>
        );
    }

    return (
        <div className="h-dvh xl:min-h-[100dvh] relative flex flex-col items-center">
            <div className="relative h-fit">
                <img src={currentPin.media.images["1200x"].url} alt="current_practice_image"
                     className={`object-cover max-h-[90dvh] xl:max-h-[100dvh] xl:h-[100dvh] ${isPaused ? 'opacity-75' : 'opacity-100'}`} />
                <p className="absolute right-[1vh] xl:bottom-[0.25vw] top-full xl:top-auto xl:right-full xl:pr-[0.6vw] text-gray-dark font-semibold text-[2vh] xl:text-[1.25vw]">
                    {currentIndex+1}/{rounds}
                </p>
            </div>
            <div className="flex gap-[2vh] xl:gap-[2vw] absolute bottom-0 xl:top-0 left-0 pl-[0.75vw] text-white uppercase font-bold text-[3.5vh] xl:text-[3vw]">
                <p className={`${isPaused ? 'text-gray-light' : ''}`}>
                    {timePerImage !== null ? formatTime(timeLeft) : 'Unlimited'}
                </p>
                {isPaused && (
                    <p className="">PAUSED</p>
                )}
            </div>
            {/* Controls UI */}
            <motion.div
                animate={{ opacity: controlsVisible ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex justify-center items-center gap-[4vh] xl:gap-[2vw]
                absolute bottom-[15vh] xl:bottom-[4vw] bg-black/40 backdrop-blur-md
                px-[4vh] py-[2vh] xl:px-[2.5vw] xl:py-[1.5vw] xl:p-0 rounded-lg">
                {/* Backward */}
                <button
                    onClick={() => {
                        setCurrentIndex(currentIndex - 1);
                        setTimeLeft(timePerImage ?? 0);
                    }}
                    disabled={currentIndex == 0}
                    className="cursor-pointer"
                >
                    <div className="w-8 h-8 xl:w-[1.2vw] xl:h-[1.2vw] flex items-center justify-center">
                        <svg width="97" height="54" viewBox="0 0 97 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_153_313)">
                                <path
                                    d="M96.3123 49.0449V4.95516C96.3123 1.16185 92.1814 -1.24124 88.8846 0.665343L50.743 22.7102C47.4363 24.6069 47.4363 29.3932 50.743 31.2998L88.8846 53.3446C92.1913 55.2413 96.3123 52.8481 96.3123 49.0548V49.0449Z"
                                    fill="white"/>
                                <path
                                    d="M40.6142 0.665343L2.4726 22.7102C-0.834129 24.6069 -0.834129 29.3932 2.4726 31.2998L40.6142 53.3446C43.9209 55.2413 48.0419 52.8481 48.0419 49.0548V4.95516C48.0419 1.16185 43.911 -1.24124 40.6142 0.665343Z"
                                    fill="white"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_153_313">
                                    <rect width="96.3122" height="54" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </button>
                {/* Play/Pause */}
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    disabled={timePerImage === null}
                    className="cursor-pointer"
                >
                    <div className="w-6 h-6 xl:w-[1vw] xl:h-[1vw] flex items-center justify-center">
                        {isPaused ?
                            <svg viewBox="0 0 49 54" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_153_310)">
                                    <path
                                        d="M7.48996 53.3347L45.9 31.2898C49.23 29.3931 49.23 24.6068 45.9 22.7002L7.48996 0.655364C4.15996 -1.24129 0.00996479 1.15187 0.00996446 4.94518L0.00996061 49.0448C0.00996028 52.8382 4.16996 55.2412 7.48996 53.3347Z"
                                        fill="white"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_153_310">
                                        <rect width="48.39" height="54" fill="white"
                                              transform="translate(48.39 54) rotate(-180)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            :
                            <svg width="56" height="67" viewBox="0 0 56 67" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_155_333)">
                                    <path
                                        d="M16.93 0H5.37C2.40423 0 0 2.40423 0 5.37V61.31C0 64.2758 2.40423 66.68 5.37 66.68H16.93C19.8958 66.68 22.3 64.2758 22.3 61.31V5.37C22.3 2.40423 19.8958 0 16.93 0Z"
                                        fill="white"/>
                                    <path
                                        d="M49.79 0H38.23C35.2642 0 32.86 2.40423 32.86 5.37V61.31C32.86 64.2758 35.2642 66.68 38.23 66.68H49.79C52.7558 66.68 55.16 64.2758 55.16 61.31V5.37C55.16 2.40423 52.7558 0 49.79 0Z"
                                        fill="white"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_155_333">
                                        <rect width="55.16" height="66.68" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>

                        }
                    </div>
                </button>
                {/* Forward */}
                <button
                    onClick={() => {
                        setCurrentIndex(currentIndex + 1);
                        setTimeLeft(timePerImage ?? 0);
                    }}
                    disabled={currentIndex === rounds - 1}
                    className="cursor-pointer"
                >
                    <div className="w-8 h-8 xl:w-[1.2vw] xl:h-[1.2vw] flex items-center justify-center">
                        <svg width="97" height="54" viewBox="0 0 97 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_153_323)">
                                <path
                                    d="M0 4.95517V49.0449C0 52.8382 4.13093 55.2413 7.42773 53.3347L45.5693 31.2899C48.8761 29.3932 48.8761 24.6069 45.5693 22.7003L7.42773 0.665359C4.13093 -1.23129 0 1.16187 0 4.95517Z"
                                    fill="white"/>
                                <path
                                    d="M55.698 53.3347L93.8396 31.2899C97.1463 29.3932 97.1463 24.6069 93.8396 22.7003L55.698 0.665359C52.3913 -1.23129 48.2703 1.16187 48.2703 4.95517V49.0449C48.2703 52.8382 52.4012 55.2413 55.698 53.3347Z"
                                    fill="white"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_153_323">
                                    <rect width="96.3122" height="54" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </button>
                {/* Stop */}
                <button
                    onClick={() => {
                        setStopClicked(true);
                        if (timePerImage !== null) setIsPaused(true);
                    }}
                    disabled={stopClicked}
                    className="cursor-pointer"
                >
                    <div className="w-6 h-6 xl:w-[1vw] xl:h-[1vw] flex items-center justify-center">
                        <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="54" height="54" rx="6" fill="white"/>
                        </svg>
                    </div>
                </button>
            </motion.div>
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
                            className="absolute top-[0.8vh] xl:top-[0.75vw] right-[1.4vh] xl:right-[1vw] z-20 text-white cursor-pointer"
                        >
                            ✕
                        </button>

                        <p className="z-10 text-center text-[5vh] xl:text-[4vw] font-fornire leading-none lowercase">Are you sure you want to quit?</p>
                        <div className="z-10 m-auto">
                            <Link href="/setup" className="button button-white w-fit cursor-pointer!">
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
                        <p className="z-10 text-center text-[6vh] xl:text-[4vw] font-fornire leading-none lowercase">Practice session
                            complete.</p>
                        <p className="z-10 text-center text-[2vh] xl:text-[1.35vw] font-semibold">Congratulations! You&#39;ve completed the
                            practice session you&#39;ve committed to.</p>
                        <div className="z-10 m-auto">
                            <Link href="/setup" className="button button-white w-fit cursor-pointer!">
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