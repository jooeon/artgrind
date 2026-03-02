import { cookies } from "next/headers";
import {redirect} from "next/navigation";
import LandingAnimation from "./components/LandingAnimation";
import React from "react";

// async function getBoards() {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("access_token")?.value;
//
//     if (!token) return null;
//
//     const res = await fetch("https://api.pinterest.com/v5/boards", {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//
//     return res.json();
// }

export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) redirect("/setup");

    return (
        <main className="relative w-full px-[1.5vh] xl:px-[2vw] pt-[5vh] xl:pt-[4vw]">
            <div className="relative">
                <h1 className="flex flex-col
                        font-fornire lowercase text-[15vh] xl:text-[15vw] leading-[0.5]">
                    <div>Art</div>
                    <div className="pl-[5vw]">Grind</div>
                    <LandingAnimation />
                </h1>
                <p className="absolute bottom-[-10vh] right-[1vw] md:bottom-[-10vh] md:right-[3vw] xl:top-[10vw] xl:right-[20vw]
                    font-neue-haas lowercase text-[2vh] xl:text-[1.3vw]
                    w-1/2 xl:w-3/12 leading-none text-end xl:text-start">
                    Your timed practice tool to consistently improve your drawing, day-by-day.
                </p>
            </div>
            {/* Login Section */}
            <section className="flex w-full h-1/2 mt-[15vh] xl:mt-[10vw] xl:px-[5vw]">
                <div className="flex flex-col gap-[2.5vh] xl:gap-[1.5vw] xl:w-1/2 h-full font-neue-haas">
                    <h2 className="font-fornire lowercase text-[5vh] xl:text-[3vw] leading-none">to get started:</h2>
                    <div className="flex flex-col gap-[2vh] xl:gap-[2vw] xl:pl-[4vw] w-fit text-[1.5vh] xl:text-[1vw]">
                        <ol className="flex flex-col gap-[1vh] xl:gap-[0.75vw] font-medium xl:font-semibold">
                            <li>1. Hand-pick your references on Pinterest</li>
                            <li>2. Instantly sync and access all of your boards</li>
                            <li>3. Customize your timer settings and start drawing</li>
                        </ol>
                        <div className="w-full">
                            <a href="/api/auth/login" role="button" className="button m-auto">
                                Sync to Pinterest
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}