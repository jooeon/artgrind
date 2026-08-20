import { cookies } from "next/headers";
import {redirect} from "next/navigation";
import LandingAnimation from "./components/LandingAnimation";
import React from "react";
import Footer from "@/app/components/Footer";
import CharacterAnimation from "@/app/components/CharacterAnimation";

export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) redirect("/setup");

    return (
        <>
            <main className="flex flex-col min-h-dvh relative w-full pb-[3vh] xl:pb-[1vw]">
                {/*<section className="flex items-center justify-center gap-[3vh] w-full h-dvh">*/}
                    <div className="flex flex-col h-screen px-[1.5vh] xl:px-[2vw] pt-[5vh] xl:pt-[4vw]">
                        <div className="relative">
                            <h1 className="flex flex-col
                                    font-fornire lowercase text-[15vh] xl:text-[15vw] leading-[0.5]">
                                <div>Art</div>
                                <div className="pl-[5vw]">Grind</div>
                                <LandingAnimation />
                            </h1>
                            <h2 className="absolute bottom-[-10vh] right-[1vw] md:bottom-[-10vh] md:right-[3vw] xl:top-[10vw] xl:right-[20vw]
                                font-neue-haas lowercase text-[2vh] xl:text-[1.3vw]
                                w-7/12 xl:w-3/12 leading-none text-end xl:text-start">
                                Your timed drawing practice tool to consistently improve your drawing, day-by-day.
                            </h2>
                        </div>
                        {/* Login Section */}
                        <section className="flex flex-col xl:flex-row items-center justify-center gap-[3vh] xl:gap-[15vw] flex-1
                            w-full h-1/2 mt-[17vh] xl:mt-[8vw] xl:px-[5vw]">
                            <div className="relative flex flex-col xl:justify-center gap-[2.5vh] w-fit h-full xl:pb-20">
                                <h2 className="xl:relative xl:top-0 xl:left-[-4vw] font-fornire lowercase text-[6vh] xl:text-[3.75vw] leading-none text-center xl:text-start">
                                    to get started:</h2>
                                <div className="flex flex-col gap-[2.5vh] xl:gap-[1.5vw] w-fit text-[1.75vh] xl:text-[1.25vw]">
                                    <ol className="flex flex-col gap-[1vh] xl:gap-[0.75vw] font-semibold">
                                        <li>1. Hand-pick your references on Pinterest</li>
                                        <li>2. Instantly sync and access all of your boards</li>
                                        <li>3. Customize your timer settings and start drawing</li>
                                    </ol>
                                    <div className="w-full">
                                        <a href="/api/auth/login" role="button" className="flex flex-col button m-auto w-fit">
                                            <span>Sync to Pinterest</span>
                                            <span className="text:[1vh] xl:text-[0.75vw] font-normal xl:font-medium">(requires account)</span>
                                        </a>
                                        <p className="text-[1vh] xl:text-[0.9vw] text-gray-light text-center mt-[1vh] xl:mt-[0.75vw]">
                                            *You&#39;ll be redirected to Pinterest to authorize access to your boards.<br/>
                                            ArtGrind only reads board data and never posts on your behalf.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex flex-col xl:justify-center gap-[2vh] w-fit h-full">
                                <h2 className="xl:relative xl:top-[-10] xl:left-[-4vw] font-fornire lowercase text-[6vh] xl:text-[3.75vw] leading-none text-center xl:text-start">
                                    or quick start by:</h2>
                                <div className="flex flex-col gap-[2.25vh] xl:gap-[1.5vw] w-full text-[1.75vh] xl:text-[1.25vw]">
                                    <p className="text-center font-semibold">Accessing our preset references</p>
                                    <a href="/setup" role="button" className="flex flex-col button m-auto w-fit">
                                        <span>Continue without login</span>
                                    </a>
                                </div>
                            </div>
                        </section>
                        <CharacterAnimation/>
                    </div>
                {/*</section>*/}
                <section className="relative flex items-center justify-center gap-[3vh] w-full h-dvh text-[2vh] xl:text-[1.5vw] font-light">
                    <div className="flex flex-col gap-[3vh] w-10/12 md:w-8/12 xl:w-1/2">
                        <h2 className="font-fornire lowercase font-normal text-[5.5vh] xl:text-[5vw] text-center">
                            What is ArtGrind?
                        </h2>
                        <h3 className="font-semibold">Timed drawing practice with your own references</h3>
                        <p>
                            ArtGrind is a timed drawing practice tool designed for artists
                            who want to build a consistent sketching habit. Connect your
                            Pinterest account and use images from your own boards as drawing
                            references, or start immediately with ArtGrind's preset references.
                        </p>
                        <h3 className="font-semibold">Practice gesture drawing at your own pace</h3>
                        <p>
                            Create drawing sessions with custom timers and multiple rounds.
                            Short sessions are useful for gesture drawing and quick sketches,
                            while longer timers give you more time to study proportion,
                            anatomy, shape, and composition.
                        </p>
                        <h3 className="font-semibold">Turn your Pinterest boards into drawing exercises</h3>
                        <p>
                            Instead of manually switching between reference images, ArtGrind
                            organizes your selected Pinterest references into a timed drawing
                            session so you can focus on drawing.
                        </p>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}