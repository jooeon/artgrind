"use client";

import {useRouter} from "next/navigation";
import {useExcludedPins} from "@/app/hooks/useExcludedPins";
import Button from "@/app/components/Button";
import React, {useEffect, useMemo, useRef, useState} from "react";
import { motion } from "motion/react";

type Pin = {
    id: string;
    media: {
        images: {
            "150x150": { url: string };
            "400x300": { url: string };
            "600x": { url: string };
            "1200x": { url: string };
        };
    };
};

type Props = {
    pins: Pin[];
    boardId: string;
    boardName: string;
};

const getAnimationDelays = (count: number) =>
    Array.from({ length: count }, () => Math.random() * 0.5);

export default function FilterClient({ pins, boardId, boardName }: Props) {
    const { excluded, togglePin, selectAll, deselectAll } = useExcludedPins(boardId);
    const router = useRouter();
    const includedCount = pins.length - excluded.length;
    const animationDelays = useRef(getAnimationDelays(pins.length));
    const mounted = useRef(false);  // Used to differentiate animation (delay, duration) from initial load

    useEffect(() => {
        const maxDelay = Math.max(...animationDelays.current) * 1000; // convert to ms
        setTimeout(() => {
            mounted.current = true;
        }, maxDelay + 600);
        return () => clearTimeout(maxDelay);
    }, []);

    // console.log(pins[0].media.images)

    return (
        <section className="flex justify-center p-[1.5vh] xl:p-[1.6vw]">
            <div className="flex flex-col justify-center items-center w-fit min-w-[30vw]">
                <div className="flex justify-between items-center w-full mb-[2vh] xl:mb-[2vw] gap-[1vh]">
                    <div className="flex items-start gap-[1vh] xl:gap-[0.75vw]">
                        <Button onClick={() => router.push("/setup")}
                                className="setting-button w-[3.5vh] xl:w-[2.1vw] h-[3.5vh] xl:h-[2.1vw]">
                            <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 31.6666L8.33337 19.9999L20 8.33325" stroke="#6A6A6A" strokeWidth="2"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M31.6667 20H8.33337" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </Button>
                        <div className="flex flex-col gap-[0.5vh] xl:gap-[0.25vw]">
                            <p className="font-semibold text-[2.4vh] xl:text-[1.5vw]">{boardName}</p>
                            <p className="text-gray-dark text-[2vh] xl:text-[1vw]">{includedCount} of {pins.length} pins
                                selected</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-[0.75vh] xl:gap-[0.75vw] text-[1.75vh] xl:text-[1vw]">
                        <Button onClick={selectAll} className="setting-button w-fit h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] 3xl:px-[1vw]">Select All</Button>
                        <Button onClick={() => deselectAll(pins)} className="setting-button w-fit h-10 xl:h-[2vw] px-3 xl:px-[0.75vw] 3xl:px-[1vw]">Deselect All</Button>
                    </div>
                </div>

                <div className="w-fit columns-3 md:columns-4 xl:columns-8 gap-[1.75vh] xl:gap-[1vw]">
                    {pins.map((pin, i) => {
                        const isExcluded = excluded.includes(pin.id);
                        return (
                            <motion.div
                                key={pin.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isExcluded ? 0.4 : 1, y: 0 }}
                                transition={{
                                    delay: mounted.current ? 0 : animationDelays.current[i],
                                    duration: mounted.current ? 0.3 : 0.5,
                                    ease: "easeOut",
                                }}
                                onClick={() => togglePin(pin.id)}
                                className={`break-inside-avoid mb-[3vh] xl:mb-[2.25vw] cursor-pointer relative rounded-2xl overflow-hidden
                                    [mask-image:radial-gradient(white,white)] [-webkit-mask-image:radial-gradient(white,white)] [transform:translateZ(0)] [-webkit-transform:translateZ(0)]
                                    ${isExcluded ? "grayscale" : "ring-[0.3vh] xl:ring-[0.2vw] ring-gray-800"}`}
                                style={{
                                    willChange: "opacity",
                                    transform: "translateZ(0)",
                                    WebkitTransform: "translateZ(0)",
                                }}
                            >
                                <img
                                    src={pin.media.images["600x"].url}
                                    alt=""
                                    className="w-full h-auto object-contain"
                                />
                                <div
                                    className="absolute top-[0.5vh] xl:top-[0.25vw] right-[0.5vh] xl:right-[0.25vw] w-[2.25vh] xl:w-[1.5vw] h-[2.25vh] xl:h-[1.5vw]">
                                    {!isExcluded ?
                                        <svg viewBox="0 0 32 32" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15 30C6.71551 30 0 23.2846 0 15C0 6.71551 6.71551 0 15 0C23.2846 0 30 6.71551 30 15C30 23.2846 23.2846 30 15 30ZM13.0849 20.5804C13.3166 20.8121 13.6924 20.8121 13.9241 20.5804L23.6901 10.8131C23.9217 10.5814 23.9217 10.2057 23.6899 9.97396L22.4081 8.69216C22.1765 8.46041 21.8007 8.46043 21.5689 8.6922L13.9241 16.3384C13.6924 16.5701 13.3166 16.5702 13.0849 16.3384L9.68061 12.9341C9.44889 12.7024 9.07316 12.7024 8.84142 12.9341L7.55962 14.2159C7.32787 14.4477 7.32787 14.8234 7.55962 15.0551L13.0849 20.5804Z"
                                                fill="#1f1f1f"/>
                                        </svg>
                                        :
                                        <svg viewBox="0 0 32 32" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15.3125 0C19.3736 0 23.2684 1.61328 26.1401 4.48493C29.0117 7.35658 30.625 11.2514 30.625 15.3125C30.625 19.3736 29.0117 23.2684 26.1401 26.1401C23.2684 29.0117 19.3736 30.625 15.3125 30.625C11.2514 30.625 7.35658 29.0117 4.48493 26.1401C1.61328 23.2684 0 19.3736 0 15.3125C0 11.2514 1.61328 7.35658 4.48493 4.48493C7.35658 1.61328 11.2514 0 15.3125 0ZM15.3125 13.4553L11.7556 9.89844C11.5093 9.65216 11.1753 9.5138 10.827 9.5138C10.4787 9.5138 10.1447 9.65216 9.89844 9.89844C9.65216 10.1447 9.5138 10.4787 9.5138 10.827C9.5138 11.1753 9.65216 11.5093 9.89844 11.7556L13.4553 15.3125L9.89844 18.8694C9.77649 18.9913 9.67976 19.1361 9.61377 19.2954C9.54777 19.4547 9.5138 19.6255 9.5138 19.798C9.5138 19.9704 9.54777 20.1412 9.61377 20.3005C9.67976 20.4598 9.77649 20.6046 9.89844 20.7266C10.0204 20.8485 10.1652 20.9452 10.3245 21.0112C10.4838 21.0772 10.6546 21.1112 10.827 21.1112C10.9995 21.1112 11.1703 21.0772 11.3296 21.0112C11.4889 20.9452 11.6337 20.8485 11.7556 20.7266L15.3125 17.1697L18.8694 20.7266C18.9913 20.8485 19.1361 20.9452 19.2954 21.0112C19.4547 21.0772 19.6255 21.1112 19.798 21.1112C19.9704 21.1112 20.1412 21.0772 20.3005 21.0112C20.4598 20.9452 20.6046 20.8485 20.7266 20.7266C20.8485 20.6046 20.9452 20.4598 21.0112 20.3005C21.0772 20.1412 21.1112 19.9704 21.1112 19.798C21.1112 19.6255 21.0772 19.4547 21.0112 19.2954C20.9452 19.1361 20.8485 18.9913 20.7266 18.8694L17.1697 15.3125L20.7266 11.7556C20.8485 11.6337 20.9452 11.4889 21.0112 11.3296C21.0772 11.1703 21.1112 10.9995 21.1112 10.827C21.1112 10.6546 21.0772 10.4838 21.0112 10.3245C20.9452 10.1652 20.8485 10.0204 20.7266 9.89844C20.6046 9.77649 20.4598 9.67976 20.3005 9.61377C20.1412 9.54777 19.9704 9.5138 19.798 9.5138C19.6255 9.5138 19.4547 9.54777 19.2954 9.61377C19.1361 9.67976 18.9913 9.77649 18.8694 9.89844L15.3125 13.4553Z"
                                                fill="#C7C7C7"/>
                                        </svg>
                                    }
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}