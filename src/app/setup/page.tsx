import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {SetupForm} from "@/app/setup/SetupForm";
import Footer from "@/app/components/Footer";
import React from "react";
import ProfilePanel from "@/app/components/ProfilePanel";
import CharacterAnimation from "@/app/components/CharacterAnimation";
import Link from "next/link";

export const runtime = "edge";

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
    let boardAvailable = false;

    if (!data) redirect("/");

    if (data.length !== 0) {
        boardAvailable = true;
    }

    console.log(data)

    const user = await getUser();
    // console.log(user);

    const username = await getUsername(user);

    return (
        <>
            {boardAvailable ?
                <main className="flex flex-col min-h-[100vh] justify-between gap-[2vh] xl:gap-[2.5vw] px-[2.5vh] xl:px-[2vw] pt-[5vh] xl:pt-[4vw]">
                    <ProfilePanel username={username} />
                    <SetupForm boards={data}/>
                    <Footer />
                </main>
            :
                <div className="flex flex-col justify-center items-center gap-[4vh] xl:gap-[3vw] w-full min-h-[100vh] p-[2vh]">
                    <ProfilePanel username={username} />
                    <p className="font-fornire text-center text-[5vh] xl:text-[4vw] leading-none">Create a board on Pinterest first and come back!</p>
                    <Link href="/setup" className="button text-[2vh] xl:text-[1.5vw]">
                        I created a board
                    </Link>
                    {/*<CharacterAnimation />*/}
                </div>
            }
        </>
    );
}