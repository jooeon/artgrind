import Link from "next/link";
import React from "react";
import CharacterAnimation from "@/app/components/CharacterAnimation";

export default function NotFound() {
    return (
        <main className="flex flex-col gap-[2vh] xl:gap-[2vw] justify-center items-center w-full min-h-[100dvh]">
            <h1 className="font-fornire leading-24 xl:leading-56 text-[20vh] xl:text-[20vw]">404</h1>
            <p className="font-fornire lowercase text-[5vh] xl:text-[5vw] leading-none">Page not found.</p>
            <Link href="/" className="button text-[2vh] xl:text-[1.5vw]">
                Go home
            </Link>
            {/*<CharacterAnimation />*/}
        </main>
    );
}