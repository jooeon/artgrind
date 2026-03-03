"use client";

import React, { useState } from "react";
import {useRouter} from "next/navigation";
import {parsePinterestUrl} from "@/app/Utils";

// UNUSED
// quickstart by pasting pinterest board URL
// Scrapped due to limitations with accessing public boards without proper AUTH

export default function QuickStart() {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSync() {
        setError("");

        const parsed = parsePinterestUrl(url);
        if (!parsed) {
            setError("Invalid Pinterest URL");
            return;
        }

        const res = await fetch(`/api/board-lookup?username=${parsed.username}&boardname=${parsed.boardname}`);
        const data = await res.json();

        if (data.error) {
            setError(data.error);
            return;
        }

        router.push(`/setup?quickboard=${data.id}`);
    }

    return (
        <div className="flex flex-col gap-[2vh] xl:gap-[2vw] xl:pl-[4vw] w-fit text-[1.5vh] xl:text-[1.25vw]">
            <p className="flex flex-col gap-[1vh] xl:gap-[0.75vw] font-medium xl:font-semibold text-center">
                Pasting a link to a Pinterest board:
            </p>
            <div className="relative w-fit h-fit">
                <input
                    type="text"
                    placeholder="https://pinterest.com/username/boardname"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex rounded-sm border-3 px-1 py-1 xl:px-2 xl:py-2 w-[30vh] xl:w-[25vw] h-10 xl:h-[2.5vw] text-center bg-white
                                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
                <div className="absolute inset-0 translate-x-1 translate-y-1 border-3 rounded-sm bg-black z-[-10]"></div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="w-full">
                <button onClick={handleSync} className="button m-auto w-fit">
                    Sync board
                </button>
            </div>
        </div>
    );
}