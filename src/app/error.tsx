"use client"
import { useEffect } from "react";
import Link from "next/link";
import CharacterAnimation from "@/app/components/CharacterAnimation";

export default function ErrorPage({
                                      error,
                                      reset,
                                  }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // This is helpful for your own debugging if a user hits an error
        console.error("Caught by error.tsx:", error);
    }, [error]);

    return (
        <main className="flex flex-col gap-[2vh] xl:gap-[2vw] justify-center items-center w-full min-h-[100dvh] text-center px-4">
            {/* I swapped '500' for 'Oops' since the errors we throw aren't always 500 Server Errors (like 404 Not Found), but you can change this back if it's an aesthetic choice! */}
            <h1 className="font-fornire leading-36 xl:leading-none text-[15vh] xl:text-[15vw]">Oops.</h1>

            {/* Here we inject the specific error message we threw in the fetch page */}
            <p className="font-fornire lowercase text-[5vh] xl:text-[5vw] leading-none">
                {error.message || "An error occurred."}
            </p>

            <p className="font-neue-haas text-[2vh] xl:text-[1.5vw]">
                Please try again or select a different board.
            </p>

            <div className="flex gap-[2vh] xl:gap-[1vw]">
                {/* The reset function allows the user to re-attempt the fetch without losing client state */}
                <button
                    onClick={() => reset()}
                    className="button text-[2vh] xl:text-[1.5vw]"
                >
                    Try again
                </button>
                <Link href="/setup" className="button text-[2vh] xl:text-[1.5vw]">
                    Back to setup
                </Link>
            </div>

            {/*<CharacterAnimation />*/}
        </main>
    );
}