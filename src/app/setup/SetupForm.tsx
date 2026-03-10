"use client";
import React, {useEffect, useMemo, useState} from "react";
import type { Board } from "./BoardCarousel";
import Link from "next/link";
import { motion } from "motion/react";
import {useSetupSettings} from "@/app/hooks/useSetupSettings";
import {useExcludedPins} from "@/app/hooks/useExcludedPins";
import Button from "../components/Button";

type Props = {
    boards: Board[];
    presetBoards: Board[];
    isLoggedIn: boolean;
}

const getAnimationDelays = (count: number) =>
    Array.from({ length: count }, () => Math.random() * 0.5);

let mounted = false;

export function SetupForm({ boards, presetBoards, isLoggedIn }: Props) {
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
    const [showPresets, setShowPresets] = useState(
        !isLoggedIn ? true : (settings.isPreset ?? false)
    );
    const activeBoards = showPresets ? presetBoards : boards; // can be preset boards or user's boards
    const safeIndex = Math.min(selectedIndex, activeBoards.length - 1);
    const boardId = activeBoards[safeIndex]?.id ?? "";
    const { excluded } = useExcludedPins(boardId);
    const maxRounds = activeBoards.length > 0
        ? Math.min(activeBoards[safeIndex].pin_count - excluded.length, 250)
        : 0;
    const presetValues = timeOptions.map(o => o.value); // preset time values (30s, 60s, etc)
    const [customTimeValue, setCustomTimeValue] = useState<number>(1200);
    const [customMode, setCustomMode] = useState(false);
    const isCustomTime = customMode || !presetValues.includes(timePerImage);
    const [roundsInput, setRoundsInput] = useState(String(numberOfRounds));
    const [customTimeInput, setCustomTimeInput] = useState(String(customTimeValue));
    const [showBoardOptions, setShowBoardOptions] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const check = () => setIsSmallScreen(window.innerWidth < 1280);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const animationDelays = useMemo(
        () => getAnimationDelays(activeBoards.length),
        [activeBoards.length]
    );

    // For calculating "mounting" time based on time of initial animation completion
    useEffect(() => {
        const timer = setTimeout(() => { mounted = true; }, Math.max(...animationDelays) * 1000 + 100);
        return () => clearTimeout(timer);
    }, []);

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

    useEffect(() => {
        if (!isLoggedIn) return; // non-logged in always shows presets, no need to sync
        setShowPresets(settings.isPreset ?? false);
    }, [settings.isPreset]);

    // if (activeBoards.length === 0) {
    //     return <p>No boards found.</p>;
    // }

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
            index: activeBoards[safeIndex]?.id,
            rounds: numberOfRounds,
            time: timePerImage === null ? "null" : timePerImage,
            intervals: warningIntervals,
            isPreset: showPresets,
        },
    };

    // console.log("showPresets:", showPresets);
    // console.log("presetBoards:", presetBoards.length);
    // console.log("activeBoards:", activeBoards.length);
    // console.log("activeBoards data:", JSON.stringify(activeBoards[0]));

    return (
        <>
            {/*<BoardCarousel*/}
            {/*    boards={activeBoards}*/}
            {/*    selectedIndex={safeIndex}*/}
            {/*    maxRounds={maxRounds}*/}
            {/*    isPreset={showPresets}*/}
            {/*    onSelect={(i) => {*/}
            {/*        const newMax = Math.min(activeBoards[i].pin_count, 250);*/}
            {/*        updateSettings({*/}
            {/*            selectedIndex: i,*/}
            {/*            numberOfRounds: Math.min(numberOfRounds, newMax)*/}
            {/*        });*/}
            {/*    }}*/}
            {/*/>*/}
            <div className="relative w-full"
                 style={{
                     maskImage: "linear-gradient(to top, transparent, black 20%)",
                     WebkitMaskImage: "linear-gradient(to top, transparent, black 20%)",
                 }}
            >
                <div className="overflow-y-auto h-[calc(1.5*30vh)] md:h-[calc(1.5*32vh)] xl:h-[calc(1.5*18vw)] scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="w-full flex flex-wrap justify-between xl:justify-start gap-[2vh] xl:gap-[2vw] overflow-x-auto
                         pt-[8vh] xl:pt-[4vw] pb-[10vh] xl:pb-[6vw] px-[2.5vh] xl:px-[2vw]
                        scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {activeBoards.map((board, i) => (
                            <motion.div
                                key={board.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: safeIndex === i ? 1 : 0.4, y: 0 }}
                                transition={{
                                    delay: mounted ? 0 : animationDelays[i],
                                    duration: mounted ? 0.3 : 0.5,
                                    ease: "easeOut",
                                }}
                                onClick={() => {
                                    const newMax = Math.min(board.pin_count, 250);
                                    updateSettings({
                                        selectedIndex: i,
                                        numberOfRounds: Math.min(numberOfRounds, newMax)
                                    });
                                }}
                                className={`w-[42vw] xl:w-[20vw] flex-1 flex flex-col items-center cursor-pointer transition-opacity
                                ${safeIndex === i ? "opacity-100" : "opacity-40"}`}
                                data-clickable="true"
                            >
                                <div className={`w-fit flex justify-center gap-[2px] rounded-2xl overflow-hidden border-3 ${safeIndex === i ? "border-black" : "border-white"}`}>
                                    {board.media.image_cover_url ?
                                        <>
                                            <img src={board.media.image_cover_url} alt="pinterest_board_thumbnail_1"
                                                 className={`w-[28.2vw] h-[28.2vw] xl:w-[13.1vw] xl:h-[13.1vw] object-cover`}/>
                                            <div className="flex flex-col gap-[2px]">
                                                {board.media.pin_thumbnail_urls[0] ?
                                                    <img src={board.media.pin_thumbnail_urls[0]}
                                                         alt="pinterest_board_thumbnail_2"
                                                         className={`w-[14vw] h-[14vw] xl:w-[6.5vw] xl:h-[6.5vw] min-w-[7vh] object-cover`}/>
                                                    :
                                                    <div
                                                        className="bg-gray-100 text-white w-[6vh] h-[6vh] xl:w-[6.5vw] xl:h-[6.5vw] min-w-[7vh] object-cover"></div>
                                                }
                                                {board.media.pin_thumbnail_urls[1] ?
                                                    <img src={board.media.pin_thumbnail_urls[1]}
                                                         alt="pinterest_board_thumbnail_3"
                                                         className={`w-[14vw] h-[14vw] xl:w-[6.5vw] xl:h-[6.5vw] min-w-[7vh] object-cover rounded-br-2xl`}/>
                                                    :
                                                    <div
                                                        className="bg-gray-100 text-white w-[6vh] h-[6vh] xl:w-[6.5vw] xl:h-[6.5vw] min-w-[7vh] object-cover rounded-br-2xl"></div>
                                                }
                                            </div>
                                        </>
                                        :
                                        <div className="flex justify-center items-center text-center w-[42.2vw] h-[28vw] xl:w-[19.6vw] xl:h-[13vw]
                                            font-semibold text-[1.75vw] bg-gray-200 text-white rounded-2xl p-[2vh] xl:p-[2vw]">
                                            Add pins to this board first!
                                        </div>
                                    }

                                </div>
                                <div className="flex mt-[1vh] xl:mt-[0.6vw] xl:pl-[0.5vw]">
                                    <div className="flex flex-col">
                                        <div className="flex gap-[1.5vh] xl:gap-[1vw] w-[42vw] xl:w-[19.6vw] ">
                                            <p className={`font-bold text-[2.3vh] xl:text-[1.5vw] leading-snug whitespace-nowrap overflow-hidden text-ellipsis`}>{board.name}</p>
                                            {(board.pin_count !== 0 && safeIndex === i) &&
                                                <a
                                                    href={`/filter?boardId=${activeBoards[safeIndex].id}&name=${activeBoards[safeIndex].name}&isPreset=${isPreset}`}
                                                    className="w-[2.3vh] xl:w-[1.5vw] h-[2.3vh] xl:h-[1.5vw] pt-[0.4vh] xl:pt-[0.3vw]"
                                                >
                                                    <svg viewBox="0 0 30 30" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd"
                                                              d="M0 30H30V27.0161H0V30ZM14.763 21.0483H9V14.9254L23.7585 0L30 6.17365L14.763 21.0483Z"
                                                              fill="black"/>
                                                    </svg>
                                                </a>
                                            }
                                        </div>
                                        <p className={`font-medium text-[1.4vh] xl:text-[0.85vw] text-gray-dark`}>
                                            {board.pin_count !== maxRounds && safeIndex === i
                                                ? `${maxRounds}/${board.pin_count} Pins selected`
                                                : `${board.pin_count} Pins`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <motion.section
                className="fixed bottom-[2vh] left-0 right-0 z-10 w-[80dvw] w-full
                    flex justify-center items-center mb-[2vh] xl:mb-[2vw] mx-auto"
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{
                    delay: 0.5,
                    duration: 0.4,
                    ease: "easeOut",
                    // ease: [0.76, 0, 0.24, 1],
                }}
            >
                <div
                    className="flex flex-col gap-[3vh] xl:gap-[1.5vw] relative w-[90dvw] xl:w-1/2 h-fit px-[2.25vh] py-[2.75vh] xl:p-[1.5vw] text-[1.5vh] xl:text-[1vw]">
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
                                    className="flex rounded-md border-1 border-gray-300 px-[1vh] py-[1vh] xl:px-[1vw] xl:py-[1vw] w-[5vh] h-[4vh] xl:w-[4vw] xl:h-[2vw] text-center
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
                        {isLoggedIn  && (
                            <div className="flex flex-col items-end">
                                <Button
                                    onClick={() => setShowBoardOptions(!showBoardOptions)}
                                    className="w-fit"
                                >
                                    <div className="flex items-center xl:items-end gap-[0.75vh] xl:gap-[0.5vw]">
                                        <p className="font-semibold">Board Options</p>
                                        <div className="w-[1.25vh] xl:w-[1vw] h-[1.25vh] xl:h-[1vw] pt-[0.25vh] xl:pt-0">
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
                        )}
                    </div>
                    <div>
                        <p>Display each image for:</p>
                        <div
                            className="flex flex-wrap gap-x-[1.25vh] gap-y-[1vh] xl:gap-[1vw] mt-[1.5vh] xl:mt-[0.75vw]">
                            {timeOptions.map(({label, value}) => {
                                if (isSmallScreen && value === 90) return null;
                                return (
                                    <Button
                                        key={value}
                                        onClick={() => {
                                            setCustomMode(false);
                                            handleTimeSelection(value);
                                        }}
                                        className={`setting-button w-fit ${value === timePerImage && !isCustomTime ? "setting-button-active" : ""}`}
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                            <div className="flex gap-[1vh] xl:gap-[1vw]">
                                <Button
                                    onClick={() => {
                                        setCustomMode(true);
                                        updateSettings({timePerImage: customTimeValue});
                                        handleTimeSelection(customTimeValue);
                                    }}
                                    className={`setting-button w-fit ${isCustomTime ? "setting-button-active" : ""}`}
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
                                                    updateSettings({timePerImage: clamped});
                                                }
                                            }}
                                            onBlur={() => {
                                                const val = Math.floor(Number(customTimeInput));
                                                const clamped = Math.min(Math.max(val || 1, 1), 3600);
                                                setCustomTimeInput(String(clamped));
                                                setCustomTimeValue(clamped);
                                                updateSettings({timePerImage: clamped});
                                            }}
                                            className="flex rounded-md border-1 border-gray-300 px-[1vh] py-[1vh] xl:px-[1vw] xl:py-[1vw] w-[8vh] xl:w-[5vw] h-[4vh] xl:h-[2vw] text-center
                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-custom-gray">seconds</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Play a chime at:</p>
                        <div
                            className="flex flex-wrap gap-x-[1.25vh] gap-y-[1vh] xl:gap-[1vw] mt-[1.5vh] xl:mt-[0.75vw]">
                            {warningOptions.map(({label, value}) => {
                                if (isSmallScreen && value === 120) return null;
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
                                        <div
                                            className="w-[1.5vh] xl:w-[0.7vw] h-[1.5vh] xl:h-[0.7vw] border border-current rounded-xs flex items-center justify-center">
                                            {isSelected &&
                                                <div className="w-[0.75vh] xl:w-[0.35vw] h-[0.75vh] xl:h-[0.35vw] bg-current"/>}
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