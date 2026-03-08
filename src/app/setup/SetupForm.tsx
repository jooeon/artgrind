"use client";
import React, {useEffect, useState} from "react";
import BoardCarousel from "@/app/setup/BoardCarousel";
import type { Board } from "./BoardCarousel";
import Link from "next/link";
import { motion } from "motion/react";
import {useSetupSettings} from "@/app/hooks/useSetupSettings";
import {useExcludedPins} from "@/app/hooks/useExcludedPins";
import Button from "../components/Button";

type Props = {
    boards: Board[];
    presetBoards: Board[];
}

export function SetupForm({ boards, presetBoards }: Props) {
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
    const { selectedIndex, numberOfRounds, timePerImage, warningIntervals, isPreset } = settings;
    const [showPresets, setShowPresets] = useState(false);   // Toggle show preset boards
    const activeBoards = showPresets ? presetBoards : boards; // can be preset boards or user's boards
    const safeIndex = Math.min(selectedIndex, activeBoards.length - 1);
    const { excluded } = useExcludedPins(activeBoards[safeIndex].id);
    const maxRounds = Math.min(activeBoards[safeIndex].pin_count - excluded.length, 250);   // max number of pins in a single API request is 250
    const presetValues = timeOptions.map(o => o.value); // preset time values (30s, 60s, etc)
    const [customTimeValue, setCustomTimeValue] = useState<number>(1200);
    const [customMode, setCustomMode] = useState(false);
    const isCustomTime = customMode || !presetValues.includes(timePerImage);
    const [roundsInput, setRoundsInput] = useState(String(numberOfRounds));
    const [customTimeInput, setCustomTimeInput] = useState(String(customTimeValue));
    const [showBoardOptions, setShowBoardOptions] = useState(false);

    useEffect(() => {
        setShowPresets(isPreset ?? false);
    }, [isPreset]);

    // sync when numberOfRounds changes externally (e.g. switching boards)
    useEffect(() => {
        setRoundsInput(String(numberOfRounds));
    }, [numberOfRounds]);

    useEffect(() => {
        setCustomTimeInput(String(customTimeValue));
    }, [customTimeValue]);

    // Safeguard for when saved selectedIndex in localStorage is larger than the number of boards returned
    useEffect(() => {
        if (selectedIndex >= activeBoards.length) {
            updateSettings({ selectedIndex: 0 });
        }
    }, []);

    // check if custom time is used, and if it is not one of the preset values (30s, 60s, 90s, etc)
    useEffect(() => {
        if (timePerImage !== null && !presetValues.includes(timePerImage)) {
            setCustomTimeValue(timePerImage);
        }
    }, [timePerImage]);

    // numberOfRounds validity check
    useEffect(() => {
        if (numberOfRounds <= 0 || numberOfRounds > maxRounds) {
            updateSettings({ numberOfRounds: maxRounds });
        }
    }, [maxRounds]);

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
            index: activeBoards[safeIndex].id,
            rounds: numberOfRounds,
            time: timePerImage === null ? "null" : timePerImage,
            intervals: warningIntervals,
            isPreset: showPresets,
        },
    };

    // console.log(isPreset);

    return (
        <>
            <BoardCarousel
                boards={activeBoards}
                selectedIndex={safeIndex}
                maxRounds={maxRounds}
                isPreset={showPresets}
                onSelect={(i) => {
                    const newMax = Math.min(activeBoards[i].pin_count, 250);
                    updateSettings({
                        selectedIndex: i,
                        numberOfRounds: Math.min(numberOfRounds, newMax)
                    });
                }}
            />
            <motion.section
                className="flex justify-center items-center mb-[2vh] xl:mb-[2vw] mx-[2.5vh] xl:mx-[2vw]"
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{
                    delay: 0.4,
                    duration: 0.4,
                    ease: [0.76, 0, 0.24, 1],
                }}
            >
                <div className="flex flex-col gap-[3vh] xl:gap-[1.5vw] relative w-full xl:w-1/2 h-fit px-[2.25vh] py-[2.75vh] xl:p-[1.5vw] text-[1.5vh] xl:text-[1vw]">
                    <div className="flex justify-between">
                        <div>
                            <p>Number of practice rounds:</p>
                            <div className="flex items-center gap-[0.5vh] xl:gap-[0.5vw] mt-[1.5vh] xl:mt-[0.75vw]">
                                <Button
                                    className="setting-button w-10 xl:w-[2vw] h-10 xl:h-[2vw]"
                                    onClick={() => updateSettings({numberOfRounds: Math.max(1, numberOfRounds - 1)})}
                                    disabled={numberOfRounds <= 1}
                                >
                                    -
                                </Button>
                                <input
                                    type="number"
                                    step="1"
                                    onKeyDown={(e) => {
                                        if (e.key === "." || e.key === "-") e.preventDefault();
                                    }}
                                    value={roundsInput}
                                    min="1" max="250"
                                    onChange={(e) => {
                                        setRoundsInput(e.target.value);
                                        const val = Math.floor(Number(e.target.value));
                                        if (val >= 1) {
                                            updateSettings({numberOfRounds: Math.min(val, maxRounds)});
                                        }
                                    }}
                                    onBlur={() => {
                                        // when user leaves the field, clamp and restore valid value
                                        const val = Math.floor(Number(roundsInput));
                                        const clamped = Math.min(Math.max(val || 1, 1), maxRounds);
                                        setRoundsInput(String(clamped));
                                        updateSettings({numberOfRounds: clamped});
                                    }}
                                    className="flex rounded-md border-1 border-gray-300 px-1 py-1 xl:px-2 xl:py-2 w-10 xl:w-[2.5vw] h-10 xl:h-[2vw] text-center
                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button
                                    onClick={() => updateSettings({numberOfRounds: Math.min(numberOfRounds + 1, maxRounds)})}
                                    disabled={numberOfRounds >= maxRounds}
                                    className="setting-button w-10 xl:w-[2vw] h-10 xl:h-[2vw]"
                                >
                                    +
                                </Button>
                                <Button
                                    onClick={() => updateSettings({numberOfRounds: maxRounds})}
                                    className="setting-button h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] ml-[1vh] xl:ml-[1vw]"
                                >
                                    Max ({maxRounds})
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <Button
                                onClick={() => setShowBoardOptions(!showBoardOptions)}
                                className="w-fit"
                            >
                                <div className="flex items-center xl:items-end gap-[0.75vh] xl:gap-[0.5vw]">
                                    <p className="font-semibold">Board Options</p>
                                    <div className="w-[1.25vh] xl:w-[1vw] h-[1.25vh] xl:h-[1vw]">
                                        {showBoardOptions ?
                                            <svg viewBox="0 0 20 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M8.8215 0.48815C9.47233 -0.162717 10.5277 -0.162717 11.1785 0.48815L19.5118 8.8215C20.1627 9.47233 20.1627 10.5277 19.5118 11.1785C18.861 11.8293 17.8057 11.8293 17.1548 11.1785L10 4.02367L2.84518 11.1785C2.1943 11.8293 1.13903 11.8293 0.48815 11.1785C-0.162717 10.5277 -0.162717 9.47233 0.48815 8.8215L8.8215 0.48815Z"
                                                      fill="#131313"/>
                                            </svg>
                                            :
                                            <svg viewBox="0 0 20 12" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M11.1785 11.1785C10.5277 11.8293 9.47233 11.8293 8.8215 11.1785L0.488167 2.84513C-0.162666 2.19429 -0.162666 1.13896 0.488167 0.488126C1.139 -0.162708 2.19433 -0.162708 2.84517 0.488126L10 7.64296L17.1548 0.488126C17.8057 -0.162708 18.861 -0.162708 19.5118 0.488126C20.1627 1.13896 20.1627 2.19429 19.5118 2.84513L11.1785 11.1785Z"
                                                      fill="#131313"/>
                                            </svg>
                                        }
                                    </div>
                                </div>
                            </Button>
                            {showBoardOptions &&
                                <div
                                    className="absolute top-[5.5vh] xl:top-[4vw] flex flex-col items-end border-3 border-black rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setShowPresets(false);
                                            updateSettings({selectedIndex: 0});
                                            updateSettings({isPreset: false});
                                        }}
                                        className={`w-full px-2 xl:px-3 h-10 xl:h-[2vw] font-medium ${!isPreset ? "setting-button-active" : ""}`}
                                    >
                                        My Boards
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPresets(true);
                                            updateSettings({selectedIndex: 0});
                                            updateSettings({isPreset: true});
                                        }}
                                        className={`w-full px-2 xl:px-3 h-10 xl:h-[2vw] font-medium ${isPreset ? "setting-button-active" : ""}`}
                                    >
                                        Preset Boards
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    <div>
                    <p>Display each image for:</p>
                    <div
                        className="flex flex-wrap gap-x-[1.5vh] gap-y-[1vh] xl:gap-[1vw] mt-[1.5vh] xl:mt-[0.75vw]">
                        {timeOptions.map(({label, value}) => (
                            <Button
                                key={value}
                                onClick={() => {
                                    setCustomMode(false);
                                        handleTimeSelection(value);
                                    }}
                                    className={`setting-button w-fit h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] ${value === timePerImage && !isCustomTime ? "setting-button-active" : ""}`}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-[1.5vh] xl:gap-[1vw] mt-[1vh] xl:mt-[0.75vw]">
                            <Button
                                onClick={() => {
                                    setCustomMode(true);
                                    updateSettings({timePerImage: customTimeValue});
                                    handleTimeSelection(customTimeValue);
                                }}
                                className={`setting-button w-fit h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] ${isCustomTime ? "setting-button-active" : ""}`}
                            >
                                Custom
                            </Button>
                            {isCustomTime && (
                                <motion.div
                                    className="flex items-center xl:items-end gap-[1vh] xl:gap-[0.5vw]"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.1, ease: "easeIn"}}
                                >
                                    <input
                                        type="number"
                                        step="1"
                                        onKeyDown={(e) => {
                                            if (e.key === "." || e.key === "-") e.preventDefault();
                                        }}
                                        value={customTimeInput}
                                        min="1" max="3600"
                                        placeholder="1200"
                                        onChange={(e) => {
                                            setCustomTimeInput(e.target.value);
                                            const val = Math.floor(Number(e.target.value));
                                            if (val >= 1) {
                                                const clamped = Math.min(val, 3600);
                                                handleTimeSelection(clamped);
                                                setCustomTimeValue(clamped);
                                                updateSettings({ timePerImage: clamped });
                                            }
                                        }}
                                        onBlur={() => {
                                            const val = Math.floor(Number(customTimeInput));
                                            const clamped = Math.min(Math.max(val || 1, 1), 3600);
                                            setCustomTimeInput(String(clamped));
                                            setCustomTimeValue(clamped);
                                            updateSettings({ timePerImage: clamped });
                                        }}
                                        className="flex rounded-md border-1 border-gray-300 px-1 py-1 xl:px-2 xl:py-2 w-[8vh] xl:w-[5vw] h-10 xl:h-[2vw] text-center
                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="text-custom-gray">seconds</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                    <div>
                        <p>Play a chime at:</p>
                        <div className="flex flex-wrap gap-x-[1.5vh] gap-y-[1vh] xl:gap-[1vw] mt-[1.5vh] xl:mt-[0.75vw]">
                            {warningOptions.map(({label, value}) => {
                                const isSelected = warningIntervals.includes(value);
                                return (
                                    <Button
                                        key={value}
                                        onClick={() => updateSettings({
                                            warningIntervals: warningIntervals.includes(value)
                                                ? warningIntervals.filter(w => w !== value)
                                                : [...warningIntervals, value]
                                        })}
                                        disabled={timePerImage === null || value >= timePerImage}
                                        className={`setting-button h-10 xl:h-[2vw] px-4 xl:px-[1vw] flex items-center gap-2 xl:gap-[0.5vw]
                                        ${isSelected ? "setting-button-active" : ""}`}
                                    >
                                        <div className="w-4 xl:w-[0.7vw] h-4 xl:h-[0.7vw] border border-current rounded-xs flex items-center justify-center">
                                            {isSelected && <div className="w-2 xl:w-[0.35vw] h-2 xl:h-[0.35vw] bg-current"/>}
                                        </div>
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    <Link
                        href={practiceUrl}
                        className={`button w-full block text-center ${maxRounds < 1 ? "disabled" : ""}`}
                        aria-disabled={maxRounds < 1}
                        onClick={(e) => maxRounds < 1 && e.preventDefault()}
                    >
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