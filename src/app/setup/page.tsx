import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {SetupForm} from "@/app/setup/SetupForm";
import Footer from "@/app/components/Footer";
import React from "react";

// Get the first x boards, sorted by last modified
async function getBoards() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch("https://api.pinterest.com/v5/boards", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    const sorted = data.items.sort((a: any, b: any) => {
        return new Date(b.board_pins_modified_at).getTime() -
            new Date(a.board_pins_modified_at).getTime();
    });

    return sorted;
}

export default async function Setup() {
    const data = await getBoards();

    if (!data) redirect("/");

    // console.log(data)

    return (
        <>
            <main
                className="flex flex-col min-h-[100vh] justify-between gap-[2vh] xl:gap-[2.5vw] px-[2.5vh] xl:px-[2vw] pt-[5vh] xl:pt-[4vw]">
                <SetupForm boards={data}/>
                <Footer />
            </main>
        </>
    );
}