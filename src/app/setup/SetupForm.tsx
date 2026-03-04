"use client";
import React, {useEffect, useState} from "react";
import BoardCarousel from "@/app/setup/BoardCarousel";
import type { Board } from "./BoardCarousel";
import Link from "next/link";
import { motion } from "motion/react";
import {useSetupSettings} from "@/app/hooks/useSetupSettings";

type Props = {
    boards: Board[];
}

export function SetupForm({ boards }: Props) {
    const timeOptions = [
        { label: "30s", value: 30 },
        { label: "60s", value: 60 },
        { label: "90s", value: 90 },
        { label: "2m", value: 120 },
        { label: "5m", value: 300 },
        { label: "10m", value: 600 },
        { label: "Unlimited", value: null },
    ];

    const warningOptions = [
        { label: "10s left", value: 10 },
        { label: "30s left", value: 30 },
        { label: "1m left", value: 60 },
        { label: "2m left", value: 120 },
        { label: "5m left", value: 300 },
    ]

    const { settings, updateSettings } = useSetupSettings();
    const { selectedIndex, numberOfRounds, timePerImage, warningIntervals } = settings;
    const maxRounds = Math.min(boards[selectedIndex].pin_count, 250);   // max number of pins in a single request is 250
    const presetValues = timeOptions.map(o => o.value);
    const [customTimeValue, setCustomTimeValue] = useState<number>(1200);
    const [customMode, setCustomMode] = useState(false);
    const isCustomTime = customMode || !presetValues.includes(timePerImage);

    // check if custom time is used, and if it is not one of the preset values (30s, 60s, 90s, etc)
    useEffect(() => {
        if (timePerImage !== null && !presetValues.includes(timePerImage)) {
            setCustomTimeValue(timePerImage);
        }
    }, [timePerImage]);

    const handleTimeSelection = (newValue: number | null) => {
        updateSettings({ timePerImage: newValue })
        // only keep warning intervals that are less than the new time per image value
        // i.e. remove warning intervals that are greater than or equal to the new time per image value
        updateSettings({
            warningIntervals: newValue === null
                ? []
                : warningIntervals.filter((item) => item < newValue)
        });
    };

    // package data into URL to be sent to Practice page
    const practiceUrl = {
        pathname: '/practice',
        query: {
            index: boards[selectedIndex].id,
            rounds: numberOfRounds,
            time: timePerImage === null ? "null" : timePerImage,
            intervals: warningIntervals,
        },
    };

    return (
        <>
            <BoardCarousel
                boards={boards}
                selectedIndex={selectedIndex}
                onSelect={(i) => {
                    const newMax = Math.min(boards[i].pin_count, 250);
                    updateSettings({
                        selectedIndex: i,
                        numberOfRounds: Math.min(numberOfRounds, newMax)
                    });
                }}
            />
            <motion.section
                className="flex flex-1 justify-center items-center w-full"
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{
                    delay: 0.2,
                    duration: 0.4,
                    ease: [0.76, 0, 0.24, 1],
                }}
            >
                <div className="flex flex-col gap-[3vh] xl:gap-[1.5vw] relative w-full xl:w-1/2 h-fit px-[3vh] py-[3vh] xl:p-[1.5vw] xl:text-[1vw]">
                    <div>
                        <p>Number of practice rounds:</p>
                        <div className="flex items-center gap-[0.5vh] xl:gap-[0.5vw] mt-[1.5vh] xl:mt-[1vw]">
                            <button
                                onClick={() => updateSettings({ numberOfRounds: Math.max(1, numberOfRounds - 1) })}
                                disabled={numberOfRounds <= 1}
                                className="setting-button w-10 xl:w-[2vw] h-10 xl:h-[2vw]"
                            >
                                −
                            </button>
                            <input type="number"
                                   step="1"
                                   onKeyDown={(e) => {
                                       if (e.key === ".") e.preventDefault();
                                   }}
                                   value={numberOfRounds < maxRounds ? numberOfRounds : maxRounds}
                                   min="1" max="250"
                                   onChange={(e) => updateSettings({ numberOfRounds: Math.min(Math.floor(Number(e.target.value)) || 1, maxRounds) })}
                                   className="flex rounded-md border-1 border-gray-300 px-1 py-1 xl:px-2 xl:py-2 w-10 xl:w-[2.5vw] h-10 xl:h-[2vw] text-center
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                onClick={() => updateSettings({ numberOfRounds: Math.min(numberOfRounds + 1, maxRounds) })}
                                disabled={numberOfRounds >= maxRounds}
                                className="setting-button w-10 xl:w-[2vw] h-10 xl:h-[2vw]"
                            >
                                +
                            </button>
                            <button
                                onClick={() => updateSettings({ numberOfRounds: maxRounds })}
                                className="setting-button h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] text-[2vh] xl:text-[1vw] ml-[2vh] xl:ml-[1vw]"
                            >
                                Max ({boards[selectedIndex].pin_count})
                            </button>
                        </div>
                    </div>
                    <div>
                        <p>Display each image for:</p>
                        <div
                            className="flex flex-wrap gap-x-[1.5vh] gap-y-[1vh] xl:gap-[1vw] mt-[1.5vh] xl:mt-[1vw] text-[2vh] xl:text-[1vw]">
                            {timeOptions.map(({label, value}) => (
                                <button
                                    key={value}
                                    onClick={() => {
                                        setCustomMode(false);
                                        handleTimeSelection(value);
                                    }}
                                    className={`setting-button w-fit h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] ${value === timePerImage && !isCustomTime ? "setting-button-active" : ""}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-[1.5vh] xl:gap-[1vw] mt-[1vh] xl:mt-[1vw]">
                            {/* Custom button alongside time options */}
                            <button
                                onClick={() => {
                                    setCustomMode(true);
                                    updateSettings({timePerImage: customTimeValue});
                                }}
                                className={`setting-button w-fit h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] ${isCustomTime ? "setting-button-active" : ""}`}
                            >
                                Custom
                            </button>
                            {/* Revealed input */}
                            {isCustomTime && (
                                <motion.div
                                    className="flex items-end gap-[1vh] xl:gap-[0.5vw]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.1,
                                        ease: "easeIn"
                                    }}
                                >
                                    <input
                                        type="number"
                                        step="1"
                                        onKeyDown={(e) => {
                                            if (e.key === ".") e.preventDefault();
                                        }}
                                        value={customTimeValue}
                                        min="1" max="3600"
                                        onChange={(e) => {
                                            const val = Math.min(Math.max(Math.floor(Number(e.target.value)) || 1, 1), 3600);
                                            setCustomTimeValue(val);
                                            updateSettings({timePerImage: val});
                                        }}
                                        placeholder="1200"
                                        className="flex rounded-md border-1 border-gray-300 px-1 py-1 xl:px-2 xl:py-2 w-[8vh] xl:w-[5vw] h-10 xl:h-[2vw] text-center
                                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-custom-gray">seconds</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                    <div>
                        <p>Warn about time at:</p>
                        <div
                            className="flex flex-wrap gap-x-[1.5vh] gap-y-[1vh] xl:gap-[1vw] mt-[1.5vh] xl:mt-[1vw] text-[2vh] xl:text-[1vw]">
                            {warningOptions.map(({label, value}) => {
                                const isSelected = warningIntervals.includes(value);
                                return (
                                    <button
                                        key={value}
                                        onClick={() => updateSettings({
                                            warningIntervals: warningIntervals.includes(value)
                                                ? warningIntervals.filter(w => w !== value)
                                                : [...warningIntervals, value]
                                        })}
                                        disabled={timePerImage === null || value >= timePerImage}    // only enable button if smaller than selected round time
                                        className={`setting-button h-10 xl:h-[2vw] px-4 xl:px-[1vw] flex items-center gap-2 xl:gap-[0.5vw]
                                            ${isSelected ? "setting-button-active" : ""}`}
                                    >
                                        <div
                                            className={`w-4 xl:w-[0.7vw] h-4 xl:h-[0.7vw] border border-current rounded-xs flex items-center justify-center`}>
                                            {isSelected &&
                                                <div className="w-2 xl:w-[0.35vw] h-2 xl:h-[0.35vw] bg-current"/>}
                                        </div>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <Link href={practiceUrl} className="button w-full">
                        Start timed practice
                    </Link>

                    {/* shadow box */}
                    <div className="absolute inset-0 translate-y-4 border-3 rounded-xl bg-black z-[-10]"></div>
                    {/* main box */}
                    <div className="absolute inset-0 border-3 rounded-xl bg-white z-[-5]"></div>
                </div>
            </motion.section>
        </>
    );

}