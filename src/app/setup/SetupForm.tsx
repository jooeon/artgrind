"use client";
import React, {useState} from "react";
import BoardCarousel from "@/app/setup/BoardCarousel";
import type { Board } from "./BoardCarousel";
import Link from "next/link";

type Props = {
    boards: Board[];
}

export function SetupForm({ boards }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [numberOfRounds, setNumberOfRounds] = useState<number>(5);
    const [timePerImage, setTimePerImage] = useState<number>(60); // stored in seconds
    const [warningIntervals, setWarningIntervals] = useState<number[]>([]); // in seconds
    const maxRounds = boards[selectedIndex].pin_count;

    const handleTimeSelection = (newValue: number) => {
        setTimePerImage(newValue);
        // only keep warning intervals that are less than the new time per image value
        // i.e. remove warning intervals that are greater than or equal to the new time per image value
        setWarningIntervals((prev) => prev.filter((item) => item < newValue));
    };

    const timeOptions = [
        { label: "30s", value: 2 },
        { label: "60s", value: 60 },
        { label: "90s", value: 90 },
        { label: "2m", value: 120 },
        { label: "5m", value: 300 },
        { label: "10m", value: 600 },
    ];

    const warningOptions = [
        { label: "10s left", value: 10 },
        { label: "30s left", value: 30 },
        { label: "1m left", value: 60 },
        { label: "2m left", value: 120 },
        { label: "5m left", value: 300 },
    ]

    // package data into URL to be sent to Practice page
    const practiceUrl = {
        pathname: '/practice',
        query: {
            index: boards[selectedIndex].id,
            rounds: numberOfRounds,
            time: timePerImage,
            intervals: JSON.stringify(warningIntervals),
        },
    };

    return (
        <>
            <BoardCarousel
                boards={boards}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
            />
            <section className="flex flex-1 justify-center items-center w-full">
                <div className="flex flex-col gap-[3vh] xl:gap-[1.5vw] relative w-full xl:w-1/2 h-fit px-[3vh] py-[3vh] xl:p-[1.5vw] xl:text-[1vw]">
                    <div>
                        <p>Number of practice rounds:</p>
                        <div className="flex items-center gap-[0.5vh] xl:gap-[0.5vw] mt-[1.5vh] xl:mt-[1vw]">
                            <button
                                onClick={() => setNumberOfRounds(prev => Math.max(1, prev - 1))}
                                disabled={numberOfRounds <= 1}
                                className="setting-button w-10 xl:w-[2vw] h-10 xl:h-[2vw]"
                            >
                                −
                            </button>
                            <input type="number"
                                   value={numberOfRounds < maxRounds ? numberOfRounds : maxRounds}
                                   onChange={(e) => setNumberOfRounds(Math.min(Number(e.target.value) || 0, maxRounds))}
                                   className="flex rounded-md border-1 border-custom-gray px-1 py-1 xl:px-2 xl:py-2 w-10 xl:w-[2.5vw] h-10 xl:h-[2vw] text-center
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                onClick={() => setNumberOfRounds(prev => Math.min(prev + 1, maxRounds))}
                                disabled={numberOfRounds >= maxRounds}
                                className="setting-button w-10 xl:w-[2vw] h-10 xl:h-[2vw]"
                            >
                                +
                            </button>
                            <button
                                onClick={() => setNumberOfRounds(maxRounds)}
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
                                        handleTimeSelection(value)
                                    }}
                                    className={`setting-button w-fit h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] ${value === timePerImage ? "setting-button-active" : ""}`}
                                >
                                    {label}
                                </button>
                            ))}
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
                                        onClick={() => setWarningIntervals(prev =>
                                            prev.includes(value)
                                                ? prev.filter(w => w !== value)  // already selected → remove it
                                                : [...prev, value]               // not selected → add it
                                        )}
                                        disabled={value >= timePerImage}    // only enable button if smaller than selected round time
                                        className={`setting-button h-10 xl:h-[2vw] px-4 xl:px-[1vw] flex items-center gap-2 xl:gap-[0.5vw]
                                            ${isSelected ? "setting-button-active" : ""}`}
                                    >
                                        <div
                                            className={`w-4 xl:w-[0.7vw] h-4 xl:h-[0.7vw] border border-current rounded-xs flex items-center justify-center`}>
                                            {isSelected && <div className="w-2 xl:w-[0.35vw] h-2 xl:h-[0.35vw] bg-current"/>}
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
            </section>
        </>
    );

}