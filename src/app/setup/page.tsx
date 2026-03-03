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

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch("https://api.pinterest.com/v5/user_account", {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    return res.json();
}

async function getUsername(user: any) {
    if (user.account_type === `PINNER`) {
        return await user.username;
    } else if (user.account_type === `BUSINESS`) {
        return await user.business_name;
    } else {
        return await "Unknown Username";
    }
}

export default async function Setup() {
    const data = await getBoards();

    if (!data) redirect("/");

    // console.log(data)

    const user = await getUser();
    console.log(user);

    const username = await getUsername(user);

    return (
        <>
            <main className="flex flex-col min-h-[100vh] justify-between gap-[2vh] xl:gap-[2.5vw] px-[2.5vh] xl:px-[2vw] pt-[5vh] xl:pt-[4vw]">
                <div
                    className="absolute top-0 right-0 flex flex-col items-end text-gray-dark px-[0.5vh] xl:px-[0.5vw] text-[1.5vh] xl:text-[1vw]">
                    <p>Logged in as: {username}</p>
                    <a href="/api/auth/logout" className="underline">Logout</a>
                </div>
                <SetupForm boards={data}/>
                <Footer />
            </main>
        </>
    );
}